import React, { FunctionComponent, memo } from 'react';
import { Grid, makeStyles, Container, CardMedia } from '@material-ui/core';
import { Navbar } from './navigation/Navbar';
import { CategoryModel, ClientModel } from '../../model';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import { State } from 'store/State';


const useStyles = makeStyles(() => ({

    header: {
        minWidth: '100%',
        height: 100,
        backgroundSize: 'cover',
        textAlign: 'right',
    },
    main: {
        marginTop: '.5em',
        maxWidth: '100%',
        paddingBottom: '1em'
    }
}));


export const BaseLayout: FunctionComponent = memo(({ children }) => {
    const styles = useStyles();
    const client = useSelector<State, ClientModel>(state => state.client.client!);
    const categories = useSelector<State, CategoryModel[]>(state => state.client.categories);
    return (
        <Container>
            <header className={styles.header}>
                <Grid container style={{ display: 'flex', height: '100%' }}>
                    <Grid item xs={false} sm={3}>
                        <CardMedia
                            style={{ maxHeight: 80, width: '100%', height: '100%', flexShrink: 0, flexGrow: 0, marginTop: 10 }}
                            image="https://placeimg.com/300/80/any"
                        />
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        <Typography variant="h5" gutterBottom style={{ padding: '0.9em', marginBottom: '0' }}>{client.title}</Typography>
                    </Grid>
                </Grid>
            </header>
            <Navbar categories={categories} />
            <main className={styles.main}>
                <Grid container justify={'flex-start'}>
                    {children}
                </Grid>
            </main>
        </Container>
    );
});