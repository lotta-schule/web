defmodule ApiWeb.UserSocket do
  require Logger

  use Phoenix.Socket
  use Absinthe.Phoenix.Socket, schema: ApiWeb.Schema

  alias ApiWeb.Context

  ## Channels
  # channel "messages:user:*", ApiWeb.MessagesChannel
  # channel "messages:group:*", ApiWeb.MessagesChannel

  # Socket params are passed from the client and can
  # be used to verify and authenticate a user. After
  # verification, you can put default assigns into
  # the socket that will be set for all channels, ie
  #
  #     {:ok, assign(socket, :user_id, verified_user_id)}
  #
  # To deny connection, return `:error`.
  #
  # See `Phoenix.Token` documentation for examples in
  # performing token verification on connect.
  def connect(params, socket, _connect_info) do
    with %{"token" => token} <- params,
         {:ok, user, _claims} <- ApiWeb.Auth.AccessToken.resource_from_token(token) do
      socket =
        socket
        |> Absinthe.Phoenix.Socket.put_opts(
          context: %Context{current_user: Context.set_virtual_user_fields(user)}
        )

      {:ok, socket}
    else
      e ->
        Logger.error(inspect(e))
        :error
    end
  end

  # Socket id's are topics that allow you to identify all sockets for a given user:
  #
  #     def id(socket), do: "user_socket:#{socket.assigns.user_id}"
  #
  # Would allow you to broadcast a "disconnect" event and terminate
  # all active sockets and channels for a given user:
  #
  #     ApiWeb.Endpoint.broadcast("user_socket:#{user.id}", "disconnect", %{})
  #
  # Returning `nil` makes this socket anonymous.
  def id(_socket), do: nil
end
