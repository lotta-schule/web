import * as React from 'react';
import { Toolbar } from '@material-ui/core';
import { Send } from '@material-ui/icons';
import { Button } from 'component/general/button/Button';
import { ErrorMessage } from 'component/general/ErrorMessage';
import { Input } from 'component/general/form/input/Input';
import { ChatType, MessageModel, ThreadRepresentation } from 'model';
import { useMutation } from '@apollo/client';
import SendMessageMutation from 'api/mutation/SendMessageMutation.graphql';
import GetMessagesQuery from 'api/query/GetMessagesQuery.graphql';

import styles from './ComposeMessage.module.scss';

export interface ComposeMessageProps {
    threadRepresentation: ThreadRepresentation;
}

export const ComposeMessage = React.memo<ComposeMessageProps>(
    ({ threadRepresentation }) => {
        const inputRef = React.useRef<HTMLInputElement>(null);
        const [content, setContent] = React.useState('');

        React.useEffect(() => {
            setContent('');
            inputRef.current?.focus();
        }, [threadRepresentation]);

        React.useEffect(() => {
            if (content === '') {
                inputRef.current?.focus();
            }
        }, [content]);

        const [createMessage, { loading: isLoading, error }] = useMutation<{
            message: Partial<MessageModel>;
        }>(SendMessageMutation, {
            errorPolicy: 'all',
            variables: {
                message: {
                    content,
                    recipientUser:
                        threadRepresentation.messageType ===
                        ChatType.DirectMessage
                            ? { id: threadRepresentation.counterpart.id }
                            : undefined,
                    recipientGroup:
                        threadRepresentation.messageType === ChatType.GroupChat
                            ? { id: threadRepresentation.counterpart.id }
                            : undefined,
                },
            },
            update: (cache, { data }) => {
                if (data && data.message) {
                    const readMessagesResult = cache.readQuery<{
                        messages: MessageModel[];
                    }>({ query: GetMessagesQuery });
                    cache.writeQuery({
                        query: GetMessagesQuery,
                        data: {
                            messages: [
                                ...(readMessagesResult?.messages.filter(
                                    (msg) => msg.id !== data.message.id
                                ) ?? []),
                                data.message,
                            ],
                        },
                    });
                }
            },
            onCompleted: () => {
                setContent('');
            },
        });

        const onSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            createMessage();
        };
        const onKeypress = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                createMessage();
            }
        };
        return (
            <Toolbar className={styles.root}>
                <form className={styles.form} onSubmit={onSubmit}>
                    <div>
                        <Input
                            multiline
                            ref={inputRef}
                            className={styles.textField}
                            label={'Nachricht schreiben'}
                            disabled={isLoading}
                            value={content}
                            onChange={(e) => setContent(e.currentTarget.value)}
                            onKeyPress={onKeypress}
                        />
                        {!!error && <ErrorMessage error={error} />}
                    </div>
                    <Button
                        className={styles.button}
                        type={'submit'}
                        disabled={isLoading}
                        icon={<Send />}
                    />
                </form>
            </Toolbar>
        );
    }
);
