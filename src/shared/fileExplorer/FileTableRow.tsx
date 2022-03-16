import * as React from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import {
    MoreVert,
    CreateOutlined,
    CloudDownloadOutlined,
    FileCopyOutlined,
    DeleteOutlineOutlined,
} from '@material-ui/icons';
import { FileModel, DirectoryModel } from 'model';
import { Button } from 'shared/general/button/Button';
import { Checkbox } from 'shared/general/form/checkbox';
import { Divider } from 'shared/general/divider/Divider';
import { File } from 'util/model/File';
import { useCurrentUser } from 'util/user/useCurrentUser';
import { FileTableRowFilenameCell } from './FileTableRowFilenameCell';
import { useServerData } from 'shared/ServerDataContext';
import fileExplorerContext, {
    FileExplorerMode,
} from './context/FileExplorerContext';
import uniqBy from 'lodash/uniqBy';
import clsx from 'clsx';

export interface FileTableRowProps {
    file: FileModel;
    onMark(e: React.MouseEvent): void;
}

export const FileTableRow = React.memo<FileTableRowProps>(
    ({ file, onMark }) => {
        const { baseUrl } = useServerData();
        const currentUser = useCurrentUser();
        const [editMenuAnchorEl, setEditMenuAnchorEl] =
            React.useState<null | HTMLElement>(null);
        const [isRenamingFile, setIsRenamingFile] = React.useState(false);
        const [state, dispatch] = React.useContext(fileExplorerContext);

        const handleEditMenuClose = () => {
            setEditMenuAnchorEl(null);
        };

        const handleEditMenuClick = React.useCallback(
            (event: React.MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation();
                setEditMenuAnchorEl(event.currentTarget);
            },
            []
        );

        const handleEditMenuClickRename = React.useCallback(
            (event: React.MouseEvent<HTMLElement>) => {
                event.stopPropagation();
                setEditMenuAnchorEl(null);
                setIsRenamingFile(true);
            },
            []
        );
        const handleEditMenuClickMove = React.useCallback(
            (event: React.MouseEvent<HTMLElement>) => {
                event.stopPropagation();
                setEditMenuAnchorEl(null);
                dispatch({ type: 'showMoveFiles' });
                dispatch({ type: 'setMarkedFiles', files: [file] });
            },
            [dispatch, file]
        );
        const handleEditMenuClickDelete = React.useCallback(
            (event: React.MouseEvent<HTMLElement>) => {
                event.stopPropagation();
                setEditMenuAnchorEl(null);
                dispatch({ type: 'showDeleteFiles' });
                dispatch({ type: 'setMarkedFiles', files: [file] });
            },
            [dispatch, file]
        );

        const isMarked =
            state.markedFiles.find((f) => f.id === file.id) !== undefined;
        const isSelected =
            state.selectedFiles.find((f) => f.id === file.id) !== undefined;

        const filesAreEditable =
            state.mode === FileExplorerMode.ViewAndEdit &&
            File.canEditDirectory(
                state.currentPath[
                    state.currentPath.length - 1
                ] as DirectoryModel,
                currentUser
            );

        return (
            <tr
                className={clsx({ selected: isMarked || isSelected })}
                onClick={onMark}
            >
                <td>
                    {state.mode === FileExplorerMode.SelectMultiple && (
                        <Checkbox
                            isReadOnly
                            aria-label={`Datei ${file.filename} auswählen`}
                            className={'select-file-checkbox'}
                            style={{ padding: 0 }}
                            isSelected={
                                state.selectedFiles.find(
                                    (f) => f.id === file.id
                                ) !== undefined
                            }
                            onChange={(isSelected) => {
                                dispatch({
                                    type: 'setSelectedFiles',
                                    files: isSelected
                                        ? uniqBy(
                                              [...state.selectedFiles, file],
                                              'id'
                                          )
                                        : state.selectedFiles.filter(
                                              (f) => f.id !== file.id
                                          ),
                                });
                            }}
                        />
                    )}
                </td>
                <td>{File.getIconForFile(file)}</td>
                <FileTableRowFilenameCell
                    file={file}
                    isRenaming={isRenamingFile}
                    onCompleteRenaming={() => setIsRenamingFile(false)}
                    onSelect={() => {}}
                />
                {filesAreEditable && (
                    <td>
                        <Button
                            small
                            icon={<MoreVert fontSize="inherit" />}
                            aria-label={'delete'}
                            onClick={handleEditMenuClick}
                        />

                        <Menu
                            anchorEl={editMenuAnchorEl}
                            open={Boolean(editMenuAnchorEl)}
                            onClose={() => handleEditMenuClose()}
                        >
                            {[
                                <MenuItem
                                    key={'download'}
                                    onClick={(e: React.MouseEvent) =>
                                        e.stopPropagation()
                                    }
                                    component={'a'}
                                    href={File.getFileRemoteLocation(
                                        baseUrl,
                                        file
                                    )}
                                    download={file.filename}
                                >
                                    <CloudDownloadOutlined
                                        color={'secondary'}
                                    />
                                    &nbsp;Herunterladen
                                </MenuItem>,
                                <Divider key={'divider-download'} />,
                                <MenuItem
                                    key={'rename'}
                                    onClick={(e) =>
                                        handleEditMenuClickRename(e)
                                    }
                                >
                                    <CreateOutlined color={'secondary'} />
                                    &nbsp;Umbenennen
                                </MenuItem>,
                                <MenuItem
                                    key={'move'}
                                    onClick={(e) => handleEditMenuClickMove(e)}
                                >
                                    <FileCopyOutlined color={'secondary'} />
                                    &nbsp;Verschieben
                                </MenuItem>,
                                <MenuItem
                                    key={'delete'}
                                    onClick={(e) =>
                                        handleEditMenuClickDelete(e)
                                    }
                                >
                                    <DeleteOutlineOutlined
                                        color={'secondary'}
                                    />
                                    &nbsp;Löschen
                                </MenuItem>,
                            ]}
                        </Menu>
                    </td>
                )}
            </tr>
        );
    }
);
FileTableRow.displayName = 'FileTableRow';
