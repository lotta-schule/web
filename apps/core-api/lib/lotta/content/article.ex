defmodule Lotta.Content.Article do
  @moduledoc """
    Ecto Schema for articles
  """
  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Query

  alias Lotta.{Accounts, Email, Mailer, Repo}
  alias Lotta.Accounts.{User, UserGroup}
  alias Lotta.Content.{Article, ArticleReaction, ContentModule}
  alias Lotta.Storage.File
  alias Lotta.Tenants.Category

  @type id() :: pos_integer()

  @type tags() :: [String.t()]

  @type t() :: %__MODULE__{
          id: id(),
          title: String.t(),
          tags: tags(),
          ready_to_publish: boolean(),
          published: boolean(),
          is_reactions_enabled: boolean(),
          is_pinned_to_top: boolean()
        }

  @timestamps_opts [type: :utc_datetime]

  schema "articles" do
    field(:title, :string)
    field(:preview, :string)
    field(:tags, {:array, :string})
    field(:ready_to_publish, :boolean)
    field(:published, :boolean, default: false)
    field(:is_pinned_to_top, :boolean)
    field(:is_reactions_enabled, :boolean, default: false)
    field(:rank, :float, virtual: true)

    belongs_to :category, Category, on_replace: :nilify

    belongs_to :preview_image_file, File,
      on_replace: :nilify,
      type: :binary_id

    has_many :content_modules, ContentModule, on_replace: :delete
    has_many :reactions, ArticleReaction, on_replace: :delete

    many_to_many(
      :groups,
      UserGroup,
      join_through: "articles_user_groups",
      join_keys: [article_id: :id, group_id: :id],
      on_replace: :delete
    )

    many_to_many(
      :users,
      User,
      join_through: "article_users",
      on_replace: :delete
    )

    timestamps()
  end

  @doc """
  Returns a query with all published articles a given user can see.
  If no user is given, return a query returning only public articles.
  """
  @spec get_published_articles_query(User.t() | nil, [{:category_id, Category.id()}]) ::
          Ecto.Queryable.t()
  def get_published_articles_query(user \\ nil, opts \\ []) do
    groups = if user, do: user.all_groups, else: []
    is_admin = if user, do: user.is_admin?, else: false

    from(a in Article,
      left_join: aug in "articles_user_groups",
      on: aug.article_id == a.id,
      join: c in Category,
      on: c.id == a.category_id,
      where:
        a.published == true and
          (is_nil(aug.group_id) or aug.group_id in ^Enum.map(groups, & &1.id) or
             ^is_admin),
      distinct: true
    )
    |> then(fn query ->
      case opts[:category_id] do
        category_id when is_binary(category_id) ->
          where(query, [..., c], c.id == ^category_id)

        _ ->
          query
      end
    end)
  end

  @doc false
  def create_changeset(article, attrs, users \\ []) do
    article
    |> Repo.preload([:category, :groups, :users, :preview_image_file, :content_modules])
    |> cast(attrs, [:title, :inserted_at])
    |> put_assoc(:users, users)
    |> validate_required([:title])
  end

  @doc false
  def changeset(article, attrs) do
    article
    |> Repo.preload([:category, :groups, :users, :preview_image_file, :content_modules])
    |> cast(attrs, [
      :title,
      :inserted_at,
      :updated_at,
      :ready_to_publish,
      :published,
      :is_reactions_enabled,
      :preview,
      :tags
    ])
    |> validate_required([:title])
    |> put_assoc_users(attrs)
    |> put_assoc_category(attrs)
    |> put_assoc_preview_image_file(attrs)
    |> put_assoc_groups(attrs)
    |> cast_assoc(:content_modules, required: false)
    |> maybe_send_admin_notification()
  end

  defp put_assoc_users(changeset, %{users: users}) do
    changeset
    |> put_assoc(:users, Repo.all(from(u in User, where: u.id in ^Enum.map(users, & &1.id))))
  end

  defp put_assoc_users(changeset, _), do: changeset

  defp put_assoc_category(changeset, %{category: %{id: category_id}}) do
    changeset
    |> put_assoc(:category, Repo.get(Category, category_id))
  end

  defp put_assoc_category(changeset, _), do: changeset

  defp put_assoc_preview_image_file(changeset, %{preview_image_file: %{id: preview_image_file_id}}) do
    changeset
    |> put_assoc(:preview_image_file, Repo.get(File, preview_image_file_id))
  end

  defp put_assoc_preview_image_file(changeset, %{preview_image_file: nil}) do
    changeset
    |> put_assoc(:preview_image_file, nil)
  end

  defp put_assoc_preview_image_file(changeset, _), do: changeset

  defp put_assoc_groups(changeset, %{groups: groups}) do
    changeset
    |> put_assoc(
      :groups,
      Repo.all(from(ug in UserGroup, where: ug.id in ^Enum.map(groups, & &1.id)))
    )
  end

  defp put_assoc_groups(changeset, _), do: changeset

  defp maybe_send_admin_notification(changeset) do
    if changeset.valid? && get_change(changeset, :ready_to_publish) do
      case apply_action(changeset, :update) do
        {:ok, article} ->
          for admin <- Accounts.list_admin_users() do
            Email.article_ready_mail(admin, article)
            |> Mailer.deliver_later()
          end

        {:error, _} ->
          nil
      end
    end

    changeset
  end
end
