# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Api.Repo.insert!(%Api.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.
Api.Accounts.register_user(%{ name: "Alexis Rinaldoni", email: "alexis.rinaldoni@einsa.net", password: "test123" })
Api.Accounts.register_user(%{ name: "Christopher Bill", email: "billy@einsa.net", password: "test123" })
Api.Accounts.register_user(%{ name: "Eike Wiewiorra", email: "eike.wiewiorra@einsa.net", password: "test123" })

{:ok, web_tenant} = Api.Repo.insert(%Api.Tenants.Tenant{ slug: "web", title: "Web Beispiel" })

{:ok, profil} = Api.Repo.insert(%Api.Tenants.Category{ tenant_id: web_tenant.id, title: "Profil" })
Api.Repo.insert(%Api.Tenants.Category{ tenant_id: web_tenant.id, title: "GTA" })
{:ok, projekt} = Api.Repo.insert(%Api.Tenants.Category{ tenant_id: web_tenant.id, title: "Projekt" })
{:ok, faecher} = Api.Repo.insert(%Api.Tenants.Category{ tenant_id: web_tenant.id, title: "Fächer" })
Api.Repo.insert(%Api.Tenants.Category{ tenant_id: web_tenant.id, title: "Material" })
Api.Repo.insert(%Api.Tenants.Category{ tenant_id: web_tenant.id, title: "Galerien" })

# Fächer
Api.Repo.insert(%Api.Tenants.Category{ tenant_id: web_tenant.id, title: "Sport", category_id: faecher.id })
Api.Repo.insert(%Api.Tenants.Category{ tenant_id: web_tenant.id, title: "Kunst", category_id: faecher.id })
Api.Repo.insert(%Api.Tenants.Category{ tenant_id: web_tenant.id, title: "Sprache", category_id: faecher.id })

# Profil
Api.Repo.insert(%Api.Tenants.Category{ tenant_id: web_tenant.id, title: "Podcast", category_id: profil.id })
Api.Repo.insert(%Api.Tenants.Category{ tenant_id: web_tenant.id, title: "Offene Kunst-AG", category_id: profil.id })
Api.Repo.insert(%Api.Tenants.Category{ tenant_id: web_tenant.id, title: "Schülerzeitung", category_id: profil.id })
Api.Repo.insert(%Api.Tenants.Category{ tenant_id: web_tenant.id, title: "Oskar-Reime-Chor", category_id: profil.id })
Api.Repo.insert(%Api.Tenants.Category{ tenant_id: web_tenant.id, title: "Schüler-Radio", category_id: profil.id })

# Articles
{:ok, oskar_goes_to} = Api.Repo.insert(%Api.Content.Article{
    tenant_id: web_tenant.id,
    category_id: profil.id,
    title: "And the oskar goes to ...",
    preview: "Hallo hallo hallo",
    preview_image_url: "https://placeimg.com/640/480/animals"
})
Api.Repo.insert(%Api.Content.ContentModule{ article_id: oskar_goes_to.id, type: "text", text: "JTdCJTIyb2JqZWN0JTIyJTNBJTIydmFsdWUlMjIlMkMlMjJkb2N1bWVudCUyMiUzQSU3QiUyMm9iamVjdCUyMiUzQSUyMmRvY3VtZW50JTIyJTJDJTIyZGF0YSUyMiUzQSU3QiU3RCUyQyUyMm5vZGVzJTIyJTNBJTVCJTdCJTIyb2JqZWN0JTIyJTNBJTIyYmxvY2slMjIlMkMlMjJ0eXBlJTIyJTNBJTIycGFyYWdyYXBoJTIyJTJDJTIyZGF0YSUyMiUzQSU3QiU3RCUyQyUyMm5vZGVzJTIyJTNBJTVCJTdCJTIyb2JqZWN0JTIyJTNBJTIydGV4dCUyMiUyQyUyMnRleHQlMjIlM0ElMjJMb3JlbSUyMGlwc3VtJTIwZG9sb3IlMjBzaXQlMjBhbWV0JTJDJTIwY29uc2V0ZXR1ciUyMHNhZGlwc2NpbmclMjBlbGl0ciUyQyUyMHNlZCUyMGRpYW0lMjBub251bXklMjBlaXJtb2QlMjB0ZW1wb3IlMjBpbnZpZHVudCUyMHV0JTIwbGFib3JlJTIwZXQlMjBkb2xvcmUlMjBtYWduYSUyMGFsaXF1eWFtJTIwZXJhdCUyQyUyMHNlZCUyMGRpYW0lMjB2b2x1cHR1YS4lMjBBdCUyMHZlcm8lMjBlb3MlMjBldCUyMGFjY3VzYW0lMjBldCUyMGp1c3RvJTIwZHVvJTIwZG9sb3JlcyUyMGV0JTIwZWElMjByZWJ1bS4lMjBTdGV0JTIwY2xpdGElMjBrYXNkJTIwZ3ViZXJncmVuJTJDJTIwbm8lMjBzZWElMjB0YWtpbWF0YSUyMHNhbmN0dXMlMjBlc3QlMjBMb3JlbSUyMGlwc3VtJTIwZG9sb3IlMjBzaXQlMjBhbWV0LiUyMExvcmVtJTIwaXBzdW0lMjBkb2xvciUyMHNpdCUyMGFtZXQlMkMlMjBjb25zZXRldHVyJTIwc2FkaXBzY2luZyUyMGVsaXRyJTJDJTIwc2VkJTIwZGlhbSUyMG5vbnVteSUyMGVpcm1vZCUyMHRlbXBvciUyMGludmlkdW50JTIwdXQlMjBsYWJvcmUlMjBldCUyMGRvbG9yZSUyMG1hZ25hJTIwYWxpcXV5YW0lMjBlcmF0JTJDJTIwc2VkJTIwZGlhbSUyMHZvbHVwdHVhLiUyMEF0JTIwdmVybyUyMGVvcyUyMGV0JTIwYWNjdXNhbSUyMGV0JTIwanVzdG8lMjBkdW8lMjBkb2xvcmVzJTIwZXQlMjBlYSUyMHJlYnVtLiUyMFN0ZXQlMjBjbGl0YSUyMGthc2QlMjBndWJlcmdyZW4lMkMlMjBubyUyMHNlYSUyMHRha2ltYXRhJTIwc2FuY3R1cyUyMGVzdCUyMExvcmVtJTIwaXBzdW0lMjBkb2xvciUyMHNpdCUyMGFtZXQuJTIyJTJDJTIybWFya3MlMjIlM0ElNUIlNUQlN0QlNUQlN0QlNUQlN0QlN0Q=" })
Api.Repo.insert(%Api.Content.ContentModule{ article_id: oskar_goes_to.id, type: "text", text: "JTdCJTIyb2JqZWN0JTIyJTNBJTIydmFsdWUlMjIlMkMlMjJkb2N1bWVudCUyMiUzQSU3QiUyMm9iamVjdCUyMiUzQSUyMmRvY3VtZW50JTIyJTJDJTIyZGF0YSUyMiUzQSU3QiU3RCUyQyUyMm5vZGVzJTIyJTNBJTVCJTdCJTIyb2JqZWN0JTIyJTNBJTIyYmxvY2slMjIlMkMlMjJ0eXBlJTIyJTNBJTIycGFyYWdyYXBoJTIyJTJDJTIyZGF0YSUyMiUzQSU3QiU3RCUyQyUyMm5vZGVzJTIyJTNBJTVCJTdCJTIyb2JqZWN0JTIyJTNBJTIydGV4dCUyMiUyQyUyMnRleHQlMjIlM0ElMjJMb3JlbSUyMGlwc3VtJTIwZG9sb3IlMjBzaXQlMjBhbWV0JTJDJTIwY29uc2V0ZXR1ciUyMHNhZGlwc2NpbmclMjBlbGl0ciUyQyUyMHNlZCUyMGRpYW0lMjBub251bXklMjBlaXJtb2QlMjB0ZW1wb3IlMjBpbnZpZHVudCUyMHV0JTIwbGFib3JlJTIwZXQlMjBkb2xvcmUlMjBtYWduYSUyMGFsaXF1eWFtJTIwZXJhdCUyQyUyMHNlZCUyMGRpYW0lMjB2b2x1cHR1YS4lMjBBdCUyMHZlcm8lMjBlb3MlMjBldCUyMGFjY3VzYW0lMjBldCUyMGp1c3RvJTIwZHVvJTIwZG9sb3JlcyUyMGV0JTIwZWElMjByZWJ1bS4lMjBTdGV0JTIwY2xpdGElMjBrYXNkJTIwZ3ViZXJncmVuJTJDJTIwbm8lMjBzZWElMjB0YWtpbWF0YSUyMHNhbmN0dXMlMjBlc3QlMjBMb3JlbSUyMGlwc3VtJTIwZG9sb3IlMjBzaXQlMjBhbWV0LiUyMExvcmVtJTIwaXBzdW0lMjBkb2xvciUyMHNpdCUyMGFtZXQlMkMlMjBjb25zZXRldHVyJTIwc2FkaXBzY2luZyUyMGVsaXRyJTJDJTIwc2VkJTIwZGlhbSUyMG5vbnVteSUyMGVpcm1vZCUyMHRlbXBvciUyMGludmlkdW50JTIwdXQlMjBsYWJvcmUlMjBldCUyMGRvbG9yZSUyMG1hZ25hJTIwYWxpcXV5YW0lMjBlcmF0JTJDJTIwc2VkJTIwZGlhbSUyMHZvbHVwdHVhLiUyMEF0JTIwdmVybyUyMGVvcyUyMGV0JTIwYWNjdXNhbSUyMGV0JTIwanVzdG8lMjBkdW8lMjBkb2xvcmVzJTIwZXQlMjBlYSUyMHJlYnVtLiUyMFN0ZXQlMjBjbGl0YSUyMGthc2QlMjBndWJlcmdyZW4lMkMlMjBubyUyMHNlYSUyMHRha2ltYXRhJTIwc2FuY3R1cyUyMGVzdCUyMExvcmVtJTIwaXBzdW0lMjBkb2xvciUyMHNpdCUyMGFtZXQuJTIyJTJDJTIybWFya3MlMjIlM0ElNUIlNUQlN0QlNUQlN0QlNUQlN0QlN0Q=" })
{:ok, landesfinale} = Api.Repo.insert(%Api.Content.Article{
    tenant_id: web_tenant.id,
    category_id: profil.id,
    title: "Landesfinale Volleyball WK IV",
    preview: "Zweimal Silber für die Mannschaften des Christian-Gottfried-Ehrenberg-Gymnasium Delitzsch beim Landesfinale \"Jugend trainiert für Europa\" im Volleyball. Nach beherztem Kampf im Finale unterlegen ...",
    preview_image_url: "https://placeimg.com/640/480/architecture"
})
Api.Repo.insert(%Api.Content.ContentModule{ article_id: landesfinale.id, type: "text", text: "JTdCJTIyb2JqZWN0JTIyJTNBJTIydmFsdWUlMjIlMkMlMjJkb2N1bWVudCUyMiUzQSU3QiUyMm9iamVjdCUyMiUzQSUyMmRvY3VtZW50JTIyJTJDJTIyZGF0YSUyMiUzQSU3QiU3RCUyQyUyMm5vZGVzJTIyJTNBJTVCJTdCJTIyb2JqZWN0JTIyJTNBJTIyYmxvY2slMjIlMkMlMjJ0eXBlJTIyJTNBJTIycGFyYWdyYXBoJTIyJTJDJTIyZGF0YSUyMiUzQSU3QiU3RCUyQyUyMm5vZGVzJTIyJTNBJTVCJTdCJTIyb2JqZWN0JTIyJTNBJTIydGV4dCUyMiUyQyUyMnRleHQlMjIlM0ElMjJMb3JlbSUyMGlwc3VtJTIwZG9sb3IlMjBzaXQlMjBhbWV0JTJDJTIwY29uc2V0ZXR1ciUyMHNhZGlwc2NpbmclMjBlbGl0ciUyQyUyMHNlZCUyMGRpYW0lMjBub251bXklMjBlaXJtb2QlMjB0ZW1wb3IlMjBpbnZpZHVudCUyMHV0JTIwbGFib3JlJTIwZXQlMjBkb2xvcmUlMjBtYWduYSUyMGFsaXF1eWFtJTIwZXJhdCUyQyUyMHNlZCUyMGRpYW0lMjB2b2x1cHR1YS4lMjBBdCUyMHZlcm8lMjBlb3MlMjBldCUyMGFjY3VzYW0lMjBldCUyMGp1c3RvJTIwZHVvJTIwZG9sb3JlcyUyMGV0JTIwZWElMjByZWJ1bS4lMjBTdGV0JTIwY2xpdGElMjBrYXNkJTIwZ3ViZXJncmVuJTJDJTIwbm8lMjBzZWElMjB0YWtpbWF0YSUyMHNhbmN0dXMlMjBlc3QlMjBMb3JlbSUyMGlwc3VtJTIwZG9sb3IlMjBzaXQlMjBhbWV0LiUyMExvcmVtJTIwaXBzdW0lMjBkb2xvciUyMHNpdCUyMGFtZXQlMkMlMjBjb25zZXRldHVyJTIwc2FkaXBzY2luZyUyMGVsaXRyJTJDJTIwc2VkJTIwZGlhbSUyMG5vbnVteSUyMGVpcm1vZCUyMHRlbXBvciUyMGludmlkdW50JTIwdXQlMjBsYWJvcmUlMjBldCUyMGRvbG9yZSUyMG1hZ25hJTIwYWxpcXV5YW0lMjBlcmF0JTJDJTIwc2VkJTIwZGlhbSUyMHZvbHVwdHVhLiUyMEF0JTIwdmVybyUyMGVvcyUyMGV0JTIwYWNjdXNhbSUyMGV0JTIwanVzdG8lMjBkdW8lMjBkb2xvcmVzJTIwZXQlMjBlYSUyMHJlYnVtLiUyMFN0ZXQlMjBjbGl0YSUyMGthc2QlMjBndWJlcmdyZW4lMkMlMjBubyUyMHNlYSUyMHRha2ltYXRhJTIwc2FuY3R1cyUyMGVzdCUyMExvcmVtJTIwaXBzdW0lMjBkb2xvciUyMHNpdCUyMGFtZXQuJTIyJTJDJTIybWFya3MlMjIlM0ElNUIlNUQlN0QlNUQlN0QlNUQlN0QlN0Q=" })
Api.Repo.insert(%Api.Content.ContentModule{ article_id: landesfinale.id, type: "text", text: "JTdCJTIyb2JqZWN0JTIyJTNBJTIydmFsdWUlMjIlMkMlMjJkb2N1bWVudCUyMiUzQSU3QiUyMm9iamVjdCUyMiUzQSUyMmRvY3VtZW50JTIyJTJDJTIyZGF0YSUyMiUzQSU3QiU3RCUyQyUyMm5vZGVzJTIyJTNBJTVCJTdCJTIyb2JqZWN0JTIyJTNBJTIyYmxvY2slMjIlMkMlMjJ0eXBlJTIyJTNBJTIycGFyYWdyYXBoJTIyJTJDJTIyZGF0YSUyMiUzQSU3QiU3RCUyQyUyMm5vZGVzJTIyJTNBJTVCJTdCJTIyb2JqZWN0JTIyJTNBJTIydGV4dCUyMiUyQyUyMnRleHQlMjIlM0ElMjJMb3JlbSUyMGlwc3VtJTIwZG9sb3IlMjBzaXQlMjBhbWV0JTJDJTIwY29uc2V0ZXR1ciUyMHNhZGlwc2NpbmclMjBlbGl0ciUyQyUyMHNlZCUyMGRpYW0lMjBub251bXklMjBlaXJtb2QlMjB0ZW1wb3IlMjBpbnZpZHVudCUyMHV0JTIwbGFib3JlJTIwZXQlMjBkb2xvcmUlMjBtYWduYSUyMGFsaXF1eWFtJTIwZXJhdCUyQyUyMHNlZCUyMGRpYW0lMjB2b2x1cHR1YS4lMjBBdCUyMHZlcm8lMjBlb3MlMjBldCUyMGFjY3VzYW0lMjBldCUyMGp1c3RvJTIwZHVvJTIwZG9sb3JlcyUyMGV0JTIwZWElMjByZWJ1bS4lMjBTdGV0JTIwY2xpdGElMjBrYXNkJTIwZ3ViZXJncmVuJTJDJTIwbm8lMjBzZWElMjB0YWtpbWF0YSUyMHNhbmN0dXMlMjBlc3QlMjBMb3JlbSUyMGlwc3VtJTIwZG9sb3IlMjBzaXQlMjBhbWV0LiUyMExvcmVtJTIwaXBzdW0lMjBkb2xvciUyMHNpdCUyMGFtZXQlMkMlMjBjb25zZXRldHVyJTIwc2FkaXBzY2luZyUyMGVsaXRyJTJDJTIwc2VkJTIwZGlhbSUyMG5vbnVteSUyMGVpcm1vZCUyMHRlbXBvciUyMGludmlkdW50JTIwdXQlMjBsYWJvcmUlMjBldCUyMGRvbG9yZSUyMG1hZ25hJTIwYWxpcXV5YW0lMjBlcmF0JTJDJTIwc2VkJTIwZGlhbSUyMHZvbHVwdHVhLiUyMEF0JTIwdmVybyUyMGVvcyUyMGV0JTIwYWNjdXNhbSUyMGV0JTIwanVzdG8lMjBkdW8lMjBkb2xvcmVzJTIwZXQlMjBlYSUyMHJlYnVtLiUyMFN0ZXQlMjBjbGl0YSUyMGthc2QlMjBndWJlcmdyZW4lMkMlMjBubyUyMHNlYSUyMHRha2ltYXRhJTIwc2FuY3R1cyUyMGVzdCUyMExvcmVtJTIwaXBzdW0lMjBkb2xvciUyMHNpdCUyMGFtZXQuJTIyJTJDJTIybWFya3MlMjIlM0ElNUIlNUQlN0QlNUQlN0QlNUQlN0QlN0Q=" })
{:ok, kleinkunst_wb2} = Api.Repo.insert(%Api.Content.Article{
    tenant_id: web_tenant.id,
    category_id: profil.id,
    title: "Der Podcast zum WB 2",
    preview: "Das Podcastteam hat alle Hochlichter der Veranstaltung in einem originellen Film zusammengeschnitten. Wir beglückwünschen die Sieger und haben unseren Sieger gesondert gefeiert.",
    page_name: "KleinKunst 2018",
    preview_image_url: "https://placeimg.com/640/480/people",
})
Api.Repo.insert(%Api.Content.ContentModule{ article_id: kleinkunst_wb2.id, type: "text", text: "JTdCJTIyb2JqZWN0JTIyJTNBJTIydmFsdWUlMjIlMkMlMjJkb2N1bWVudCUyMiUzQSU3QiUyMm9iamVjdCUyMiUzQSUyMmRvY3VtZW50JTIyJTJDJTIyZGF0YSUyMiUzQSU3QiU3RCUyQyUyMm5vZGVzJTIyJTNBJTVCJTdCJTIyb2JqZWN0JTIyJTNBJTIyYmxvY2slMjIlMkMlMjJ0eXBlJTIyJTNBJTIycGFyYWdyYXBoJTIyJTJDJTIyZGF0YSUyMiUzQSU3QiU3RCUyQyUyMm5vZGVzJTIyJTNBJTVCJTdCJTIyb2JqZWN0JTIyJTNBJTIydGV4dCUyMiUyQyUyMnRleHQlMjIlM0ElMjJMb3JlbSUyMGlwc3VtJTIwZG9sb3IlMjBzaXQlMjBhbWV0JTJDJTIwY29uc2V0ZXR1ciUyMHNhZGlwc2NpbmclMjBlbGl0ciUyQyUyMHNlZCUyMGRpYW0lMjBub251bXklMjBlaXJtb2QlMjB0ZW1wb3IlMjBpbnZpZHVudCUyMHV0JTIwbGFib3JlJTIwZXQlMjBkb2xvcmUlMjBtYWduYSUyMGFsaXF1eWFtJTIwZXJhdCUyQyUyMHNlZCUyMGRpYW0lMjB2b2x1cHR1YS4lMjBBdCUyMHZlcm8lMjBlb3MlMjBldCUyMGFjY3VzYW0lMjBldCUyMGp1c3RvJTIwZHVvJTIwZG9sb3JlcyUyMGV0JTIwZWElMjByZWJ1bS4lMjBTdGV0JTIwY2xpdGElMjBrYXNkJTIwZ3ViZXJncmVuJTJDJTIwbm8lMjBzZWElMjB0YWtpbWF0YSUyMHNhbmN0dXMlMjBlc3QlMjBMb3JlbSUyMGlwc3VtJTIwZG9sb3IlMjBzaXQlMjBhbWV0LiUyMExvcmVtJTIwaXBzdW0lMjBkb2xvciUyMHNpdCUyMGFtZXQlMkMlMjBjb25zZXRldHVyJTIwc2FkaXBzY2luZyUyMGVsaXRyJTJDJTIwc2VkJTIwZGlhbSUyMG5vbnVteSUyMGVpcm1vZCUyMHRlbXBvciUyMGludmlkdW50JTIwdXQlMjBsYWJvcmUlMjBldCUyMGRvbG9yZSUyMG1hZ25hJTIwYWxpcXV5YW0lMjBlcmF0JTJDJTIwc2VkJTIwZGlhbSUyMHZvbHVwdHVhLiUyMEF0JTIwdmVybyUyMGVvcyUyMGV0JTIwYWNjdXNhbSUyMGV0JTIwanVzdG8lMjBkdW8lMjBkb2xvcmVzJTIwZXQlMjBlYSUyMHJlYnVtLiUyMFN0ZXQlMjBjbGl0YSUyMGthc2QlMjBndWJlcmdyZW4lMkMlMjBubyUyMHNlYSUyMHRha2ltYXRhJTIwc2FuY3R1cyUyMGVzdCUyMExvcmVtJTIwaXBzdW0lMjBkb2xvciUyMHNpdCUyMGFtZXQuJTIyJTJDJTIybWFya3MlMjIlM0ElNUIlNUQlN0QlNUQlN0QlNUQlN0QlN0Q=" })
Api.Repo.insert(%Api.Content.ContentModule{ article_id: kleinkunst_wb2.id, type: "text", text: "JTdCJTIyb2JqZWN0JTIyJTNBJTIydmFsdWUlMjIlMkMlMjJkb2N1bWVudCUyMiUzQSU3QiUyMm9iamVjdCUyMiUzQSUyMmRvY3VtZW50JTIyJTJDJTIyZGF0YSUyMiUzQSU3QiU3RCUyQyUyMm5vZGVzJTIyJTNBJTVCJTdCJTIyb2JqZWN0JTIyJTNBJTIyYmxvY2slMjIlMkMlMjJ0eXBlJTIyJTNBJTIycGFyYWdyYXBoJTIyJTJDJTIyZGF0YSUyMiUzQSU3QiU3RCUyQyUyMm5vZGVzJTIyJTNBJTVCJTdCJTIyb2JqZWN0JTIyJTNBJTIydGV4dCUyMiUyQyUyMnRleHQlMjIlM0ElMjJMb3JlbSUyMGlwc3VtJTIwZG9sb3IlMjBzaXQlMjBhbWV0JTJDJTIwY29uc2V0ZXR1ciUyMHNhZGlwc2NpbmclMjBlbGl0ciUyQyUyMHNlZCUyMGRpYW0lMjBub251bXklMjBlaXJtb2QlMjB0ZW1wb3IlMjBpbnZpZHVudCUyMHV0JTIwbGFib3JlJTIwZXQlMjBkb2xvcmUlMjBtYWduYSUyMGFsaXF1eWFtJTIwZXJhdCUyQyUyMHNlZCUyMGRpYW0lMjB2b2x1cHR1YS4lMjBBdCUyMHZlcm8lMjBlb3MlMjBldCUyMGFjY3VzYW0lMjBldCUyMGp1c3RvJTIwZHVvJTIwZG9sb3JlcyUyMGV0JTIwZWElMjByZWJ1bS4lMjBTdGV0JTIwY2xpdGElMjBrYXNkJTIwZ3ViZXJncmVuJTJDJTIwbm8lMjBzZWElMjB0YWtpbWF0YSUyMHNhbmN0dXMlMjBlc3QlMjBMb3JlbSUyMGlwc3VtJTIwZG9sb3IlMjBzaXQlMjBhbWV0LiUyMExvcmVtJTIwaXBzdW0lMjBkb2xvciUyMHNpdCUyMGFtZXQlMkMlMjBjb25zZXRldHVyJTIwc2FkaXBzY2luZyUyMGVsaXRyJTJDJTIwc2VkJTIwZGlhbSUyMG5vbnVteSUyMGVpcm1vZCUyMHRlbXBvciUyMGludmlkdW50JTIwdXQlMjBsYWJvcmUlMjBldCUyMGRvbG9yZSUyMG1hZ25hJTIwYWxpcXV5YW0lMjBlcmF0JTJDJTIwc2VkJTIwZGlhbSUyMHZvbHVwdHVhLiUyMEF0JTIwdmVybyUyMGVvcyUyMGV0JTIwYWNjdXNhbSUyMGV0JTIwanVzdG8lMjBkdW8lMjBkb2xvcmVzJTIwZXQlMjBlYSUyMHJlYnVtLiUyMFN0ZXQlMjBjbGl0YSUyMGthc2QlMjBndWJlcmdyZW4lMkMlMjBubyUyMHNlYSUyMHRha2ltYXRhJTIwc2FuY3R1cyUyMGVzdCUyMExvcmVtJTIwaXBzdW0lMjBkb2xvciUyMHNpdCUyMGFtZXQuJTIyJTJDJTIybWFya3MlMjIlM0ElNUIlNUQlN0QlNUQlN0QlNUQlN0QlN0Q=" })
{:ok, vorausscheid} = Api.Repo.insert(%Api.Content.Article{
    tenant_id: web_tenant.id,
    category_id: profil.id,
    title: "Der Vorausscheid",
    preview: "Singen, Schauspielern, Instrumente Spielen - Die Kerndisziplinen von Klienkunst waren auch diese Jahr beim Vorausscheid am 14. Februar vertreten. Wir mischten uns unter die Kandidaten, Techniker und die Jury.",
    page_name: "KleinKunst 2018",
    preview_image_url: "https://placeimg.com/640/480/tech",
})
Api.Repo.insert(%Api.Content.ContentModule{ article_id: vorausscheid.id, type: "text", text: "JTdCJTIyb2JqZWN0JTIyJTNBJTIydmFsdWUlMjIlMkMlMjJkb2N1bWVudCUyMiUzQSU3QiUyMm9iamVjdCUyMiUzQSUyMmRvY3VtZW50JTIyJTJDJTIyZGF0YSUyMiUzQSU3QiU3RCUyQyUyMm5vZGVzJTIyJTNBJTVCJTdCJTIyb2JqZWN0JTIyJTNBJTIyYmxvY2slMjIlMkMlMjJ0eXBlJTIyJTNBJTIycGFyYWdyYXBoJTIyJTJDJTIyZGF0YSUyMiUzQSU3QiU3RCUyQyUyMm5vZGVzJTIyJTNBJTVCJTdCJTIyb2JqZWN0JTIyJTNBJTIydGV4dCUyMiUyQyUyMnRleHQlMjIlM0ElMjJMb3JlbSUyMGlwc3VtJTIwZG9sb3IlMjBzaXQlMjBhbWV0JTJDJTIwY29uc2V0ZXR1ciUyMHNhZGlwc2NpbmclMjBlbGl0ciUyQyUyMHNlZCUyMGRpYW0lMjBub251bXklMjBlaXJtb2QlMjB0ZW1wb3IlMjBpbnZpZHVudCUyMHV0JTIwbGFib3JlJTIwZXQlMjBkb2xvcmUlMjBtYWduYSUyMGFsaXF1eWFtJTIwZXJhdCUyQyUyMHNlZCUyMGRpYW0lMjB2b2x1cHR1YS4lMjBBdCUyMHZlcm8lMjBlb3MlMjBldCUyMGFjY3VzYW0lMjBldCUyMGp1c3RvJTIwZHVvJTIwZG9sb3JlcyUyMGV0JTIwZWElMjByZWJ1bS4lMjBTdGV0JTIwY2xpdGElMjBrYXNkJTIwZ3ViZXJncmVuJTJDJTIwbm8lMjBzZWElMjB0YWtpbWF0YSUyMHNhbmN0dXMlMjBlc3QlMjBMb3JlbSUyMGlwc3VtJTIwZG9sb3IlMjBzaXQlMjBhbWV0LiUyMExvcmVtJTIwaXBzdW0lMjBkb2xvciUyMHNpdCUyMGFtZXQlMkMlMjBjb25zZXRldHVyJTIwc2FkaXBzY2luZyUyMGVsaXRyJTJDJTIwc2VkJTIwZGlhbSUyMG5vbnVteSUyMGVpcm1vZCUyMHRlbXBvciUyMGludmlkdW50JTIwdXQlMjBsYWJvcmUlMjBldCUyMGRvbG9yZSUyMG1hZ25hJTIwYWxpcXV5YW0lMjBlcmF0JTJDJTIwc2VkJTIwZGlhbSUyMHZvbHVwdHVhLiUyMEF0JTIwdmVybyUyMGVvcyUyMGV0JTIwYWNjdXNhbSUyMGV0JTIwanVzdG8lMjBkdW8lMjBkb2xvcmVzJTIwZXQlMjBlYSUyMHJlYnVtLiUyMFN0ZXQlMjBjbGl0YSUyMGthc2QlMjBndWJlcmdyZW4lMkMlMjBubyUyMHNlYSUyMHRha2ltYXRhJTIwc2FuY3R1cyUyMGVzdCUyMExvcmVtJTIwaXBzdW0lMjBkb2xvciUyMHNpdCUyMGFtZXQuJTIyJTJDJTIybWFya3MlMjIlM0ElNUIlNUQlN0QlNUQlN0QlNUQlN0QlN0Q=" })
Api.Repo.insert(%Api.Content.ContentModule{ article_id: vorausscheid.id, type: "text", text: "JTdCJTIyb2JqZWN0JTIyJTNBJTIydmFsdWUlMjIlMkMlMjJkb2N1bWVudCUyMiUzQSU3QiUyMm9iamVjdCUyMiUzQSUyMmRvY3VtZW50JTIyJTJDJTIyZGF0YSUyMiUzQSU3QiU3RCUyQyUyMm5vZGVzJTIyJTNBJTVCJTdCJTIyb2JqZWN0JTIyJTNBJTIyYmxvY2slMjIlMkMlMjJ0eXBlJTIyJTNBJTIycGFyYWdyYXBoJTIyJTJDJTIyZGF0YSUyMiUzQSU3QiU3RCUyQyUyMm5vZGVzJTIyJTNBJTVCJTdCJTIyb2JqZWN0JTIyJTNBJTIydGV4dCUyMiUyQyUyMnRleHQlMjIlM0ElMjJMb3JlbSUyMGlwc3VtJTIwZG9sb3IlMjBzaXQlMjBhbWV0JTJDJTIwY29uc2V0ZXR1ciUyMHNhZGlwc2NpbmclMjBlbGl0ciUyQyUyMHNlZCUyMGRpYW0lMjBub251bXklMjBlaXJtb2QlMjB0ZW1wb3IlMjBpbnZpZHVudCUyMHV0JTIwbGFib3JlJTIwZXQlMjBkb2xvcmUlMjBtYWduYSUyMGFsaXF1eWFtJTIwZXJhdCUyQyUyMHNlZCUyMGRpYW0lMjB2b2x1cHR1YS4lMjBBdCUyMHZlcm8lMjBlb3MlMjBldCUyMGFjY3VzYW0lMjBldCUyMGp1c3RvJTIwZHVvJTIwZG9sb3JlcyUyMGV0JTIwZWElMjByZWJ1bS4lMjBTdGV0JTIwY2xpdGElMjBrYXNkJTIwZ3ViZXJncmVuJTJDJTIwbm8lMjBzZWElMjB0YWtpbWF0YSUyMHNhbmN0dXMlMjBlc3QlMjBMb3JlbSUyMGlwc3VtJTIwZG9sb3IlMjBzaXQlMjBhbWV0LiUyMExvcmVtJTIwaXBzdW0lMjBkb2xvciUyMHNpdCUyMGFtZXQlMkMlMjBjb25zZXRldHVyJTIwc2FkaXBzY2luZyUyMGVsaXRyJTJDJTIwc2VkJTIwZGlhbSUyMG5vbnVteSUyMGVpcm1vZCUyMHRlbXBvciUyMGludmlkdW50JTIwdXQlMjBsYWJvcmUlMjBldCUyMGRvbG9yZSUyMG1hZ25hJTIwYWxpcXV5YW0lMjBlcmF0JTJDJTIwc2VkJTIwZGlhbSUyMHZvbHVwdHVhLiUyMEF0JTIwdmVybyUyMGVvcyUyMGV0JTIwYWNjdXNhbSUyMGV0JTIwanVzdG8lMjBkdW8lMjBkb2xvcmVzJTIwZXQlMjBlYSUyMHJlYnVtLiUyMFN0ZXQlMjBjbGl0YSUyMGthc2QlMjBndWJlcmdyZW4lMkMlMjBubyUyMHNlYSUyMHRha2ltYXRhJTIwc2FuY3R1cyUyMGVzdCUyMExvcmVtJTIwaXBzdW0lMjBkb2xvciUyMHNpdCUyMGFtZXQuJTIyJTJDJTIybWFya3MlMjIlM0ElNUIlNUQlN0QlNUQlN0QlNUQlN0QlN0Q=" })
{:ok, nipplejesus} = Api.Repo.insert(%Api.Content.Article{
    tenant_id: web_tenant.id,
    category_id: projekt.id,
    title: "„Nipple Jesus“- eine extreme Erfahrung",
    preview: "Das Theaterstück „Nipple Jesus“, welches am 08.02.2019 im Museum der Bildenden Künste aufgeführt wurde, hat bei mir noch lange nach der Aufführung große Aufmerksamkeit hinterlassen.",
    preview_image_url: "https://placeimg.com/640/480/people",
})
Api.Repo.insert(%Api.Content.ContentModule{ article_id: nipplejesus.id, type: "text", text: "JTdCJTIyb2JqZWN0JTIyJTNBJTIydmFsdWUlMjIlMkMlMjJkb2N1bWVudCUyMiUzQSU3QiUyMm9iamVjdCUyMiUzQSUyMmRvY3VtZW50JTIyJTJDJTIyZGF0YSUyMiUzQSU3QiU3RCUyQyUyMm5vZGVzJTIyJTNBJTVCJTdCJTIyb2JqZWN0JTIyJTNBJTIyYmxvY2slMjIlMkMlMjJ0eXBlJTIyJTNBJTIycGFyYWdyYXBoJTIyJTJDJTIyZGF0YSUyMiUzQSU3QiU3RCUyQyUyMm5vZGVzJTIyJTNBJTVCJTdCJTIyb2JqZWN0JTIyJTNBJTIydGV4dCUyMiUyQyUyMnRleHQlMjIlM0ElMjJMb3JlbSUyMGlwc3VtJTIwZG9sb3IlMjBzaXQlMjBhbWV0JTJDJTIwY29uc2V0ZXR1ciUyMHNhZGlwc2NpbmclMjBlbGl0ciUyQyUyMHNlZCUyMGRpYW0lMjBub251bXklMjBlaXJtb2QlMjB0ZW1wb3IlMjBpbnZpZHVudCUyMHV0JTIwbGFib3JlJTIwZXQlMjBkb2xvcmUlMjBtYWduYSUyMGFsaXF1eWFtJTIwZXJhdCUyQyUyMHNlZCUyMGRpYW0lMjB2b2x1cHR1YS4lMjBBdCUyMHZlcm8lMjBlb3MlMjBldCUyMGFjY3VzYW0lMjBldCUyMGp1c3RvJTIwZHVvJTIwZG9sb3JlcyUyMGV0JTIwZWElMjByZWJ1bS4lMjBTdGV0JTIwY2xpdGElMjBrYXNkJTIwZ3ViZXJncmVuJTJDJTIwbm8lMjBzZWElMjB0YWtpbWF0YSUyMHNhbmN0dXMlMjBlc3QlMjBMb3JlbSUyMGlwc3VtJTIwZG9sb3IlMjBzaXQlMjBhbWV0LiUyMExvcmVtJTIwaXBzdW0lMjBkb2xvciUyMHNpdCUyMGFtZXQlMkMlMjBjb25zZXRldHVyJTIwc2FkaXBzY2luZyUyMGVsaXRyJTJDJTIwc2VkJTIwZGlhbSUyMG5vbnVteSUyMGVpcm1vZCUyMHRlbXBvciUyMGludmlkdW50JTIwdXQlMjBsYWJvcmUlMjBldCUyMGRvbG9yZSUyMG1hZ25hJTIwYWxpcXV5YW0lMjBlcmF0JTJDJTIwc2VkJTIwZGlhbSUyMHZvbHVwdHVhLiUyMEF0JTIwdmVybyUyMGVvcyUyMGV0JTIwYWNjdXNhbSUyMGV0JTIwanVzdG8lMjBkdW8lMjBkb2xvcmVzJTIwZXQlMjBlYSUyMHJlYnVtLiUyMFN0ZXQlMjBjbGl0YSUyMGthc2QlMjBndWJlcmdyZW4lMkMlMjBubyUyMHNlYSUyMHRha2ltYXRhJTIwc2FuY3R1cyUyMGVzdCUyMExvcmVtJTIwaXBzdW0lMjBkb2xvciUyMHNpdCUyMGFtZXQuJTIyJTJDJTIybWFya3MlMjIlM0ElNUIlNUQlN0QlNUQlN0QlNUQlN0QlN0Q=" })
Api.Repo.insert(%Api.Content.ContentModule{ article_id: nipplejesus.id, type: "text", text: "JTdCJTIyb2JqZWN0JTIyJTNBJTIydmFsdWUlMjIlMkMlMjJkb2N1bWVudCUyMiUzQSU3QiUyMm9iamVjdCUyMiUzQSUyMmRvY3VtZW50JTIyJTJDJTIyZGF0YSUyMiUzQSU3QiU3RCUyQyUyMm5vZGVzJTIyJTNBJTVCJTdCJTIyb2JqZWN0JTIyJTNBJTIyYmxvY2slMjIlMkMlMjJ0eXBlJTIyJTNBJTIycGFyYWdyYXBoJTIyJTJDJTIyZGF0YSUyMiUzQSU3QiU3RCUyQyUyMm5vZGVzJTIyJTNBJTVCJTdCJTIyb2JqZWN0JTIyJTNBJTIydGV4dCUyMiUyQyUyMnRleHQlMjIlM0ElMjJMb3JlbSUyMGlwc3VtJTIwZG9sb3IlMjBzaXQlMjBhbWV0JTJDJTIwY29uc2V0ZXR1ciUyMHNhZGlwc2NpbmclMjBlbGl0ciUyQyUyMHNlZCUyMGRpYW0lMjBub251bXklMjBlaXJtb2QlMjB0ZW1wb3IlMjBpbnZpZHVudCUyMHV0JTIwbGFib3JlJTIwZXQlMjBkb2xvcmUlMjBtYWduYSUyMGFsaXF1eWFtJTIwZXJhdCUyQyUyMHNlZCUyMGRpYW0lMjB2b2x1cHR1YS4lMjBBdCUyMHZlcm8lMjBlb3MlMjBldCUyMGFjY3VzYW0lMjBldCUyMGp1c3RvJTIwZHVvJTIwZG9sb3JlcyUyMGV0JTIwZWElMjByZWJ1bS4lMjBTdGV0JTIwY2xpdGElMjBrYXNkJTIwZ3ViZXJncmVuJTJDJTIwbm8lMjBzZWElMjB0YWtpbWF0YSUyMHNhbmN0dXMlMjBlc3QlMjBMb3JlbSUyMGlwc3VtJTIwZG9sb3IlMjBzaXQlMjBhbWV0LiUyMExvcmVtJTIwaXBzdW0lMjBkb2xvciUyMHNpdCUyMGFtZXQlMkMlMjBjb25zZXRldHVyJTIwc2FkaXBzY2luZyUyMGVsaXRyJTJDJTIwc2VkJTIwZGlhbSUyMG5vbnVteSUyMGVpcm1vZCUyMHRlbXBvciUyMGludmlkdW50JTIwdXQlMjBsYWJvcmUlMjBldCUyMGRvbG9yZSUyMG1hZ25hJTIwYWxpcXV5YW0lMjBlcmF0JTJDJTIwc2VkJTIwZGlhbSUyMHZvbHVwdHVhLiUyMEF0JTIwdmVybyUyMGVvcyUyMGV0JTIwYWNjdXNhbSUyMGV0JTIwanVzdG8lMjBkdW8lMjBkb2xvcmVzJTIwZXQlMjBlYSUyMHJlYnVtLiUyMFN0ZXQlMjBjbGl0YSUyMGthc2QlMjBndWJlcmdyZW4lMkMlMjBubyUyMHNlYSUyMHRha2ltYXRhJTIwc2FuY3R1cyUyMGVzdCUyMExvcmVtJTIwaXBzdW0lMjBkb2xvciUyMHNpdCUyMGFtZXQuJTIyJTJDJTIybWFya3MlMjIlM0ElNUIlNUQlN0QlNUQlN0QlNUQlN0QlN0Q=" })