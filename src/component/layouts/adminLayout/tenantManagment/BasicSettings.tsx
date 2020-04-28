import React, { memo, useState } from 'react';
import { Card, CardContent, Grid, Link, Table, TableBody, TableRow, TableCell, TextField, Typography, makeStyles } from '@material-ui/core';
import { SelectFileOverlay } from 'component/edit/SelectFileOverlay';
import { PlaceholderImage } from 'component/placeholder/PlaceholderImage';
import { ErrorMessage } from 'component/general/ErrorMessage';
import { useTenant } from 'util/client/useTenant';
import { Tenant } from 'util/model';
import { useMutation } from '@apollo/client';
import { UpdateTenantMutation } from 'api/mutation/UpdateTenantMutation';
import { SaveButton } from 'component/general/SaveButton';
import Img from 'react-cloudimage-responsive';

const useStyles = makeStyles(theme => ({
    gridContainer: {
        marginBottom: theme.spacing(3),
    }
}));

export const BasicSettings = memo(() => {
    const styles = useStyles();
    const tenant = useTenant();
    const [title, setTitle] = useState(tenant.title);
    const [logo, setLogo] = useState(tenant.logoImageFile);

    const [isShowSuccess, setIsShowSuccess] = useState(false);
    const [updateTenant, { loading: isLoading, error }] = useMutation(UpdateTenantMutation, {
        onCompleted: () => {
            setIsShowSuccess(true);
            setTimeout(() => setIsShowSuccess(false), 3000);
        }
    });

    return (
        <>
            <ErrorMessage error={error} />
            <Typography variant={'h6'}>
                Name der Seite
            </Typography>
            <Grid container className={styles.gridContainer}>
                <Grid item sm={6}>
                    <TextField fullWidth value={title} onChange={e => setTitle(e.target.value)} />
                </Grid>
            </Grid>

            <Typography variant={'h6'}>
                Logo der Seite
            </Typography>
            <Grid container className={styles.gridContainer}>
                <Grid item sm={6}>
                    <Card>
                        <CardContent>
                            <SelectFileOverlay label={'Logo ändern'} onSelectFile={logo => setLogo(logo)} allowDeletion>
                                {logo ? (
                                    <Img operation={'height'} size={'200x80'} src={logo.remoteLocation} />
                                ) : <PlaceholderImage width={'100%'} height={80} />}
                            </SelectFileOverlay>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item sm={6}>
                    <Typography>
                        Für eine optimale Darstellung sollte das Logo eine Höhe von mindestens 160 Pixeln haben.
                    </Typography>
                </Grid>
            </Grid>

            <Typography variant={'h6'}>
                Domains
            </Typography>
            <Grid container className={styles.gridContainer}>
                <Grid item sm={12}>
                    <Table size={'small'}>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <Link href={`https://${Tenant.getLottaDomainHost(tenant)}`}>
                                        {Tenant.getLottaDomainHost(tenant)}
                                    </Link>
                                </TableCell>
                            </TableRow>
                            {tenant.customDomains.map(customDomain => (
                                <TableRow key={customDomain.host}>
                                    <TableCell>
                                        <Link href={`https://${customDomain.host}`}>
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
                        onClick={() => updateTenant({ variables: { tenant: { title, logoImageFile: logo } } })}
                    >
                        speichern
                    </SaveButton>
                </Grid>
            </Grid>
        </>
    );
});