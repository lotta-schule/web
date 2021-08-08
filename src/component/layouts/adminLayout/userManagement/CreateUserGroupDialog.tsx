import * as React from 'react';
import {
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@material-ui/core';
import { useMutation } from '@apollo/client';
import { TenantModel, UserGroupModel } from 'model';
import { CreateUserGroupMutation } from 'api/mutation/CreateUserGroupMutation';
import { GetTenantQuery } from 'api/query/GetTenantQuery';
import { ResponsiveFullScreenDialog } from 'component/dialog/ResponsiveFullScreenDialog';
import { ErrorMessage } from 'component/general/ErrorMessage';
import { Button } from 'component/general/button/Button';
import { Label } from 'component/general/label/Label';
import { Input } from 'component/general/form/input/Input';

export interface CreateUserGroupDialogProps {
    isOpen: boolean;
    onAbort(): void;
    onConfirm(group: UserGroupModel): void;
}

export const CreateUserGroupDialog = React.memo<CreateUserGroupDialogProps>(
    ({ isOpen, onAbort, onConfirm }) => {
        const [name, setName] = React.useState('');
        const [createUserGroup, { loading: isLoading, error }] = useMutation<
            { group: UserGroupModel },
            { group: Partial<UserGroupModel> }
        >(CreateUserGroupMutation, {
            update: (cache, { data }) => {
                if (data && data.group) {
                    const readTenantResult = cache.readQuery<{
                        tenant: TenantModel;
                    }>({ query: GetTenantQuery });
                    cache.writeQuery<{ tenant: TenantModel }>({
                        query: GetTenantQuery,
                        data: {
                            tenant: {
                                ...readTenantResult!.tenant,
                                groups: [
                                    ...readTenantResult!.tenant.groups,
                                    data.group,
                                ],
                            },
                        },
                    });
                }
            },
            onCompleted: ({ group }) => {
                onConfirm(group);
            },
        });
        const resetForm = () => {
            setName('');
        };
        return (
            <ResponsiveFullScreenDialog open={isOpen} fullWidth>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        createUserGroup({
                            variables: {
                                group: {
                                    name,
                                },
                            },
                        });
                    }}
                >
                    <DialogTitle>Nutzergruppe erstellen</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Erstelle eine neue Gruppe
                        </DialogContentText>
                        <ErrorMessage error={error} />
                        <Label label="Name der Gruppe:">
                            <Input
                                autoFocus
                                required
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.currentTarget.value)}
                                disabled={isLoading}
                                placeholder="Neue Gruppe"
                            />
                        </Label>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                resetForm();
                                onAbort();
                            }}
                        >
                            Abbrechen
                        </Button>
                        <Button type={'submit'} disabled={!name || isLoading}>
                            Gruppe erstellen
                        </Button>
                    </DialogActions>
                </form>
            </ResponsiveFullScreenDialog>
        );
    }
);
