import React, { FunctionComponent, memo } from 'react';
import {
    makeStyles, Theme
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
    root: {

    }
}));

export const ClientManagement: FunctionComponent = memo(() => {
    const styles = useStyles();

    return (
        <div className={styles.root}>
            "Mein Lotta" bearbeiten
        </div>
    );
});