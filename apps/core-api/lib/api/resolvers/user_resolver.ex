defmodule Api.UserResolver do
  alias Api.Accounts
  alias Api.Accounts.{AuthHelper,User}

  def get_current(_args, %{context: %{current_user: current_user}}) do
    {:ok, current_user}
  end
  def get_current(_args, _info) do
    {:ok, nil}
  end

  def all_with_groups(_args, %{context: %{tenant: tenant} = context}) do
    case context[:current_user] && User.is_admin?(context.current_user, tenant) do
      true -> {:ok, Accounts.list_users_with_groups(tenant.id)}
      _ -> {:error, "Nur Administrator dürfen auf Benutzer auflisten."}
    end
  end

  def search(%{searchtext: searchtext}, %{context: %{tenant: tenant} = context}) do
    case context[:current_user] && User.is_admin?(context.current_user, tenant) do
      true ->
        if String.length(searchtext) > 2 do
          Accounts.search_user(searchtext, tenant)
        else
          {:ok, []}
        end
      _ -> {:error, "Nur Administrator dürfen auf Benutzer auflisten."}
    end
  end

  def get(%{id: id}, %{context: %{tenant: tenant} = context}) do
    if context[:current_user] && User.is_admin?(context.current_user, tenant) do
      try do
        {:ok, Accounts.get_user!(id)}
      rescue
        Ecto.NoResultsError -> {:ok, nil}
      end
    else
      {:error, "Nur Administrator dürfen auf Benutzer auflisten."}
    end
  end

  def assign_user(%{id: id, group_id: group_id}, %{context: %{current_user: current_user, tenant: tenant}}) do
    if User.is_admin?(current_user, tenant) do
      group = Accounts.get_user_group!(group_id)
      if group != nil and group.tenant_id == tenant.id do
        case Accounts.get_user!(id) do
          nil -> {:error, "Nutzer mit der id #{id} nicht gefunden."}
          user -> Accounts.assign_user_to_group(user, group)
        end
      else
        {:error, "Gruppe mit der id #{group_id} nicht gefunden."}
      end
    else
      {:error, "Nur Administrator dürfen Benutzer Gruppen zuweisen"}
    end
  end

  def register(%{user: user_params, group_key: group_key}, %{context: %{tenant: tenant}}) do
    with {:ok, user} <- Accounts.register_user(user_params |> Map.put(:tenant_id, tenant.id)),
      {:ok, user} <- (case group_key do
        # TODO: Remove as fast as possible. Is just very shitty workaround
        "LEb0815Hp!1969" -> Accounts.assign_user_to_group(user, Api.Repo.get_by(Accounts.UserGroup, name: "Lehrer"))
        "ELa1789Re!1848" -> Accounts.assign_user_to_group(user, Api.Repo.get_by(Accounts.UserGroup, name: "Eltern"))
        "Seb034hP2?019" -> Accounts.assign_user_to_group(user, Api.Repo.get_by(Accounts.UserGroup, name: "Schüler"))
        _ -> {:ok, user}
      end),
      {:ok, jwt, _} <- Api.Guardian.encode_and_sign(user, %{
        email: user.email,
        nickname: user.nickname,
        name: user.name,
        class: user.class,
        # groups: user.groups
     }) do
        {:ok, %{user: user, token: jwt}}
    end
  end
  
  def login(%{username: username, password: password}, _info) do
    with {:ok, user} <- AuthHelper.login_with_username_pass(username, password),
        {:ok, jwt, _} <- Api.Guardian.encode_and_sign(user, %{
          email: user.email,
          nickname: user.nickname,
          name: user.name,
          class: user.class,
          # groups: user.groups
       }) do
      {:ok, %{user: user, token: jwt}}
    end
  end

  def update_profile(%{user: user_params}, %{context: %{current_user: current_user}}) do
    current_user
    |> Accounts.update_user(user_params)
  end
end