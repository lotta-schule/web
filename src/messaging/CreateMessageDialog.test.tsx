import * as React from 'react';
import { render, waitFor } from 'test/util';
import { SomeUser, SomeUserin, schuelerGroup } from 'test/fixtures';
import { CreateMessageDialog } from './CreateMessageDialog';
import userEvent from '@testing-library/user-event';

import SearchUsersQuery from 'api/query/SearchUsersQuery.graphql';

describe('CreateMessageDialog', () => {
    describe('select detination popup', () => {
        const SomeUserWithGroups = { ...SomeUser, groups: [schuelerGroup] };

        it('should not show the "groups" tab if userr has no groups', async () => {
            const screen = render(
                <CreateMessageDialog
                    isOpen
                    onAbort={() => {}}
                    onConfirm={() => {}}
                />,
                {},
                { currentUser: SomeUser }
            );

            userEvent.click(
                screen.getByRole('button', { name: /nachricht verfassen/i })
            );
            await waitFor(() => {
                expect(
                    screen.getByRole('dialog', { name: /empfänger/i })
                ).toBeVisible();
            });

            expect(screen.queryByRole('tab', { name: /gruppe/i })).toBeNull();
        });

        it('should select a userAvatar and create the corresponding thread object', async () => {
            const additionalMocks = [
                {
                    request: {
                        query: SearchUsersQuery,
                        variables: { searchtext: 'Drinalda' },
                    },
                    result: {
                        data: { users: [SomeUserWithGroups, SomeUserin] },
                    },
                },
            ];
            const onConfirm = jest.fn((destination) => {
                expect(destination.user.name).toEqual('Luisa Drinalda');
                expect(destination.group).not.toBeDefined();
            });
            const screen = render(
                <CreateMessageDialog
                    isOpen
                    onAbort={() => {}}
                    onConfirm={onConfirm}
                />,
                {},
                { currentUser: SomeUserin, additionalMocks }
            );

            userEvent.click(
                screen.getByRole('button', { name: /nachricht verfassen/i })
            );
            await waitFor(() => {
                expect(
                    screen.getByRole('dialog', { name: /empfänger/i })
                ).toBeVisible();
            });

            userEvent.click(screen.getByRole('tab', { name: /nutzer/i }));
            userEvent.type(
                screen.getByRole('combobox', { name: /nutzer suchen/i }),
                'Drinalda'
            );
            await waitFor(() => {
                expect(screen.queryByRole('progressbar')).toBeNull();
            });
            await waitFor(
                () => {
                    expect(
                        screen.getByRole('option', { name: /drinalda/i })
                    ).toBeVisible();
                },
                { timeout: 2000 }
            );
            userEvent.click(screen.getByRole('option', { name: /drinalda/i }));

            await waitFor(() => {
                expect(
                    screen.getByTestId('message-destination')
                ).toHaveTextContent('Drinalda');
            });

            userEvent.click(
                screen.getByRole('button', { name: 'Nachricht verfassen' })
            );

            await waitFor(() => {
                expect(onConfirm).toHaveBeenCalled();
            });
        });

        it('should select a group and call the onConfirm with it', async () => {
            const onConfirm = jest.fn((destination) => {
                expect(destination.user).not.toBeDefined();
                expect(destination.group.name).toEqual('Schüler');
            });
            const screen = render(
                <CreateMessageDialog
                    isOpen
                    onAbort={() => {}}
                    onConfirm={onConfirm}
                />,
                {},
                { currentUser: SomeUserWithGroups }
            );

            userEvent.click(
                screen.getByRole('button', { name: /nachricht verfassen/i })
            );
            await waitFor(() => {
                expect(
                    screen.getByRole('dialog', { name: /empfänger/i })
                ).toBeVisible();
            });

            userEvent.click(screen.getByRole('tab', { name: /gruppe/i }));

            await waitFor(() => {
                expect(
                    screen.getByRole('combobox', { name: /gruppe wählen/i })
                ).toBeVisible();
            });
            userEvent.click(
                screen.getByRole('button', { name: /vorschläge/i })
            );
            expect(screen.getAllByRole('option')).toHaveLength(1);
            userEvent.click(screen.getByRole('option', { name: 'Schüler' }));

            await waitFor(() => {
                expect(
                    screen.getByTestId('message-destination')
                ).toHaveTextContent('Schüler');
            });

            userEvent.click(
                screen.getByRole('button', { name: 'Nachricht verfassen' })
            );

            await waitFor(() => {
                expect(onConfirm).toHaveBeenCalled();
            });
        });
    });
});
