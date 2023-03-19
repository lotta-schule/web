import { cache } from 'react';
import { UserModel } from 'model';
import { headers } from 'next/headers';
import { getApolloClient } from 'api/client';

import GetCurrentUserQuery from 'api/query/GetCurrentUser.graphql';

export const getCurrentUser = cache(async () => {
    const headersList = headers();

    const { data } = await getApolloClient().query<{ user?: UserModel }>({
        query: GetCurrentUserQuery,
        context: {
            headers: {
                'x-tenant-id': headersList.get('x-tenant-id'),
                host: headersList.get('host'),
                authorization: headersList.get('authorization'),
            },
        },
    });

    return data?.user ?? null;
});
