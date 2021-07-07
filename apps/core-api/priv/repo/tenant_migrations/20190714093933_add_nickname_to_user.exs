defmodule Lotta.Repo.TenantMigrations.AddNicknameToUser do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add(:nickname, :string)
    end
  end
end
