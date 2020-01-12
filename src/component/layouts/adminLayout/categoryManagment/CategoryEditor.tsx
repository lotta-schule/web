import React, { memo, useState, useEffect, useCallback } from 'react';
import {
    Divider, Typography, makeStyles, Theme, TextField, FormControl, InputLabel, Select, MenuItem, Button, Checkbox, FormControlLabel
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { CategoryModel } from 'model';
import { useMutation } from 'react-apollo';
import Img from 'react-cloudimage-responsive';
import { UpdateCategoryMutation } from 'api/mutation/UpdateCategoryMutation';
import { ID } from 'model/ID';
import { GroupSelect } from 'component/edit/GroupSelect';
import { SelectFileOverlay } from 'component/edit/SelectFileOverlay';
import { PlaceholderImage } from 'component/placeholder/PlaceholderImage';
import { ErrorMessage } from 'component/general/ErrorMessage';
import { useCategories } from 'util/categories/useCategories';
import { CategoryWidgetSelector } from './CategoryWidgetSelector';
import { DeleteCategoryDialog } from './DeleteCategoryDialog';

const useStyles = makeStyles((theme: Theme) => ({
    input: {
        marginTop: theme.spacing(3),
        width: '100%'
    },
    switchBase: {
        color: 'gray'
    },
    saveButton: {
        float: 'right',
        marginBottom: theme.spacing(2)
    },
    deleteDivider: {
        clear: 'both',
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(2)
    }
}));

export interface CategoryEditorProps {
    selectedCategory: CategoryModel | null;
    onSelectCategory(category: CategoryModel | null): void;
}


export const CategoryEditor = memo<CategoryEditorProps>(({ selectedCategory, onSelectCategory }) => {

    const styles = useStyles();

    const [categories] = useCategories();

    const [category, setCategory] = useState<CategoryModel | null>(null);
    const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false);

    const [mutateCategory, { loading: isLoading, error }] = useMutation<{ category: CategoryModel }, { id: ID, category: Partial<CategoryModel> }>(UpdateCategoryMutation);

    const updateCategory = useCallback(async () => {
        if (!selectedCategory || !category) {
            return null;
        }
        mutateCategory({
            variables: {
                id: selectedCategory.id,
                category: {
                    sortKey: selectedCategory.sortKey,
                    title: category.title,
                    bannerImageFile: category.bannerImageFile,
                    groups: category.groups,
                    redirect: category.redirect === 'null' ? null : category.redirect,
                    hideArticlesFromHomepage: category.hideArticlesFromHomepage || false,
                    widgets: category.widgets ? category.widgets.map(w => ({ ...w, configuration: JSON.stringify(w.configuration) })) : []
                }
            }
        });
    }, [category, mutateCategory, selectedCategory]);

    useEffect(() => {
        if (selectedCategory === null && category !== null) {
            setCategory(null);
        } else if (selectedCategory) {
            if (!category || category.id !== selectedCategory.id) {
                setCategory({ ...selectedCategory });
            }
        }
    }, [category, selectedCategory])

    if (!category) {
        return null;
    }

    return (
        <>
            <Typography variant="h5">
                {selectedCategory ? selectedCategory.title : category && category.title}
            </Typography>
            <ErrorMessage error={error} />
            <TextField
                className={styles.input}
                fullWidth
                label="Name der Kategorie"
                value={category.title}
                onChange={e => setCategory({ ...category, title: e.target.value })}
            />

            {!category.isHomepage && (
                <>
                    <GroupSelect
                        className={styles.input}
                        selectedGroups={category.groups || []}
                        onSelectGroups={groups => setCategory({ ...category, groups })}
                    />

                    <Typography className={styles.input}>
                        <b>Wähle ein Banner für diese Kategorie</b>
                    </Typography>

                    <SelectFileOverlay label={'Banner ändern'} onSelectFile={bannerImageFile => setCategory({ ...category, bannerImageFile })} allowDeletion>
                        {category.bannerImageFile ? (
                            <Img operation={'cover'} size={'900x150'} src={category.bannerImageFile.remoteLocation} />
                        ) : (<PlaceholderImage width={'100%'} height={75} />)}
                    </SelectFileOverlay>

                    <FormControl className={styles.input}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={category.hideArticlesFromHomepage}
                                    onChange={(_, checked) => setCategory({ ...category, hideArticlesFromHomepage: checked })}
                                    value={'hideArticlesFromHomepage'}
                                />
                            }
                            label={'Beiträge dieser Kategorie auf der Startseite verstecken'}
                        />
                    </FormControl>

                    <FormControl className={styles.input}>
                        <InputLabel htmlFor={'category-redirect'}>Zu einer anderen Kategorie weiterleiten ...</InputLabel>
                        <Select
                            value={category.redirect || 'null'}
                            onChange={({ target }) => setCategory({ ...category, redirect: target.value as string })}
                            inputProps={{
                                id: 'category-redirect'
                            }}
                            displayEmpty
                            fullWidth
                        >
                            <MenuItem value={'null'}>
                                <em>Nicht weiterleiten</em>
                            </MenuItem>
                            {categories.map(category => (
                                <MenuItem key={category.id} value={`/category/${category.id}`}>
                                    {category.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <p>&nbsp;</p>
                </>
            )}

            <Typography className={styles.input}>
                <b>Wähle die marginalen Module für diese Kategorie</b>
            </Typography>
            <CategoryWidgetSelector
                selectedWidgets={category.widgets || []}
                setSelectedWidgets={widgets => setCategory({ ...category, widgets })}
            />
            <p>&nbsp;</p>
            <Button
                className={styles.saveButton}
                disabled={isLoading}
                variant={'contained'}
                color={'secondary'}
                onClick={() => updateCategory()}
            >
                Kategorie speichern
            </Button>

            {!category.isHomepage && (
                <>
                    <Divider className={styles.deleteDivider} />
                    <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        startIcon={<Delete />}
                        onClick={() => setIsDeleteCategoryDialogOpen(true)}
                    >
                        Kategorie löschen
                    </Button>
                    <DeleteCategoryDialog
                        isOpen={isDeleteCategoryDialogOpen}
                        categoryToDelete={category}
                        onClose={() => setIsDeleteCategoryDialogOpen(false)}
                        onConfirm={() => {
                            setIsDeleteCategoryDialogOpen(false);
                            onSelectCategory(null);
                        }}
                    />
                </>
            )}
        </>
    );

});