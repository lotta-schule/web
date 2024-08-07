import * as React from 'react';
import { ArticleModel } from 'model';
import { getApolloClient } from 'api/legacyClient';
import { UnpublishedArticlesPage } from 'article/UnpublishedArticlesPage';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import GetUnpublishedArticlesQuery from 'api/query/GetUnpublishedArticlesQuery.graphql';

const UnpublishedRoute = ({
  articles,
  loadArticlesError: error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <UnpublishedArticlesPage articles={articles} error={error} />;
};

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const {
    data: { articles },
    error,
  } = await getApolloClient().query<{ articles: ArticleModel[] }>({
    query: GetUnpublishedArticlesQuery,
    context: {
      headers: req?.headers,
    },
  });

  return {
    props: {
      articles,
      loadArticlesError: error ?? null,
    },
  };
};

export default UnpublishedRoute;
