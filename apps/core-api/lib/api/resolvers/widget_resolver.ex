defmodule Api.WidgetResolver do
  alias Api.Tenants.Widget
  alias Api.Accounts.User

  def all(_args, %{context: %{context: %{current_user: current_user, tenant: tenant}}}) do
    {:ok, Api.Tenants.list_widgets_by_tenant(tenant.id, current_user)}
  end
  def all(_args, %{context: %{context: %{tenant: tenant}}}) do
    {:ok, Api.Tenants.list_widgets_by_tenant(tenant.id, nil)}
  end
  def all(_args, _info) do
    {:error, "Tenant nicht gefunden"}
  end

  def find(%{id: id}, %{context: %{context: %{current_user: current_user, tenant: tenant}}}) do
    {:ok, Api.Tenants.Widget.find_by([id: id, tenant_id: tenant.id])}
  end
  def find(_args, _info) do
    {:error, "Tenant nicht gefunden"}
  end

  def create(%{title: title, type: type}, %{context: %{context: %{ current_user: current_user, tenant: tenant }}}) do
    if User.is_admin?(current_user, tenant) do
        %{title: title, type: type, tenant_id: tenant.id} |> Api.Tenants.create_widget
    else
        {:error, "Nur Administrator dürfen Widgets erstellen"}
    end
  end

  def update(%{id: id, widget: widget_params}, %{context: %{context: %{current_user: current_user, tenant: tenant}}}) do
    if User.is_admin?(current_user, tenant) do
      case Api.Tenants.get_widget!(id) do
        nil -> {:error, "Kategorie mit der id #{id} nicht gefunden."}
        widget -> Api.Tenants.update_widget(widget, widget_params)
      end
    else
      {:error, "Nur Administrator dürfen Widgets bearbeiten"}
    end
  end
end