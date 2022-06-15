import * as React from 'react';
import { HomeOutlined } from '@material-ui/icons';

import styles from './PathViewer.module.scss';

export interface PathViewerProps {}

export const PathViewer = React.memo<PathViewerProps>(() => {
    return (
        <div className={styles.root}>
            <a
                onClick={(e) => {
                    e.preventDefault();
                    alert('HOME');
                }}
            >
                <HomeOutlined />
            </a>
            <div className={styles.paths}>
                /
                <a
                    onClick={(_e) => {
                        alert('click');
                    }}
                >
                    Test1
                </a>
                /
                <a
                    onClick={(_e) => {
                        alert('click');
                    }}
                >
                    Test2
                </a>
            </div>
        </div>
    );
});
PathViewer.displayName = 'PathViewer';
