defmodule Lotta.Repo.TenantMigrations.AddSortKeyToContentModule do
  @moduledoc false

  use Ecto.Migration

  def change do
    alter table(:content_modules) do
      add(:sort_key, :integer, default: 0)
    end
  end
end
