import * as React from 'react';
import { useMutation } from '@apollo/client';
import { animated, useSpring } from 'react-spring';
import { CategoryModel } from 'model';
import { Button } from 'shared/general/button/Button';
import {
    Dialog,
    DialogActions,
    DialogContent,
} from 'shared/general/dialog/Dialog';
import { ErrorMessage } from 'shared/general/ErrorMessage';
import { Input } from 'shared/general/form/input/Input';
import { Label } from 'shared/general/label/Label';
import { Radio, RadioGroup } from 'shared/general/form/radio';
import { CategorySelect } from 'shared/categorySelect/CategorySelect';
import { LinearProgress } from 'shared/general/progress/LinearProgress';

import CreateCategoryMutation from 'api/mutation/CreateCategoryMutation.graphql';
import GetCategoriesQuery from 'api/query/GetCategoriesQuery.graphql';

import styles from './CreateCategoryDialog.module.scss';

enum CategoryPosition {
    Main,
    Sub,
    Side,
}

export interface CreateCategoryDialogProps {
    isOpen: boolean;
    onAbort(): void;
    onConfirm(category: CategoryModel): void;
}

export const CreateCategoryDialog = React.memo<CreateCategoryDialogProps>(
    ({ isOpen, onAbort, onConfirm }) => {
        const [title, setTitle] = React.useState('');
        const [categoryPosition, setCategoryPosition] = React.useState(
            CategoryPosition.Main
        );
        const [parentCategory, setParentCategory] =
            React.useState<CategoryModel | null>(null);
        const [createCategory, { loading: isLoading, error }] = useMutation<
            { category: CategoryModel },
            { category: any }
        >(CreateCategoryMutation, {
            update: (cache, { data }) => {
                let categories: CategoryModel[] = [];
                if (data && data.category) {
                    const readCategoriesResult = cache.readQuery<{
                        categories: CategoryModel[];
                    }>({ query: GetCategoriesQuery });
                    if (
                        readCategoriesResult &&
                        readCategoriesResult.categories
                    ) {
                        categories = [...readCategoriesResult.categories];
                    }
                    cache.writeQuery<{ categories: CategoryModel[] }>({
                        query: GetCategoriesQuery,
                        data: {
                            categories: [...categories, data.category],
                        },
                    });
                }
            },
            onCompleted: ({ category }) => {
                onConfirm(category);
            },
        });
        const parentCategorySpringProps = useSpring({
            overflow: 'hidden',
            height: categoryPosition === CategoryPosition.Sub ? 70 : 0,
        });
        const resetForm = () => {
            setTitle('');
        };

        React.useEffect(() => {
            resetForm();
        }, [isOpen]);

        return (
            <Dialog
                open={isOpen}
                onRequestClose={() => onAbort()}
                title={'Kategorie erstellen'}
            >
                {isLoading && (
                    <LinearProgress
                        isIndeterminate
                        label={'Kategorie wird erstellt'}
                    />
                )}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        createCategory({
                            variables: {
                                category: {
                                    title,
                                    isSidenav:
                                        categoryPosition ===
                                        CategoryPosition.Side,
                                    category:
                                        categoryPosition !==
                                            CategoryPosition.Side &&
                                        parentCategory
                                            ? { id: parentCategory.id }
                                            : null,
                                },
                            },
                        });
                    }}
                >
                    <DialogContent>
                        <ErrorMessage error={error} />
                        <Label label="Name der Kategorie:">
                            <Input
                                id="title"
                                value={title}
                                onChange={({ currentTarget }) =>
                                    setTitle(currentTarget.value)
                                }
                                disabled={isLoading}
                                placeholder="Meine neue Kategorie"
                                autoFocus
                                required
                            />
                        </Label>
                        <Label
                            label={'Art der Kategorie'}
                            className={styles.categoryPositionSet}
                        >
                            <RadioGroup
                                name={'category-type'}
                                aria-label={'Art der Kategorie'}
                                value={categoryPosition}
                                onChange={(_e, value) =>
                                    setCategoryPosition(parseInt(value, 10))
                                }
                            >
                                <Radio
                                    value={CategoryPosition.Main}
                                    label={'Hauptnavigation'}
                                />
                                <Radio
                                    value={CategoryPosition.Sub}
                                    label={'Subnavigation'}
                                />
                                <animated.div style={parentCategorySpringProps}>
                                    <CategorySelect
                                        hideSubCategories
                                        className={styles.categorySelect}
                                        label={'Übergeordnete Kategorie'}
                                        disabled={
                                            categoryPosition !==
                                                CategoryPosition.Sub &&
                                            !isLoading
                                        }
                                        selectedCategory={parentCategory}
                                        onSelectCategory={setParentCategory}
                                    />
                                </animated.div>
                                <Radio
                                    value={CategoryPosition.Side}
                                    label={'Randnavigation'}
                                />
                            </RadioGroup>
                        </Label>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                resetForm();
                                onAbort();
                            }}
                        >
                            Abbrechen
                        </Button>
                        <Button
                            type={'submit'}
                            disabled={
                                !title ||
                                isLoading ||
                                (categoryPosition === CategoryPosition.Sub &&
                                    !parentCategory)
                            }
                        >
                            Kategorie erstellen
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        );
    }
);
CreateCategoryDialog.displayName = 'CreateCategoryDialog';
