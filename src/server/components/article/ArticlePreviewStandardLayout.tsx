import * as React from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { ArticleModel } from 'model';
import { Article, File, User } from 'util/model';
import {
    Box,
} from '@lotta-schule/hubert/src/layout/Box';
import { AuthorAvatarsList } from 'client/components/article/authorAvatarsList';
import { ResponsiveImage } from 'util/image/ResponsiveImage';
import Link from 'next/link';
import clsx from 'clsx';

import styles from './ArticlePreviewStandardLayout.module.scss';
import { getCurrentUser } from 'server/loader';
import { getBaseUrl } from 'server/util';
import { ClientComponentOperator } from '../ClientComponentOperator';

interface ArticlePreviewProps {
    article: ArticleModel;
    disableLink?: boolean;
    limitedHeight?: boolean;
    isEmbedded?: boolean;
    narrow?: boolean;
}

export const ArticlePreviewStandardLayout =  async ({
        article,
        disableLink,
        isEmbedded,
        narrow,
    }: ArticlePreviewProps) => {
        const currentUser = await getCurrentUser();

        const maybeLinked = (content: any) =>
            disableLink ? (
                content
            ) : (
                <Link href={Article.getPath(article)} legacyBehavior>
                    <a
                        color={'inherit'}
                        style={{ textDecoration: 'none' }}
                        className={styles.link}
                    >
                        {content ?? ''}
                    </a>
                </Link>
            );

        return (
            <Box
                className={clsx(styles.root, {
                    [styles.narrow]: narrow,
                    [styles.isEmbedded]: isEmbedded,
                })}
                data-testid="ArticlePreviewStandardLayout"
            >
                <div className={styles.containerGrid}>
                    <div className={styles.imageSection}>
                        {maybeLinked(
                            article.previewImageFile && (
                                <ResponsiveImage
                                    className={styles.previewImage}
                                    width={400}
                                    aspectRatio={'4:3'}
                                    src={File.getFileRemoteLocation(
                                        getBaseUrl(),
                                        article.previewImageFile
                                    )}
                                    alt={`Vorschaubild zu ${article.title}`}
                                />
                            )
                        )}
                    </div>
                    <div className={styles.mainSection}>
                            <div
                                className={styles.title}
                                role={'heading'}
                                aria-level={1}
                                aria-label={'Article title'}
                            >
                                {maybeLinked(article.title)}
                            </div>
                            <div
                                className={styles.previewSection}
                                aria-label={'Article preview Text'}
                            >
                                {article.preview}
                            </div>
                        {article.tags?.map((tag) => (
                            <div>{/*<Tag key={tag}>{tag}</Tag>*/}</div>
                        ))}
                        <div className={styles.metaSection}>
                            <div className={styles.dateGridItem}>
                                <time
                                    className={clsx(styles.date, 'dt-updated')}
                                    dateTime={article.updatedAt}
                                >
                                    {format(new Date(article.updatedAt), 'P', {
                                        locale: de,
                                    }) + ' '}
                                </time>
                            </div>
                            <div className={styles.authorAvatarsList}>
                                <ClientComponentOperator>
                                    <AuthorAvatarsList
                                        max={undefined}
                                        users={article.users}
                                    />
                                </ClientComponentOperator>
                            </div>
                        </div>
                    </div>
                </div>
            </Box>
        );
    }
;
ArticlePreviewStandardLayout.displayName = 'ArticlePreviewStandardLayout';
