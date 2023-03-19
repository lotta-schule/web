import { cache } from 'react';
import { TenantModel } from 'model';
import { headers } from 'next/headers';
import { getApolloClient } from 'api/client';

import GetTenantQuery from 'api/query/GetTenantQuery.graphql';

export const getTenant = cache(async () => {
    const headersList = headers();
    const apolloClient = getApolloClient();

    const { data } = await apolloClient.query<{ tenant?: TenantModel }>({
        query: GetTenantQuery,
        context: {
            headers: {
                'x-tenant-id': headersList.get('x-tenant-id'),
                host: headersList.get('host'),
                authorization: headersList.get('authorization'),
            },
        },
    });

    return data?.tenant ?? null;
});
