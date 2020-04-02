import React, { MouseEvent, memo, useState, useCallback, useContext } from 'react';
import { TableRow, TableCell, IconButton, Menu, MenuItem } from '@material-ui/core';
import { MoreVert, CreateOutlined } from '@material-ui/icons';
import { DirectoryModel } from 'model';
import { File } from 'util/model/File';
import { FileTableRowFilenameCell } from './FileTableRowFilenameCell';
import { useCurrentUser } from 'util/user/useCurrentUser';
import fileExplorerContext, { FileExplorerMode } from './context/FileExplorerContext';
import clsx from 'clsx';

export interface FileTableRowProps {
    directory: DirectoryModel;
}

export const DirectoryTableRow = memo<FileTableRowProps>(({ directory }) => {
    const [state, dispatch] = useContext(fileExplorerContext);
    const [currentUser] = useCurrentUser();
    const [editMenuAnchorEl, setEditMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [isRenamingFile, setIsRenamingFile] = useState(false);

    const handleEditMenuClose = () => {
        setEditMenuAnchorEl(null);
    }

    const handleEditMenuClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setEditMenuAnchorEl(event.currentTarget);
    }, []);

    const handleEditMenuClickRename = useCallback((event: MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setEditMenuAnchorEl(null);
        setIsRenamingFile(true);
    }, []);

    const isMarked = state.currentPath[state.currentPath.length - 1].id === directory.id;

    return (
        <TableRow hover className={clsx({ selected: isMarked })}>
            <TableCell>
                {/* checkbox column */}
            </TableCell>
            <TableCell>
                {File.getIconForDirectory(directory)}
            </TableCell>
            <FileTableRowFilenameCell
                directory={directory}
                isRenaming={isRenamingFile}
                onCompleteRenaming={() => setIsRenamingFile(false)}
                onSelect={() => dispatch({ type: 'setPath', path: [...state.currentPath, directory] })}
            />
            <TableCell align="right">&nbsp;</TableCell>
            {state.mode === FileExplorerMode.ViewAndEdit && (
                <TableCell>
                    {File.canEditDirectory(directory, currentUser) && (
                        <>
                            <IconButton aria-label="delete" size="small" onClick={handleEditMenuClick}>
                                <MoreVert fontSize="inherit" />
                            </IconButton>
                            <Menu
                                anchorEl={editMenuAnchorEl}
                                open={Boolean(editMenuAnchorEl)}
                                onClose={() => handleEditMenuClose()}
                            >
                                <MenuItem key={'rename'} onClick={(e) => handleEditMenuClickRename(e)}><CreateOutlined color={'secondary'} />&nbsp;Umbenennen</MenuItem>
                            </Menu>
                        </>
                    )}
                </TableCell>
            )}
        </TableRow >
    );
});