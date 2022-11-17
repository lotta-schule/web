import * as React from 'react';
import { render, waitFor } from 'test/util';
import { adminGroup, SomeUser, tenant } from 'test/fixtures';
import { ConstraintList } from './ConstraintsList';
import userEvent from '@testing-library/user-event';

import UpdateTenantMutation from 'api/mutation/UpdateTenantMutation.graphql';

const adminUser = { ...SomeUser, groups: [adminGroup] };

describe('pages/admin/users/constraints', () => {
    it('should render without error', () => {
        render(<ConstraintList />, {}, { currentUser: adminUser });
    });

    describe('should not impose limit', () => {
        it('should have "no limit" checkbox checked when limit is -1', async () => {
            const screen = render(
                <ConstraintList />,
                {},
                {
                    tenant: {
                        ...tenant,
                        configuration: {
                            ...tenant.configuration,
                            userMaxStorageConfig: '-1',
                        },
                    },
                    currentUser: adminUser,
                }
            );
            await waitFor(() => {
                expect(
                    screen.getByRole('checkbox', { name: /nicht begrenzen/i })
                ).toBeChecked();
                expect(
                    screen.getByRole('checkbox', { name: /begrenzen auf/i })
                ).not.toBeChecked();
            });
        });

        it('should set a limit when clicking corresponding checkbox', async () => {
            const screen = render(
                <ConstraintList />,
                {},
                {
                    tenant: {
                        ...tenant,
                        configuration: {
                            ...tenant.configuration,
                            userMaxStorageConfig: '-1',
                        },
                    },
                    currentUser: adminUser,
                }
            );
            await userEvent.click(
                screen.getByRole('checkbox', { name: /begrenzen auf:/i })
            );
            expect(
                screen.getByRole('spinbutton', { name: /begrenzung/i })
            ).toHaveValue(20);
        });
    });

    describe('should impose limit', () => {
        it('should have "no limit" checkbox checked when limit is 20', () => {
            const screen = render(
                <ConstraintList />,
                {},
                { currentUser: adminUser }
            );
            expect(
                screen.getByRole('checkbox', { name: /begrenzen auf/i })
            ).toBeChecked();
            expect(
                screen.getByRole('checkbox', { name: /nicht begrenzen/i })
            ).not.toBeChecked();
        });

        it('should remember the limit set when disabling and reenabling the limit', async () => {
            const screen = render(
                <ConstraintList />,
                {},
                { currentUser: adminUser }
            );
            await userEvent.type(
                screen.getByRole('spinbutton', {
                    name: /begrenzung/i,
                }),
                '123'
            );
            await userEvent.tab();
            await userEvent.click(
                screen.getByRole('checkbox', { name: /nicht begrenzen/i })
            );
            await userEvent.click(
                screen.getByRole('checkbox', { name: /begrenzen auf/i })
            );
            expect(
                screen.getByRole('spinbutton', { name: /begrenzung/i })
            ).toHaveValue(20123);
        });

        it('have the tenant value prefilled', () => {
            const screen = render(
                <ConstraintList />,
                {},
                { currentUser: adminUser }
            );
            expect(
                screen.getByRole('spinbutton', { name: /begrenzung/i })
            ).toHaveValue(20);
        });

        describe('update the value', () => {
            it('should work by request when changing via input field', async () => {
                const updateFn = jest.fn(() => ({
                    data: {
                        tenant: {
                            ...tenant,
                            configuration: {
                                ...tenant.configuration,
                                userMaxStorageConfig: '20123',
                            },
                        },
                    },
                }));
                const mocks = [
                    {
                        request: {
                            query: UpdateTenantMutation,
                            variables: {
                                tenant: {
                                    configuration: {
                                        ...tenant.configuration,
                                        userMaxStorageConfig: '21100494848',
                                    },
                                },
                            },
                        },
                        result: updateFn,
                    },
                ];
                const screen = render(
                    <ConstraintList />,
                    {},
                    { additionalMocks: mocks, currentUser: adminUser }
                );
                await userEvent.type(
                    screen.getByRole('spinbutton', {
                        name: /begrenzung/i,
                    }),
                    '123'
                );
                await userEvent.tab();
                expect(
                    screen.getByRole('spinbutton', { name: /begrenzung/i })
                ).not.toHaveFocus();
                await userEvent.click(
                    screen.getByRole('button', { name: /speichern/i })
                );
                expect(
                    screen.getByRole('button', { name: /speichern/i })
                ).toBeDisabled();
                await waitFor(() => {
                    expect(updateFn).toHaveBeenCalled();
                });
            });
        });
    });
});
