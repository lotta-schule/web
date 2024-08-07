import * as React from 'react';
import { Button, LoadingButton } from '../../button';
import { Dialog, DialogActions, DialogContent } from '../../dialog';
import { ErrorMessage } from '../../message';
import { Label } from '../../label';
import { Input } from '../../form';
import { BrowserNode, useBrowserState } from '../BrowserStateContext';

export interface CreateNewFolderDialogProps {
  parentNode: BrowserNode<'directory'> | null;
  isOpen: boolean;
  onRequestClose(): void;
}

export const CreateNewDirectoryDialog = React.memo(
  ({ parentNode, isOpen, onRequestClose }: CreateNewFolderDialogProps) => {
    const [name, setName] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const { createDirectory } = useBrowserState();

    React.useEffect(() => {
      if (!isOpen) {
        setName('');
        setErrorMessage(null);
      }
    }, [isOpen]);

    return (
      <Dialog
        open={isOpen}
        onRequestClose={onRequestClose}
        title={'Neuen Ordner erstellen'}
      >
        <form>
          <DialogContent>
            <p>Wähle einen Namen für den Ordner, den du erstellen möchtest.</p>
            <ErrorMessage error={errorMessage} />
            <Label label={'Name des Ordners'}>
              <Input
                autoFocus
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setName(event.currentTarget.value)
                }
              />
            </Label>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => onRequestClose()}>Abbrechen</Button>
            <LoadingButton
              type="submit"
              onAction={async () => {
                await createDirectory?.(parentNode, name);
              }}
              onComplete={() => onRequestClose()}
            >
              Ordner erstellen
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
);
CreateNewDirectoryDialog.displayName = 'CreateNewDirectoryDialog';
