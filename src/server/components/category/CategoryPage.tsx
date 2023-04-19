import * as React from 'react';
import { ArticleModel, CategoryModel } from 'model';
import { File } from 'util/model';
import { ArticlePreview } from 'server/components/article';
import { CategoryHead } from './CategoryHead';
import { getBaseUrl } from 'server/util';
import { Header } from 'server/components/layout';
import { CategorySidebar } from 'client/components/category';
import { ClientComponentOperator } from '../ClientComponentOperator';
import clsx from 'clsx';

import styles from './CategoryPage.module.scss';

export interface CategoryPageProps {
    category: CategoryModel;
    prefetchedArticles: ArticleModel[];
}

// const PREFETCH_COUNT = 10;

export const CategoryPage = React.memo<CategoryPageProps>(
    ({ category, prefetchedArticles }) => {
        const baseUrl = getBaseUrl();
        // const user = useCurrentUser();
        const twoColumnsLayout = category?.layoutName === '2-columns';

        // const [lastFetchedElementDate, setLastFetchedElementDate] =
        //     React.useState<string | null>(null);

        // const FETCH_MORE_OFFSET =
        //     typeof window !== 'undefined' ? window.innerHeight / 2 || 512 : 0;

        // const nextFetchCount = (() => {
        //     if (typeof window === 'undefined') {
        //         return PREFETCH_COUNT;
        //     }
        //     // calculate how much articles must be fetched by guessing how much article previews would fit by current screen size
        //     const defaultElmHeight = ((layoutName?: string | null) => {
        //         switch (layoutName) {
        //             case 'densed':
        //                 return 110;
        //             case '2-columns':
        //                 return 175;
        //             default:
        //                 return 300;
        //         }
        //     })(category?.layoutName);
        //     return (
        //         Math.round((1.25 * window.innerHeight) / defaultElmHeight) +
        //         (category?.layoutName === '2-columns' &&
        //         defaultElmHeight % 2 !== 0
        //             ? 1
        //             : 0)
        //     );
        // })();

        // const {
        //     data,
        //     error,
        //     loading: isLoading,
        //     fetchMore,
        // } = useQuery<
        //     { articles: ArticleModel[] },
        //     { categoryId: ID | null; filter: ArticleFilter }
        // >(GetArticlesQuery, {
        //     variables: { categoryId, filter: { first: nextFetchCount } },
        //     onCompleted: ({ articles }) => {
        //         if (articles.length < nextFetchCount) {
        //             const lastDate = [...articles].sort(
        //                 (a1, a2) =>
        //                     new Date(a1.updatedAt).getTime() -
        //                     new Date(a2.updatedAt).getTime()
        //             )[0]?.updatedAt;
        //             if (lastDate) {
        //                 setLastFetchedElementDate(lastDate);
        //             }
        //         }
        //     },
        // });

        // const maybeFetchMoreArticles = React.useCallback(() => {
        //     if (
        //         window.innerHeight +
        //             Math.max(
        //                 window.pageYOffset,
        //                 document.documentElement.scrollTop
        //             ) >
        //         document.documentElement.offsetHeight - FETCH_MORE_OFFSET
        //     ) {
        //         if (
        //             data?.articles &&
        //             data.articles.length > nextFetchCount - 1 &&
        //             !isLoading
        //         ) {
        //             const lastDate = [...(data?.articles ?? [])].sort(
        //                 (a1, a2) =>
        //                     new Date(a1.updatedAt).getTime() -
        //                     new Date(a2.updatedAt).getTime()
        //             )[0].updatedAt;
        //             if (lastFetchedElementDate !== lastDate) {
        //                 try {
        //                     fetchMore({
        //                         variables: {
        //                             filter: {
        //                                 first: nextFetchCount,
        //                                 updated_before: lastDate,
        //                             },
        //                         },
        //                         updateQuery: (
        //                             prev: { articles: ArticleModel[] },
        //                             { fetchMoreResult }
        //                         ) => {
        //                             if (!fetchMoreResult) {
        //                                 return prev;
        //                             }
        //                             setLastFetchedElementDate(lastDate);
        //                             return {
        //                                 ...prev,
        //                                 articles: [
        //                                     ...data.articles,
        //                                     ...fetchMoreResult.articles,
        //                                 ],
        //                             };
        //                         },
        //                     });
        //                 } catch {}
        //             }
        //         }
        //     }
        // }, [
        //     FETCH_MORE_OFFSET,
        //     data,
        //     nextFetchCount,
        //     isLoading,
        //     lastFetchedElementDate,
        //     fetchMore,
        // ]);

        // useScrollEvent(maybeFetchMoreArticles, 250);

        // if (error) {
        //     return <ErrorMessage error={error} />;
        // }

        // if (!category) {
        //     return <ErrorMessage error={new Error('Seite nicht gefunden!')} />;
        // }

        // const loadedArticles = data?.articles ?? [];
        const loadedArticles = prefetchedArticles;
        const articlesToShow = !category?.id
            ? // Homepage
              loadedArticles.filter((a) =>
                  !!(a.category && !a.category.hideArticlesFromHomepage)
              )
            : loadedArticles;

        return (
            <>
                <CategoryHead category={category} />
                <Header
                    bannerImageUrl={
                        category.bannerImageFile &&
                        File.getFileRemoteLocation(
                            baseUrl,
                            category.bannerImageFile
                        )
                    }
                >
                    <h2 data-testid="title">{category.title}</h2>
                </Header>
                <div className={styles.articles}>
                    {[...articlesToShow]
                        .sort((a1, a2) => {
                            if (
                                !category.isHomepage &&
                                a1.isPinnedToTop !== a2.isPinnedToTop
                            ) {
                                if (a1.isPinnedToTop) {
                                    return -1;
                                }
                                if (a2.isPinnedToTop) {
                                    return 1;
                                }
                            }
                            return (
                                new Date(a2.updatedAt).getTime() -
                                new Date(a1.updatedAt).getTime()
                            );
                        })
                        .map((article) => (
                            <div
                                className={clsx(styles.gridItem, {
                                    [styles['two-columns']]: twoColumnsLayout,
                                })}
                                key={article.id}
                            >
                                <ArticlePreview
                                    article={article}
                                    limitedHeight
                                    layout={category.layoutName ?? 'standard'}
                                />
                            </div>
                        ))}
                </div>
            </>
        );
    }
);
CategoryPage.displayName = 'CategoryPage';
