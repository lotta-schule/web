import React, { memo } from 'react';
import { CategoryModel, ArticleModel, WidgetModel } from '../../model';
import { ArticlePreview } from '../article/ArticlePreview';
import { Grid, Typography, makeStyles, Theme } from '@material-ui/core';
import { fade } from '@material-ui/core/styles';
import { BaseLayoutMainContent } from './BaseLayoutMainContent';
import { BaseLayoutSidebar } from './BaseLayoutSidebar';
import { ArticleLayout } from './ArticleLayout';
import { WidgetsList } from './WidgetsList';
import { useQuery } from '@apollo/client';
import { GetCategoryWidgetsQuery } from 'api/query/GetCategoryWidgetsQuery';
import { ErrorMessage } from 'component/general/ErrorMessage';
import { useCurrentUser } from 'util/user/useCurrentUser';
import { User } from 'util/model';
import { UserNavigation } from './navigation/UserNavigation';

const useStyles = makeStyles<Theme, { twoColumns: boolean }>(theme => ({
    subheaderContainer: {
        height: '120px',
        border: '0.5em solid',
        borderColor: theme.palette.background.paper,
        marginBottom: '0.5em',
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        boxShadow: `1px 1px 2px ${fade(theme.palette.text.primary, .2)}`,
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
    },
    subheader: {
        maxHeight: 120,
        width: '100%',
        height: '100%',
        flexShrink: 1,
        flexGrow: 1,
        position: 'relative',
        '&::after': {
            position: 'absolute',
            display: 'block',
            content: `''`,
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to right, #ffffff00 75%, #ffffffff 98%)'
        }
    },
    bannerheading: {
        textTransform: 'uppercase',
        letterSpacing: '5px',
        fontSize: '1.5em',
        textShadow: '1px 1px 15px #fff',
        padding: '0.6em',
        color: theme.palette.primary.dark,
    },
    gridItem: {
        display: 'flex',
        '&:nth-child(2n)': {
            paddingLeft: ({ twoColumns }) => twoColumns ? theme.spacing(.5) : 'initial'
        },
        '&:nth-child(2n+1)': {
            paddingRight: ({ twoColumns }) => twoColumns ? theme.spacing(.5) : 'initial'
        },
        '& > *': {
            width: '100%'
        }
    },
    userNavigationGridItem: {
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    }
}));

export interface CategoryLayoutProps {
    category: CategoryModel;
    articles?: ArticleModel[];
}

export const CategoryLayout = memo<CategoryLayoutProps>(({ category, articles }) => {
    const styles = useStyles({ twoColumns: category.layoutName === '2-columns' });
    const [user] = useCurrentUser();

    const { data: widgetsData, error: widgetsError, loading: isWidgetsLoading } = useQuery(GetCategoryWidgetsQuery, {
        variables: { categoryId: category.id }
    });
    const widgets = (widgetsData?.widgets ?? []).filter((widget: WidgetModel) => {
        if (User.isAdmin(user)) {
            return !!user!.groups.find(g => widget.groups.length < 1 || !!widget.groups.find(cg => cg.id === g.id));
        }
        return true;
    });

    if (articles && articles.length === 1 && articles[0].id) {
        return (
            <ArticleLayout articleId={articles[0].id} />
        );
    }

    return (
        <>
            <BaseLayoutMainContent>
                <Grid container className={styles.subheaderContainer}>
                    <Grid
                        item
                        xs
                        className={styles.subheader}
                        style={{
                            background: category.bannerImageFile ?
                                `url(https://afdptjdxen.cloudimg.io/cover/950x104/foil1/${category.bannerImageFile.remoteLocation})` :
                                'transparent'
                        }}
                    >
                        <Typography variant={'h2'} className={styles.bannerheading}>
                            {category.title}
                        </Typography>
                    </Grid>
                    <Grid item xs={false} sm={4} xl={3} className={styles.userNavigationGridItem}>
                        <UserNavigation />
                    </Grid>
                </Grid>
                <Grid container wrap={'wrap'}>
                    {articles && articles.length > 1 && (
                        [...articles]
                            .sort((a1, a2) => {
                                if (!category.isHomepage && a1.isPinnedToTop !== a2.isPinnedToTop) {
                                    if (a1.isPinnedToTop) { return -1; }
                                    if (a2.isPinnedToTop) { return 1; }
                                }
                                return new Date(a2.updatedAt).getTime() - new Date(a1.updatedAt).getTime();
                            })
                            .map(article => (
                                <Grid item xs={category.layoutName === '2-columns' ? 6 : 12} className={styles.gridItem} key={article.id}>
                                    <ArticlePreview article={article} limitedHeight layout={category.layoutName ?? 'standard'} />
                                </Grid>
                            ))
                    )}
                </Grid>
            </BaseLayoutMainContent>
            <BaseLayoutSidebar isEmpty={!widgetsError && !isWidgetsLoading && widgets.length < 1}>
                {widgetsError && (
                    <ErrorMessage error={widgetsError} />
                )}
                <WidgetsList widgets={widgets} />
            </BaseLayoutSidebar>
        </>
    );
});