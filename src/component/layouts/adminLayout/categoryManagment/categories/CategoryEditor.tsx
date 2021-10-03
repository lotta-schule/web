import * as React from 'react';
import {
    Divider,
    makeStyles,
    Theme,
    FormControl,
    Checkbox,
    FormControlLabel,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { CategoryModel, WidgetModel, ID } from 'model';
import { useMutation, useQuery } from '@apollo/client';
import { GroupSelect } from 'component/edit/GroupSelect';
import { SelectFileOverlay } from 'component/edit/SelectFileOverlay';
import { PlaceholderImage } from 'component/placeholder/PlaceholderImage';
import { ErrorMessage } from 'component/general/ErrorMessage';
import { useCategories } from 'util/categories/useCategories';
import { Category, File, RedirectType } from 'util/model';
import { CategoryWidgetSelector } from './CategoryWidgetSelector';
import { Button } from 'component/general/button/Button';
import { animated, useSpring } from 'react-spring';
import { Label } from 'component/general/label/Label';
import { Input } from 'component/general/form/input/Input';
import { Select } from 'component/general/form/select/Select';
import { Radio, RadioGroup } from 'component/general/form/radio';
import { useServerData } from 'component/ServerDataContext';
import { DeleteCategoryDialog } from './DeleteCategoryDialog';
import UpdateCategoryMutation from 'api/mutation/UpdateCategoryMutation.graphql';
import GetCategoryWidgetsQuery from 'api/query/GetCategoryWidgetsQuery.graphql';
import clsx from 'clsx';
import Img from 'react-cloudimage-responsive';

const useStyles = makeStyles((theme: Theme) => ({
    input: {
        marginTop: theme.spacing(1.5),
        width: '100%',
    },
    title: {
        fontSize: '1.5rem',
    },
    heading: {
        marginTop: theme.spacing(5),
        paddingTop: theme.spacing(3),
        marginBottom: theme.spacing(1),
    },
    switchBase: {
        color: 'gray',
    },
    saveButton: {
        float: 'right',
        marginBottom: theme.spacing(2),
    },
    deleteDivider: {
        clear: 'both',
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(2),
    },
}));

export interface CategoryEditorProps {
    selectedCategory: CategoryModel | null;
    onSelectCategory(category: CategoryModel | null): void;
}

export const CategoryEditor = React.memo<CategoryEditorProps>(
    ({ selectedCategory, onSelectCategory }) => {
        const { baseUrl } = useServerData();
        const styles = useStyles();

        const [categories] = useCategories();

        const [category, setCategory] = React.useState<CategoryModel | null>(
            null
        );
        const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] =
            React.useState(false);

        const [selectedWidgets, setSelectedWidgets] = React.useState<
            WidgetModel[]
        >([]);
        const [mutateCategory, { loading: isLoading, error }] = useMutation<
            { category: CategoryModel },
            { id: ID; category: any }
        >(UpdateCategoryMutation, {
            refetchQueries: [
                {
                    query: GetCategoryWidgetsQuery,
                    variables: { categoryId: category?.id ?? null },
                },
            ],
        });
        const { data: currentWidgetsData, error: currentWidgetsError } =
            useQuery(GetCategoryWidgetsQuery, {
                variables: { categoryId: category?.id ?? null },
                skip: !category?.id,
            });
        React.useEffect(() => {
            if (currentWidgetsData) {
                setSelectedWidgets(currentWidgetsData.widgets);
            }
        }, [currentWidgetsData]);

        const updateCategory = React.useCallback(() => {
            if (!selectedCategory || !category) {
                return null;
            }
            return mutateCategory({
                variables: {
                    id: selectedCategory.id,
                    category: {
                        title: category.title,
                        bannerImageFile: category.bannerImageFile && {
                            id: category.bannerImageFile.id,
                        },
                        groups: category.groups?.map(({ id }) => ({ id })),
                        redirect: category.redirect,
                        layoutName: category.layoutName,
                        hideArticlesFromHomepage:
                            category.hideArticlesFromHomepage || false,
                        widgets:
                            selectedWidgets?.map(({ id }) => ({ id })) ?? [],
                    },
                },
            });
        }, [category, mutateCategory, selectedCategory, selectedWidgets]);

        const redirectInternallySpringProps = useSpring({
            overflow: 'hidden',
            height:
                Category.getRedirectType(category) === RedirectType.Intern
                    ? 70
                    : 0,
        });
        const redirectExternallySpringProps = useSpring({
            overflow: 'hidden',
            height:
                Category.getRedirectType(category) === RedirectType.Extern
                    ? 70
                    : 0,
        });

        React.useEffect(() => {
            if (selectedCategory === null && category !== null) {
                setCategory(null);
            } else if (selectedCategory) {
                if (!category || category.id !== selectedCategory.id) {
                    setCategory({ ...selectedCategory });
                }
            }
        }, [category, selectedCategory]);

        if (!category) {
            return null;
        }

        return (
            <>
                <h5 className={styles.title}>
                    {selectedCategory
                        ? selectedCategory.title
                        : category && category.title}
                </h5>
                <ErrorMessage error={error || currentWidgetsError} />
                <Label label={'Name der Kategorie'}>
                    <Input
                        className={styles.input}
                        aria-label={'Name der Kategorie'}
                        value={category.title}
                        onChange={(e) =>
                            setCategory({
                                ...category,
                                title: e.currentTarget.value,
                            })
                        }
                    />
                </Label>

                {!category.isHomepage && (
                    <GroupSelect
                        className={styles.input}
                        selectedGroups={category.groups || []}
                        onSelectGroups={(groups) =>
                            setCategory({ ...category, groups })
                        }
                    />
                )}

                <h6 className={clsx(styles.input, styles.heading)}>
                    Wähle ein Banner für diese Kategorie
                </h6>

                <SelectFileOverlay
                    label={'Banner ändern'}
                    onSelectFile={(bannerImageFile) =>
                        setCategory({ ...category, bannerImageFile })
                    }
                    allowDeletion
                >
                    {category.bannerImageFile ? (
                        <Img
                            operation={'cover'}
                            size={'900x150'}
                            src={File.getFileRemoteLocation(
                                baseUrl,
                                category.bannerImageFile
                            )}
                        />
                    ) : (
                        <PlaceholderImage width={'100%'} height={75} />
                    )}
                </SelectFileOverlay>

                {!category.isHomepage && (
                    <>
                        <FormControl className={styles.input}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={
                                            category.hideArticlesFromHomepage
                                        }
                                        onChange={(_, checked) =>
                                            setCategory({
                                                ...category,
                                                hideArticlesFromHomepage:
                                                    checked,
                                            })
                                        }
                                        value={'hideArticlesFromHomepage'}
                                    />
                                }
                                label={
                                    'Beiträge dieser Kategorie auf der Startseite verstecken'
                                }
                            />
                        </FormControl>
                    </>
                )}

                <FormControl className={styles.input}>
                    <Label label={'Layout für die Kategorie wählen'}>
                        <Select
                            value={category.layoutName ?? 'standard'}
                            onChange={({ currentTarget }) =>
                                setCategory({
                                    ...category,
                                    layoutName: currentTarget.value as any,
                                })
                            }
                            id={'category-layout'}
                        >
                            <option value={'standard'}>Standardlayout</option>
                            <option value={'densed'}>Kompaktlayout</option>
                            <option value={'2-columns'}>
                                Zweispaltenlayout
                            </option>
                        </Select>
                    </Label>
                </FormControl>

                {!category.isHomepage && (
                    <>
                        <h6 className={clsx(styles.input, styles.heading)}>
                            Die Kategorie als Weiterleitung
                        </h6>

                        <RadioGroup
                            name={'category-redirect-type'}
                            aria-label={'Die Kategorie als Weiterleitung'}
                            value={Category.getRedirectType(category)}
                            onChange={(_e, value) => {
                                if (value === RedirectType.None) {
                                    setCategory({
                                        ...category,
                                        redirect: null,
                                    });
                                }
                                if (value === RedirectType.Intern) {
                                    setCategory({
                                        ...category,
                                        redirect: Category.getPath(
                                            categories[0]
                                        ),
                                    });
                                }
                                if (value === RedirectType.Extern) {
                                    setCategory({
                                        ...category,
                                        redirect: 'https://lotta.schule',
                                    });
                                }
                            }}
                        >
                            <Radio
                                value={RedirectType.None}
                                label={
                                    'Kategorie wird nicht weitergeleitet und zeigt eigene Beiträge an.'
                                }
                            />
                            <Radio
                                value={RedirectType.Intern}
                                label={
                                    'Kategorie zu einer anderen Kategorie weiterleiten:'
                                }
                            />

                            <animated.div
                                data-testid={'InternalRedirectWrapper'}
                                style={redirectInternallySpringProps}
                            >
                                <FormControl className={styles.input}>
                                    <Label
                                        label={
                                            'Zu einer anderen Kategorie weiterleiten ...'
                                        }
                                    >
                                        <Select
                                            value={category.redirect || 'null'}
                                            onChange={({ currentTarget }) =>
                                                setCategory({
                                                    ...category,
                                                    redirect:
                                                        currentTarget.value,
                                                })
                                            }
                                            id={'category-redirect'}
                                        >
                                            <option key={0} />
                                            {categories.map((category) => (
                                                <option
                                                    key={category.id}
                                                    value={Category.getPath(
                                                        category
                                                    )}
                                                >
                                                    {category.title}
                                                </option>
                                            ))}
                                        </Select>
                                    </Label>
                                </FormControl>
                            </animated.div>

                            <Radio
                                value={RedirectType.Extern}
                                label={
                                    'Kategorie zu einer Seite im Internet weiterleiten'
                                }
                            />

                            <animated.div
                                data-testid={'ExternalRedirectWrapper'}
                                style={redirectExternallySpringProps}
                            >
                                <Label label={'Ziel der Weiterleitung:'}>
                                    <Input
                                        className={styles.input}
                                        aria-label={'Ziel der Weiterleitung'}
                                        value={category.redirect as string}
                                        onChange={(e) =>
                                            setCategory({
                                                ...category,
                                                redirect: e.currentTarget.value,
                                            })
                                        }
                                    />
                                </Label>
                            </animated.div>
                        </RadioGroup>

                        <p>&nbsp;</p>
                    </>
                )}

                <h6 className={clsx(styles.input, styles.heading)}>
                    Wähle die marginalen Module für diese Kategorie
                </h6>
                <CategoryWidgetSelector
                    selectedWidgets={selectedWidgets}
                    setSelectedWidgets={(widgets) =>
                        setSelectedWidgets(widgets)
                    }
                />
                <p>&nbsp;</p>
                <Button
                    className={styles.saveButton}
                    disabled={isLoading}
                    onClick={() => updateCategory()}
                >
                    Kategorie speichern
                </Button>

                {!category.isHomepage && (
                    <>
                        <Divider className={styles.deleteDivider} />
                        <Button
                            icon={<Delete />}
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
    }
);
