import * as React from 'react';
import { CategorySidebar } from 'client/components/category';
import { CategoryPage } from 'server/components/category';
import { ClientComponentOperator } from 'server/components/ClientComponentOperator';
import { Main } from 'server/components/layout';

import { getCategoryArticles, getAllCategories } from 'server/loader';

const RootPage = async () => {
    const [allCategories, articles] = await Promise.all([
        getAllCategories(),
        getCategoryArticles(null),
    ]);

    const category = allCategories.find((c) => c.isHomepage);

    if (!category) {
        throw new Error('Kategorie nicht gefunden.');
    }

    return (
        <>
            <Main>
                <CategoryPage
                    category={category}
                    prefetchedArticles={articles}
                />
            </Main>
            <ClientComponentOperator>
                <CategorySidebar category={category} />
            </ClientComponentOperator>
        </>
    );
};

export default RootPage;
