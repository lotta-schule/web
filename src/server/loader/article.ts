import { cache } from 'react';
import { getApolloClient } from 'api/client';
import { headers } from 'next/headers';
import {
    ArticleFilter,
    ArticleModel,
    ID,
} from 'model';

import GetArticlesQuery from 'api/query/GetArticlesQuery.graphql';
import GetArticleQuery from 'api/query/GetArticleQuery.graphql';

export const getCategoryArticles = cache(async (
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
        throw error;
    }

    return data?.articles ?? [];
});

export const getArticle = cache(async (articleId: ID | null) => {
    const headersList = headers();

    const { data, error } = await getApolloClient().query<
        { article: ArticleModel[] },
        { articleId: ID | null; }
    >({
        query: GetArticleQuery,
        variables: { articleId },
        context: {
            headers: {
                'x-tenant-id': headersList.get('x-tenant-id'),
                host: headersList.get('host'),
                authorization: headersList.get('authorization'),
            },
        },
    });

    if (error) {
        throw error;
    }

    return data?.article || null;
});
