defmodule ApiWeb.Router do
  use ApiWeb, :router
  use Honeybadger.Plug

  pipeline :auth do
    plug Guardian.Plug.Pipeline,
      module: Api.Guardian,
      error_handler: Api.Guardian.AuthErrorHandler

    # plug Guardian.Plug.VerifySession, %{"typ" => "access"}
    # plug Guardian.Plug.VerifyCookie, %{"typ" => "access"}
    # plug Guardian.Plug.LoadResource
    plug ApiWeb.Context
  end

  scope "/api" do
    pipe_through :auth

    forward "/", Absinthe.Plug,
      schema: ApiWeb.Schema
  end

  scope "/_debug" do
    # health endpoint
    forward "/health", ApiWeb.HealthPlug
  end

  forward "/graphiql", Absinthe.Plug.GraphiQL,
    schema: ApiWeb.Schema

end
