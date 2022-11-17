import * as React from 'react';
import { render, waitFor } from 'test/util';
import { SomeUser, SomeUserin } from 'test/fixtures';
import { ComposeMessage } from './ComposeMessage';
import { MessageModel } from 'model';
import userEvent from '@testing-library/user-event';

import SendMessageMutation from 'api/mutation/SendMessageMutation.graphql';

describe('shared/layouts/messagingLayout/ComposeMessage', () => {
    it('should render the shared', () => {
        render(
            <ComposeMessage
                destination={{
                    user: SomeUserin,
                }}
            />
        );
    });

    it('should auto focus input field', async () => {
        const screen = render(
            <ComposeMessage
                destination={{
                    user: SomeUserin,
                }}
            />
        );
        expect(screen.queryByRole('textbox')).toBeVisible();
        await waitFor(() => {
            expect(screen.queryByRole('textbox')).toHaveFocus();
        });
    });

    describe('send form', () => {
        it('should send a user a message', async () => {
            let didCallMutation = false;
            const additionalMocks = [
                {
                    request: {
                        query: SendMessageMutation,
                        variables: {
                            message: {
                                content: 'Hallo!',
                                recipientUser: { id: SomeUserin.id },
                                recipientGroup: undefined,
                            },
                        },
                    },
                    result: () => {
                        didCallMutation = true;
                        return {
                            data: {
                                message: {
                                    id: 1,
                                    content: 'Hallo!',
                                    user: SomeUser,
                                    recipientGroup: null,
                                    insertedAt: new Date().toString(),
                                    updatedAt: new Date().toString(),
                                    conversation: {
                                        id: 99900,
                                        insertedAt: new Date().toString(),
                                        updatedAt: new Date().toString(),
                                        users: [SomeUser, SomeUserin],
                                        groups: [],
                                        messages: [],
                                        unreadMessages: 0,
                                    },
                                },
                            },
                        };
                    },
                },
            ];
            const screen = render(
                <ComposeMessage
                    destination={{
                        user: SomeUserin,
                    }}
                />,
                {},
                { currentUser: SomeUser, additionalMocks }
            );
            await userEvent.type(screen.getByRole('textbox'), 'Hallo!');
            await userEvent.click(screen.getByRole('button'));

            await waitFor(() => {
                expect(didCallMutation).toEqual(true);
            });
            await waitFor(() => {
                expect(screen.getByRole('textbox')).toHaveFocus();
            });
            expect(screen.getByRole('textbox')).toHaveValue('');
        });

        it('should send form on ENTER', async () => {
            let didCallMutation = false;
            const additionalMocks = [
                {
                    request: {
                        query: SendMessageMutation,
                        variables: {
                            message: {
                                content: 'Hallo!',
                                recipientUser: { id: SomeUserin.id },
                                recipientGroup: undefined,
                            },
                        },
                    },
                    result: () => {
                        didCallMutation = true;
                        return {
                            data: {
                                message: {
                                    id: 1,
                                    content: 'Hallo!',
                                    user: SomeUser,
                                    insertedAt: new Date().toString(),
                                    updatedAt: new Date().toString(),
                                    conversation: {
                                        id: 99901,
                                        insertedAt: new Date().toString(),
                                        updatedAt: new Date().toString(),
                                        users: [SomeUser, SomeUserin],
                                        groups: [],
                                        messages: [],
                                        unreadMessages: 0,
                                    },
                                },
                            },
                        };
                    },
                },
            ];
            const onSent = jest.fn((message: MessageModel) => {
                expect(message.id).toEqual(1);
            });
            const screen = render(
                <ComposeMessage
                    destination={{
                        user: SomeUserin,
                    }}
                    onSent={onSent}
                />,
                {},
                { currentUser: SomeUser, additionalMocks }
            );
            await userEvent.type(screen.getByRole('textbox'), 'Hallo!{Enter}');
            await waitFor(() => {
                expect(didCallMutation).toEqual(true);
            });
            expect(onSent).toHaveBeenCalled();
        });

        it('should not send form on ENTER when SHIFT modifier is pressed', async () => {
            const user = userEvent.setup();
            const screen = render(
                <ComposeMessage
                    destination={{
                        user: SomeUserin,
                    }}
                />,
                {},
                { currentUser: SomeUser }
            );
            const textbox = screen.getByRole('textbox');
            await user.type(textbox, 'Hallo!');
            await user.type(textbox, '{Shift>}{Enter}{/Shift}');
            await user.type(textbox, 'Zweite Zeile');
            expect(screen.getByRole('textbox')).toHaveValue(
                'Hallo!\nZweite Zeile'
            );
        });
    });
});
