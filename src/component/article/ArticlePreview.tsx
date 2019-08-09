import React, { FunctionComponent, memo } from 'react';
import { ArticleModel, UserModel } from '../../model';
import { Card, CardContent, Typography, Link, Grid, Fab, makeStyles, Theme } from '@material-ui/core';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { CollisionLink } from '../general/CollisionLink';
import { Edit } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import { State } from 'store/State';
import classNames from 'classnames';
import Img from 'react-cloudimage-responsive';
import { theme } from 'theme';

const useStyle = makeStyles((theme: Theme) => ({
    root: {
        padding: '0.5em',
        borderRadius: 0,
        '&:hover': {
            '& .edit-button': {
                border: 0,
                display: 'flex',
                color: '#fff',
                backgroundColor: theme.palette.secondary.main,
            },
        }
    },
    editButton: {
        float: 'right',
        color: '#ccc',
        background: 'transparent',
        transition: 'opacity ease-in 250ms',
    },
    articlePreviewImage: {
        width: '100%',
        height: 'auto',
        flexShrink: 0,
        flexGrow: 0,
        backgroundPosition: '0 0'
    },
    previewtext: {
        overflow: 'hidden',
        webkitLineClamp: 3,
        lineClamp: 3,
        WebkitBoxOrient: 'vertical',
        boxOrient: 'vertical',
        display: '-webkit-box',
    }
}
));

interface ArticlePreviewProps {
    article: ArticleModel;
}

export const ArticlePreview: FunctionComponent<ArticlePreviewProps> = memo(({ article }) => {

    const user = useSelector<State, UserModel | null>(s => s.user.user);

    const styles = useStyle();

    return (
        <Card className={styles.root}>
            <Grid container style={{ display: 'flex' }}>
                {article.previewImageFile && (
                    <Grid item xs={12} sm={4}>
                        <Img
                            operation={'cover'}
                            size={'300x200'}
                            src={article.previewImageFile.remoteLocation}
                            className={styles.articlePreviewImage}
                            alt={`Vorschaubild zu ${article.title}`}
                        />
                    </Grid>
                )}
                <Grid item xs>
                    <CardContent>
                        <Typography component={'h5'} variant={'h5'} gutterBottom>
                            <Link
                                component={CollisionLink}
                                color='inherit'
                                underline='none'
                                to={`/article/${article.id}`}
                            >
                                {article.title}
                            </Link>
                            {user/* && user.group > UserGroup.GUEST*/ && (
                                <Fab
                                    aria-label="Edit"
                                    size="small"
                                    className={classNames(styles.editButton, 'edit-button')}
                                    component={CollisionLink}
                                    to={`/article/${article.id}/edit`}
                                >
                                    <Edit />
                                </Fab>
                            )}
                        </Typography>
                        <Typography variant={'subtitle1'} style={{ textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: theme.spacing(1) }}>
                            {format(parseISO(article.insertedAt), 'PPP', { locale: de }) + ' '}
                            {article.topic && <> | {article.topic}&nbsp;</>}
                            | 18 Views&nbsp;
                            {article.user && <>| Autor: {article.user.nickname}&nbsp;</>}
                            | Bewertung&nbsp;
                        </Typography>
                        <Typography variant={'subtitle1'} color="textSecondary" className={styles.previewtext}>
                            {article.preview}
                        </Typography>
                    </CardContent>
                </Grid>
            </Grid>
        </Card>
    );
});