import React, { memo, useMemo, useCallback, useState } from 'react';
import { CategoryModel } from 'model';
import { makeStyles } from '@material-ui/styles';
import { Theme, Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, List, ListItem } from '@material-ui/core';
import { useCategories } from 'util/categories/useCategories';
import { MoreVert } from '@material-ui/icons';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { ID } from 'model/ID';
import { useMutation } from '@apollo/client';
import { UpdateCategoryMutation } from 'api/mutation/UpdateCategoryMutation';
import findIndex from 'lodash/findIndex';

const useStyles = makeStyles((theme: Theme) => {
    return ({
        heading: {
            marginBottom: theme.spacing(3),
        },
        moveCategoryHandlerIcon: {
            verticalAlign: 'bottom',
            marginRight: theme.spacing(3)
        },
        expansionSummary: {
            backgroundColor: theme.palette.grey[200],
            borderRadius: 4,
            border: '1px solid',
            borderColor: theme.palette.divider,
            marginBottom: theme.spacing(1),
            '&:hover': {
                borderColor: theme.palette.grey[400],
            }
        },
        subcategories: {
            borderRadius: 4,
            border: '1px solid',
            borderColor: theme.palette.divider,
            marginBottom: theme.spacing(1),
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.grey[700],
            '&:hover': {
                borderColor: theme.palette.grey[400],
            }
        },
        before: {
            '&::before': {
                display: 'none',
            },
        }
    });
});

export interface CategoryNavigationProps {
    selectedCategory: CategoryModel | null;
    onSelectCategory(categoryModel: CategoryModel): void;
}

export const CategoryNavigation = memo<CategoryNavigationProps>(({ selectedCategory, onSelectCategory }) => {
    const styles = useStyles();

    const [categories] = useCategories();

    const [expandedMainCategoryId, setExpandedMainCategoryId] = useState<ID | null>(null);

    const homepageCategory = (categories || []).find(category => category.isHomepage);
    const mainCategories = useMemo(() => categories.filter(category => !Boolean(category.category) && !category.isSidenav && !category.isHomepage), [categories]);
    const sidenavCategories = categories.filter(c => c.isSidenav);

    const getSubcategoriesForCategory = useCallback((category: Partial<CategoryModel>) => {
        return categories.filter(c => c.category && c.category.id === category.id);
    }, [categories]);

    const [updateCategory] = useMutation<{ category: CategoryModel }, { id: ID, category: any }>(UpdateCategoryMutation, {
        optimisticResponse: ({ id, category }) => {
            return {
                __typename: 'Mutation',
                category: {
                    __typename: 'Category',
                    id,
                    sortKey: category.sortKey
                }
            } as any;
        }
    });

    return (
        <>
            <Typography variant="h5" className={styles.heading}>
                Alle Kategorien
            </Typography>

            {homepageCategory && (
                <ExpansionPanel className={styles.before} expanded={false} key={homepageCategory.id}>
                    <ExpansionPanelSummary className={styles.expansionSummary} onClick={() => onSelectCategory(homepageCategory)}>
                        <Typography variant="body1">
                            <b>{homepageCategory.title}</b>
                        </Typography>
                    </ExpansionPanelSummary>
                </ExpansionPanel>
            )}
            <p>&nbsp;</p>

            <DragDropContext
                onDragEnd={({ destination, source, draggableId }) => {
                    if (!destination) {
                        return;
                    }

                    if (destination.droppableId !== source.droppableId) {
                        return;
                    }

                    const initialCategoriesArray = destination.droppableId === 'categories-root' ? mainCategories : getSubcategoriesForCategory({ id: destination.droppableId });
                    const sourceIndex = findIndex(initialCategoriesArray, { id: draggableId })
                    const newCategoriesArray = [...initialCategoriesArray];
                    newCategoriesArray.splice(sourceIndex, 1);
                    newCategoriesArray.splice(destination.index, 0, initialCategoriesArray[sourceIndex]);
                    newCategoriesArray.forEach((category, index) => {
                        if (category) {
                            updateCategory({
                                variables: {
                                    id: category.id,
                                    category: {
                                        sortKey: index * 10 + 10,
                                        title: category.title,
                                        bannerImageFile: category.bannerImageFile ? { id: category.bannerImageFile } : undefined,
                                        groups: category.groups?.map(({ id }) => ({ id })),
                                        redirect: category.redirect,
                                        hideArticlesFromHomepage: category.hideArticlesFromHomepage
                                    }
                                }
                            });
                        }
                    });
                }}
            >
                <Droppable droppableId={'categories-root'} type={'root-categories'}>
                    {({ droppableProps, innerRef, placeholder }) => (
                        <div {...droppableProps} ref={innerRef} style={{ paddingBottom: '5em' }}>
                            {mainCategories.map((category, index) => (
                                <Draggable key={category.id} draggableId={String(category.id)} index={index}>
                                    {({ innerRef, dragHandleProps, draggableProps }) => (
                                        <ExpansionPanel
                                            expanded={Boolean(expandedMainCategoryId && expandedMainCategoryId === category.id)}
                                            onChange={(e, expanded) => {
                                                if (expanded) {
                                                    setExpandedMainCategoryId(category.id);
                                                }
                                            }}
                                            innerRef={innerRef}
                                            {...draggableProps}
                                            className={styles.before}
                                        >
                                            <ExpansionPanelSummary
                                                aria-controls={`${category.id}-content`}
                                                id={`${category.id}-header`}
                                                className={styles.expansionSummary}
                                                onClick={() => {
                                                    onSelectCategory(category);
                                                }}
                                            >
                                                <Typography variant="body1">
                                                    <span {...dragHandleProps}>
                                                        <MoreVert className={styles.moveCategoryHandlerIcon} />
                                                    </span>
                                                    <b>{category.title}</b>
                                                </Typography>
                                            </ExpansionPanelSummary>
                                            <ExpansionPanelDetails>
                                                <Droppable droppableId={String(category.id)} type={`subcategories-to-${category.id}`}>
                                                    {({ droppableProps, innerRef, placeholder }) => (
                                                        <List component="nav" innerRef={innerRef} {...droppableProps}>
                                                            {getSubcategoriesForCategory(category).map((subcategory, index) => (
                                                                <Draggable key={subcategory.id} draggableId={String(subcategory.id)} index={index}>
                                                                    {({ innerRef, dragHandleProps, draggableProps }) => (
                                                                        <ListItem
                                                                            className={styles.subcategories}
                                                                            style={{ cursor: 'pointer' }}
                                                                            onClick={() => onSelectCategory(subcategory)}
                                                                            innerRef={innerRef}
                                                                            {...draggableProps}
                                                                        >
                                                                            <Typography>
                                                                                <span {...dragHandleProps}>
                                                                                    <MoreVert className={styles.moveCategoryHandlerIcon} />
                                                                                </span>
                                                                                {subcategory.title}
                                                                            </Typography>
                                                                        </ListItem>
                                                                    )}
                                                                </Draggable>
                                                            ))}
                                                            {placeholder}
                                                        </List>
                                                    )}
                                                </Droppable>
                                            </ExpansionPanelDetails>
                                        </ExpansionPanel>
                                    )}
                                </Draggable>
                            ))}
                            {placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <Typography variant="h6" className={styles.heading}>
                Seitenleistenkategorien
            </Typography>
            {sidenavCategories.map(category => (
                <ExpansionPanel className={styles.before} expanded={false} key={category.id}>
                    <ExpansionPanelSummary className={styles.expansionSummary} onClick={() => onSelectCategory(category)}>
                        <Typography variant="body1">
                            <b>{category.title}</b>
                        </Typography>
                    </ExpansionPanelSummary>
                </ExpansionPanel>
            ))}
        </>
    );
});
