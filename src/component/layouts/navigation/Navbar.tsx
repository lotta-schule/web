import React, { FunctionComponent, memo } from 'react';
import { AppBar, Toolbar, Button, Theme, Grid } from '@material-ui/core';
import { CategoryModel } from '../../../model';
import { CollisionLink } from 'component/general/CollisionLink';
import { useCurrentCategoryId } from '../../../util/path/useCurrentCategoryId';
import { makeStyles } from '@material-ui/styles';
import { useCategoriesAncestorsForItem } from 'util/categories/useCategoriesAncestorsForItem';
import classNames from 'classnames';

const useStyles = makeStyles<Theme>(theme => ({
    root: {
        position: 'sticky',
        top: 0,
        zIndex: 1,
        '& a': {
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),

        }
    },
    appBar: {
        backgroundColor: theme.palette.primary.main,
    },
    secondaryAppBar: {
        backgroundColor: '#fff',
        maxHeight: '40px',
    },
    navButton: {
        '&:hover': {
            backgroundColor: '#ffffff21'
        },
        '&.selected': {
            backgroundColor: '#ffffff21'
        }
    },
    navButtonSecond: {
        flexGrow: 1,
        flexShrink: 0,
        '&.selected': {
            backgroundColor: '#b9b9b954'
        }
    }
}));

export interface NavbarProps {
    categories?: CategoryModel[];
}

export const Navbar: FunctionComponent<NavbarProps> = memo(({ categories }) => {

    const styles = useStyles();

    const currentCategoryId = useCurrentCategoryId();
    const categoriesAncestors = useCategoriesAncestorsForItem(currentCategoryId || '');
    const categoriesHierarchy = [...categoriesAncestors, currentCategoryId];

    const mainCategories = (categories || []).filter(category => !Boolean(category.category));
    const subcategories = (categories || []).filter(category => category.category && category.category.id === categoriesHierarchy[0]);


    return (
        <nav className={styles.root}>
            <Grid item xs={10} sm={11} md={12}>
                <AppBar position={'sticky'} className={styles.appBar}>
                    <Toolbar>
                        <Button
                            key={'home'}
                            component={CollisionLink}
                            style={{ flexGrow: 1, flexShrink: 0, color: '#fff' }}
                            to={'/'}
                            variant="text"
                            size={'medium'}
                            className={styles.navButton}
                            color='inherit'
                        >
                            Startseite
                        </Button>
                        {mainCategories.map(category => (
                            <Button
                                variant="text"
                                key={category.id}
                                component={CollisionLink}
                                style={{ flexGrow: 1, flexShrink: 0, color: '#fff' }}
                                to={category.redirect ? category.redirect : `/category/${category.id}`}
                                size={'medium'}
                                className={classNames(styles.navButton, { selected: categoriesHierarchy.indexOf(category.id) > -1 })}
                            >
                                {category.title}
                            </Button>
                        ))}
                    </Toolbar>
                </AppBar>
            </Grid>
            {subcategories.length > 0 && (
                <AppBar position={'sticky'} className={styles.secondaryAppBar}>
                    <Toolbar style={{ minHeight: '0', height: '40px' }}>
                        {subcategories.map(category => (
                            <Button
                                variant="text"
                                key={category.id}
                                component={CollisionLink}
                                to={category.redirect ? category.redirect : `/category/${category.id}`}
                                size={'small'}
                                className={classNames(styles.navButtonSecond, { selected: categoriesHierarchy.indexOf(category.id) > -1 })}
                            >
                                {category.title}
                            </Button>
                        ))}
                    </Toolbar>
                </AppBar>
            )}
        </nav>
    );
});