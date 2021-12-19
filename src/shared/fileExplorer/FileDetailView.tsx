import * as React from 'react';
import { Tooltip } from '@material-ui/core';
import { useQuery } from '@apollo/client';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { FileModel, ID } from 'model';
import { File, User } from 'util/model';
import { FileSize } from 'util/FileSize';
import { UserAvatar } from 'shared/userAvatar/UserAvatar';
import { ErrorMessage } from 'shared/general/ErrorMessage';
import { useTranslation } from 'react-i18next';
import { useServerData } from 'shared/ServerDataContext';
import GetFileDetailsQuery from 'api/query/GetFileDetailsQuery.graphql';
import fileExplorerContext from './context/FileExplorerContext';

import styles from './FileDetailView.module.scss';

export interface FileDetailViewProps {
    file: FileModel;
}

export const FileDetailView = React.memo<FileDetailViewProps>(({ file }) => {
    const { baseUrl } = useServerData();
    const { t } = useTranslation();
    const [, dispatch] = React.useContext(fileExplorerContext);
    const { data, error } = useQuery<{ file: FileModel }, { id: ID }>(
        GetFileDetailsQuery,
        {
            variables: { id: file.id },
        }
    );

    const get = <T extends any = string>(prop: string): T =>
        // @ts-ignore
        data?.file?.[prop] ?? file[prop];

    return (
        <div className={styles.root}>
            <Tooltip title={get('filename')}>
                <h3 className={styles.filename}>{get('filename')}</h3>
            </Tooltip>
            {File.getPreviewImageLocation(baseUrl, file) && (
                <div className={styles.filePreview}>
                    <img
                        src={File.getPreviewImageLocation(baseUrl, file)!}
                        alt={`Vorschau der Datei ${get('filename')}`}
                        data-testid="PreviewImage"
                    />
                </div>
            )}
            <ErrorMessage error={error} />
            <div style={{ flexGrow: 1 }} />
            <ul className={styles.infoList}>
                <li>
                    <strong>Größe:</strong>
                    <span>
                        {new FileSize(get<number>('filesize')).humanize()}
                    </span>
                </li>
                <li data-testid="DateListItem">
                    <strong>Datum:</strong>
                    <span>
                        {format(new Date(get<Date>('insertedAt')), 'PPP', {
                            locale: de,
                        })}
                    </span>
                </li>
                <li data-testid="TypeListItem">
                    <strong>Typ:</strong>
                    <span>
                        <Tooltip title={file.mimeType}>
                            <span>{t(`files.filetypes.${file.fileType}`)}</span>
                        </Tooltip>
                    </span>
                </li>
                {data?.file?.user && (
                    <li data-testid="AuthorsListItem">
                        <strong>Autor:</strong>
                        <span>
                            <UserAvatar
                                user={data.file.user}
                                size={40}
                                className={styles.userAvatar}
                            />
                            {User.getNickname(data.file.user)}
                        </span>
                    </li>
                )}
                {data?.file?.usage !== undefined && (
                    <li data-testid="UsageListItem">
                        <strong>Verwendung:</strong>
                        <span>
                            {data.file.usage.length}x
                            {data.file.usage.length > 0 && (
                                <>
                                    &nbsp;(
                                    <a
                                        href={'#'}
                                        onClick={() =>
                                            dispatch({ type: 'showFileUsage' })
                                        }
                                    >
                                        ansehen
                                    </a>
                                    )&nbsp;
                                </>
                            )}
                        </span>
                    </li>
                )}
                {!!data?.file?.fileConversions?.length && (
                    <>
                        <li data-testid="FileConversionsListItem">
                            <strong>Umwandlungen: </strong>
                            <span>
                                <Tooltip
                                    title={
                                        <ul>
                                            {data.file.fileConversions.map(
                                                (conversion) => (
                                                    <li key={conversion.id}>
                                                        {conversion.format} -{' '}
                                                        {conversion.mimeType}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    }
                                >
                                    <span>
                                        {t('files.formats', {
                                            count: data.file.fileConversions
                                                .length,
                                        })}
                                    </span>
                                </Tooltip>
                            </span>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
});
FileDetailView.displayName = 'FileDetailView';
