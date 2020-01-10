import React, { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FileModel, FileModelType } from 'model';
import { IconButton, InputAdornment, TableCell, TextField, Tooltip, makeStyles, CircularProgress } from '@material-ui/core';
import { Done } from '@material-ui/icons';
import { useMutation } from '@apollo/react-hooks';
import { MoveFileMutation } from 'api/mutation/MoveFileMutation';
import { MoveDirectoryMutation } from 'api/mutation/MoveDirectoryMutation';

export interface FileTableRowFilenameCellProps {
    file: FileModel;
    isRenaming: boolean;
    onCompleteRenaming(): void;
    onSelect(): void;
}

const useStyles = makeStyles(() => ({
    tooltip: {
        backgroundColor: 'transparent'
    }
}));

export const FileTableRowFilenameCell = memo<FileTableRowFilenameCellProps>(({ file, isRenaming, onCompleteRenaming, onSelect }) => {
    const styles = useStyles();
    const [newFilename, setNewFilename] = useState(file.filename);

    const renamingInputRef = useRef<HTMLInputElement>();
    useLayoutEffect(() => {
        if (renamingInputRef.current) {
            renamingInputRef.current.focus();
            renamingInputRef.current.addEventListener('blur', () => {
                onCompleteRenaming();
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [renamingInputRef.current]);

    useEffect(() => {
        setNewFilename(file.filename);
    }, [file.filename, isRenaming]);

    const [moveFile, { loading: isLoadingMoveFile }] = useMutation(MoveFileMutation, {
        variables: {
            id: file.id,
            filename: newFilename
        },
        optimisticResponse: ({ id, filename }) => {
            renamingInputRef.current?.blur();
            return {
                __typename: 'Mutation',
                file: {
                    __typename: 'File',
                    id,
                    filename: filename
                }
            } as any;
        },
        onCompleted: () => {
            onCompleteRenaming();
            renamingInputRef.current?.blur();
        }
    });
    const [moveDirectory, { loading: isLoadingMoveDirectory }] = useMutation(MoveDirectoryMutation, {
        variables: {
            path: file.path,
            isPublic: file.isPublic,
            newPath: file.path.replace(/\/[^/]*$/, `/${newFilename}`)
        },
        onCompleted: () => {
            onCompleteRenaming();
            renamingInputRef.current?.blur();
        }
    });

    const move = () => {
        if (file.fileType === FileModelType.Directory) {
            moveDirectory();
        } else {
            moveFile();
        }
    };

    if (isRenaming) {
        return (
            <TableCell scope="row" padding="none" onClick={() => onSelect()}>
                <form style={{ width: '100%' }} onSubmit={e => {
                    e.preventDefault();
                    if (newFilename.length > 0) {
                        move();
                    }
                }}>
                    <TextField
                        fullWidth
                        inputRef={renamingInputRef}
                        value={newFilename}
                        onChange={e => setNewFilename(e.target.value)}
                        InputProps={{
                            endAdornment: (isLoadingMoveFile || isLoadingMoveDirectory) ? (
                                <InputAdornment position={'end'}>
                                    <CircularProgress style={{ width: '1em', height: '1em' }} />
                                </InputAdornment>
                            ) : (
                                    <InputAdornment position={'end'}>
                                        <IconButton
                                            aria-label="OK"
                                            disabled={newFilename.length < 1}
                                            color={'secondary'}
                                            onMouseDown={e => {
                                                e.preventDefault();
                                                move();
                                            }}
                                        >
                                            <Done />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                        }}
                    />
                </form>
            </TableCell>
        );
    }

    let previewImageUrl: string | null = null;
    if (file.fileType === FileModelType.Image) {
        previewImageUrl = file.remoteLocation;
    } else {
        const imageConversionFile = file.fileConversions?.find(fc => /^storyboard/.test(fc.format));
        if (imageConversionFile) {
            previewImageUrl = imageConversionFile.remoteLocation;
        }
    }

    const tableCell = (
        <TableCell scope="row" padding="none" onClick={e => {
            e.preventDefault();
            onSelect?.();
        }}>
            {file.filename}
        </TableCell>
    );

    if (previewImageUrl) {
        return (
            <Tooltip className={styles.tooltip} title={(
                <img
                    src={`https://afdptjdxen.cloudimg.io/bound/200x200/foil1/${previewImageUrl}`}
                    alt={file.filename}
                />
            )}>
                {tableCell}
            </Tooltip>
        );
    } else {
        return tableCell;
    }
});