import * as React from 'react';
import { Button } from '@lotta-schule/hubert';
import { UserAvatar } from 'shared/userAvatar/UserAvatar';
import { format } from 'date-fns';
import { faCloudArrowDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useMutation } from '@apollo/client';
import {
  ConversationModel,
  FileModel,
  FileModelType,
  MessageModel,
} from 'model';
import { File, User } from 'util/model';
import { FileSize } from 'util/FileSize';
import { ResponsiveImage } from 'util/image/ResponsiveImage';
import { Icon } from 'shared/Icon';
import { useServerData } from 'shared/ServerDataContext';
import de from 'date-fns/locale/de';
import clsx from 'clsx';

import GetConversationQuery from 'api/query/GetConversationQuery.graphql';
import GetConversationsQuery from 'api/query/GetConversationsQuery.graphql';
import DeleteMessageMutation from 'api/mutation/DeleteMessageMutation.graphql';

import styles from './MessageBubble.module.scss';

export interface MessageBubbleProps {
  active?: boolean;
  message: MessageModel;
}

export const MessageBubble = React.memo(
  ({ active, message }: MessageBubbleProps) => {
    const { baseUrl } = useServerData();
    const [deleteMessage] = useMutation(DeleteMessageMutation, {
      variables: { id: message.id },
      update: (client, { data }) => {
        if (data?.message) {
          let msgConversation: ConversationModel | null = null;
          const getConversationsCache = client.readQuery<{
            conversations: ConversationModel[];
          }>({
            query: GetConversationsQuery,
          });
          client.writeQuery({
            query: GetConversationsQuery,
            data: {
              conversations:
                getConversationsCache?.conversations?.map((conversation) => {
                  if (
                    conversation.messages.find((m) => m.id === data.message.id)
                  ) {
                    msgConversation = conversation;
                  }
                  return {
                    ...conversation,
                    messages: conversation.messages.filter(
                      (m) => m.id !== data.message.id
                    ),
                  };
                }) ?? [],
            },
          });

          if (msgConversation) {
            const getConversationCache = client.readQuery<{
              conversation: ConversationModel;
            }>({
              query: GetConversationQuery,
              variables: {
                id: (msgConversation as ConversationModel).id,
              },
            });
            if (getConversationCache?.conversation) {
              client.writeQuery({
                query: GetConversationQuery,
                data: {
                  conversation: {
                    ...getConversationCache.conversation,
                    messages: getConversationCache.conversation.messages.filter(
                      (m) => m.id !== data.message.id
                    ),
                  },
                },
              });
            }
          }
        }
      },
      optimisticResponse: ({ id }) => {
        return {
          message: {
            __typename: 'Message',
            id,
          },
        };
      },
    });

    const hasPreviewImage = (file: FileModel) => {
      if (file.fileType === FileModelType.Image) {
        return true;
      }
      return false;
    };

    return (
      <div className={clsx(styles.root, { [styles.isActive]: !!active })}>
        <div className={styles.user}>
          <UserAvatar
            user={message.user}
            className={styles.senderUserAvatar}
            size={40}
          />
        </div>
        <div className={styles.messageWrapper}>
          <div className={styles.message}>
            {!!message.files?.length && (
              <div className={styles.files} data-testid="message-attachments">
                {message.files.map((file) => (
                  <div className={styles.file} key={file.id}>
                    {hasPreviewImage(file) && (
                      <div className={styles.previewWrapper}>
                        <ResponsiveImage
                          alt={'Bildvorschau'}
                          width={400}
                          resize={'inside'}
                          sizes={'150px'}
                          style={{}}
                          src={File.getFileRemoteLocation(baseUrl, file)}
                        />
                      </div>
                    )}
                    <span className={styles.filename}>{file.filename}</span>
                    <div className={styles.downloadButton}>
                      <Button
                        href={File.getFileRemoteLocation(
                          baseUrl,
                          file,
                          'download'
                        )}
                        small
                        target={'_blank'}
                        icon={
                          <Icon
                            icon={faCloudArrowDown}
                            className={styles.downloadIcon}
                            size={'lg'}
                          />
                        }
                        role={'link'}
                        title={`${file.filename} herunterladen`}
                      >
                        download
                      </Button>
                    </div>
                    <div className={styles.filesize}>
                      {new FileSize(file.filesize).humanize()}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {message.content && (
              <div className={styles.content}>{message.content}</div>
            )}
          </div>
          <div className={styles.messageInformation}>
            {active && (
              <Button
                small
                icon={<Icon icon={faTrash} />}
                title={'Nachricht löschen'}
                onClick={() => deleteMessage()}
              />
            )}
            <span>
              {!active && <i>{User.getName(message.user)}, </i>}
              {format(new Date(message.insertedAt), 'Pp', {
                locale: de,
              })}
            </span>
          </div>
        </div>
      </div>
    );
  }
);
MessageBubble.displayName = 'MessageBubble';
