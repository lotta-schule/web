import React, { memo, FunctionComponent } from 'react';
import { Card, CardContent, CardMedia, Divider, TextField, Button, Typography, makeStyles } from '@material-ui/core';
import { ArticleModel } from '../../../model';
import clsx from 'clsx';
import { Save as SaveIcon, Edit } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    iconSmall: {
        fontSize: 20,
    },
}));

interface EditArticleSidebarProps {
    article: ArticleModel;
    onUpdate(article: ArticleModel): void;
    onSave(): void;
}

export const EditArticleSidebar: FunctionComponent<EditArticleSidebarProps> = memo(({ article, onUpdate, onSave }) => {
        const styles = useStyles();
        return (
    <Card style={{marginTop: '0.5em'}}>
        <CardContent>
            <TextField
                label="Titel des Beitrags"
                placeholder="Placeholder"
                value={article.title}
                onChange={e => onUpdate({ ...article, title: e.target.value })}
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </CardContent>
        <Divider />
        <CardContent>
            <TextField
                label="Vorschautext"
                placeholder="Füge hier einen kurzen Vorschautext ein"
                value={article.preview}
                onChange={e => onUpdate({ ...article, preview: e.target.value })}
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </CardContent>
        <Divider />
        <CardContent>
            <TextField
                label="Datum"
                type={'date'}
                value={article.updatedAt}
                disabled
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </CardContent>
        <Divider />
        <CardContent>
            <TextField
                label="Kategorie"
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </CardContent>
        <CardContent>
            <TextField
                label="Seite"
                value={article.pageName}
                onChange={e => onUpdate({ ...article, pageName: e.target.value || undefined })}
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </CardContent>
        <Divider />
        <CardContent>
            <img src={'https://placeimg.com/300/150/any'} style={{ width: '100%', height: 'auto' }} title={`Vorschaubild zu ${article.title}`} />
            <Button
            variant='outlined'
            color='secondary'
            >
                <Edit className={clsx(styles.leftIcon, styles.iconSmall)} />
                Vorschaubild ändern
            </Button>
        </CardContent>
        <Divider />
        <CardContent>
            <TextField
                label="Autoren"
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </CardContent>
        <Divider />
        <CardContent>
            <TextField
                label="Sichtbarkeit"
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </CardContent>
        <Divider />
        <CardContent>
            <Button 
            onClick={onSave}
            variant='outlined'
            color='secondary'
            >
                <SaveIcon className={clsx(styles.leftIcon, styles.iconSmall)} />
                speichern
            </Button>
        </CardContent>
    </Card>
)}
);