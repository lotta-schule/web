import { ArticleModel, ArticleModelInput } from 'model';
import { CircularProgress } from '@material-ui/core';
import { createUpdateArticleAction, createAddArticleAction } from 'store/actions/content';
import { EditArticleLayout } from 'component/layouts/EditArticleLayout';
import { find, omit } from 'lodash';
import { GetArticleQuery } from 'api/query/GetArticleQuery';
import { Query } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import { State } from 'store/State';
import { useSelector, useDispatch } from 'react-redux';
import { client as apolloClient } from '../../api/client';
import { UpdateArticleMutation } from 'api/mutation/UpdateArticleMutation';
import React, { memo } from 'react';
import { ID } from 'model/ID';

export const EditArticleRoute = memo<RouteComponentProps<{ id: string }>>(({ match }) => {
    const id = Number(match.params.id);
    const article = useSelector<State, ArticleModel | undefined>(state => find(state.content.articles, { id }));
    const dispatch = useDispatch();
    const onUpdateArticle = async (article: ArticleModel) => {
        const { data: { article: updatedArticle } } = await apolloClient.mutate<ArticleModel, { id: ID, article: ArticleModelInput }>({
            mutation: UpdateArticleMutation,
            variables: {
                id: article.id,
                article: {
                    readyToPublish: false,
                    ...omit(article, ['id', 'updatedAt']),
                    contentModules: article.contentModules.map(cm => omit(cm, ['id']))
                } as ArticleModelInput
            }
        });
        dispatch(createUpdateArticleAction(updatedArticle));
    }
    const onAddArticle = (article: ArticleModel) => dispatch(createAddArticleAction(article));
    if (article) {
        return (
            <EditArticleLayout article={article} onUpdateArticle={onUpdateArticle} />
        );
    }
    return (
        <Query<{ article: ArticleModel }, { id: ID }> query={GetArticleQuery} variables={{ id }}>
            {({ data, loading: isLoading, error }) => {
                if (!data || isLoading) {
                    return <div><CircularProgress /></div>;
                }
                if (error) {
                    return <div><span style={{ color: 'red' }}>{error.message}</span></div>;
                }
                if (data) {
                    onAddArticle(data!.article);
                    return (
                        <EditArticleLayout
                            article={data!.article}
                            onUpdateArticle={onUpdateArticle}
                        />
                    );
                }
                return null;
            }}
        </Query>
    );
});