import * as React from 'react';
import {
    Grid,
    Input as MuiInput,
    Container,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@material-ui/core';
import { Button } from 'component/general/button/Button';
import { Edit, Place } from '@material-ui/icons';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { ArticleModel, ID } from 'model';
import { useCurrentUser } from 'util/user/useCurrentUser';
import { Article, File, User } from 'util/model';
import { useMutation } from '@apollo/client';
import { AuthorAvatarsList } from './AuthorAvatarsList';
import { useIsMobile } from 'util/useIsMobile';
import { Article as ArticleUtil } from 'util/model/Article';
import { useIsRetina } from 'util/useIsRetina';
import { SelectFileOverlay } from 'component/edit/SelectFileOverlay';
import { PlaceholderImage } from 'component/placeholder/PlaceholderImage';
import { TagsSelect } from 'component/layouts/editArticleLayout/TagsSelect';
import { Tag } from 'component/general/tag/Tag';
import { ResponsiveFullScreenDialog } from 'component/dialog/ResponsiveFullScreenDialog';
import { Input } from 'component/general/form/input/Input';
import { useServerData } from 'component/ServerDataContext';
import ToggleArticlePinMutation from 'api/mutation/ToggleArticlePin.graphql';
import Img from 'react-cloudimage-responsive';
import Link from 'next/link';
import getConfig from 'next/config';
import clsx from 'clsx';

import styles from './ArticlePreviewStandardLayout.module.scss';

const {
    publicRuntimeConfig: { cloudimageToken },
} = getConfig();

interface ArticlePreviewProps {
    article: ArticleModel;
    disableLink?: boolean;
    onUpdateArticle?: (article: ArticleModel) => void;
    disableEdit?: boolean;
    disablePin?: boolean;
    limitedHeight?: boolean;
    isEmbedded?: boolean;
    narrow?: boolean;
}

export const ArticlePreviewStandardLayout = React.memo<ArticlePreviewProps>(
    ({
        article,
        disableLink,
        disableEdit,
        disablePin,
        isEmbedded,
        narrow,
        onUpdateArticle,
    }) => {
        const { baseUrl } = useServerData();
        const isMobile = useIsMobile();
        const retinaMultiplier = useIsRetina() ? 2 : 1;

        const currentUser = useCurrentUser();

        const showEditSection =
            User.canEditArticle(currentUser, article) ||
            User.isAdmin(currentUser);

        const [isSelfRemovalDialogOpen, setIsSelfRemovalDialogOpen] =
            React.useState(false);

        const [toggleArticlePin] = useMutation<
            { article: ArticleModel },
            { id: ID }
        >(ToggleArticlePinMutation, {
            variables: { id: article.id },
        });

        const maybeLinked = (content: any) =>
            disableLink ? (
                content
            ) : (
                <Link href={Article.getPath(article)}>
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
            <Container
                className={clsx(styles.root, {
                    [styles.narrow]: narrow,
                    [styles.isEmbedded]: isEmbedded,
                })}
                data-testid="ArticlePreviewStandardLayout"
            >
                <Grid container className={styles.containerGrid}>
                    <Grid className={styles.imageSection} container>
                        {!!onUpdateArticle && (
                            <SelectFileOverlay
                                allowDeletion
                                style={{ width: '100%' }}
                                label={'Vorschaubild ändern'}
                                onSelectFile={(previewImageFile) =>
                                    onUpdateArticle({
                                        ...article,
                                        previewImageFile,
                                    })
                                }
                            >
                                {article.previewImageFile ? (
                                    <Img
                                        operation={'width'}
                                        size={'300x200'}
                                        src={File.getFileRemoteLocation(
                                            baseUrl,
                                            article.previewImageFile
                                        )}
                                    />
                                ) : (
                                    <PlaceholderImage
                                        width={'100%'}
                                        height={150}
                                    />
                                )}
                            </SelectFileOverlay>
                        )}
                        {!onUpdateArticle &&
                            maybeLinked(
                                article.previewImageFile && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        className={styles.previewImage}
                                        src={`https://${cloudimageToken}.cloudimg.io/bound/${
                                            400 * retinaMultiplier
                                        }x${
                                            300 * retinaMultiplier
                                        }/foil1/${File.getFileRemoteLocation(
                                            baseUrl,
                                            article.previewImageFile
                                        )}`}
                                        alt={`Vorschaubild zu ${article.title}`}
                                    />
                                )
                            )}
                    </Grid>
                    <Grid className={styles.mainSection}>
                        {!!onUpdateArticle && (
                            <Input
                                inline
                                value={article.title}
                                onChange={(e) => {
                                    onUpdateArticle({
                                        ...article,
                                        title: (e.target as HTMLInputElement)
                                            .value,
                                    });
                                }}
                                className={styles.title}
                                aria-label={'Article title'}
                            />
                        )}
                        {!onUpdateArticle && (
                            <div
                                className={styles.title}
                                role={'heading'}
                                aria-level={1}
                                aria-label={'Article title'}
                            >
                                {maybeLinked(article.title)}
                            </div>
                        )}
                        {!!onUpdateArticle && (
                            <MuiInput
                                fullWidth
                                multiline
                                disableUnderline
                                placeholder={
                                    'Füge dem Beitrag einen kurzen Vorschautext hinzu.'
                                }
                                value={article.preview}
                                onChange={(e) => {
                                    onUpdateArticle({
                                        ...article,
                                        preview: (e.target as HTMLInputElement)
                                            .value,
                                    });
                                }}
                                className={styles.previewSection}
                                inputProps={{
                                    'aria-label': 'Article preview text',
                                }}
                            />
                        )}
                        {!onUpdateArticle && (
                            <div
                                className={styles.previewSection}
                                aria-label={'Article preview Text'}
                            >
                                {article.preview}
                            </div>
                        )}
                        {!!onUpdateArticle && (
                            <TagsSelect
                                value={article.tags ?? []}
                                onChange={(tags) => {
                                    onUpdateArticle({ ...article, tags });
                                }}
                            />
                        )}
                        {!onUpdateArticle &&
                            article.tags?.map((tag) => (
                                <Tag key={tag}>{tag}</Tag>
                            ))}
                        <Grid container>
                            <Grid item className={styles.dateGridItem}>
                                <time
                                    className={clsx(styles.date, 'dt-updated')}
                                    dateTime={article.updatedAt}
                                >
                                    {format(new Date(article.updatedAt), 'P', {
                                        locale: de,
                                    }) + ' '}
                                </time>
                            </Grid>
                            <Grid item style={{ flexGrow: 1 }}>
                                <AuthorAvatarsList
                                    max={
                                        !!onUpdateArticle ? Infinity : undefined
                                    }
                                    users={article.users}
                                    onUpdate={
                                        !!onUpdateArticle
                                            ? (users) => {
                                                  if (
                                                      users.length ===
                                                          article.users.length -
                                                              1 &&
                                                      article.users.find(
                                                          (u) =>
                                                              u.id ===
                                                              currentUser!.id
                                                      ) &&
                                                      !users.find(
                                                          (u) =>
                                                              u.id ===
                                                              currentUser!.id
                                                      )
                                                  ) {
                                                      setIsSelfRemovalDialogOpen(
                                                          true
                                                      );
                                                  } else {
                                                      onUpdateArticle({
                                                          ...article,
                                                          users,
                                                      });
                                                  }
                                              }
                                            : undefined
                                    }
                                />
                                <ResponsiveFullScreenDialog
                                    open={isSelfRemovalDialogOpen}
                                >
                                    <DialogTitle>
                                        Dich selbst aus dem Beitrag entfernen
                                    </DialogTitle>
                                    <DialogContent>
                                        <p>
                                            Möchtest du dich selbst wirklich aus
                                            dem Beitrag "{article.title}"
                                            entfernen?
                                        </p>
                                        <p>
                                            Du wirst den Beitrag dann nicht mehr
                                            bearbeiten können und übergibst die
                                            Rechte den anderen Autoren oder
                                            Administratoren der Seite
                                        </p>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button
                                            onClick={() =>
                                                setIsSelfRemovalDialogOpen(
                                                    false
                                                )
                                            }
                                        >
                                            abbrechen
                                        </Button>
                                        <Button
                                            color={'secondary'}
                                            onClick={() => {
                                                onUpdateArticle!({
                                                    ...article,
                                                    users: article.users.filter(
                                                        (articleUser) =>
                                                            articleUser.id !==
                                                            currentUser?.id
                                                    ),
                                                });
                                                setIsSelfRemovalDialogOpen(
                                                    false
                                                );
                                            }}
                                        >
                                            endgültig entfernen
                                        </Button>
                                    </DialogActions>
                                </ResponsiveFullScreenDialog>
                            </Grid>
                        </Grid>
                    </Grid>
                    {(!isMobile || isEmbedded) && (
                        <Grid item xs={1} className={styles.editSection}>
                            {showEditSection && (
                                <section>
                                    {showEditSection && (
                                        <div className={styles.buttonSection}>
                                            {User.canEditArticle(
                                                currentUser,
                                                article
                                            ) &&
                                                !disableEdit && (
                                                    <Link
                                                        href={ArticleUtil.getPath(
                                                            article,
                                                            { edit: true }
                                                        )}
                                                        passHref
                                                    >
                                                        <Button
                                                            aria-label="Beitrag bearbeiten"
                                                            style={{
                                                                width: '3em' /* I dont know why this is necessary */,
                                                            }}
                                                            className={clsx(
                                                                styles.editButton,
                                                                'edit-button'
                                                            )}
                                                            icon={<Edit />}
                                                        />
                                                    </Link>
                                                )}
                                            {User.isAdmin(currentUser) &&
                                                !disablePin && (
                                                    <Button
                                                        aria-label="Beitrag an der Kategorie anpinnen"
                                                        className={clsx(
                                                            styles.pinButton,
                                                            {
                                                                active: article.isPinnedToTop,
                                                            }
                                                        )}
                                                        onClick={() =>
                                                            toggleArticlePin()
                                                        }
                                                        icon={<Place />}
                                                    />
                                                )}
                                        </div>
                                    )}
                                </section>
                            )}
                        </Grid>
                    )}
                </Grid>
            </Container>
        );
    }
);
