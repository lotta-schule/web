import * as React from 'react';
import { Input } from '../form/input';
import { Button } from '../button';
import { CircularProgress } from '../progress';
import {
  Check,
  Close,
  CloudUpload,
  CreateNewFolder,
  Home,
  KeyboardArrowLeft,
} from '../icon';
import { useBrowserState } from './BrowserStateContext';
import { ActiveUploadsDialog } from './dialogs/ActiveUploadsDialog';
import clsx from 'clsx';

import styles from './Toolbar.module.scss';

export type ToolbarProps = {
  className?: string;
};

export const Toolbar = React.memo(({ className }: ToolbarProps) => {
  const {
    currentPath,
    mode,
    selected,
    onNavigate,
    onSelect,
    createDirectory,
    setCurrentAction,
    isFilePreviewVisible,
    setIsFilePreviewVisible,
    uploadClient,
    canEdit,
  } = useBrowserState();

  const [isActiveUploadsDialogOpen, setIsActiveUploadsDialogOpen] =
    React.useState(false);
  const uploadInputRef = React.useRef<HTMLInputElement>(null);

  const activeDirectoryName = React.useMemo(
    () =>
      [...currentPath].reverse().find((node) => node.type === 'directory')
        ?.name ?? <Home />,
    [selected, currentPath]
  );

  const isUploadAllowed = React.useMemo(() => {
    if (currentPath.length === 0) {
      return false;
    }

    return canEdit(currentPath.at(-1)!);
  }, [currentPath, canEdit]);

  const isDirectoryCreationAllowed = React.useMemo(() => {
    return canEdit(currentPath.at(-1) ?? null);
  }, [currentPath, canEdit]);

  return (
    <div className={clsx(styles.root, className)} role="toolbar">
      <div className={styles.leftContainer}>
        {currentPath.length > 0 && (
          <Button
            icon={<KeyboardArrowLeft />}
            title="Zurück"
            onClick={() => {
              if (isFilePreviewVisible) {
                setIsFilePreviewVisible(false);
              } else {
                onSelect([]);
                onNavigate(currentPath.slice(0, -1));
              }
            }}
          />
        )}
        {activeDirectoryName}
      </div>
      <div className={styles.searchField}>
        <Input placeholder="suchen" />
      </div>
      <div className={styles.rightContainer}>
        {mode === 'view-and-edit' && (
          <>
            {createDirectory !== undefined && isDirectoryCreationAllowed && (
              <Button
                icon={<CreateNewFolder />}
                title="Ordner erstellen"
                onClick={() => {
                  setCurrentAction({
                    type: 'create-directory',
                    path: currentPath,
                  });
                }}
              />
            )}
            {!!uploadClient?.currentUploads.length && (
              <Button
                title={`Es werden ${uploadClient.currentUploads.length} Dateien hochgeladen`}
                label={`Es werden ${uploadClient.currentUploads.length} Dateien hochgeladen (${uploadClient.currentProgress}% Fortschritt)`}
                className={styles.uploadProgressButton}
                icon={
                  uploadClient.hasErrors ? (
                    <Close />
                  ) : uploadClient.isSuccess ? (
                    <Check />
                  ) : uploadClient.currentProgress !== null ? (
                    <CircularProgress
                      value={uploadClient.currentProgress}
                      style={{ width: '1em', height: '1em' }}
                      aria-label={`Der Uploadfortschritt beträgt ${uploadClient.currentProgress}%`}
                    />
                  ) : undefined
                }
                onClick={(e) => {
                  e.preventDefault();
                  setIsActiveUploadsDialogOpen(true);
                }}
              >
                {
                  uploadClient?.currentUploads.filter(
                    ({ status }) => status === 'uploading'
                  ).length
                }
              </Button>
            )}

            {isUploadAllowed && (
              <Button
                icon={<CloudUpload />}
                onClick={() => {
                  if (uploadInputRef.current) {
                    uploadInputRef.current.click();
                  }
                }}
                title="Datei hochladen"
                className={styles.uploadButton}
                onlyIcon
              >
                <input
                  type="file"
                  value={''} // to reset the input after selecting a file
                  ref={uploadInputRef}
                  multiple
                  onChange={(event) => {
                    const parentNode = currentPath.at(-1);

                    if (!parentNode || !uploadClient) {
                      return;
                    }

                    if (!event.target.files) {
                      return;
                    }

                    for (const file of event.target.files) {
                      uploadClient.addFile(file, parentNode);
                    }
                  }}
                />
              </Button>
            )}
          </>
        )}
      </div>
      <ActiveUploadsDialog
        isOpen={isActiveUploadsDialogOpen}
        onRequestClose={() => setIsActiveUploadsDialogOpen(false)}
      />
    </div>
  );
});
Toolbar.displayName = 'Toolbar';
