import React, { memo, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { CategoryLayout } from 'component/layouts/CategoryLayout';
import { useCategory } from 'util/categories/useCategory';
import { useQuery } from 'react-apollo';
import { ArticleModel, ArticleFilter } from 'model';
import { GetArticlesQuery } from 'api/query/GetArticlesQuery';
import { EmptyLoadingLayout } from 'component/layouts/EmptyLoadingLayout';
import { ID } from 'model/ID';
import { parseISO } from 'date-fns';
import { useScrollEvent } from 'util/useScrollEvent';

export const CategoryRoute = memo<RouteComponentProps<{ id: string }>>(({ match }) => {
    const categoryId = Number(match.params.id);
    const category = useCategory(categoryId);
    const [lastFetchedElementDate, setLastFetchedElementDate] = useState<string | null>(null);

    const FETCH_MORE_OFFSET = window.innerHeight || 1024;
    const FETCH_COUNT = 25;

    const { data, loading: isLoading, error, fetchMore, called } = useQuery<{ articles: ArticleModel[] }, { categoryId: ID, filter: ArticleFilter }>(
        GetArticlesQuery,
        {
            variables: { categoryId, filter: { first: FETCH_COUNT } }
        },
    );

    useScrollEvent(() => {
        if (window.innerHeight + Math.max(window.pageYOffset, document.documentElement.scrollTop) > document.documentElement.offsetHeight - FETCH_MORE_OFFSET) {
            if (data && data.articles && data.articles.length > FETCH_COUNT - 1 && !isLoading) {
                const lastDate = data && data.articles
                    .sort((a1, a2) => parseISO(a1.updatedAt).getTime() - parseISO(a2.updatedAt).getTime())[0].updatedAt;
                if (lastFetchedElementDate !== lastDate) {
                    fetchMore({
                        variables: { filter: { first: FETCH_COUNT, updated_before: lastDate } },
                        updateQuery: (prev: { articles: ArticleModel[] }, { fetchMoreResult }) => {
                            if (!fetchMoreResult) return prev;
                            const fetchedArticles = fetchMoreResult.articles;
                            if (fetchedArticles && fetchedArticles.length) {
                                setLastFetchedElementDate(lastDate);
                            }
                            return {
                                ...prev,
                                articles: [...data.articles, ...fetchMoreResult.articles]
                            };
                        },

                    });
                }
            }
        }
    }, 250, [data, fetchMore, isLoading, lastFetchedElementDate]);

    if (!called || isLoading) {
        return (
            <EmptyLoadingLayout />
        );
    }

    if (error) {
        return (
            <div><span style={{ color: 'red' }}>{error.message}</span></div>
        );
    }

    if (!category) {
        return (
            <div><span style={{ color: 'red' }}>Seite nicht gefunden!</span></div>
        );
    }

    if (data) {
        const articles = !categoryId ?
            data.articles.filter(a => Boolean(a.category && !a.category.hideArticlesFromHomepage)) :
            data.articles;
        return (
            <CategoryLayout
                category={category}
                articles={articles}
            />
        )
    }

    return (
        <p>Keine Beiträge in dieser Kategorie.</p>
    );
});