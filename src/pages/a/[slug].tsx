import * as React from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getApolloClient } from 'api/client';
import { Main, Sidebar } from 'layouts/base';
import { ArticleModel, ID } from 'model';
import { ErrorMessage } from 'component/general/ErrorMessage';
import { ArticlePage } from 'layouts/article/ArticlePage';

import GetArticleQuery from 'api/query/GetArticleQuery.graphql';

const ArticleRoute = ({
    article,
    loadArticleError,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    if (!article) {
        throw new Error('Beitrag nicht gefunden');
    }
    getApolloClient().writeQuery({
        query: GetArticleQuery,
        variables: { id: article.id },
        data: { article },
    });

    if (loadArticleError) {
        return <ErrorMessage error={loadArticleError} />;
    }

    return (
        <>
            <Main>
                <ArticlePage article={article} />
            </Main>
            <Sidebar isEmpty />
        </>
    );
};

export const getServerSideProps = async ({
    params,
    req,
}: GetServerSidePropsContext) => {
    const articleId = (params?.slug as string)?.replace(/^(\d+).*/, '$1');
    if (!articleId) {
        return {
            props: {
                article: null,
                loadArticleError: null,
            },
            notFound: true,
        };
    }
    const {
        data: { article },
        error: loadArticleError,
    } = await getApolloClient().query<{ article: ArticleModel }, { id: ID }>({
        query: GetArticleQuery,
        variables: { id: articleId },
        context: {
            headers: req?.headers,
        },
    });

    return {
        props: {
            article,
            loadArticleError: loadArticleError ?? null,
        },
        notFound: !article,
    };
};

export default ArticleRoute;
