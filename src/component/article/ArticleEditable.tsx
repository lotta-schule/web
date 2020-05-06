import React, { memo, Suspense } from 'react';
import { ArticleModel } from '../../model';
import { ContentModule } from './module/ContentModule';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { makeStyles, CircularProgress, Grid, Typography, Divider } from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { ArticleTitle } from './ArticleTitle';

const useStyles = makeStyles(theme => ({
    root: {
        padding: '0.5em',
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        boxShadow: `1px 1px 2px ${fade(theme.palette.text.primary, .2)}`,
    },
    contentModules: {
        marginTop: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
    },
    previewSection: {
        padding: theme.spacing(1),
        color: theme.palette.grey[600]
    },
}));

interface ArticleEditableProps {
    article: ArticleModel;
    isEditModeEnabled?: boolean;
    onUpdateArticle?(article: ArticleModel): void;
}

export const ArticleEditable = memo<ArticleEditableProps>(({ article, isEditModeEnabled, onUpdateArticle }) => {
    const styles = useStyles();
    return (
        <article className={styles.root} data-testid={'ArticleEditable'}>
            <ArticleTitle article={article} />
            <section className={styles.contentModules}>
                {article.preview && (
                    <section className={styles.previewSection}>
                        <Grid container>
                            <Grid item xs>
                                <Typography variant={'subtitle2'}>
                                    {article.preview}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider />
                    </section>
                )}
                <Suspense fallback={<CircularProgress />}>
                    <DragDropContext onDragEnd={({ draggableId, destination, source }) => {
                        if (!destination) {
                            return;
                        }

                        if (
                            destination.droppableId === source.droppableId &&
                            destination.index === source.index
                        ) {
                            return;
                        }

                        if (onUpdateArticle) {
                            onUpdateArticle({
                                ...article,
                                contentModules: Array.from(article.contentModules)
                                    .map(contentModule => {
                                        if (contentModule.id.toString() === draggableId) {
                                            return {
                                                ...contentModule,
                                                sortKey: destination.index * 10 + (destination.index > source.index ? 1 : -1)
                                            };
                                        } else {
                                            return contentModule;
                                        }
                                    })
                                    .sort((cm1, cm2) => cm1.sortKey - cm2.sortKey)
                                    .map((cm, i) => ({
                                        ...cm,
                                        sortKey: i * 10
                                    }))
                            });
                        }
                    }}>
                        <Droppable droppableId={String(article.id)}>
                            {provided => (
                                <section {...provided.droppableProps} ref={provided.innerRef}>
                                    {[...article.contentModules].sort((cm1, cm2) => cm1.sortKey - cm2.sortKey).map((contentModule, index) => (
                                        <Draggable key={contentModule.id} draggableId={String(contentModule.id)} index={index}>
                                            {({ draggableProps, dragHandleProps, innerRef }, snapshot) => (
                                                <ContentModule
                                                    index={index}
                                                    contentModule={contentModule}
                                                    isEditModeEnabled={isEditModeEnabled}
                                                    cardProps={{ innerRef, ...draggableProps }}
                                                    dragbarProps={dragHandleProps}
                                                    isDragging={snapshot.isDragging}
                                                    onUpdateModule={updatedModule => {
                                                        if (onUpdateArticle) {
                                                            onUpdateArticle({
                                                                ...article,
                                                                contentModules: article.contentModules.map(contentModule =>
                                                                    contentModule.id === updatedModule.id ?
                                                                        updatedModule :
                                                                        contentModule
                                                                )
                                                            });
                                                        }
                                                    }}
                                                    onRemoveContentModule={() => onUpdateArticle && onUpdateArticle({
                                                        ...article,
                                                        contentModules: article.contentModules.filter(currentModule => contentModule.id !== currentModule.id)
                                                    })}
                                                />
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </section>
                            )}
                        </Droppable>
                    </DragDropContext>
                </Suspense>
            </section>
        </article>
    );
});