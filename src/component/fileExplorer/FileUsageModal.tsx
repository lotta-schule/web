import * as React from 'react';
import {
    Dialog,
    DialogTitle,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
} from '@material-ui/core';
import { Button } from 'component/general/button/Button';
import { OpenInNew } from '@material-ui/icons';
import { useQuery } from '@apollo/client';
import { FileModel, ID, FileModelUsageLocation } from 'model';
import { UserAvatar } from 'component/user/UserAvatar';
import { useCurrentUser } from 'util/user/useCurrentUser';
import { Article, Category, File, User } from 'util/model';
import { useTranslation } from 'react-i18next';
import { useServerData } from 'component/ServerDataContext';
import GetFileDetailsQuery from 'api/query/GetFileDetailsQuery.graphql';
import fileExplorerContext from './context/FileExplorerContext';
import Img from 'react-cloudimage-responsive';

import styles from './FileUsageModal.module.scss';

export const FileUsageModal = React.memo(() => {
    const { baseUrl } = useServerData();
    const { t } = useTranslation();
    const current_user = useCurrentUser();
    const [{ showFileUsage, markedFiles }, dispatch] =
        React.useContext(fileExplorerContext);

    const { data } = useQuery<{ file: FileModel }, { id: ID }>(
        GetFileDetailsQuery,
        {
            variables: { id: markedFiles[0]?.id },
            skip: !showFileUsage || markedFiles.length !== 1 || !markedFiles[0],
        }
    );

    const hasSecondaryAction = (usage: FileModelUsageLocation) =>
        usage.article || usage.category || usage.user?.id === current_user?.id;

    const getSecondaryActionCallback =
        (usage: FileModelUsageLocation) => (_e: React.MouseEvent<any>) => {
            if (usage.user) {
                window.open('/profile');
            }
            if (usage.category) {
                window.open(Category.getPath(usage.category));
            }
            if (usage.article) {
                window.open(Article.getPath(usage.article));
            }
        };

    const getPrimaryTextForUsage = (usage: FileModelUsageLocation) => {
        if (usage.article) {
            return `Artikel: ${usage.article.title}`;
        }
        if (usage.category) {
            return `Kategorie: ${usage.category.title}`;
        }
        if (usage.user) {
            return `Nutzer: ${User.getNickname(usage.user)}`;
        }
        if (usage.tenant) {
            return `SeitenLayout ${usage.tenant.title}`;
        }
        return 'Verwendung unbekannt';
    };

    return (
        <Dialog
            className={styles.root}
            open={showFileUsage && markedFiles.length === 1}
            onClose={() => dispatch({ type: 'hideFileUsage' })}
        >
            <DialogTitle>
                Nutzung der Datei {markedFiles[0]?.filename}
            </DialogTitle>
            <List>
                {data?.file?.usage?.map((usage, i) => (
                    <ListItem key={i}>
                        {usage.article?.previewImageFile && (
                            <ListItemAvatar>
                                <Img
                                    operation={'cover'}
                                    size={'150x100'}
                                    src={File.getFileRemoteLocation(
                                        baseUrl,
                                        usage.article.previewImageFile
                                    )}
                                    alt={`Vorschaubild zu ${usage.article.title}`}
                                />
                            </ListItemAvatar>
                        )}
                        {usage.tenant?.configuration.logoImageFile && (
                            <ListItemAvatar>
                                <Img
                                    operation={'cover'}
                                    size={'150x100'}
                                    src={File.getFileRemoteLocation(
                                        baseUrl,
                                        usage.tenant.configuration.logoImageFile
                                    )}
                                    alt={`Logo von ${usage.tenant.title}`}
                                />
                            </ListItemAvatar>
                        )}
                        {usage.user && (
                            <ListItemAvatar>
                                <UserAvatar user={usage.user} />
                            </ListItemAvatar>
                        )}
                        <ListItemText
                            classes={{
                                root: styles.listItemText,
                                primary: styles.listItemTextLine,
                                secondary: styles.listItemTextLine,
                            }}
                            primary={getPrimaryTextForUsage(usage)}
                            secondary={t(`files.usage.${usage.usage}`)}
                        />
                        {hasSecondaryAction(usage) && (
                            <ListItemSecondaryAction>
                                <Button
                                    onClick={getSecondaryActionCallback(usage)}
                                    icon={<OpenInNew />}
                                />
                            </ListItemSecondaryAction>
                        )}
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
});
FileUsageModal.displayName = 'FileUsageModal';
