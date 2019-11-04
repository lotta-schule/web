import Config

ugc_s3_compat_endpoint = System.fetch_env!("UGC_S3_COMPAT_ENDPOINT")
ugc_s3_compat_access_key_id = System.fetch_env!("UGC_S3_COMPAT_ACCESS_KEY_ID")
ugc_s3_compat_secret_access_key = System.fetch_env!("UGC_S3_COMPAT_SECRET_ACCESS_KEY")
ugc_s3_compat_bucket = System.fetch_env!("UGC_S3_COMPAT_BUCKET")
ugc_s3_compat_region = System.fetch_env!("UGC_S3_COMPAT_REGION")
ugc_s3_compat_cdn_base_url = System.fetch_env!("UGC_S3_COMPAT_CDN_BASE_URL")

# Configure your database
config :api, Api.Repo,
  username: "lotta",
  password: "lotta",
  database: "lotta",
  hostname: "postgres",
  show_sensitive_data_on_connection_error: true,
  pool_size: 10

config :api, :rabbitmq_connection,
  username: "guest",
  password: "guest",
  host: "rabbitmq"

config :api, :schedule_provider_url, "http://schedule_provider:3000"

config :ex_aws, :s3,
  http_client: ExAws.Request.Hackney,
  access_key_id: ugc_s3_compat_access_key_id,
  secret_access_key: ugc_s3_compat_secret_access_key,
  host: %{ugc_s3_compat_region => ugc_s3_compat_endpoint},
  region: ugc_s3_compat_region,
  scheme: "https://"

# For development, we disable any cache and enable
# debugging and code reloading.
#
# The watchers configuration can be used to run external
# watchers to your application. For example, we use it
# with webpack to recompile .js and .css sources.
config :api, ApiWeb.Endpoint,
  http: [port: 4000],
  debug_errors: true,
  code_reloader: true,
  check_origin: false,
  watchers: []

config :api, Api.Guardian,
  issuer: "lotta",
  secret_key: "JM1gXuiWLLO766ayWjaee4Ed/8nmwssLoDbmtt0+yct7jO8TmFsCeOQhDcqQ+v2D"

# ## SSL Support
#
# In order to use HTTPS in development, a self-signed
# certificate can be generated by running the following
# Mix task:
#
#     mix phx.gen.cert
#
# Note that this task requires Erlang/OTP 20 or later.
# Run `mix help phx.gen.cert` for more information.
#
# The `http:` config above can be replaced with:
#
#     https: [
#       port: 4001,
#       cipher_suite: :strong,
#       keyfile: "priv/cert/selfsigned_key.pem",
#       certfile: "priv/cert/selfsigned.pem"
#     ],
#
# If desired, both `http:` and `https:` keys can be
# configured to run both http and https servers on
# different ports.

# Do not include metadata nor timestamps in development logs
config :logger, :console, format: "[$level] $message\n"

# Set a higher stacktrace during development. Avoid configuring such
# in production as building large stacktraces may be expensive.
config :phoenix, :stacktrace_depth, 20

# Initialize plugs at runtime for faster development compilation
config :phoenix, :plug_init_mode, :runtime
