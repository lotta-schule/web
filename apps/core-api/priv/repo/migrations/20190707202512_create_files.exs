defmodule Api.Repo.Migrations.CreateFiles do
  use Ecto.Migration

  def change do
    create table(:files) do
      add :path, :string
      add :filename, :string
      add :filesize, :integer
      add :remote_location, :string
      add :mime_type, :string
      add :file_type, :string
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:files, [:user_id])
  end
end
