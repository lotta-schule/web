defmodule Api.Tenants.Tenant do
  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query
  alias Api.Tenants.{Category, CustomDomain}
  alias Api.Accounts
  alias Api.Accounts.{File,User,UserGroup}

  schema "tenants" do
    field :slug, :string
    field :title, :string
    field :custom_theme, :map
  
    has_many :categories, Category
    has_many :groups, UserGroup
    has_many :users, User
    has_many :custom_domains, CustomDomain
    belongs_to :logo_image_file, File, on_replace: :nilify
    belongs_to :background_image_file, File, on_replace: :nilify

    timestamps()
  end

  @doc false
  def changeset(tenant, attrs) do
    tenant
    |> Api.Repo.preload([:logo_image_file, :background_image_file])
    |> cast(attrs, [:title, :custom_theme])
    |> validate_required([:slug, :title])
    |> put_assoc_logo_image_file(attrs)
    |> put_assoc_background_image_file(attrs)
  end

  def get_main_url(%Api.Tenants.Tenant{} = tenant) do
    main_domain = tenant
    |> Api.Repo.preload(:custom_domains)
    |> Map.fetch!(:custom_domains)
    |> Enum.find(&(&1.is_main_domain === true))
    case main_domain do
      %CustomDomain{host: host} ->
        "https://" <> host
      _ ->
        get_lotta_url(tenant)
    end
  end
  
  def get_lotta_url(%Api.Tenants.Tenant{slug: slug}) do
    base_url = Application.fetch_env!(:api, :base_url)
    "https://" <> slug  <> base_url
  end

  def get_admin_users(%Api.Tenants.Tenant{} = tenant) do
    from(u in User,
      join: g in assoc(u, :groups),
      where: g.tenant_id == ^(tenant.id) and g.is_admin_group == true,
      order_by: [u.name, u.email],
      distinct: true)
    |> Api.Repo.all
  end

  defp put_assoc_logo_image_file(changeset, %{logo_image_file: %{id: logo_image_file_id}}) do
    changeset
    |> put_assoc(:logo_image_file, Api.Repo.get(Api.Accounts.File, logo_image_file_id))
  end
  defp put_assoc_logo_image_file(changeset, %{logo_image_file: nil}) do
    changeset
    |> put_assoc(:logo_image_file, nil)
  end
  defp put_assoc_logo_image_file(changeset, _args), do: changeset
  
  defp put_assoc_background_image_file(changeset, %{background_image_file: %{id: background_image_file_id}}) do
    changeset
    |> put_assoc(:background_image_file, Api.Repo.get(Api.Accounts.File, background_image_file_id))
  end
  defp put_assoc_background_image_file(changeset, %{background_image_file: nil}) do
    changeset
    |> put_assoc(:background_image_file, nil)
  end
  defp put_assoc_background_image_file(changeset, _args), do: changeset
end
