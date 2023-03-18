'use client';

import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFile,
    faFileAudio,
    faFileImage,
    faFileVideo,
    faFilePdf,
} from '@fortawesome/free-regular-svg-icons';
import { Tooltip } from '@lotta-schule/hubert/src/util/tooltip/Tooltip';
import { FileModel, FileModelType } from 'model';

export type FileIconProps = {
    file: FileModel;
};

export const FileIcon = React.memo(
    ({ file }: FileIconProps) => {
        switch (file.fileType) {
            case FileModelType.Pdf:
                return (
                    <Tooltip label={'PDF-Dokument'}>
                        <div style={{ width: '100%' }}>
                            <FontAwesomeIcon icon={faFilePdf} />
                        </div>
                    </Tooltip>
                );
            case FileModelType.Audio:
                return (
                    <Tooltip label={'Audio'}>
                        <div style={{ width: '100%' }}>
                            <FontAwesomeIcon icon={faFileAudio} />
                        </div>
                    </Tooltip>
                );
            case FileModelType.Image:
                return (
                    <Tooltip label={'Bild'}>
                        <div style={{ width: '100%' }}>
                            <FontAwesomeIcon icon={faFileImage} />
                        </div>
                    </Tooltip>
                );
            case FileModelType.Video:
                return (
                    <Tooltip label={'Video'}>
                        <div style={{ width: '100%' }}>
                            <FontAwesomeIcon icon={faFileVideo} />
                        </div>
                    </Tooltip>
                );
            default:
                return (
                    <Tooltip label={'Datei'}>
                        <div style={{ width: '100%' }}>
                            <FontAwesomeIcon icon={faFile} />
                        </div>
                    </Tooltip>
                );
        }
    },
    (prevProps, nextProps) => prevProps.file.id === nextProps.file.id
);
