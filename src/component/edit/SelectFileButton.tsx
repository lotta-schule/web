import React, { memo, useState, useEffect } from 'react';
import { FileModel } from '../../model';
import { DialogTitle, Button } from '@material-ui/core';
import { FileExplorer, FileExplorerProps } from 'component/fileExplorer/FileExplorer';
import { ButtonProps } from '@material-ui/core/Button';
import { ResponsiveFullScreenDialog } from 'component/dialog/ResponsiveFullScreenDialog';

interface SelectFileButtonProps {
    label: string | JSX.Element;
    buttonComponent?: any;
    buttonComponentProps?: any;
    fileFilter?(file: FileModel): boolean;
    onSelectFile?(file: FileModel): void;
    onSelectFiles?(file: FileModel[]): void;
    onChangeFileExplorerVisibility?(isFileExplorerVisible: boolean): void;
}

export const SelectFileButton = memo<SelectFileButtonProps>(({ label, fileFilter, onSelectFile, onSelectFiles, buttonComponent, buttonComponentProps, onChangeFileExplorerVisibility }) => {
    const [isSelectFileDialogOpen, setIsSelectFileDialogOpen] = useState(false);
    const fileExplorerOptions: Partial<FileExplorerProps> = {};

    useEffect(() => {
        onChangeFileExplorerVisibility?.(isSelectFileDialogOpen);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSelectFileDialogOpen]);

    if (onSelectFile) {
        fileExplorerOptions.onSelectFile = file => {
            setIsSelectFileDialogOpen(false);
            onSelectFile(file);
        };
    }
    if (onSelectFiles) {
        fileExplorerOptions.onSelectFiles = files => {
            setIsSelectFileDialogOpen(false);
            onSelectFiles(files);
        }
    }
    return (
        <>
            {React.createElement<ButtonProps>(buttonComponent || Button, {
                onClick: (e) => {
                    e.preventDefault();
                    setIsSelectFileDialogOpen(true);
                },
                ...buttonComponentProps
            }, label)}
            <ResponsiveFullScreenDialog open={isSelectFileDialogOpen} onClose={() => setIsSelectFileDialogOpen(false)} fullWidth>
                <DialogTitle>Datei auswählen</DialogTitle>
                <FileExplorer
                    style={{ padding: '0 .5em' }}
                    fileFilter={fileFilter}
                    {...fileExplorerOptions}
                />
            </ResponsiveFullScreenDialog>
        </>
    );
});