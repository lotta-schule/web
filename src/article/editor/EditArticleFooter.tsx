import * as React from 'react';
import {
    ArrowDropDown as ArrowDropDownIcon,
    Event,
    Warning,
} from '@material-ui/icons';
import { useMutation } from '@apollo/client';
import { CategorySelect } from '../../shared/categorySelect/CategorySelect';
import { ArticleModel, ID } from 'model';
import { Category, User } from 'util/model';
import { useCurrentUser } from 'util/user/useCurrentUser';
import { ArticleStateEditor } from 'article/editor/ArticleStateEditor';
import { GroupSelect } from 'shared/edit/GroupSelect';
import {
    Button,
    ButtonGroup,
    Box,
    Dialog,
    DialogContent,
    DialogActions,
    MenuButton,
    Item,
} from '@lotta-schule/hubert';
import { ArticleDatesEditor } from './ArticleDatesEditor';
import { useRouter } from 'next/router';
import clsx from 'clsx';

import DeleteArticleMutation from 'api/mutation/DeleteArticleMutation.graphql';

import styles from './EditArticleFooter.module.scss';

interface EditArticleFooterProps {
    article: ArticleModel;
    isLoading?: boolean;
    style?: React.CSSProperties;
    onUpdate(article: ArticleModel): void;
    onSave(additionalProps?: Partial<ArticleModel>): void;
}

export const EditArticleFooter = React.memo<EditArticleFooterProps>(
    ({ article, style, isLoading, onUpdate, onSave }) => {
        const currentUser = useCurrentUser();
        const router = useRouter();

        const [isSelfRemovalDialogOpen, setIsSelfRemovalDialogOpen] =
            React.useState(false);
        const [isDatesEditorOpen, setIsDatesEditorOpen] = React.useState(false);
        const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

        const [deleteArticle] = useMutation<
            { article: ArticleModel },
            { id: ID }
        >(DeleteArticleMutation, {
            variables: {
                id: article.id,
            },
            onCompleted: () => {
                if (article.category) {
                    router.push(Category.getPath(article.category));
                } else {
                    router.push('/');
                }
            },
        });

        return (
            <Box
                style={style}
                className={styles.root}
                data-testid="EditArticleFooter"
            >
                <h5>Beitrags-Einstellungen</h5>
                <div className={styles.container}>
                    <div className={styles.gridItem}>
                        <h6>Sichtbarkeit</h6>
                        <div>
                            <GroupSelect
                                label={null}
                                selectedGroups={article.groups}
                                variant={'outlined'}
                                onSelectGroups={(groups) =>
                                    onUpdate({ ...article, groups })
                                }
                            />
                        </div>
                        <div className={styles.buttonWrapper}>
                            <Button
                                className={styles.deleteButton}
                                onClick={() => setIsDeleteModalOpen(true)}
                                variant={'error'}
                                icon={
                                    <Warning
                                        className={clsx(
                                            styles.leftIcon,
                                            styles.iconSmall
                                        )}
                                    />
                                }
                            >
                                Beitrag l??schen
                            </Button>
                        </div>
                    </div>
                    <div className={styles.gridItem}>
                        <h6>Kategorie zuordnen</h6>
                        <div>
                            <CategorySelect
                                selectedCategory={article.category || null}
                                onSelectCategory={(category) =>
                                    onUpdate({ ...article, category })
                                }
                            />
                        </div>
                        <div />
                    </div>
                    <div className={styles.gridItem}>
                        <h6>Ver??ffentlichung</h6>
                        <ArticleStateEditor
                            article={article}
                            onUpdate={onUpdate}
                        />
                        <div className={styles.buttonWrapper}>
                            <Button
                                className={styles.cancelButton}
                                onClick={() => router.back()}
                            >
                                abbrechen
                            </Button>
                            {User.isAdmin(currentUser) && (
                                <>
                                    <Button
                                        className={styles.cancelButton}
                                        onClick={() =>
                                            setIsDatesEditorOpen(true)
                                        }
                                        title={'Daten bearbeiten'}
                                        aria-label={'Edit dates'}
                                    >
                                        <Event />
                                    </Button>
                                    <ArticleDatesEditor
                                        isOpen={isDatesEditorOpen}
                                        article={article}
                                        onUpdate={({ insertedAt }) => {
                                            onUpdate({
                                                ...article,
                                                insertedAt,
                                            });
                                            setIsDatesEditorOpen(false);
                                        }}
                                        onAbort={() =>
                                            setIsDatesEditorOpen(false)
                                        }
                                    />
                                </>
                            )}
                            <ButtonGroup fullWidth>
                                <MenuButton
                                    title={'Speicheroptionen'}
                                    buttonProps={{
                                        icon: <ArrowDropDownIcon />,
                                        className:
                                            'is-first-button-group-button',
                                        variant: 'fill',
                                    }}
                                    placement={'top'}
                                    onAction={(action) => {
                                        switch (action) {
                                            case 'save-no-pudated-at':
                                                return onSave({
                                                    updatedAt: new Date(
                                                        article.updatedAt
                                                    ).toISOString(),
                                                });
                                            case 'save-updated-on-created':
                                                return onSave({
                                                    updatedAt:
                                                        article.insertedAt,
                                                });
                                        }
                                    }}
                                >
                                    <Item key={'save-no-updated-at'}>
                                        Ohne Aktualisierszeit zu ??ndern
                                    </Item>
                                    <Item key={'save-updated-on-created'}>
                                        Aktualisierszeit auf Erstellszeit setzen
                                    </Item>
                                </MenuButton>
                                <Button
                                    fullWidth
                                    className={'is-last-button-group-button'}
                                    variant={'fill'}
                                    disabled={isLoading}
                                    onClick={() =>
                                        onSave({
                                            updatedAt: new Date().toISOString(),
                                        })
                                    }
                                >
                                    speichern
                                </Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </div>
                <Dialog
                    open={isDeleteModalOpen}
                    title={'Beitrag l??schen'}
                    onRequestClose={() => setIsDeleteModalOpen(false)}
                >
                    <DialogContent>
                        <p>
                            M??chtest du den Beitrag "{article.title}" wirklich
                            l??schen?
                        </p>
                        <p>
                            Der Beitrag ist dann unwiederbringbar verloren und
                            kann nicht wiederhergestellt werden.
                        </p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsDeleteModalOpen(false)}>
                            Beitrag behalten
                        </Button>
                        <Button
                            variant={'error'}
                            onClick={() => deleteArticle()}
                        >
                            Beitrag endg??ltig l??schen
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={isSelfRemovalDialogOpen}
                    title={'Dich selbst aus dem Beitrag entfernen'}
                    onRequestClose={() => setIsSelfRemovalDialogOpen(false)}
                >
                    <DialogContent>
                        <p>
                            M??chtest du dich selbst wirklich aus dem Beitrag "
                            {article.title}" entfernen?
                        </p>
                        <p>
                            Du wirst den Beitrag dann nicht mehr bearbeiten
                            k??nnen und ??bergibst die Rechte den anderen Autoren
                            oder Administratoren der Seite
                        </p>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setIsSelfRemovalDialogOpen(false)}
                        >
                            abbrechen
                        </Button>
                        <Button
                            onClick={() => {
                                onUpdate({
                                    ...article,
                                    users: article.users.filter(
                                        (articleUser) =>
                                            articleUser.id !== currentUser?.id
                                    ),
                                });
                                setIsSelfRemovalDialogOpen(false);
                            }}
                        >
                            endg??ltig entfernen
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        );
    }
);
EditArticleFooter.displayName = 'EditArticleFooter';
