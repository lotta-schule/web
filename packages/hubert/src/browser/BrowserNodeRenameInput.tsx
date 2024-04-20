import * as React from 'react';
import { BrowserPath, useBrowserState } from './BrowserStateContext';
import { Input } from '../form';
import { CircularProgress } from '../progress';

import styles from './BrowserNodeRenameInput.module.scss';
import { Popover } from '../popover/new/Popover';
import { ErrorMessage } from '../message';

export type BrowserNodeRenameInputProps = {
  path: BrowserPath;
  onRequestClose: () => void;
};

export const BrowserNodeRenameInput = React.memo(
  ({ path, onRequestClose }: BrowserNodeRenameInputProps) => {
    const renamingInputRef = React.useRef<HTMLInputElement>(null);
    const node = path.at(-1);

    const [newNodeName, setNewNodeName] = React.useState(node?.name || '');
    const [isLoading, setIsLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const { renameNode } = useBrowserState();

    React.useEffect(() => {
      if (renamingInputRef.current) {
        renamingInputRef.current.focus();
      }
    }, []);

    React.useEffect(() => {
      setErrorMessage(null);
    }, [newNodeName]);

    if (!node) {
      return null;
    }

    return (
      <form
        className={styles.root}
        onSubmit={async (e) => {
          e.preventDefault();
          if (newNodeName.length > 0) {
            setIsLoading(true);
            try {
              await renameNode?.(node, newNodeName);
              onRequestClose();
            } catch (e: any) {
              setErrorMessage(
                e.message || 'Fehler beim Umbenennen des Ordners.'
              );
            } finally {
              setIsLoading(false);
            }
          }
        }}
      >
        <Input
          autoFocus
          ref={renamingInputRef}
          readOnly={isLoading}
          value={newNodeName}
          onBlur={onRequestClose}
          onChange={(e) => setNewNodeName(e.currentTarget.value)}
        />
        <Popover
          isOpen={!!errorMessage}
          placement={'bottom'}
          triggerRef={renamingInputRef}
          onClose={() => setErrorMessage(null)}
        >
          <ErrorMessage error={errorMessage} />
        </Popover>
        {isLoading && (
          <CircularProgress
            className={styles.progress}
            size={'1em'}
            isIndeterminate
          />
        )}
      </form>
    );
  }
);
BrowserNodeRenameInput.displayName = 'BrowserNodeRenameInput';