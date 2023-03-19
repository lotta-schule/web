import * as React from 'react';
import { CategoryPage } from 'server/components/category';

import { getCategoryArticles, getAllCategories } from 'server/loader';

type CategoryRouteProps = {
    params: { slug: string };
};

const CategoryRoute = async ({ params: { slug } }: CategoryRouteProps) => {
    const rawCategoryId = (slug as string)?.replace(/^(\d+).*/, '$1');
    const categoryId = rawCategoryId === '0' ? null : rawCategoryId ?? null;

    const [allCategories, articles] = await Promise.all([
        getAllCategories(),
        getCategoryArticles(categoryId),
    ]);

    const category = allCategories.find((c) => c.id === rawCategoryId) ?? null;

    return <CategoryPage category={category} prefetchedArticles={articles} />;
};

export default CategoryRoute;
