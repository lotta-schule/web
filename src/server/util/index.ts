import { getApolloClient } from 'api/client';
import { headers } from 'next/headers';
import {
    ArticleFilter,
    ArticleModel,
    CategoryModel,
    ID,
    TenantModel,
} from 'model';

import GetArticlesQuery from 'api/query/GetArticlesQuery.graphql';
import GetTenantQuery from 'api/query/GetTenantQuery.graphql';
import GetCategoriesQuery from 'api/query/GetCategoriesQuery.graphql';

export const getTenant = async () => {
    const headersList = headers();

    const { data } = await getApolloClient().query<{ tenant?: TenantModel }>({
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
};

export const getTenantCategories = async () => {
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
};

export const getCategoryArticles = async (
    categoryId: ID | null,
    count = 10
) => {
    const headersList = headers();

    const { data, error } = await getApolloClient().query<
        { articles: ArticleModel[] },
        { categoryId: ID | null; filter: ArticleFilter }
    >({
        query: GetArticlesQuery,
        variables: { categoryId, filter: { first: count } },
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

    return data?.articles ?? [];
};

export const getBaseUrl = () => {
    const headersList = headers();
    const host = headersList.get('host');
    const isHttps = headersList.get('X-Forwarded-Proto') === 'https';
    const protocol = isHttps ? 'https' : 'http';
    return (
        process.env.NEXT_PUBLIC_BASE_URL ||
        `${protocol}://${host ?? 'localhost'}`
    );
};
