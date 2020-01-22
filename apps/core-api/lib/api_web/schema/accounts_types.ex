defmodule ApiWeb.Schema.AccountsTypes do
  use Absinthe.Schema.Notation

  object :accounts_queries do
    field :current_user, :user do
      resolve &Api.UserResolver.get_current/2
    end

    field :users, list_of(:user) do
      resolve &Api.UserResolver.all_with_groups/2
    end

    field :search_users, list_of(:user) do
      arg :searchtext, non_null(:string)
      resolve &Api.UserResolver.search/2
    end

    field :user, type: :user do
      arg :id, non_null(:lotta_id)
      resolve &Api.UserResolver.get/2
    end
    
    field :group, type: :user_group do
      arg :id, non_null(:lotta_id)
      resolve &Api.UserGroupResolver.get/2
    end

    field :files, list_of(:file) do
      resolve &Api.FileResolver.all/2
    end
  end

  object :accounts_mutations do
    field :register, type: :authresult do
      arg :user, non_null(:register_user_params)
      arg :group_key, :string

      resolve &Api.UserResolver.register/2
      middleware &Api.AbsintheMiddlewares.set_user_token/2
    end

    field :login, type: :authresult do
      arg :username, :string
      arg :password, :string

      resolve &Api.UserResolver.login/2
      middleware &Api.AbsintheMiddlewares.set_user_token/2
    end

    field :logout, type: :boolean do
      resolve fn (_args, _info) -> {:ok, true} end
      middleware(fn resolution, _ ->
        Map.update!(resolution, :context, fn ctx ->
          Map.put(ctx, :auth_token, nil)
        end)
      end)
    end

    field :update_profile, type: :user do
      arg :user, non_null(:update_user_params)

      resolve &Api.UserResolver.update_profile/2
    end

    field :set_user_blocked, type: :user do
      arg :id, non_null(:lotta_id)
      arg :is_blocked, non_null(:boolean)
      
      resolve &Api.UserResolver.set_user_blocked/2
    end

    field :create_user_group, type: :user_group do
      arg :group, non_null(:user_group_input)

      resolve &Api.UserGroupResolver.create/2
    end

    field :update_user_group, type: :user_group do
      arg :id, non_null(:lotta_id)
      arg :group, non_null(:user_group_input)

      resolve &Api.UserGroupResolver.update/2
    end

    field :delete_user_group, type: :user_group do
      arg :id, non_null(:lotta_id)

      resolve &Api.UserGroupResolver.delete/2
    end
    
    field :request_password_reset, type: :boolean do
      arg :email, non_null(:string)

      resolve &Api.UserResolver.request_password_reset/2
    end

    field :reset_password, type: :authresult do
      arg :email, non_null(:string)
      arg :token, non_null(:string)
      arg :password, non_null(:string)

      resolve &Api.UserResolver.reset_password/2
      middleware &Api.AbsintheMiddlewares.set_user_token/2
    end

    field :set_user_groups, type: :user do
      arg :id, non_null(:lotta_id)
      arg :group_ids, non_null(list_of(:lotta_id))
      resolve &Api.UserResolver.set_user_groups/2
    end

    field :upload_file, type: :file do
      arg :path, :string, default_value: "/"
      arg :file, non_null(:upload)
      arg :is_public, :boolean

      resolve &Api.FileResolver.upload/2
    end

    field :move_file, type: :file do
      arg :id, non_null(:lotta_id)
      arg :path, :string
      arg :filename, :string
      arg :is_public, :boolean

      resolve &Api.FileResolver.move/2
    end
    
    field :move_directory, type: list_of(:file) do
      arg :path, non_null(:string)
      arg :is_public, non_null(:boolean)
      arg :new_path, non_null(:string)

      resolve &Api.FileResolver.move_directory/2
    end
    
    field :delete_file, type: :file do
      arg :id, non_null(:lotta_id)

      resolve &Api.FileResolver.delete/2
    end
  end

  input_object :register_user_params do
    field :name, :string
    field :nickname, :string
    field :hide_full_name, :boolean
    field :email, :string
    field :password, :string
  end
  
  input_object :update_user_params do
    field :name, :string
    field :email, :string
    field :class, :string
    field :nickname, :string
    field :hide_full_name, :boolean
    field :avatar_image_file, :file
    field :enrollment_tokens, list_of(:string)
  end
  
  input_object :user_group_input do
    field :name, :string
    field :sort_key, :integer
    field :enrollment_tokens, list_of(:string)
  end

  object :authresult do
    field :token, :string
  end

  object :user do
    field :id, :lotta_id
    field :inserted_at, :naive_datetime
    field :updated_at, :naive_datetime
    field :last_seen, :naive_datetime
    field :name, :string, resolve: &Api.UserResolver.resolve_name/3
    field :class, :string
    field :nickname, :string
    field :email, :string
    field :hide_full_name, :boolean
    field :tenant, :tenant, resolve: Absinthe.Resolution.Helpers.dataloader(Api.Tenants)
    field :avatar_image_file, :file, resolve: Absinthe.Resolution.Helpers.dataloader(Api.Accounts)
    field :articles, list_of(:article), resolve: Absinthe.Resolution.Helpers.dataloader(Api.Content)
    field :groups, list_of(:user_group), resolve: &Api.UserResolver.resolve_groups/3
    field :enrollment_tokens, list_of(:string), resolve: &Api.UserResolver.resolve_enrollment_tokens/3
    field :is_blocked, :boolean, resolve: &Api.UserResolver.resolve_is_blocked/3
  end

  object :user_group do
    field :id, :lotta_id
    field :inserted_at, :naive_datetime
    field :updated_at, :naive_datetime
    field :name, :string
    field :sort_key, :integer
    field :is_admin_group, :boolean
    field :tenant, :tenant, resolve: Absinthe.Resolution.Helpers.dataloader(Api.Tenants)
    field :enrollment_tokens, list_of(:group_enrollment_token), resolve: &Api.UserGroupResolver.resolve_enrollment_tokens/3
  end

  object :group_enrollment_token do
    field :id, :lotta_id
    field :token, :string
  end

  object :file do
    field :id, :lotta_id
    field :inserted_at, :naive_datetime
    field :updated_at, :naive_datetime
    field :is_public, :boolean
    field :filename, :string
    field :filesize, :integer
    field :mime_type, :string
    field :path, :string
    field :remote_location, :string
    field :file_type, :file_type
    field :user_id, :lotta_id
    field :file_conversions, list_of(:file_conversion), resolve: Absinthe.Resolution.Helpers.dataloader(Api.Accounts)
  end

  object :file_conversion do
    field :id, :lotta_id
    field :inserted_at, :naive_datetime
    field :updated_at, :naive_datetime
    field :format, :string
    field :mime_type, :string
    field :remote_location, :string
  end

  enum :file_type do
    value :image, as: "image"
    value :audio, as: "audio"
    value :video, as: "video"
    value :pdf, as: "pdf"
    value :misc, as: "misc"
  end
  
end