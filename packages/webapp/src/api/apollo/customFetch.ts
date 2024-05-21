import axios from 'axios';

const isBrowser = typeof window !== 'undefined';
const tenantSlugOverwrite = undefined;

export const createHeaders = (headers: Record<string, string> = {}) => {
  console.log({ incomingHeaders: headers });
  return Object.assign(
    {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    {
      'x-lotta-originary-host':
        headers['x-lotta-originary-host'] || headers.host,
    },
    tenantSlugOverwrite ? { tenant: `slug:${tenantSlugOverwrite}` } : {},
    { ...headers }
  );
};

export const createCustomFetch = (
  {
    requestExtraHeaders,
  }: {
    requestExtraHeaders: () => Record<string, string | undefined | null>;
  } = {
    requestExtraHeaders: () => ({}),
  }
) =>
  (async (url: string, options: any) => {
    const { headers, body, method, ...miscOptions } = options;

    const outgoingHeaders = createHeaders({
      ...headers,
      ...requestExtraHeaders(),
    });
    console.log({ outgoingHeaders });

    const axiosResponse = await axios({
      ...miscOptions,
      headers: outgoingHeaders,
      url,
      method,
      data: body,
      withCredentials: isBrowser,
    });
    return new Response(JSON.stringify(axiosResponse.data), {
      headers: Object.entries(axiosResponse.headers).map(([key, value]) => {
        return [key, Array.isArray(value) ? value.join(',') : value || ''] as [
          string,
          string,
        ];
      }),
      status: axiosResponse.status,
      statusText: axiosResponse.statusText,
    });
  }) as typeof fetch;
