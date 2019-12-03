defmodule Api.UserGroupResolverTest do
  use ApiWeb.ConnCase
  
  setup do
    Api.Repo.Seeder.seed()

    web_tenant = Api.Tenants.get_tenant_by_slug!("web")
    admin = Api.Repo.get_by!(Api.Accounts.User, [email: "alexis.rinaldoni@einsa.net"])
    user = Api.Repo.get_by!(Api.Accounts.User, [email: "eike.wiewiorra@einsa.net"])
    user2 = Api.Repo.get_by!(Api.Accounts.User, [email: "mcurie@lotta.schule"])
    {:ok, admin_jwt, _} = Api.Guardian.encode_and_sign(admin, %{ email: admin.email, name: admin.name })
    {:ok, user_jwt, _} = Api.Guardian.encode_and_sign(user, %{ email: user.email, name: user.name })
    schueler_group = Api.Repo.get_by!(Api.Accounts.UserGroup, name: "Schüler")
    lehrer_group = Api.Repo.get_by!(Api.Accounts.UserGroup, name: "Lehrer")

    {:ok, %{
      web_tenant: web_tenant,
      admin: admin,
      admin_jwt: admin_jwt,
      user: user,
      user2: user2,
      user_jwt: user_jwt,
      schueler_group: schueler_group,
      lehrer_group: lehrer_group
    }}
  end

describe "group query" do
    @query """
    query group($id: ID!) {
      group(id: $id) {
        name
        enrollmentTokens {
          token
        }
      }
    }
    """

    test "should return group with requested", %{admin_jwt: admin_jwt, lehrer_group: lehrer_group} do
      res = build_conn()
      |> put_req_header("tenant", "slug:web")
      |> put_req_header("authorization", "Bearer #{admin_jwt}")
      |> get("/api", query: @query, variables: %{id: lehrer_group.id})
      |> json_response(200)

      assert res == %{
        "data" => %{
          "group" => %{"name" => "Lehrer", "enrollmentTokens" => [%{"token" => "LEb0815Hp!1969"}]}
        }
      }
    end

    test "should return nil if user is admin, but requested id does not exist", %{admin_jwt: admin_jwt} do
      res = build_conn()
      |> put_req_header("tenant", "slug:web")
      |> put_req_header("authorization", "Bearer #{admin_jwt}")
      |> get("/api", query: @query, variables: %{id: 0})
      |> json_response(200)

      assert res == %{
        "data" => %{
          "group" => nil,
        }
      }
    end

    test "should return an error if user is not an admin", %{user_jwt: user_jwt, lehrer_group: lehrer_group} do
      res = build_conn()
      |> put_req_header("tenant", "slug:web")
      |> put_req_header("authorization", "Bearer #{user_jwt}")
      |> get("/api", query: @query, variables: %{id: lehrer_group.id})
      |> json_response(200)

      assert res == %{
        "data" => %{
          "group" => nil,
        },
        "errors" => [
          %{
            "locations" => [%{"column" => 0, "line" => 2}],
            "message" => "Nur Administratoren dürfen Gruppen anzeigen.",
            "path" => ["group"]
          }
        ]
      }
    end

    test "should return an error if user is not logged in" do
      res = build_conn()
      |> put_req_header("tenant", "slug:web")
      |> get("/api", query: @query, variables: %{id: 0})
      |> json_response(200)

      assert res == %{
        "data" => %{
          "group" => nil,
        },
        "errors" => [
          %{
            "locations" => [%{"column" => 0, "line" => 2}],
            "message" => "Nur Administratoren dürfen Gruppen anzeigen.",
            "path" => ["group"]
          }
        ]
      }
    end
  end
  
  describe "updateGroup mutation" do
    @query """
    mutation updateGroup($id: ID!, $group: UserGroupInput!) {
      updateGroup(id: $id, group: $group) {
        name
        enrollmentTokens {
          token
        }
      }
    }
    """

    test "should update group", %{admin_jwt: admin_jwt, lehrer_group: lehrer_group} do
      res = build_conn()
      |> put_req_header("tenant", "slug:web")
      |> put_req_header("authorization", "Bearer #{admin_jwt}")
      |> post("/api", query: @query, variables: %{id: lehrer_group.id, group: %{ "name" => "Die Lehrer", "enrollmentTokens" => ["L1", "L2"] }})
      |> json_response(200)

      assert res == %{
        "data" => %{
          "updateGroup" => %{"name" => "Die Lehrer", "enrollmentTokens" => [%{"token" => "L1"}, %{"token" => "L2"}]}
        }
      }
    end

    test "should return an error if user is admin, but requested id does not exist", %{admin_jwt: admin_jwt} do
      res = build_conn()
      |> put_req_header("tenant", "slug:web")
      |> put_req_header("authorization", "Bearer #{admin_jwt}")
      |> post("/api", query: @query, variables: %{id: 0, group: %{ "name" => "Die Lehrer", "enrollmentTokens" => ["L1", "L2"] }})
      |> json_response(200)

      assert res == %{
        "data" => %{
          "updateGroup" => nil,
        },
        "errors" => [
          %{
            "locations" => [%{"column" => 0, "line" => 2}],
            "message" => "Gruppe existiert nicht.",
            "path" => ["updateGroup"]
          }
        ]
      }
    end

    test "should return an error if user is not an admin", %{user_jwt: user_jwt, lehrer_group: lehrer_group} do
      res = build_conn()
      |> put_req_header("tenant", "slug:web")
      |> put_req_header("authorization", "Bearer #{user_jwt}")
      |> post("/api", query: @query, variables: %{id: lehrer_group.id, group: %{ "name" => "Die Lehrer", "enrollmentTokens" => ["L1", "L2"] }})
      |> json_response(200)

      assert res == %{
        "data" => %{
          "updateGroup" => nil,
        },
        "errors" => [
          %{
            "locations" => [%{"column" => 0, "line" => 2}],
            "message" => "Nur Administratoren dürfen Gruppen bearbeiten.",
            "path" => ["updateGroup"]
          }
        ]
      }
    end

    test "should return an error if user is not logged in" do
      res = build_conn()
      |> put_req_header("tenant", "slug:web")
      |> post("/api", query: @query, variables: %{id: 0, group: %{ "name" => "Die Lehrer", "enrollmentTokens" => ["L1", "L2"] }})
      |> json_response(200)

      assert res == %{
        "data" => %{
          "updateGroup" => nil,
        },
        "errors" => [
          %{
            "locations" => [%{"column" => 0, "line" => 2}],
            "message" => "Nur Administratoren dürfen Gruppen bearbeiten.",
            "path" => ["updateGroup"]
          }
        ]
      }
    end
  end
end