import * as React from 'react';
import { Badge, BaseButton, Button } from '@lotta-schule/hubert';
import { useCurrentUser } from 'util/user/useCurrentUser';
import {
    ExitToAppOutlined,
    AddCircleOutlineOutlined,
    SecurityOutlined,
    FolderOutlined,
    QuestionAnswerOutlined,
    AssignmentOutlined,
    PersonOutlineOutlined,
    SearchOutlined,
} from '@material-ui/icons';
import { useOnLogout } from 'util/user/useOnLogout';
import { useQuery } from '@apollo/client';
import { ArticleModel } from 'model';
import { User, Article } from 'util/model';
import { CreateArticleDialog } from 'shared/dialog/CreateArticleDialog';
import { LoginDialog } from 'shared/dialog/LoginDialog';
import { RegisterDialog } from 'shared/dialog/RegisterDialog';
import { useRouter } from 'next/router';
import GetUnpublishedArticlesQuery from 'api/query/GetUnpublishedArticles.graphql';
import Link from 'next/link';

import styles from './UserNavigationMobile.module.scss';

export const UserNavigationMobile = React.memo(() => {
    const router = useRouter();
    const currentUser = useCurrentUser();
    const newMessagesBadgeNumber = currentUser?.unreadMessages ?? 0;
    const onLogout = useOnLogout();

    const { data: unpublishedArticlesData } = useQuery<{
        articles: ArticleModel[];
    }>(GetUnpublishedArticlesQuery, {
        skip: !currentUser || !User.isAdmin(currentUser),
    });
    const unpublishedBadgeNumber = unpublishedArticlesData?.articles.filter(
        (article) => !article.readyToPublish || !article.published
    ).length;

    const [loginModalIsOpen, setLoginModalIsOpen] = React.useState(false);
    const [registerModalIsOpen, setRegisterModalIsOpen] = React.useState(false);
    const [createArticleModalIsOpen, setCreateArticleModalIsOpen] =
        React.useState(false);

    if (currentUser) {
        return (
            <>
                <nav className={styles.root}>
                    <BaseButton
                        variant={'borderless'}
                        className={styles.button}
                        onClick={() => {
                            onLogout();
                        }}
                        data-testid="LogoutButton"
                    >
                        <ExitToAppOutlined />
                        <span className={styles.label}>Abmelden</span>
                    </BaseButton>
                    <BaseButton
                        variant={'borderless'}
                        className={styles.button}
                        onClick={() => {
                            setCreateArticleModalIsOpen(true);
                        }}
                        data-testid="CreateArticleButton"
                    >
                        <AddCircleOutlineOutlined color={'secondary'} />
                        <span className={styles.label}>Beitrag</span>
                    </BaseButton>
                    <Link href={'/search'} passHref>
                        <BaseButton
                            variant={'borderless'}
                            className={styles.button}
                            data-testid="SearchButton"
                        >
                            <SearchOutlined color={'secondary'} />
                            <span className={styles.label}>Suche</span>
                        </BaseButton>
                    </Link>
                    <Link href={'/profile'} passHref>
                        <BaseButton
                            variant={'borderless'}
                            className={styles.button}
                            data-testid="ProfileButton"
                        >
                            <PersonOutlineOutlined color={'secondary'} />
                            <span className={styles.label}>Profil</span>
                        </BaseButton>
                    </Link>
                    <Link href={'/profile/files'} passHref>
                        <BaseButton
                            variant={'borderless'}
                            className={styles.button}
                            data-testid="ProfileFilesButton"
                        >
                            <FolderOutlined color={'secondary'} />
                            <span className={styles.label}>Dateien</span>
                        </BaseButton>
                    </Link>
                    <Link href={'/profile/articles'} passHref>
                        <BaseButton
                            variant={'borderless'}
                            className={styles.button}
                            data-testid="OwnArticlesButton"
                        >
                            <AssignmentOutlined color={'secondary'} />
                            <span className={styles.label}>Meine Beitr??ge</span>
                        </BaseButton>
                    </Link>
                    <Link href={'/messaging'} passHref>
                        <BaseButton
                            variant={'borderless'}
                            className={styles.button}
                            data-testid="MessagingButton"
                        >
                            <QuestionAnswerOutlined color={'secondary'} />
                            <span className={styles.label}>
                                Nachrichten{' '}
                                <Badge
                                    value={newMessagesBadgeNumber}
                                    className={styles.badge}
                                />
                            </span>
                        </BaseButton>
                    </Link>
                    {User.isAdmin(currentUser) && (
                        <>
                            <Link href={'/admin'} passHref>
                                <BaseButton
                                    variant={'borderless'}
                                    className={styles.button}
                                    data-testid="AdminButton"
                                >
                                    <SecurityOutlined color={'secondary'} />
                                    <span className={styles.label}>Admin</span>
                                </BaseButton>
                            </Link>
                            <Link href={'/admin/unpublished'} passHref>
                                <BaseButton
                                    variant={'borderless'}
                                    className={styles.button}
                                >
                                    <AssignmentOutlined color={'secondary'} />
                                    <span className={styles.label}>
                                        Beitr??ge freigeben
                                        <Badge
                                            value={unpublishedBadgeNumber}
                                            className={styles.badge}
                                            data-testid="UnpublishedArticlesButton"
                                        />
                                    </span>
                                </BaseButton>
                            </Link>
                        </>
                    )}
                    {!User.isAdmin(currentUser) && (
                        <>
                            <div />
                            <div />
                        </>
                    )}
                    <div />
                </nav>
                <CreateArticleDialog
                    isOpen={createArticleModalIsOpen}
                    onAbort={() => setCreateArticleModalIsOpen(false)}
                    onConfirm={(article) => {
                        router.push(Article.getPath(article, { edit: true }));
                    }}
                />
            </>
        );
    }
    return (
        <>
            <div>
                <Button
                    fullWidth
                    variant={'borderless'}
                    onClick={() => setLoginModalIsOpen(true)}
                    data-testid="LoginButton"
                >
                    Anmelden
                </Button>
                <Button
                    variant={'borderless'}
                    fullWidth
                    onClick={() => setRegisterModalIsOpen(true)}
                    data-testid="RegisterButton"
                >
                    Registrieren
                </Button>
                <Link href={'/search'} passHref>
                    <Button
                        fullWidth
                        data-testid="SearchButton"
                        variant={'borderless'}
                    >
                        Suche
                    </Button>
                </Link>
            </div>
            <LoginDialog
                isOpen={loginModalIsOpen}
                onRequestClose={() => {
                    setLoginModalIsOpen(false);
                }}
            />
            <RegisterDialog
                isOpen={registerModalIsOpen}
                onRequestClose={() => {
                    setRegisterModalIsOpen(false);
                }}
            />
        </>
    );
});
UserNavigationMobile.displayName = 'UserNavigationMobile';
