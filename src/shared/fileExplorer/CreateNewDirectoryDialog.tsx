import * as React from 'react';
import { useMutation } from '@apollo/client';
import { DirectoryModel, FileModel, ID } from 'model';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    ErrorMessage,
    Input,
    Label,
} from '@lotta-schule/hubert';
import { User } from 'util/model';
import { useCurrentUser } from 'util/user/useCurrentUser';

import CreateDirectoryMutation from 'api/mutation/CreateDirectoryMutation.graphql';
import GetDirectoriesAndFilesQuery from 'api/query/GetDirectoriesAndFiles.graphql';

export interface CreateNewFolderDialogProps {
    basePath?: ({ id: null } | { id: ID; name: string })[];
    open: boolean;
    onRequestClose(): void;
}

export const CreateNewDirectoryDialog = React.memo<CreateNewFolderDialogProps>(
    ({ basePath, open, onRequestClose }) => {
        const parentDirectoryId = basePath?.[basePath.length - 1].id ?? null;
        const currentUser = useCurrentUser();
        const [name, setName] = React.useState('');
        const [isPublic, setIsPublic] = React.useState(false);
        React.useEffect(() => {
            if (open) {
                setIsPublic(false);
            }
        }, [open]);
        const [createDirectory, { error, loading: isLoading }] = useMutation<{
            directory: DirectoryModel;
        }>(CreateDirectoryMutation, {
            variables: { name, parentDirectoryId, isPublic },
            update: (cache, { data }) => {
                const cached = cache.readQuery<{
                    directories: DirectoryModel[];
                    files: FileModel[];
                }>({
                    query: GetDirectoriesAndFilesQuery,
                    variables: { parentDirectoryId },
                });
                cache.writeQuery({
                    query: GetDirectoriesAndFilesQuery,
                    variables: { parentDirectoryId },
                    data: {
                        directories: [
                            ...(cached?.directories ?? []),
                            data!.directory,
                        ],
                        files: cached?.files ?? [],
                    },
                });
            },
            onCompleted: () => {
                onRequestClose();
            },
        });

        return (
            <Dialog
                open={open}
                onRequestClose={onRequestClose}
                title={'Neuen Ordner erstellen'}
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        createDirectory();
                    }}
                >
                    <DialogContent>
                        <p>
                            W??hle einen Namen f??r den Ordner, den du erstellen
                            m??chtest.
                        </p>
                        <ErrorMessage error={error} />
                        <Label label={'Name des Ordners'}>
                            <Input
                                autoFocus
                                onChange={({ currentTarget }) =>
                                    setName(currentTarget.value)
                                }
                            />
                        </Label>
                        {User.isAdmin(currentUser) &&
                            basePath?.slice(-1)[0].id === null && (
                                <Checkbox
                                    isSelected={isPublic}
                                    onChange={setIsPublic}
                                >
                                    Diesen Ordner f??r alle registrierten Nutzer
                                    sichtbar machen. Administratoren d??rfen
                                    ??ffentliche Ordner bearbeiten.
                                </Checkbox>
                            )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => onRequestClose()}>
                            Abbrechen
                        </Button>
                        <Button type={'submit'} disabled={isLoading}>
                            Ordner erstellen
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        );
    }
);
CreateNewDirectoryDialog.displayName = 'CreateNewDirectoryDialog';
