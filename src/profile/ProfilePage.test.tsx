import * as React from 'react';
import { render, waitFor } from 'test/util';
import { SomeUser, adminGroup, elternGroup, lehrerGroup } from 'test/fixtures';
import { ProfilePage } from './ProfilePage';
import userEvent from '@testing-library/user-event';

import GetDirectoriesAndFilesQuery from 'api/query/GetDirectoriesAndFiles.graphql';
import UpdateProfileMutation from 'api/mutation/UpdateProfileMutation.graphql';

describe('shared/layouts/profileLayout/ProfileData', () => {
    describe('show userAvatar data', () => {
        it('should show an input with the username', async () => {
            const screen = render(
                <ProfilePage />,
                {},
                { currentUser: SomeUser }
            );
            expect(
                await screen.findByLabelText(/vor- und nachname/i)
            ).toHaveValue('Ernesto Guevara');
        });

        it("should show a disabled input with the userAvatar's email", async () => {
            const screen = render(
                <ProfilePage />,
                {},
                { currentUser: SomeUser }
            );
            expect(await screen.findByLabelText(/Email-Adresse/i)).toHaveValue(
                'userAvatar@lotta.schule'
            );
            expect(
                await screen.findByLabelText(/Email-Adresse/i)
            ).toBeDisabled();
        });

        it("should show an input with the userAvatar's name, nickname and class", async () => {
            const screen = render(
                <ProfilePage />,
                {},
                { currentUser: SomeUser }
            );
            expect(
                await screen.findByLabelText(/vor- und nachname/i)
            ).toHaveValue('Ernesto Guevara');
            expect(await screen.findByLabelText(/spitzname/i)).toHaveValue(
                'Che'
            );
        });

        it('should check the corresponding checkbox if userAvatar is hiding his full name', async () => {
            const screen = render(
                <ProfilePage />,
                {},
                {
                    currentUser: { ...SomeUser, hideFullName: true },
                }
            );
            expect(
                await screen.findByLabelText(/??ffentlich verstecken/i)
            ).toBeChecked();
        });

        it('should send a change request with the correct data', async () => {
            let didCallUpdateData = false;
            const mocks = [
                {
                    request: {
                        query: UpdateProfileMutation,
                        variables: {
                            user: {
                                name: 'Ernesto Guevara',
                                nickname: 'Spitzi',
                                class: '5/1',
                                hideFullName: true,
                                avatarImageFile: null,
                                enrollmentTokens: [],
                            },
                        },
                    },
                    result: () => {
                        didCallUpdateData = true;
                        return {
                            data: {
                                user: {
                                    ...SomeUser,
                                    name: 'Ernesto Guevara',
                                    nickname: 'Spitzi',
                                    class: '5/1',
                                    hideFullName: true,
                                    email: 'neue-email@adresse.de',
                                    avatarImageFile: null,
                                    enrollmentTokens: [],
                                },
                            },
                        };
                    },
                },
            ];
            const screen = render(
                <ProfilePage />,
                {},
                {
                    currentUser: SomeUser,
                    additionalMocks: mocks,
                }
            );

            const emailField = screen.getByPlaceholderText(
                'beispiel@medienportal.org'
            ) as HTMLInputElement;
            // const nameField = screen.getByLabelText('Dein Vor- und Nachname') as HTMLInputElement;
            const nicknameField = screen.getByLabelText(
                'Dein Spitzname'
            ) as HTMLInputElement;
            const publishNameCheckbox = screen.getByLabelText(
                'Deinen vollst??ndigen Namen ??ffentlich verstecken'
            ) as HTMLInputElement;
            const classField = screen.getByLabelText(
                'Deine Klasse / Dein K??rzel:'
            ) as HTMLInputElement;

            userEvent.clear(emailField);
            userEvent.clear(nicknameField);
            userEvent.clear(classField);

            userEvent.type(emailField, 'neue-email@adresse.de');
            userEvent.type(nicknameField, 'Spitzi');
            userEvent.click(publishNameCheckbox);
            userEvent.type(classField, '5/1');

            userEvent.click(screen.getByRole('button', { name: 'Speichern' }));

            await waitFor(() => {
                expect(didCallUpdateData).toEqual(true);
            });
        });
    });

    describe('User groups', () => {
        it("should show all the userAvatar's groups", async () => {
            const screen = render(
                <ProfilePage />,
                {},
                {
                    currentUser: {
                        ...SomeUser,
                        groups: [adminGroup, lehrerGroup, elternGroup],
                        assignedGroups: [adminGroup, lehrerGroup],
                    },
                }
            );
            const groupsList = await screen.findByTestId(
                'ProfileData-GroupsList'
            );
            expect(groupsList).toBeVisible();
            expect(groupsList).toHaveTextContent('Administrator');
            expect(groupsList).toHaveTextContent('Lehrer');
            expect(groupsList).toHaveTextContent('Eltern');
        });
    });

    describe('Profile picture', () => {
        it('should open the file selection dialog when "Change profile picture" is selected', async () => {
            const screen = render(
                <ProfilePage />,
                {},
                {
                    currentUser: { ...SomeUser, hideFullName: true },
                    additionalMocks: [
                        {
                            request: {
                                query: GetDirectoriesAndFilesQuery,
                                variables: { parentDirectoryId: null },
                            },
                            result: { data: { files: [], directories: [] } },
                        },
                    ],
                }
            );
            const profilePictureButton = (
                await screen.findAllByText('Profilbild ??ndern')
            )[0];
            expect(profilePictureButton).toBeVisible();
            userEvent.click(profilePictureButton);
            await waitFor(() => {
                expect(
                    screen.getByText(/datei ausw??hlen/i)
                ).toBeInTheDocument();
            });
        });
    });

    describe('Password', () => {
        it('should open the change password dialog when the change password button is clicked', async () => {
            const screen = render(
                <ProfilePage />,
                {},
                {
                    currentUser: { ...SomeUser, hideFullName: true },
                }
            );
            const changePasswordButton = (
                await screen.findAllByText('Passwort ??ndern')
            )[0];
            expect(changePasswordButton).toBeVisible();
            userEvent.click(changePasswordButton);
            await waitFor(() => {
                expect(
                    screen.getByRole('heading', {
                        name: 'Passwort ??ndern',
                    })
                ).toBeInTheDocument();
            });
        });
    });

    describe('Email', () => {
        it('should open the change email dialog when the change email button is clicked', async () => {
            const screen = render(
                <ProfilePage />,
                {},
                {
                    currentUser: SomeUser,
                }
            );
            const changeEmailButton = await screen.findByText('Email ??ndern');
            expect(changeEmailButton).toBeVisible();
            userEvent.click(changeEmailButton);
            await waitFor(() => {
                expect(
                    screen.getByRole('heading', {
                        name: 'Email ??ndern',
                    })
                ).toBeInTheDocument();
            });
        });
    });
});
