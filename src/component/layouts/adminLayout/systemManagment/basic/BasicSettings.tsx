import React, { memo, useState } from 'react';
import {
    Card,
    CardContent,
    Grid,
    Link,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TextField,
    Typography,
    makeStyles,
} from '@material-ui/core';
import { SelectFileOverlay } from 'component/edit/SelectFileOverlay';
import { PlaceholderImage } from 'component/placeholder/PlaceholderImage';
import { ErrorMessage } from 'component/general/ErrorMessage';
import { useSystem } from 'util/client/useSystem';
import { useMutation } from '@apollo/client';
import { UpdateSystemMutation } from 'api/mutation/UpdateSystemMutation';
import { SaveButton } from 'component/general/SaveButton';
import Img from 'react-cloudimage-responsive';

const useStyles = makeStyles((theme) => ({
    gridContainer: {
        marginBottom: theme.spacing(3),
    },
}));

export const BasicSettings = memo(() => {
    const styles = useStyles();
    const system = useSystem();
    const [title, setTitle] = useState(system.title);
    const [logo, setLogo] = useState(system.logoImageFile);

    const [isShowSuccess, setIsShowSuccess] = useState(false);
    const [updateSystem, { loading: isLoading, error }] = useMutation(
        UpdateSystemMutation,
        {
            onCompleted: () => {
                setIsShowSuccess(true);
                setTimeout(() => setIsShowSuccess(false), 3000);
            },
        }
    );

    return (
        <>
            <ErrorMessage error={error} />
            <Typography variant={'h6'}>Name der Seite</Typography>
            <Grid container className={styles.gridContainer}>
                <Grid item sm={6}>
                    <TextField
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Grid>
            </Grid>

            <Typography variant={'h6'}>Logo der Seite</Typography>
            <Grid container className={styles.gridContainer}>
                <Grid item sm={6}>
                    <Card>
                        <CardContent>
                            <SelectFileOverlay
                                label={'Logo ändern'}
                                onSelectFile={(logo) => setLogo(logo)}
                                allowDeletion
                            >
                                {logo ? (
                                    <Img
                                        operation={'height'}
                                        size={'80'}
                                        src={logo.remoteLocation}
                                    />
                                ) : (
                                    <PlaceholderImage
                                        width={'100%'}
                                        height={80}
                                    />
                                )}
                            </SelectFileOverlay>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item sm={6}>
                    <Typography>
                        Für eine optimale Darstellung sollte das Logo eine Höhe
                        von mindestens 160 Pixeln haben.
                    </Typography>
                </Grid>
            </Grid>

            <Typography variant={'h6'}>Domains</Typography>
            <Grid container className={styles.gridContainer}>
                <Grid item sm={12}>
                    <Table size={'small'}>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <Link href={`https://${system.host}`}>
                                        {system.host}
                                    </Link>
                                </TableCell>
                            </TableRow>
                            {system.customDomains.map((customDomain) => (
                                <TableRow key={customDomain.host}>
                                    <TableCell>
                                        <Link
                                            href={`https://${customDomain.host}`}
                                        >
                                            {customDomain.host}
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>

            <Grid container justify={'flex-end'}>
                <Grid item sm={6} md={4} lg={3}>
                    <SaveButton
                        fullWidth
                        isLoading={isLoading}
                        isSuccess={isShowSuccess}
                        onClick={() =>
                            updateSystem({
                                variables: {
                                    system: {
                                        title,
                                        logoImageFile: logo && { id: logo.id },
                                    },
                                },
                            })
                        }
                    >
                        speichern
                    </SaveButton>
                </Grid>
            </Grid>
        </>
    );
});
