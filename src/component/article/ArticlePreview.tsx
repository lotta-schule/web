import React, { FunctionComponent, memo } from 'react';
import { ArticleModel } from '../../model';
import { Card, CardMedia, CardContent, Typography } from '@material-ui/core';
import { Link } from '../general/Link';


interface ArticlePreviewProps {
    article: ArticleModel;
}

export const ArticlePreview: FunctionComponent<ArticlePreviewProps> = memo(({ article }) => (
    <Card key={article.id}>
        <div style={{ display: 'flex' }}>
                <CardMedia
                    style={{ width: 200, margin: 7, }}
                    image={article.previewImage}
                    title={`Vorschaubild zu ${article.title}`}
                />
            <CardContent>
                <Typography variant="h4" component="h3">
                    <Link color='inherit' underline='none' to={`/page/${article.pageName || article.id}`}>
                        Titel: {article.title}
                    </Link>
                </Typography>
                <Typography variant={'subtitle1'} color="textSecondary">
                    15.07.2019 &bull; Oskarverleihung &bull; 18 Views &bull; Autor: Lola &bull; Bewertung
                </Typography>
                <Typography variant={'subtitle1'} color="textSecondary">
                    (Füge hier einen kurzen Vorschautext von etwa 30 Wörtern ein)
                </Typography>
            </CardContent>
        </div>
    </Card>
));