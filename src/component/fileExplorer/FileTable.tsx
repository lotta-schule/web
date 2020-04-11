import React, { MouseEvent, memo, useContext } from 'react';
import { some, every, uniqBy, range } from 'lodash';
import { Table, TableHead, TableRow, TableCell, TableBody, Theme, Checkbox, CircularProgress, IconButton, fade, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useQuery } from '@apollo/react-hooks';
import { ArrowBackRounded } from '@material-ui/icons';
import { useDropzone } from 'react-dropzone';
import { FileModel, FileModelType, DirectoryModel } from 'model';
import { GetDirectoriesAndFilesQuery } from 'api/query/GetDirectoriesAndFiles';
import { DirectoryTableRow } from './DirectoryTableRow';
import { ErrorMessage } from 'component/general/ErrorMessage';
import { FileTableRow } from './FileTableRow';
import { FileTableFooter } from './FileTableFooter';
import { useCreateUpload } from './context/UploadQueueContext';
import { EmptyDirectoryTableRow } from './EmptyDirectoryTableRow';
import fileExplorerContext, { FileExplorerMode } from './context/FileExplorerContext';
import clsx from 'clsx';

const useStyles = makeStyles<Theme, { filesAreEditable: boolean }>((theme: Theme) => ({
    root: {
        position: 'relative',
        borderColor: '2px solid transparent',
        transition: 'ease-out 250ms all',
        border: '2px dashed transparent',
        outline: 'none'
    },
    isDragActive: {
        backgroundColor: fade(theme.palette.secondary.main, .075),
        border: '2px dashed',
        borderColor: theme.palette.secondary.main,
    },
    dragHelpText: {
        display: 'block',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#333',
        fontSize: '1.2rem',
        textShadow: '1px 1px 4px #f523'
    },
    table: {
        display: 'flex',
        flexDirection: 'column',
        '& thead': {
            display: 'flex',
            width: '100%',
        },
        '& tbody': {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            overflowY: 'scroll',
            height: 600,
            '& tr': {
                cursor: 'pointer'
            }
        },
        '& tr': {
            display: 'flex',
            width: '100%',
            flexShrink: 0,
            boxSizing: 'border-box',
            '&.selected, &.selected:hover': {
                backgroundColor: theme.palette.action.selected
            },
            '& > td, & > th': {
                userSelect: 'none',
                padding: theme.spacing(1),
                boxSizing: 'border-box',
                '&:nth-child(1)': {
                    width: '10%',
                    display: ({ filesAreEditable }) => filesAreEditable ? 'none' : 'initial'
                },
                '&:nth-child(2)': {
                    width: '2em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: 0,
                    paddingBottom: 0
                },
                '&:nth-child(3)': {
                    width: 'auto',
                    flexGrow: 1,
                    flexShrink: 1
                },
                '&:nth-child(4)': {
                    width: '20%'
                },
                '&:nth-child(5)': {
                    width: '3em',
                    paddingTop: 0,
                    paddingBottom: 0
                }
            },
            '& > td': {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flexGrow: 0,
                flexShrink: 0
            }
        }
    }
}));

export const FileTable = memo(() => {
    const [state, dispatch] = useContext(fileExplorerContext);
    const styles = useStyles({ filesAreEditable: state.mode === FileExplorerMode.ViewAndEdit });

    const { data, error, loading: isLoading } = useQuery<{ directories: DirectoryModel[], files: FileModel[] }>(GetDirectoriesAndFilesQuery, {
        variables: {
            parentDirectoryId: state.currentPath[state.currentPath.length - 1].id ?? null
        }
    });
    const files = data?.files ?? [];

    const uploadFile = useCreateUpload();
    const { getRootProps, draggedFiles, isDragAccept, isDragActive } = useDropzone({
        onDrop: files => {
            files.forEach(f => uploadFile(f, state.currentPath[state.currentPath.length - 1] as DirectoryModel));
        },
        disabled: state.currentPath.length < 2,
        multiple: true,
        preventDropOnDocument: true,
        noClick: true
    });

    const isMarked = (file: FileModel) => {
        if (!file) {
            return false;
        }
        return state.markedFiles.findIndex(f => f.id === file.id) > -1;
    };

    const findNearest = (number: number, listOfNumbers: number[]) => {
        return listOfNumbers.reduce((prev: number | null, value) => {
            if (!prev) {
                return value;
            }
            return (Math.abs(value - number) < Math.abs(prev - number)) ? value : prev;
        }, null) as number;
    }

    const toggleFileMarked = (e: MouseEvent, file: FileModel) => {
        e.preventDefault();
        if (isMarked(file)) {
            if (e.metaKey) {
                dispatch({ type: 'setMarkedFiles', files: state.markedFiles.filter(f => f.id !== file.id) });
            } else {
                dispatch({ type: 'markSingleFile', file });
            }
        } else {
            if (e.shiftKey) {
                const fileIndex = files.findIndex(f => f.id === file.id);
                const markedFileIndexes = state.markedFiles.map(file => files.findIndex(f => f.id === file.id));
                const nearestIndex = findNearest(fileIndex, markedFileIndexes);
                const indexesRange = [
                    ...range(Math.min(fileIndex, nearestIndex), Math.max(fileIndex, nearestIndex)),
                    ...(fileIndex > nearestIndex ? [fileIndex] : [])
                ];
                dispatch({ type: 'setMarkedFiles', files: [...state.markedFiles, ...indexesRange.map(findex => files[findex]).filter(f => !isMarked(f))] });
            } else if (e.metaKey) {
                dispatch({ type: 'setMarkedFiles', files: [...state.markedFiles, file] });
            } else {
                dispatch({ type: 'markSingleFile', file });
            }
        }
    };

    return (
        <div {...getRootProps()} className={clsx(styles.root, { [styles.isDragActive]: isDragActive, [styles.isDragAccept]: isDragAccept })}>
            {!isDragAccept && isDragActive && (
                <Typography variant={'caption'} className={styles.dragHelpText}>
                    Dateien hierher ziehen
                </Typography>
            )}
            {isDragAccept && (
                <Typography variant={'caption'} className={styles.dragHelpText}>
                    Loslassen, um {draggedFiles.length} Dateien hochzuladen
                </Typography>
            )}
            <ErrorMessage error={error} />
            <Table size={'small'} className={styles.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            {!isLoading && state.mode === FileExplorerMode.SelectMultiple && ((data?.files?.length ?? 0) > 0) && (
                                <Checkbox
                                    style={{ padding: 0 }}
                                    indeterminate={!every(files.filter(f => f.fileType !== FileModelType.Directory), f => state.selectedFiles.includes(f)) && some(state.selectedFiles, selectedFile => files.includes(selectedFile))}
                                    checked={every(files.filter(f => f.fileType !== FileModelType.Directory), f => state.selectedFiles.includes(f))}
                                    onChange={(e, checked) => {
                                        e.preventDefault();
                                        dispatch({
                                            type: 'setSelectedFiles',
                                            files: checked ?
                                                uniqBy([...state.selectedFiles, ...files], 'id') :
                                                state.selectedFiles.filter(selectedFile => !files.includes(selectedFile))
                                        });
                                    }}
                                />
                            )}
                        </TableCell>
                        <TableCell>
                            {isLoading && <CircularProgress size={'1rem'} />}
                            {!isLoading && state.currentPath.length > 1 && (
                                <IconButton
                                    size={'small'}
                                    onClick={() => dispatch({
                                        type: 'setPath',
                                        path: state.currentPath.slice(0, state.currentPath.length - 1)
                                    })}
                                >
                                    <ArrowBackRounded />
                                </IconButton>
                            )}
                        </TableCell>
                        <TableCell>
                            {!isLoading && state.currentPath.length < 2 && <strong>Wähle einen Ordner</strong>}
                            {state.currentPath.length > 1 && 'Dateiname'}
                        </TableCell>
                        <TableCell>{state.currentPath.length > 1 && 'Dateigröße'}</TableCell>
                        {state.mode === FileExplorerMode.ViewAndEdit && <TableCell>&nbsp;</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {[...(data?.directories ?? [])].sort((d1, d2) => d1.name.localeCompare(d2.name)).map(directory => (
                        <DirectoryTableRow
                            key={`dir-${directory.id}`}
                            directory={directory}
                        />
                    ))}
                    {[...(data?.files ?? [])].sort((f1, f2) => f1.filename.localeCompare(f2.filename)).map(file => (
                        <FileTableRow
                            key={`file-${file.id}`}
                            file={file}
                            onMark={e => {
                                if (state.mode === FileExplorerMode.Select) {
                                    dispatch({ type: 'setSelectedFiles', files: [file] });
                                } else if (state.mode === FileExplorerMode.SelectMultiple) {
                                    dispatch({ type: 'setSelectedFiles', files: uniqBy([...state.selectedFiles, file], 'id') });
                                } else {
                                    toggleFileMarked(e, file);
                                }
                            }}
                        />
                    ))}
                    {state.currentPath.length > 1 && data?.files.length === 0 && data?.directories.length === 0 && (
                        <EmptyDirectoryTableRow />
                    )}
                </TableBody>
            </Table>
            <FileTableFooter />
        </div>
    );
});
