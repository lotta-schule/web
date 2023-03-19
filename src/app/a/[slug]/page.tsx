import * as React from 'react';
import { ArticlePage } from 'server/components/article';
import { getArticle } from 'server/loader';

type ArticleRouteProps = {
    params: { slug: string };
};

const ArticleRoute = async ({ params: { slug } }: ArticleRouteProps) => {
    const rawArticleId = (slug as string)?.replace(/^(\d+).*/, '$1');
    const articleId = rawArticleId === '0' ? null : rawArticleId ?? null;

    const article = await getArticle(articleId);

    return <ArticlePage article={article} />;
};

export default ArticleRoute;
