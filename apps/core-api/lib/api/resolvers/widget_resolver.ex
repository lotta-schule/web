defmodule Api.WidgetResolver do
  alias Ecto.NoResultsError
  alias Api.Tenants
  alias Api.Accounts.User

  def all(%{category_id: category_id}, %{context: %{tenant: tenant} = context}) do
    Tenants.list_widgets_by_tenant_and_category_id(tenant, category_id, context[:current_user], context[:user_group_ids])
  end
  def all(_args, %{context: %{tenant: tenant} = context}) do
    Tenants.list_widgets_by_tenant(tenant, context[:current_user], context[:user_group_ids])
  end
  def all(_args, _info) do
    {:error, "Tenant nicht gefunden"}
  end

  def create(%{title: title, type: type}, %{context: %{tenant: tenant} = context}) do
    if context[:current_user] && User.is_admin?(context[:current_user], tenant) do
        %{title: title, type: type, tenant_id: tenant.id}
        |> Tenants.create_widget()
    else
        {:error, "Nur Administratoren dürfen Widgets erstellen."}
    end
  end

  def update(%{id: id, widget: widget_params}, %{context: %{tenant: tenant} = context}) do
    if context[:current_user] && User.is_admin?(context.current_user, tenant) do
      try do
        Tenants.get_widget!(id)
        |> Tenants.update_widget(widget_params)
      rescue
        NoResultsError ->
          {:error, "Marginale mit der id #{id} nicht gefunden."}
      end
    else
      {:error, "Nur Administratoren dürfen Widgets bearbeiten."}
    end
  end
  
  def delete(%{id: id}, %{context: %{tenant: tenant} = context}) do
    if context[:current_user] && User.is_admin?(context.current_user, tenant) do
      try do
        Tenants.get_widget!(id)
        |> Tenants.delete_widget()
      rescue
        NoResultsError ->
          {:error, "Marginale mit der id #{id} nicht gefunden."}
      end
    else
      {:error, "Nur Administratoren dürfen Marginalen löschen."}
    end
  end
end
