import * as React from 'react';
import { useMutation, useSubscription } from '@apollo/client';
import { ArticleModel, ID } from 'model';
import { Button } from 'component/general/button/Button';
import {
    Dialog,
    DialogActions,
    DialogContent,
} from 'component/general/dialog/Dialog';
import { AddModuleBar } from 'component/article/AddModuleBar';
import { useCurrentUser } from 'util/user/useCurrentUser';
import { Article as ArticleUtil } from 'util/model/Article';
import { useBeforeUnloadConfirmation } from 'util/useBeforeUnloadConfirmation';
import { ArticleEditable as Article } from '../../article/ArticleEditable';
import { EditArticleFooter } from './EditArticleFooter';
import { BaseLayoutMainContent } from '../BaseLayoutMainContent';
import { useRouter } from 'next/router';
import omit from 'lodash/omit';

import ArticleIsUpdatedSubscription from 'api/subscription/GetArticleSubscription.graphql';
import UpdateArticleMutation from 'api/mutation/UpdateArticleMutation.graphql';
import GetArticleQuery from 'api/query/GetArticleQuery.graphql';

export interface ArticleLayoutProps {
    article: ArticleModel;
}

const BEFORE_LEAVE_MESSAGE =
    'Möchtest du die Seite wirklich verlassen? Ungespeicherte Änderungen gehen verloren.';

export const EditArticleLayout = React.memo<ArticleLayoutProps>(
    ({ article }) => {
        const router = useRouter();
        const currentUser = useCurrentUser();

        const [isArticleDirty, setIsArticleDirty] = React.useState(false);
        const [editedArticle, setEditedArticle] = React.useState(article);
        const [isUpdatedArticleModalVisible, setIsUpdatedArticleModalVisible] =
            React.useState(false);
        React.useEffect(() => {
            if (article.id === editedArticle.id) {
                setEditedArticle({
                    ...editedArticle,
                    ...article,
                    contentModules: editedArticle.contentModules,
                });
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [article]);
        const [saveArticle, { loading: isLoading, data: updatedArticleData }] =
            useMutation<{ article: ArticleModel }, { id: ID; article: any }>(
                UpdateArticleMutation,
                {
                    onCompleted: ({ article }) => {
                        setIsArticleDirty(false);
                        if (article) {
                            router.push(ArticleUtil.getPath(article));
                        }
                    },
                }
            );
        useSubscription<{ article: ArticleModel }, { id: ID }>(
            ArticleIsUpdatedSubscription,
            {
                variables: { id: article.id },
                skip: isLoading || !!updatedArticleData?.article,
                onSubscriptionData: ({
                    client,
                    subscriptionData: { data },
                }) => {
                    if (data) {
                        client.writeQuery({
                            query: GetArticleQuery,
                            variables: { id: article.id },
                            data,
                        });
                        const updatedContentModules =
                            data.article.contentModules.filter((cm) => {
                                const existingModule =
                                    editedArticle.contentModules.find(
                                        (_cm) => _cm.id === cm.id
                                    );
                                return (
                                    existingModule &&
                                    new Date(cm.updatedAt).getTime() >
                                        new Date(
                                            existingModule.updatedAt
                                        ).getTime()
                                );
                            });
                        const newContentModules =
                            editedArticle.contentModules.filter((_cm) =>
                                /^-/.test(_cm.id)
                            );
                        if (
                            newContentModules.length ||
                            updatedContentModules.length
                        ) {
                            setIsUpdatedArticleModalVisible(true);
                        }
                    }
                },
            }
        );

        useBeforeUnloadConfirmation(isArticleDirty, BEFORE_LEAVE_MESSAGE);

        React.useEffect(() => {
            if (!currentUser) {
                router.push(ArticleUtil.getPath(article));
            }
        }, [article, currentUser, router]);

        const changeArticle = (article: ArticleModel) => {
            setIsArticleDirty(true);
            setEditedArticle(article);
        };

        return (
            <>
                <BaseLayoutMainContent>
                    <Article
                        article={editedArticle}
                        onUpdateArticle={changeArticle}
                    />
                    <AddModuleBar
                        onAddModule={async (contentModule) => {
                            changeArticle({
                                ...editedArticle,
                                contentModules: [
                                    ...editedArticle.contentModules,
                                    {
                                        configuration: {},
                                        ...contentModule,
                                        insertedAt: new Date().toISOString(),
                                        updatedAt: new Date().toISOString(),
                                        sortKey: editedArticle.contentModules
                                            .length
                                            ? Math.max(
                                                  ...editedArticle.contentModules.map(
                                                      (cm) => cm.sortKey || 0
                                                  )
                                              ) + 10
                                            : 0,
                                    },
                                ],
                            });
                        }}
                    />
                    <EditArticleFooter
                        style={{ marginTop: '.5em' }}
                        article={editedArticle}
                        onUpdate={changeArticle}
                        isLoading={isLoading}
                        onSave={(additionalProps) => {
                            const article = {
                                ...(omit(editedArticle, [
                                    'isPinnedToTop',
                                ]) as ArticleModel),
                                ...additionalProps,
                                contentModules:
                                    editedArticle.contentModules.map((cm) => ({
                                        ...cm,
                                        content: cm.content
                                            ? JSON.stringify(cm.content)
                                            : cm.content,
                                        configuration: JSON.stringify(
                                            cm.configuration || {}
                                        ),
                                    })),
                            };
                            saveArticle({
                                variables: {
                                    id: article.id,
                                    article: {
                                        ...omit(article, ['id']),
                                        contentModules:
                                            article.contentModules.map(
                                                (cm) => ({
                                                    ...omit(
                                                        cm,
                                                        ...(/^-/.test(cm.id)
                                                            ? ['id']
                                                            : []),
                                                        'updatedAt',
                                                        'insertedAt'
                                                    ),
                                                    content: cm.content || null,
                                                    files: cm.files?.map(
                                                        ({ id }) => ({ id })
                                                    ),
                                                })
                                            ),
                                        previewImageFile:
                                            article.previewImageFile
                                                ? {
                                                      id: article
                                                          .previewImageFile.id,
                                                  }
                                                : null,
                                        category: article.category
                                            ? { id: article.category.id }
                                            : null,
                                        groups: article.groups.map(
                                            ({ id }) => ({ id })
                                        ),
                                        users: article.users.map(({ id }) => ({
                                            id,
                                        })),
                                    },
                                },
                            });
                        }}
                    />
                    <Dialog
                        open={isUpdatedArticleModalVisible}
                        onRequestClose={() =>
                            setIsUpdatedArticleModalVisible(false)
                        }
                        title={
                            'Beitrag wurde von einem anderen Nutzer aktualisiert.'
                        }
                    >
                        <DialogContent>
                            <p>
                                Module des Beitrags von einem Nutzer verändert.
                            </p>
                            <p>
                                Möchtest du den veränderten Beitrag laden?
                                Allerdings gehen dadurch deine Änderungen
                                verloren.
                            </p>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() =>
                                    setIsUpdatedArticleModalVisible(false)
                                }
                            >
                                Nichts tun
                            </Button>
                            <Button
                                onClick={() => {
                                    changeArticle(article);
                                    setIsArticleDirty(false);
                                    setIsUpdatedArticleModalVisible(false);
                                }}
                            >
                                Änderungen laden
                            </Button>
                        </DialogActions>
                    </Dialog>
                </BaseLayoutMainContent>
            </>
        );
    }
);
