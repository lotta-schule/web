import * as React from 'react';
import { DirectoryModel, FileModel } from 'model';
import { render, waitFor } from 'test/util';
import {
    ComputerExperten,
    VivaLaRevolucion,
    Schulfest,
    Weihnachtsmarkt,
    Klausurenplan,
    SomeUser,
    getPrivateAndPublicFiles,
} from 'test/fixtures';
import { DeletePage } from './DeletePage';
import { getDefaultApolloMocks } from 'test/mocks/defaultApolloMocks';
import userEvent from '@testing-library/user-event';

import DestroyAccountMutation from 'api/mutation/DestroyAccountMutation.graphql';
import GetDirectoriesAndFilesQuery from 'api/query/GetDirectoriesAndFiles.graphql';
import GetOwnArticlesQuery from 'api/query/GetOwnArticles.graphql';
import GetRelevantFilesInUsageQuery from 'api/query/GetRelevantFilesInUsage.graphql';

describe('shared/layouts/profileLayout/ProfileDelete', () => {
    const filesAndDirs = getPrivateAndPublicFiles(SomeUser);

    const files = filesAndDirs.filter(
        (f: unknown) => (f as FileModel).fileType !== undefined
    ) as unknown as FileModel[];
    const directories = filesAndDirs.filter(
        (f: unknown) => (f as FileModel).fileType === undefined
    ) as unknown as DirectoryModel[];
    const rootDirectories = directories.filter((d) => !d.parentDirectory);

    it('should render the shared without error', () => {
        render(
            <DeletePage />,
            {},
            {
                currentUser: SomeUser,
            }
        );
    });

    it('should be able to go to second page and see own articles when clicking on button', async () => {
        const screen = render(
            <DeletePage />,
            {},
            {
                currentUser: SomeUser,
                additionalMocks: [
                    {
                        request: { query: GetOwnArticlesQuery },
                        result: {
                            data: {
                                articles: [
                                    Weihnachtsmarkt,
                                    Klausurenplan,
                                    Schulfest,
                                    VivaLaRevolucion,
                                    ComputerExperten,
                                ],
                            },
                        },
                    },
                    {
                        request: {
                            query: GetDirectoriesAndFilesQuery,
                            variables: { parentDirectoryId: null },
                        },
                        result: {
                            data: { files: [], directories: rootDirectories },
                        },
                    },
                ],
            }
        );

        expect(
            await screen.findByRole('heading', { name: /daten l??schen/i })
        ).toBeInTheDocument();
        userEvent.click(await screen.findByRole('button', { name: /weiter/i }));

        await waitFor(() => {
            expect(screen.getByTestId('ProfileDeleteStep2Box')).toBeVisible();
        });
    }, 10_000);

    it('should be able to go to third page after having seen the first and the second one', async () => {
        const screen = render(
            <DeletePage />,
            {},
            {
                currentUser: SomeUser,
                additionalMocks: [
                    {
                        request: { query: GetRelevantFilesInUsageQuery },
                        result: { data: { files } },
                    },
                    {
                        request: { query: GetOwnArticlesQuery },
                        result: {
                            data: {
                                articles: [
                                    Weihnachtsmarkt,
                                    Klausurenplan,
                                    Schulfest,
                                    VivaLaRevolucion,
                                    ComputerExperten,
                                ],
                            },
                        },
                    },
                    {
                        request: {
                            query: GetDirectoriesAndFilesQuery,
                            variables: { parentDirectoryId: null },
                        },
                        result: {
                            data: { files: [], directories: rootDirectories },
                        },
                    },
                ],
            }
        );

        userEvent.click(await screen.findByRole('button', { name: /weiter/i }));
        await waitFor(() => {
            expect(screen.getByTestId('ProfileDeleteStep2Box')).toBeVisible();
        });
        userEvent.click(await screen.findByRole('button', { name: /weiter/i }));
        await waitFor(() => {
            expect(screen.getByRole('progressbar')).toBeVisible();
        });
        await waitFor(() => {
            expect(screen.getByTestId('ProfileDeleteStep3Box')).toBeVisible();
        });
    }, 10_000);

    it('The third page should not show the DeleteFileSelection or the tab bar if userAvatar has no files', async () => {
        const screen = render(
            <DeletePage />,
            {},
            {
                currentUser: SomeUser,
                additionalMocks: [
                    {
                        request: { query: GetRelevantFilesInUsageQuery },
                        result: { data: { files: [] } },
                    },
                    {
                        request: { query: GetOwnArticlesQuery },
                        result: {
                            data: {
                                articles: [
                                    Weihnachtsmarkt,
                                    Klausurenplan,
                                    Schulfest,
                                    VivaLaRevolucion,
                                    ComputerExperten,
                                ],
                            },
                        },
                    },
                    {
                        request: {
                            query: GetDirectoriesAndFilesQuery,
                            variables: { parentDirectoryId: null },
                        },
                        result: {
                            data: { files: [], directories: rootDirectories },
                        },
                    },
                ],
            }
        );

        userEvent.click(await screen.findByRole('button', { name: /weiter/i }));
        await waitFor(() => {
            expect(screen.getByRole('progressbar')).toBeVisible();
        });
        userEvent.click(await screen.findByRole('button', { name: /weiter/i }));
        expect(
            await screen.findByTestId('ProfileDeleteStep3Box')
        ).toBeInTheDocument();
        expect(screen.queryByRole('tablist')).toBeNull();
        expect(
            screen.queryByRole('tabpanel', {
                name: /dateien aus beitr??gen ??bergeben/i,
            })
        ).toBeNull();
        expect(
            screen.queryByRole('tabpanel', { name: /alle dateien ??berpr??fen/i })
        ).toBeVisible();
    }, 10_000);

    it('The fourth page should show a "definitly delete account" button, which upon click should show a modal with another "definitly delete account" button', async () => {
        let didCallDeleteMutation = false;
        const onPushLocation = jest.fn(async (url: any) => {
            expect(url).toEqual('/');
            return true;
        });
        const screen = render(
            <DeletePage />,
            {},
            {
                currentUser: SomeUser,
                router: { onPush: onPushLocation },
                additionalMocks: [
                    {
                        request: {
                            query: DestroyAccountMutation,
                            variables: {
                                userId: SomeUser.id,
                                transferFileIds: [],
                            },
                        },
                        result: () => {
                            didCallDeleteMutation = true;
                            return { data: { user: SomeUser } };
                        },
                    },
                    {
                        request: { query: GetRelevantFilesInUsageQuery },
                        result: { data: { files: [] } },
                    },
                    {
                        request: { query: GetOwnArticlesQuery },
                        result: {
                            data: {
                                articles: [
                                    Weihnachtsmarkt,
                                    Klausurenplan,
                                    Schulfest,
                                    VivaLaRevolucion,
                                    ComputerExperten,
                                ],
                            },
                        },
                    },
                    {
                        request: {
                            query: GetDirectoriesAndFilesQuery,
                            variables: { parentDirectoryId: null },
                        },
                        result: {
                            data: { files: [], directories: rootDirectories },
                        },
                    },
                    {
                        request: {
                            query: GetDirectoriesAndFilesQuery,
                            variables: { parentDirectoryId: null },
                        },
                        result: {
                            data: { files: [], directories: rootDirectories },
                        },
                    },
                    ...getDefaultApolloMocks().mocks, // double mocks because cache is restored
                ],
            }
        );

        await waitFor(() => {
            screen.getByRole('button', { name: /weiter/i });
        });
        userEvent.click(screen.getByRole('button', { name: /weiter/i }));
        await waitFor(() => {
            expect(screen.getByTestId('ProfileDeleteStep2Box')).toBeVisible();
        });
        userEvent.click(screen.getByRole('button', { name: /weiter/i }));
        await waitFor(() => {
            expect(screen.getByTestId('ProfileDeleteStep3Box')).toBeVisible();
        });
        userEvent.click(screen.getByRole('button', { name: /weiter/i }));
        await waitFor(() => {
            expect(screen.getByTestId('ProfileDeleteStep4Box')).toBeVisible();
        });
        userEvent.click(
            screen.getByRole('button', { name: /endg??ltig l??schen/i })
        );

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeVisible();
        });

        userEvent.click(
            await screen.findByRole('button', {
                name: /jetzt alle daten endg??ltig l??schen/i,
            })
        );

        await waitFor(() => {
            expect(didCallDeleteMutation).toEqual(true);
        });
        await waitFor(() => {
            expect(onPushLocation).toHaveBeenCalled();
        });
    }, 25_000);
});
