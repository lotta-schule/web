import * as React from 'react';
import {
    NavigateNext,
    NavigateBefore,
    Warning,
    DeleteForever,
} from '@material-ui/icons';
import { useQuery, useApolloClient, useMutation } from '@apollo/client';
import { ArticleModel, FileModel } from 'model';
import {
    Button,
    Box,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    ErrorMessage,
    LinearProgress,
    Tabbar,
    Tab,
} from '@lotta-schule/hubert';
import { useTenant } from 'util/tenant/useTenant';
import { ArticlesList } from 'shared/articlesList/ArticlesList';
import { Main, Sidebar } from 'layout';
import { ProfileDeleteFileSelection } from './component/ProfileDeleteFileSelection';
import { useRouter } from 'next/router';
import { useCurrentUser } from 'util/user/useCurrentUser';
import FileExplorer from 'shared/fileExplorer/FileExplorer';
import clsx from 'clsx';

import DestroyAccountMutation from 'api/mutation/DestroyAccountMutation.graphql';
import GetOwnArticlesQuery from 'api/query/GetOwnArticles.graphql';
import GetRelevantFilesInUsageQuery from 'api/query/GetRelevantFilesInUsage.graphql';

import styles from './DeletePage.module.scss';

enum ProfileDeleteStep {
    Start,
    ReviewArticles,
    ReviewFiles,
    ConfirmDeletion,
}

export const DeletePage = React.memo(() => {
    const router = useRouter();
    const apolloClient = useApolloClient();

    const tenant = useTenant();
    const currentUser = useCurrentUser();
    const [selectedFilesToTransfer, setSelectedFilesToTransfer] =
        React.useState<FileModel[]>([]);

    const [currentStep, setCurrentStep] = React.useState<ProfileDeleteStep>(
        ProfileDeleteStep.Start
    );
    const [selectedFilesTab, setSelectedFilesTab] = React.useState(0);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);

    const {
        data: ownArticlesData,
        loading: isLoadingOwnArticles,
        error: ownArticlesError,
    } = useQuery<{ articles: ArticleModel[] }>(GetOwnArticlesQuery, {
        skip: currentStep !== ProfileDeleteStep.ReviewArticles,
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-first',
        onCompleted: (data) => {
            if (data) {
                if (!data.articles.length) {
                    // userAvatar has not written any articles. So don't bother him, go to next step
                    setCurrentStep((s) => s + 1);
                }
            }
        },
        onError: () => setCurrentStep((s) => s - 1),
    });

    const {
        data: relevantFilesData,
        loading: isLoadingRelevantFiles,
        error: relevantFilesError,
    } = useQuery<{ files: FileModel[] }>(GetRelevantFilesInUsageQuery, {
        skip: currentStep !== ProfileDeleteStep.ReviewFiles,
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-first',
        onCompleted: (data) => {
            if (data) {
                if (!data.files.length) {
                    // userAvatar has no files used in public articles or categories. Just show him his own files
                    setSelectedFilesTab(1);
                } else {
                    setSelectedFilesToTransfer([...data.files]);
                }
            }
        },
        onError: () => setCurrentStep((s) => s - 1),
    });

    const [
        destroyAccount,
        { loading: isLoadingDestroyAccount, error: destroyAccountError },
    ] = useMutation(DestroyAccountMutation, {
        fetchPolicy: 'no-cache',
        variables: {
            userId: currentUser?.id,
            transferFileIds: selectedFilesToTransfer.map((f) => f.id),
        },
        onCompleted: async () => {
            setIsConfirmDialogOpen(false);
            await router.push('/');
            localStorage.clear();
            apolloClient.resetStore();
        },
        onError: () => setCurrentStep((s) => s - 1),
    });

    const isLoading =
        isLoadingOwnArticles ||
        isLoadingRelevantFiles ||
        isLoadingDestroyAccount;

    const boxActions = React.useMemo(() => {
        const button =
            currentStep < ProfileDeleteStep.ConfirmDeletion ? (
                <Button
                    small
                    disabled={isLoading}
                    icon={<NavigateNext />}
                    onClick={() => {
                        setCurrentStep((s) => s + 1);
                    }}
                >
                    Weiter
                </Button>
            ) : (
                <Button
                    small
                    className={styles.deleteButton}
                    disabled={isLoading}
                    icon={<Warning />}
                    onClick={() => {
                        setIsConfirmDialogOpen(true);
                    }}
                >
                    Daten endg??ltig l??schen
                </Button>
            );
        return (
            <Box className={styles.boxActions}>
                <Collapse
                    visible={
                        !isLoading && currentStep > ProfileDeleteStep.Start
                    }
                >
                    <Button
                        small
                        icon={<NavigateBefore />}
                        disabled={currentStep <= ProfileDeleteStep.Start}
                        onClick={() => setCurrentStep((s) => s - 1)}
                        aria-hidden={
                            isLoading || currentStep <= ProfileDeleteStep.Start
                        }
                    >
                        Zur??ck
                    </Button>
                </Collapse>
                <Collapse visible={!isLoading}>{button}</Collapse>
            </Box>
        );
    }, [currentStep, isLoading]);

    return (
        <>
            <Main className={styles.root}>
                {isLoading && (
                    <Box data-testid={'ProfileDeleteLoadingBox'}>
                        <LinearProgress
                            isIndeterminate
                            aria-label={'Seite wird gel??scht'}
                        />
                    </Box>
                )}

                <ErrorMessage error={ownArticlesError || relevantFilesError} />

                <Collapse
                    visible={
                        !isLoading && currentStep === ProfileDeleteStep.Start
                    }
                >
                    <Box
                        className={styles.container}
                        aria-hidden={
                            isLoading || currentStep !== ProfileDeleteStep.Start
                        }
                        data-testid={'ProfileDeleteStep1Box'}
                    >
                        <h3 className={styles.paragraph}>
                            Benutzerkonto und Daten l??schen
                        </h3>
                        <p className={styles.paragraph}>
                            Deine Zeit bei <em>{tenant.title}</em> ist vorbei
                            und du m??chtest dein Benutzerkonto mit deinen
                            pers??nlichen Dateien und Daten l??schen?
                            <br />
                            Deine Zeit bei <em>{tenant.title}</em> ist vorbei
                            und du m??chtest dein Benutzerkonto mit deinen
                            pers??nlichen Dateien und Daten l??schen?
                        </p>
                        <div className={styles.paragraph}>
                            <p>
                                Es ist wichtig zu wissen, wo pers??nliche Daten
                                von dir und ??ber dich gespeichert sind.
                            </p>
                            <p>Hier erh??ltst du eine ??bersicht dar??ber,</p>
                        </div>
                        <ul className={clsx(styles.paragraph, styles.list)}>
                            <li>
                                welche Daten Lotta ??ber dich gespeichert hat,
                            </li>
                            <li>welche gel??scht werden k??nnen und</li>
                            <li>
                                welche Daten Du an <em>{tenant.title}</em>{' '}
                                ??bergeben kannst, sodass nachfolgende
                                Generationen auf der Homepage von{' '}
                                <em>{tenant.title}</em> von Dir lesen k??nnen.
                            </li>
                        </ul>
                        {boxActions}
                    </Box>
                </Collapse>

                <Collapse
                    visible={
                        !isLoading &&
                        currentStep === ProfileDeleteStep.ReviewArticles
                    }
                >
                    <Box
                        className={styles.container}
                        aria-hidden={
                            isLoading ||
                            currentStep !== ProfileDeleteStep.ReviewArticles
                        }
                        data-testid={'ProfileDeleteStep2Box'}
                    >
                        {ownArticlesData &&
                            ownArticlesData.articles.length > 0 && (
                                <>
                                    <h4 className={styles.paragraph}>
                                        Deine Beitr??ge
                                    </h4>
                                    <p className={styles.paragraph}>
                                        Du bist bei{' '}
                                        <strong>
                                            {' '}
                                            {
                                                ownArticlesData.articles.filter(
                                                    (a) => a.published
                                                ).length
                                            }{' '}
                                        </strong>{' '}
                                        sichtbaren Beitr??gen auf{' '}
                                        <em>{tenant.title}</em> als Autor
                                        eingetragen.
                                    </p>
                                    <p className={styles.paragraph}>
                                        Wenn dein Konto gel??scht ist, bleiben
                                        die sichtbaren Artikel erhalten, nur du
                                        wirst als Autor entfernt. ??berpr??fe, ob
                                        das f??r dich in Ordnung ist. Du hast
                                        hier nochmal die Gelegenheit, Beitr??ge
                                        zu ??berpr??fen. Alle nicht-sichtbaren
                                        Beitr??ge (z.Bsp. Beitr??ge die in
                                        Bearbeitung sind) werden gel??scht.
                                    </p>
                                    <ArticlesList
                                        articles={ownArticlesData.articles}
                                    />
                                </>
                            )}
                        {boxActions}
                    </Box>
                </Collapse>

                <Collapse
                    visible={
                        !isLoading &&
                        currentStep === ProfileDeleteStep.ReviewFiles
                    }
                >
                    <Box
                        className={styles.container}
                        aria-hidden={
                            isLoading ||
                            currentStep !== ProfileDeleteStep.ReviewFiles
                        }
                        data-testid={'ProfileDeleteStep3Box'}
                    >
                        {relevantFilesData &&
                            relevantFilesData.files.length > 1 && (
                                <Tabbar
                                    value={selectedFilesTab}
                                    onChange={(val) =>
                                        setSelectedFilesTab(val as number)
                                    }
                                >
                                    <Tab
                                        value={0}
                                        label={`Dateien ??bergeben (${selectedFilesToTransfer.length}/${relevantFilesData.files.length})`}
                                    />
                                    <Tab
                                        value={1}
                                        label={'Alle Dateien ??berpr??fen'}
                                    />
                                </Tabbar>
                            )}

                        <div
                            role={'tabpanel'}
                            hidden={selectedFilesTab !== 0}
                            aria-labelledby={'tabpanel-handover-heading'}
                        >
                            <h4
                                className={styles.paragraph}
                                id={'tabpanel-handover-heading'}
                            >
                                Dateien aus genutzten Beitr??gen ??bergeben
                            </h4>
                            <p className={styles.paragraph}>
                                Es gibt Dateien, die du hochgeladen hast, die
                                bei <em>{tenant.title}</em> in Beitr??gen
                                sichtbar sind.
                            </p>
                            <p className={styles.paragraph}>
                                Du hast jetzt die M??glichkeit, die
                                Nutzungsrechte an diesen Dateien{' '}
                                <em>{tenant.title}</em> zu ??bergeben. Dadurch
                                bleiben die Beitr??ge weiter vollst??ndig und die
                                Dateien w??ren weiter f??r Nutzer sichtbar.
                            </p>
                            <p className={styles.paragraph}>
                                ??berlege dir gut, f??r welche Dateien du{' '}
                                <em>{tenant.title}</em> erlauben m??chtest, sie
                                weiterhin auf ihrer Webseite zu zeigen. Wenn
                                dein Benutzerkonto erst gel??scht ist, kann der
                                Vorgang nicht mehr korrigiert werden, und du
                                wirst dich pers??nlich an einen Administrator
                                wenden m??ssen.
                            </p>
                            <ProfileDeleteFileSelection
                                files={relevantFilesData?.files ?? []}
                                selectedFiles={selectedFilesToTransfer}
                                onSelectFiles={setSelectedFilesToTransfer}
                            />
                        </div>
                        <div
                            role={'tabpanel'}
                            hidden={selectedFilesTab !== 1}
                            aria-labelledby={'tabpanel-files-heading'}
                        >
                            <h4
                                className={styles.paragraph}
                                id={'tabpanel-files-heading'}
                            >
                                Alle Dateien ??berpr??fen
                            </h4>
                            <p className={styles.paragraph}>
                                Du kannst Dateien, die du behalten m??chtest, zur
                                Sicherheit herunterladen. Andere Dateien werden
                                endg??ltig gel??scht.
                            </p>
                            <FileExplorer />
                        </div>
                        {boxActions}
                    </Box>
                </Collapse>

                <Collapse
                    visible={
                        !isLoading &&
                        currentStep === ProfileDeleteStep.ConfirmDeletion
                    }
                >
                    <Box
                        className={styles.container}
                        aria-hidden={
                            isLoading ||
                            currentStep !== ProfileDeleteStep.ConfirmDeletion
                        }
                        data-testid={'ProfileDeleteStep4Box'}
                    >
                        <h4 className={styles.paragraph}>
                            L??schanfrage best??tigen
                        </h4>
                        <p className={styles.paragraph}>
                            Deine Daten k??nnen nun gel??scht werden.
                        </p>
                        <ul className={clsx(styles.paragraph, styles.list)}>
                            <li>
                                Von dir erstellte, nicht ver??ffentlichte
                                Beitr??ge, bei denen es keine anderen AutorInnen
                                gibt, werden gel??scht
                            </li>
                            <li>
                                Du wirst als AutorIn aus Beitr??gen entfernt, die
                                ver??ffentlicht sind
                            </li>
                            <li>
                                Du wirst als AutorIn aus Beitr??gen entfernt, die
                                ver??ffentlicht sind
                            </li>
                            {selectedFilesToTransfer.length > 0 && (
                                <li>
                                    Deine Dateien und Ordner, ausgenommen die{' '}
                                    <em>
                                        {selectedFilesToTransfer.length} Dateien
                                    </em>
                                    , die du {tenant.title} ??berl??sst, werden
                                    gel??scht
                                </li>
                            )}
                            {selectedFilesToTransfer.length === 0 && (
                                <li>
                                    Alle deine Dateien und Ordner werden
                                    gel??scht
                                </li>
                            )}
                            <li>
                                Dein Nutzeraccount und alle darin gespeicherten
                                Informationen werden gel??scht [Hinweis: Es kann
                                bis zu vier Wochen dauern, bis die allerletzten
                                Daten, wie IP-Adressen aus Logs, oder Daten die
                                sich in Backups befinden, gel??scht werden.]
                            </li>
                        </ul>
                        <p className={styles.paragraph}>
                            Wenn du einverstanden bist, klicke auf 'Daten
                            endg??ltig l??schen'. Du wirst dann abgemeldet und auf
                            die Startseite weitergeleitet.
                        </p>
                        <p className={styles.paragraph}>
                            Dieser Vorgang ist endg??ltig.
                        </p>
                        {boxActions}
                    </Box>
                </Collapse>
                <Dialog
                    open={isConfirmDialogOpen}
                    onRequestClose={() => setIsConfirmDialogOpen(false)}
                    title={'Benutzerkonto wirklich l??schen?'}
                >
                    <DialogContent>
                        <ErrorMessage error={destroyAccountError} />
                        <p>
                            Das Benutzerkonto wird endg??ltig und
                            unwiederbringlich gel??scht. Daten k??nnen nicht
                            wiederhergestellt werden.
                        </p>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setIsConfirmDialogOpen(false)}
                            autoFocus
                        >
                            Abbrechen
                        </Button>
                        <Button
                            onClick={() => destroyAccount()}
                            icon={<DeleteForever />}
                            className={styles.deleteButton}
                            disabled={isLoading}
                        >
                            Jetzt alle Daten endg??ltig l??schen
                        </Button>
                    </DialogActions>
                </Dialog>
            </Main>
            <Sidebar isEmpty />
        </>
    );
});
DeletePage.displayName = 'ProfileDeletePage';
