import React, { FunctionComponent, memo } from 'react';
import {
    makeStyles, Theme, Paper, Typography, TextField, Grid, CardMedia, Fab
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
    headlines: {
        marginBottom: theme.spacing(2),
    },
    margintop: {
        marginTop: theme.spacing(3),
    }
}));

export const ClientManagement: FunctionComponent = memo(() => {
    const styles = useStyles();

    return (
        <Paper className={styles.root}>
            <Typography variant="h4" className={styles.headlines}>
                Mein Lotta
            </Typography>
            <Typography className={styles.margintop}>
                <b>Name der Seite</b>
            </Typography>
            <TextField
                defaultValue="Webseiten-Name"
                margin='dense'
                style={{ width: '50%', }}
            />
            <Typography className={styles.margintop}>
                <b>Seiten-Logo ändern</b>
            </Typography>
            <Grid container style={{ display: 'flex' }}>
                <Grid item sm={3}>
                    <CardMedia
                        style={{ height: 80, margin: '0.5em', }}
                        image="https://placeimg.com/200/80/any"
                    />
                </Grid>
                <Grid item >
                    <Fab color="secondary" aria-label="Edit" size="small" className={styles.margintop}>
                        <Edit />
                    </Fab>
                </Grid>
                <Grid item sm={4}>
                    <Typography className={styles.margintop}>
                        Das Logo sollte wird eine feste Höhe von 80px haben.
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
});