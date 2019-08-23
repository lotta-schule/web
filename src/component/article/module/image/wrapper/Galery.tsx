import React, { FunctionComponent, memo, useState } from 'react';
import { ContentModuleModel, FileModel } from 'model';
import { ImageImage } from '../ImageImage';
import { Grid, makeStyles, IconButton } from '@material-ui/core';
import { SelectFileButton } from 'component/edit/SelectFileButton';
import { ImageOverlay } from '../imageOverlay/ImageOverlay';
import { Delete } from '@material-ui/icons';

const useStyles = makeStyles(() => ({
    img: {
        '& img': {
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
        }
    },
    deleteButton: {
        position: 'absolute',
        right: '1.5em',
        top: '.5em',
        zIndex: 1000
    }
}));

export interface GaleryProps {
    contentModule: ContentModuleModel;
    isEditModeEnabled: boolean;
    onUpdateModule(contentModule: ContentModuleModel): void;
}

export const Galery: FunctionComponent<GaleryProps> = memo(({ contentModule, isEditModeEnabled, onUpdateModule }) => {
    const styles = useStyles();
    const [selectedFile, setSelectedFile] = useState<FileModel | null>(null);
    let imageCaptions: (string | null)[] = [];
    try {
        if (!contentModule.text) {
            throw new Error('No Text');
        }
        imageCaptions = JSON.parse(contentModule.text);
    } catch {
        imageCaptions = contentModule.text ? [contentModule.text] : [];
    }
    return (
        <>
            <Grid container>
                {contentModule.files.map((file, index) => (
                    <Grid item xs={6} lg={4} key={file.id} style={{ position: 'relative' }}>
                        {isEditModeEnabled && (
                            <IconButton
                                color={'secondary'}
                                className={styles.deleteButton}
                                onClick={() => {
                                    const captions = Array.from(new Array(contentModule.files.length - imageCaptions.length)).map(() => '');
                                    captions.splice(index, 1);
                                    onUpdateModule({
                                        ...contentModule,
                                        files: contentModule.files.filter(f => f.id !== file.id),
                                        text: JSON.stringify(captions)
                                    })
                                }}
                            >
                                <Delete />
                            </IconButton>
                        )}
                        <ImageImage
                            isEditModeEnabled={isEditModeEnabled}
                            file={file}
                            caption={imageCaptions[index] || ''}
                            onUpdateFile={newFile => onUpdateModule({
                                ...contentModule,
                                files: contentModule.files.map((f, i) => i === index ? newFile : f)
                            })}
                            onUpdateCaption={newCaption => {
                                onUpdateModule({
                                    ...contentModule,
                                    text: JSON.stringify(
                                        imageCaptions.concat(
                                            Array.from(new Array(contentModule.files.length - imageCaptions.length)).map(() => '')
                                        ).map((f, i) => i === index ? newCaption : f)
                                    )
                                });
                            }}
                            onSelect={() => setSelectedFile(file)}
                            size={'350x200'}
                            width={350}
                            height={200}
                            operation={'fit'}
                            ratio={1.75}
                            className={styles.img}
                        />
                    </Grid>
                ))}
            </Grid>
            {isEditModeEnabled && <SelectFileButton label={'Bild hinzufügen'} onSelectFiles={f => onUpdateModule({ ...contentModule, files: contentModule.files.concat(f) })} />}
            {!isEditModeEnabled && selectedFile !== null && (
                <ImageOverlay selectedFile={selectedFile} onClose={() => setSelectedFile(null)} />
            )}
        </>
    );
});