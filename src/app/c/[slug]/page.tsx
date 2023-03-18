import * as React from 'react';
import { CategoryPage } from 'category/CategoryPage';

import { getCategoryArticles, getTenantCategories } from 'server/util';

type CategoryRouteProps = {
    params: { slug: string };
};

const CategoryRoute = async ({ params: { slug } }: CategoryRouteProps) => {
    const rawCategoryId = (slug as string)?.replace(/^(\d+).*/, '$1');
    const categoryId = rawCategoryId === '0' ? null : rawCategoryId ?? null;

    const [allCategories, articles] = await Promise.all([
        getTenantCategories(),
        getCategoryArticles(categoryId),
    ]);

    const category = allCategories.find((c) => c.id === rawCategoryId) ?? null;

    return <CategoryPage category={category} prefetchedArticles={articles} />;
};

export default CategoryRoute;
