import * as React from 'react';
import { useMutation } from '@apollo/client';
import { DirectoryModel, FileModel } from 'model';
import { Button, ErrorMessage } from '@lotta-schule/hubert';
import fileExplorerContext, {
  FileExplorerMode,
} from './context/FileExplorerContext';
import DeleteDirectoryMutation from 'api/mutation/DeleteDirectoryMutation.graphql';
import GetDirectoriesAndFilesQuery from 'api/query/GetDirectoriesAndFiles.graphql';
import { Icon } from 'shared/Icon';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

import styles from './EmptyDirectoryTableRow.module.scss';

export const EmptyDirectoryTableRow = React.memo(() => {
  const [state, dispatch] = React.useContext(fileExplorerContext);

  const [deleteDirectory, { error, loading: isLoading }] = useMutation(
    DeleteDirectoryMutation,
    {
      variables: { id: state.currentPath.slice(-1)[0].id },
      update: (client, { data }) => {
        if (data?.directory) {
          const cache = client.readQuery<{
            files: FileModel[];
            directories: DirectoryModel[];
          }>({
            query: GetDirectoriesAndFilesQuery,
            variables: {
              parentDirectoryId: data.directory.parentDirectory?.id ?? null,
            },
          });
          client.writeQuery({
            query: GetDirectoriesAndFilesQuery,
            variables: {
              parentDirectoryId: data.directory.parentDirectory?.id ?? null,
            },
            data: {
              files: [...(cache?.files ?? [])],
              directories: cache?.directories.filter(
                (d) => d.id !== data.directory.id
              ),
            },
          });
        }
      },
      onCompleted: () => {
        dispatch({
          type: 'setPath',
          path: state.currentPath.slice(0, state.currentPath.length - 1),
        });
      },
    }
  );

  return (
    <tr className={styles.root}>
      <td
        colSpan={state.mode === FileExplorerMode.ViewAndEdit ? 5 : 4}
        style={{
          textAlign: 'center',
          display: 'table-cell',
          width: '100%',
          whiteSpace: 'normal',
        }}
      >
        <ErrorMessage error={error} />
        <p>
          <em>In diesem Ordner liegen keine Dateien oder Ordner.</em>
        </p>
        <p>
          <em>
            Du kannst Dateien hochladen, indem du sie mit der Maus aus deiner
            Dateiverwaltung in dieses Feld ziehst.
          </em>
        </p>
        <p>
          <Button
            className={styles.deleteButton}
            disabled={isLoading}
            onClick={() => deleteDirectory()}
            variant={'error'}
            icon={
              <Icon
                icon={faTrash}
                className={clsx(styles.leftIcon, styles.iconSmall)}
              />
            }
          >
            Ordner löschen
          </Button>
        </p>
      </td>
    </tr>
  );
});
EmptyDirectoryTableRow.displayName = 'EmptyDirectoryTableRow';
