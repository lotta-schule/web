defmodule Api.Storage.RemoteStorage do
  alias Api.Storage.RemoteStorageEntity

  @type config :: %{
          name: String.t(),
          type: module(),
          config: map()
        }

  @doc """
  Get the config for a given store (identified by name). Returns an :error-Tuple if the store is not available

  ## Examples

  iex> config_for_store("minio")
  {:ok, %{name: "minio", type: Strategy.S3, config: %{}}}

  iex> config_for_store("IMPOSSIBLE")
  {:error, :unknown_store}
  """
  @doc since: "2.5.0"
  @spec config_for_store(String.t()) :: {:ok, config()} | {:error, :unknown_store}
  def config_for_store(store_name) do
    Application.fetch_env!(:api, __MODULE__)
    |> Keyword.get(:storages)
    |> case do
      %{^store_name => config} ->
        {:ok, Map.put(config, :name, store_name)}

      _ ->
        {:error, :unknown_store}
    end
  end

  @doc """
  Get the name of the default store

  ## Examples

      iex> default_store()
      "dev-data"
  """
  @doc since: "2.5.0"
  @spec default_store() :: String.t()
  def default_store do
    Keyword.get(
      Application.fetch_env!(:api, __MODULE__),
      :default_storage,
      ""
    )
  end

  @doc """
  Get the stragegy set for a given store name, or, if none is given, for the default store.
  """
  @doc since: "2.5.0"
  @spec get_strategy() :: {:ok, module()} | {:error, :unknown_store}
  @spec get_strategy(String.t()) :: module() | nil
  def get_strategy(store_name \\ default_store()) do
    case config_for_store(store_name) do
      {:ok, %{type: strategy}} ->
        {:ok, strategy}

      error ->
        error
    end
  end

  @doc """
  Returns a path with the global prefix attached if any is set in the config
  """
  @doc since: "2.5.0"
  @spec get_prefixed_path(String.t()) :: String.t()
  def get_prefixed_path(path) do
    prefix =
      Application.fetch_env!(:api, __MODULE__)
      |> Keyword.get(:prefix)

    if is_nil(prefix) do
      [path]
    else
      [prefix, String.replace_prefix(path, "/", "")]
    end
    |> Enum.join("/")
  end

  @doc """
  Create a file on the remote storage given an elixir Upload struct.
  Returns an (unsaved[!]) RemoteStorageEntity in a result tuple.
  """
  @spec create(%Plug.Upload{}, String.t()) ::
          {:ok, RemoteStorageEntity.t()} | {:error, term()}
  def create(%Plug.Upload{} = file, path) do
    with {:ok, strategy} <- get_strategy(),
         {:ok, config} <- config_for_store(default_store()) do
      strategy.create(file, path, config)
    else
      error ->
        error
    end
  end

  @doc """
  Delete a file on the storage for the given entity
  """
  @spec delete(RemoteStorageEntity.t()) :: {:ok, RemoteStorageEntity.t()} | {:error, term()}
  def delete(%RemoteStorageEntity{store_name: store} = entity) do
    with {:ok, strategy} <- get_strategy(store),
         {:ok, config} <- config_for_store(store) do
      strategy.delete(entity, config)
    else
      error ->
        error
    end
  end

  @doc """
  Get the http URL for a given entity: Returns null if the URL cannot be found.
  """
  @spec get_http_url(RemoteStorageEntity.t()) :: String.t() | nil
  def get_http_url(%RemoteStorageEntity{} = remote_storage_entity) do
    with {:ok, strategy} <- get_strategy(remote_storage_entity.store_name),
         {:ok, config} <- config_for_store(remote_storage_entity.store_name) do
      strategy.get_http_url(remote_storage_entity, config)
    else
      _ ->
        nil
    end
  end
end
