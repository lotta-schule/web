import * as React from 'react';
import { Main } from 'server/components/layout/Main';
import { ArticlePage } from 'server/components/article';
import { getArticle } from 'server/loader';

type ArticleRouteProps = {
    params: { slug: string };
};

const ArticleRoute = async ({ params: { slug } }: ArticleRouteProps) => {
    const rawArticleId = (slug as string)?.replace(/^(\d+).*/, '$1');
    const articleId = rawArticleId === '0' ? null : rawArticleId ?? null;

    const article = await getArticle(articleId);

    return <Main><ArticlePage article={article} /></Main>;
};

export default ArticleRoute;
