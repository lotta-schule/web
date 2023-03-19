import { cache } from 'react';
import { headers } from 'next/headers';
import { getApolloClient } from 'api/client';
import {
  CategoryModel,
} from 'model';

import GetCategoriesQuery from 'api/query/GetCategoriesQuery.graphql';

export const getAllCategories = cache(async () => {
    const headersList = headers();

    const { data, error } = await getApolloClient().query<{
        categories?: CategoryModel[];
    }>({
        query: GetCategoriesQuery,
        context: {
            headers: {
                'x-tenant-id': headersList.get('x-tenant-id'),
                host: headersList.get('host'),
                authorization: headersList.get('authorization'),
            },
        },
    });

    if (error) {
        console.error('upsi', error);
        throw error;
    }

    return data?.categories ?? [];
});
