import * as React from 'react';
import { UserGroupModel } from 'model';
import { render, waitFor } from 'test/util';
import {
    adminGroup,
    lehrerGroup,
    schuelerGroup,
    elternGroup,
    userGroups,
} from 'test/fixtures';
import { GroupSelect } from './GroupSelect';
import userEvent from '@testing-library/user-event';

describe('shared/editor/GroupSelect', () => {
    it('should render an GroupSelect without error', () => {
        render(
            <GroupSelect selectedGroups={[]} onSelectGroups={() => {}} />,
            {}
        );
    });

    describe('label prop', () => {
        it('should show a default label', () => {
            const screen = render(
                <GroupSelect selectedGroups={[]} onSelectGroups={() => {}} />,
                {}
            );
            expect(screen.getByText('Sichtbarkeit:')).toBeVisible();
        });

        it('should show no label if null is given', () => {
            const screen = render(
                <GroupSelect
                    label={null}
                    selectedGroups={[]}
                    onSelectGroups={() => {}}
                />,
                {}
            );
            expect(screen.getByRole('heading')).toBeVisible();
        });

        it('should show a given label', () => {
            const screen = render(
                <GroupSelect
                    label={'Wähle Gruppen:'}
                    selectedGroups={[]}
                    onSelectGroups={() => {}}
                />,
                {}
            );
            expect(screen.getByText('Wähle Gruppen:')).toBeVisible();
        });
    });

    describe('disabled prop', () => {
        it('should disable the input field', async () => {
            const screen = render(
                <GroupSelect
                    disabled
                    selectedGroups={[]}
                    onSelectGroups={() => {}}
                />,
                {}
            );

            const input = await screen.findByRole('textbox');
            expect(input).toBeVisible();
            expect(input).toBeDisabled();
        });

        it('should disable the remove group button', async () => {
            const screen = render(
                <GroupSelect
                    disabled
                    selectedGroups={[schuelerGroup]}
                    onSelectGroups={() => {}}
                />,
                {}
            );

            const removeButton = await screen.findByLabelText(
                'Gruppe "Schüler" entfernen'
            );
            expect(removeButton).toBeVisible();
            expect(removeButton).toBeDisabled();
        });

        it('should disable the publicly available checkbox', async () => {
            const screen = render(
                <GroupSelect
                    disabled
                    selectedGroups={[schuelerGroup]}
                    onSelectGroups={() => {}}
                />,
                {}
            );

            const checkbox = await screen.findByRole('checkbox');

            expect(checkbox).toBeDisabled();
        });
    });

    describe('publicly available checkbox', () => {
        it('should be checked when no groups are selected', async () => {
            const screen = render(
                <GroupSelect selectedGroups={[]} onSelectGroups={() => {}} />,
                {}
            );

            const selection = await screen.findByLabelText(/alle sichtbar/i);

            expect(selection).toBeChecked();
        });

        it('should not be checked when a group is selected', async () => {
            const screen = render(
                <GroupSelect
                    selectedGroups={[lehrerGroup]}
                    onSelectGroups={() => {}}
                />,
                {}
            );

            const selection = await screen.findByLabelText(/alle sichtbar/i);

            expect(selection).not.toBeChecked();
        });

        it('should add all groups when checkbox is unchecked', async () => {
            const callback = jest.fn((newGroups) => {
                expect(newGroups.map((g: UserGroupModel) => g.name)).toEqual([
                    'Administrator',
                    'Lehrer',
                    'Schüler',
                    'Eltern',
                ]);
            });
            const screen = render(
                <GroupSelect selectedGroups={[]} onSelectGroups={callback} />,
                {}
            );

            const selection = await screen.findByLabelText(/alle sichtbar/i);

            userEvent.click(selection);

            await waitFor(() => {
                expect(callback).toHaveBeenCalled();
            });
        });

        it('should remove all groups when checkbox is checked', async () => {
            const callback = jest.fn((newGroups) => {
                expect(newGroups.map((g: UserGroupModel) => g.name)).toEqual(
                    []
                );
            });
            const screen = render(
                <GroupSelect
                    selectedGroups={[adminGroup, elternGroup, lehrerGroup]}
                    onSelectGroups={callback}
                />,
                {}
            );

            const selection = await screen.findByLabelText(/alle sichtbar/i);

            userEvent.click(selection);

            await waitFor(() => {
                expect(callback).toHaveBeenCalled();
            });
        });

        it('should not show element when hidePublicGroupSelection prop is given', () => {
            const screen = render(
                <GroupSelect
                    hidePublicGroupSelection
                    selectedGroups={[]}
                    onSelectGroups={() => {}}
                />,
                {}
            );
            expect(screen.queryByLabelText(/alle sichtbar/i)).toBeNull();
        });

        it('should change the elements description when publicGroupSelectionLabel is given', () => {
            const screen = render(
                <GroupSelect
                    publicGroupSelectionLabel={'Keine Gruppen'}
                    selectedGroups={[]}
                    onSelectGroups={() => {}}
                />,
                {}
            );
            expect(
                screen.queryByLabelText(/keine gruppen/i)
            ).toBeInTheDocument();
        });
    });

    describe('selection display', () => {
        it('should show selected group if one is selected', async () => {
            const screen = render(
                <GroupSelect
                    selectedGroups={[adminGroup]}
                    onSelectGroups={() => {}}
                />,
                {}
            );

            const selection = await screen.findByTestId('GroupSelectSelection');

            expect(selection).toHaveTextContent(/Administrator/i);
        });

        it('should show selected groups (in order) if multiple are selected', async () => {
            const screen = render(
                <GroupSelect
                    selectedGroups={[lehrerGroup, schuelerGroup, adminGroup]}
                    onSelectGroups={() => {}}
                />,
                {}
            );

            const selection = await screen.findByTestId('GroupSelectSelection');

            expect(selection).toHaveTextContent(/AdministratorLehrerSchüler/i);
        });
    });

    describe('should manipulate selected groups', () => {
        it('should send deselection request when clicking on group\'s "X"', async () => {
            const callback = jest.fn((newGroups) => {
                expect(newGroups.map((g: UserGroupModel) => g.name)).toEqual([
                    'Administrator',
                    'Lehrer',
                ]);
            });
            const screen = render(
                <GroupSelect
                    selectedGroups={[lehrerGroup, schuelerGroup, adminGroup]}
                    onSelectGroups={callback}
                />,
                {}
            );

            userEvent.click(
                await screen.findByLabelText('Gruppe "Schüler" entfernen')
            );

            await waitFor(() => {
                expect(callback).toHaveBeenCalled();
            });
        });
    });

    describe('listbox options', () => {
        it('should provide all groups as options when clicking into the input field', async () => {
            const screen = render(
                <GroupSelect selectedGroups={[]} onSelectGroups={() => {}} />,
                {}
            );

            userEvent.click(
                await screen.findByPlaceholderText(/gruppe suchen/i)
            );

            expect(
                screen.getByRole('option', { name: 'Administrator' })
            ).toBeVisible();
            expect(
                screen.getByRole('option', { name: 'Lehrer' })
            ).toBeVisible();
            expect(
                screen.getByRole('option', { name: 'Eltern' })
            ).toBeVisible();
            expect(
                screen.getByRole('option', { name: 'Schüler' })
            ).toBeVisible();

            await screen.findByRole('listbox');
        });

        it('should filter the groups when entering text into the search field', async () => {
            const screen = render(
                <GroupSelect selectedGroups={[]} onSelectGroups={() => {}} />,
                {}
            );

            userEvent.type(await screen.findByRole('textbox'), 'Schü');

            await waitFor(() => {
                expect(screen.getByRole('listbox')).toBeVisible();
            });

            await waitFor(() => {
                expect(
                    screen.queryByRole('option', { name: 'Administrator' })
                ).toBeNull();
            });

            expect(screen.queryByRole('option', { name: 'Lehrer' })).toBeNull();
            expect(screen.queryByRole('option', { name: 'Eltern' })).toBeNull();
            expect(
                screen.queryByRole('option', { name: 'Schüler' })
            ).toBeVisible();
        });

        it('should reset the search filter when searchfield is blurred', async () => {
            const screen = render(
                <GroupSelect selectedGroups={[]} onSelectGroups={() => {}} />,
                {}
            );

            const textbox = screen.getByRole('textbox');
            userEvent.type(textbox, 'Schü');

            await waitFor(() => {
                expect(screen.queryByRole('listbox')).toBeVisible();
            });

            userEvent.tab();

            await waitFor(() => {
                expect(screen.getByRole('textbox')).toHaveValue('');
            });
            await waitFor(() => {
                expect(screen.queryByRole('listbox')).toBeNull();
            });
        });

        it('should show selected options with a checkmark', async () => {
            const screen = render(
                <GroupSelect
                    selectedGroups={[lehrerGroup]}
                    onSelectGroups={() => {}}
                />,
                {}
            );

            userEvent.click(
                await screen.findByPlaceholderText(/gruppe suchen/i)
            );

            const selectedOption = screen.getByRole('option', {
                name: 'Lehrer',
                selected: true,
            });
            expect(selectedOption).not.toBeNull();
            expect(selectedOption).toBeVisible();
        });

        describe('selecting a group', () => {
            const secondAdminGroup: UserGroupModel = {
                id: '87',
                insertedAt: '2020-09-11 00:00',
                updatedAt: '2020-09-11 00:00',
                name: 'Administrator2',
                sortKey: 1500,
                isAdminGroup: true,
                enrollmentTokens: [],
            };

            it('should select a group after having clicked on it', async () => {
                const callback = jest.fn((groups) => {
                    expect(groups.map((g: UserGroupModel) => g.name)).toEqual([
                        'Administrator',
                        'Lehrer',
                        'Schüler',
                    ]);
                });

                const screen = render(
                    <GroupSelect
                        selectedGroups={[adminGroup, lehrerGroup]}
                        onSelectGroups={callback}
                    />,
                    {},
                    { userGroups: [...userGroups, secondAdminGroup] }
                );

                userEvent.click(await screen.findByRole('textbox'));

                await waitFor(() => {
                    expect(screen.getByRole('listbox')).toBeVisible();
                });
                const selectedOption = screen.getByRole('option', {
                    name: 'Schüler',
                    selected: false,
                });

                userEvent.click(selectedOption);

                await waitFor(() => {
                    expect(callback).toHaveBeenCalled();
                });
            });

            it('should select only all admin groups after having clicked on one', async () => {
                const callback = jest.fn((groups) => {
                    expect(groups.map((g: UserGroupModel) => g.name)).toEqual([
                        'Administrator',
                        'Administrator2',
                    ]);
                });

                const screen = render(
                    <GroupSelect
                        selectedGroups={[lehrerGroup]}
                        onSelectGroups={callback}
                    />,
                    {},
                    { userGroups: [...userGroups, secondAdminGroup] }
                );

                userEvent.click(await screen.findByRole('textbox'));

                await waitFor(() => {
                    expect(screen.getByRole('listbox')).toBeVisible();
                });
                const selectedOption = screen.getByRole('option', {
                    name: 'Administrator',
                    selected: false,
                });

                userEvent.click(selectedOption);

                await waitFor(() => {
                    expect(callback).toHaveBeenCalled();
                });
            });

            it('should deselect a selected non-admin group after having clicked on it', async () => {
                const callback = jest.fn((groups) => {
                    expect(groups.map((g: UserGroupModel) => g.name)).toEqual([
                        'Administrator',
                    ]);
                });

                const screen = render(
                    <GroupSelect
                        selectedGroups={[adminGroup, lehrerGroup]}
                        onSelectGroups={callback}
                    />,
                    {},
                    { userGroups: [...userGroups, secondAdminGroup] }
                );

                userEvent.click(await screen.findByRole('textbox'));

                await waitFor(() => {
                    expect(screen.getByRole('listbox')).toBeVisible();
                });

                const selectedOption = screen.getByRole('option', {
                    name: 'Lehrer',
                    selected: true,
                });

                userEvent.click(selectedOption);

                await waitFor(() => {
                    expect(callback).toHaveBeenCalled();
                });
            });

            it('should deselect all selected groups after having clicked on a selected admin group', async () => {
                const callback = jest.fn((groups) => {
                    expect(groups.map((g: UserGroupModel) => g.name)).toEqual(
                        []
                    );
                });

                const screen = render(
                    <GroupSelect
                        selectedGroups={[adminGroup, lehrerGroup]}
                        onSelectGroups={callback}
                    />,
                    {},
                    { userGroups: [...userGroups, secondAdminGroup] }
                );

                userEvent.click(await screen.findByRole('textbox'));

                await waitFor(() => {
                    expect(screen.getByRole('listbox')).toBeVisible();
                });

                const selectedOption = screen.getByRole('option', {
                    name: 'Administrator',
                    selected: true,
                });

                userEvent.click(selectedOption);

                await waitFor(() => {
                    expect(callback).toHaveBeenCalled();
                });
            });

            describe('with disableGroupExclusivity enabled', () => {
                it('should select a group after having clicked on it', async () => {
                    const callback = jest.fn((groups) => {
                        expect(
                            groups.map((g: UserGroupModel) => g.name)
                        ).toEqual(['Administrator', 'Lehrer', 'Schüler']);
                    });

                    const screen = render(
                        <GroupSelect
                            disableAdminGroupsExclusivity
                            selectedGroups={[adminGroup, lehrerGroup]}
                            onSelectGroups={callback}
                        />,
                        {}
                    );

                    userEvent.click(await screen.findByRole('textbox'));

                    await waitFor(() => {
                        expect(screen.getByRole('listbox')).toBeVisible();
                    });

                    const selectedOption = screen.getByRole('option', {
                        name: 'Schüler',
                        selected: false,
                    });

                    userEvent.click(selectedOption);

                    await waitFor(() => {
                        expect(callback).toHaveBeenCalled();
                    });
                });

                it('should deselect a selected group after having clicked on it', async () => {
                    const callback = jest.fn((groups) => {
                        expect(
                            groups.map((g: UserGroupModel) => g.name)
                        ).toEqual(['Lehrer']);
                    });

                    const screen = render(
                        <GroupSelect
                            disableAdminGroupsExclusivity
                            selectedGroups={[adminGroup, lehrerGroup]}
                            onSelectGroups={callback}
                        />,
                        {}
                    );

                    userEvent.click(await screen.findByRole('textbox'));

                    await waitFor(() => {
                        expect(screen.getByRole('listbox')).toBeVisible();
                    });

                    const selectedOption = screen.getByRole('option', {
                        name: 'Administrator',
                        selected: true,
                    });

                    userEvent.click(selectedOption);

                    await waitFor(() => {
                        expect(callback).toHaveBeenCalled();
                    });
                });
            });
        });
    });
});
