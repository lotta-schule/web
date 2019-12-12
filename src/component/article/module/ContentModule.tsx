import React, { memo, useState, useCallback } from 'react';
import { ContentModuleModel, ContentModuleType } from '../../../model';
import { Text } from './text/Text';
import { Title } from './title/Title';
import { Config as TitleConfig } from './title/Config';
import { Image } from './image/Image';
import { ImageCollection } from './image_collection/ImageCollection';
import { Config as ImageCollectionConfig } from './image_collection/Config';
import { Video } from './video/Video';
import { Audio } from './audio/Audio';
import { Download } from './download/Download';
import { Draggable, DraggableProvided } from 'react-beautiful-dnd';
import { Card, makeStyles, Theme, createStyles, IconButton, Collapse } from '@material-ui/core';
import { DragHandle, Delete, Settings } from '@material-ui/icons';
import { includes } from 'lodash';
import clsx from 'clsx';
import { ID } from 'model/ID';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            position: 'relative'
        },
        dragbar: {
            height: '2em',
            backgroundColor: theme.palette.grey[200],
            display: 'flex',
            justifyContent: 'space-between',
            '& > span': {
                display: 'flex'
            }
        },
        dragbarButton: {
            padding: '0 5px',
            height: 32,
            width: 32
        },
        dragHandle: {
            marginTop: '0.15em',
            marginLeft: '0.5em',
            color: theme.palette.grey[700]
        },
        buttonIcon: {
            color: theme.palette.grey[700]
        },
        activeButtonIcon: {
            color: theme.palette.primary.main
        },
        configSection: {
            position: 'absolute',
            top: '2.25em',
            left: 0,
            width: '100%',
            zIndex: 1,
            backgroundColor: theme.palette.background.paper
        }
    }),
);

interface ContentModuleProps {
    contentModule: ContentModuleModel;
    index: number;
    isEditModeEnabled?: boolean;
    onUpdateModule(contentModule: ContentModuleModel): void;
    onRemoveContentModule(): void;
}

export const ContentModule = memo<ContentModuleProps>(({ isEditModeEnabled, contentModule, index, onUpdateModule, onRemoveContentModule }) => {

    const styles = useStyles();
    const [showConfigModeContentModuleId, setShowConfigModeContentModuleId] = useState<ID | null>(null);
    const toggleConfigMode = useCallback((id: ID) => {
        if (showConfigModeContentModuleId === id) {
            setShowConfigModeContentModuleId(null);
        } else {
            setShowConfigModeContentModuleId(id);
        }
    }, [showConfigModeContentModuleId]);
    const configurableContentModuleTypes = [ContentModuleType.TITLE, ContentModuleType.IMAGE_COLLECTION];

    const card = (draggableProvided?: DraggableProvided) => (
        <Card
            className={styles.card}
            component={'section'}
            innerRef={draggableProvided && draggableProvided.innerRef}
            {...(draggableProvided ? draggableProvided.draggableProps : undefined)}
        >
            {isEditModeEnabled && (
                <div {...(draggableProvided ? draggableProvided.dragHandleProps : undefined)} className={styles.dragbar}>
                    <span>
                        <DragHandle className={styles.dragHandle} />
                        {includes(configurableContentModuleTypes, contentModule.type) && (
                            <IconButton
                                classes={{ root: styles.dragbarButton }}
                                aria-label="Settings"
                                onClick={() => toggleConfigMode(contentModule.id)}
                            >
                                <Settings className={clsx(styles.buttonIcon, { [styles.activeButtonIcon]: showConfigModeContentModuleId === contentModule.id })} />
                            </IconButton>
                        )}
                    </span>
                    <span>
                        <IconButton
                            color={'primary'}
                            classes={{ root: styles.dragbarButton }}
                            aria-label="Delete"
                            style={{ float: 'right' }}
                            onClick={() => onRemoveContentModule()}
                        >
                            <Delete className={clsx(styles.buttonIcon)} />
                        </IconButton>
                    </span>
                </div>
            )}
            {contentModule.type === ContentModuleType.TITLE && (
                <>
                    <Collapse in={showConfigModeContentModuleId === contentModule.id} className={styles.configSection}>
                        <TitleConfig
                            contentModule={contentModule}
                            onUpdateModule={onUpdateModule}
                            onRequestClose={() => setShowConfigModeContentModuleId(null)}
                        />
                    </Collapse>
                    <Title
                        contentModule={contentModule}
                        isEditModeEnabled={isEditModeEnabled}
                        onUpdateModule={onUpdateModule}
                    />
                </>
            )}
            {contentModule.type === ContentModuleType.TEXT && (
                <Text contentModule={contentModule} isEditModeEnabled={isEditModeEnabled} onUpdateModule={onUpdateModule} />
            )}
            {contentModule.type === ContentModuleType.IMAGE && (
                <Image contentModule={contentModule} isEditModeEnabled={isEditModeEnabled} onUpdateModule={onUpdateModule} />
            )}
            {contentModule.type === ContentModuleType.IMAGE_COLLECTION && (
                <>
                    <Collapse in={showConfigModeContentModuleId === contentModule.id} className={styles.configSection}>
                        <ImageCollectionConfig
                            contentModule={contentModule}
                            onUpdateModule={onUpdateModule}
                            onRequestClose={() => setShowConfigModeContentModuleId(null)}
                        />
                    </Collapse>
                    <ImageCollection
                        contentModule={contentModule}
                        isEditModeEnabled={isEditModeEnabled}
                        onUpdateModule={onUpdateModule}
                    />
                </>
            )}
            {contentModule.type === ContentModuleType.VIDEO && (
                <Video contentModule={contentModule} isEditModeEnabled={isEditModeEnabled} onUpdateModule={onUpdateModule} />
            )}
            {contentModule.type === ContentModuleType.AUDIO && (
                <Audio contentModule={contentModule} isEditModeEnabled={isEditModeEnabled} onUpdateModule={onUpdateModule} />
            )}
            {contentModule.type === ContentModuleType.DOWNLOAD && (
                <Download contentModule={contentModule} isEditModeEnabled={isEditModeEnabled} onUpdateModule={onUpdateModule} />
            )}
        </Card>
    );

    return isEditModeEnabled ?
        (
            <Draggable draggableId={String(contentModule.id)} index={index}>
                {card}
            </Draggable>
        ) : (
            card()
        );
});