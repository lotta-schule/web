'use client';

import * as React from 'react';
import { Tooltip } from '@lotta-schule/hubert';
import { faUser, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faFolder } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DirectoryModel } from 'model';

export type DirectoryIconProps = {
    directory: DirectoryModel;
};

export const DirectoryIcon = React.memo(
    ({ directory }: DirectoryIconProps) => {
        const folderStyle = { fontSize: '1.45em' };
        const innerIconStyle = { fontSize: '.6em' };
        if (!directory.parentDirectory && directory.user) {
            return (
                <Tooltip label={'privater Ordner'}>
                    <span className="fa-layers">
                        <FontAwesomeIcon icon={faFolder} style={folderStyle} />
                        <FontAwesomeIcon icon={faUser} style={innerIconStyle} />
                    </span>
                </Tooltip>
            );
        }
        if (!directory.parentDirectory && !directory.user) {
            return (
                <Tooltip label={'privater Ordner'}>
                    <span className="fa-layers">
                        <FontAwesomeIcon icon={faFolder} style={folderStyle} />
                        <FontAwesomeIcon
                            icon={faGlobe}
                            style={innerIconStyle}
                        />
                    </span>
                </Tooltip>
            );
        }
        return (
            <Tooltip label={'Ordner'}>
                <span>
                    <FontAwesomeIcon icon={faFolder} style={folderStyle} />
                </span>
            </Tooltip>
        );
    },
    (prevProps, nextProps) => prevProps.directory.id === nextProps.directory.id
);
DirectoryIcon.displayName = 'DirectoryIcon';
