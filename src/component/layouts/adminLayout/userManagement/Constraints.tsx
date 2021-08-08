import * as React from 'react';
import {
    Checkbox,
    FormControlLabel,
    Grid,
    Slider,
    Typography,
} from '@material-ui/core';
import { Button } from 'component/general/button/Button';
import { SdStorage } from '@material-ui/icons';
import { useTenant } from 'util/tenant/useTenant';
import { useMutation } from '@apollo/client';
import { UpdateTenantMutation } from 'api/mutation/UpdateTenantMutation';
import { ErrorMessage } from 'component/general/ErrorMessage';
import { animated, useSpring } from 'react-spring';
import { Label } from 'component/general/label/Label';
import { Input } from 'component/general/form/input/Input';

const MEGABYTE = 1024 * 1024;

export const Constraints = React.memo(() => {
    const tenant = useTenant();
    const lastSetLimitRef = React.useRef(20);
    const [value, setValue] = React.useState(
        tenant.configuration.userMaxStorageConfig
            ? parseInt(tenant.configuration.userMaxStorageConfig, 10) / MEGABYTE
            : -1
    );

    const isLimitSet = value >= 0;

    const springProps = useSpring({
        maxHeight: isLimitSet ? '10em' : '0em',
        overflow: 'hidden',
    });

    React.useEffect(() => {
        if (isLimitSet) {
            lastSetLimitRef.current = value;
        }
    }, [isLimitSet, value]);

    const [updateTenant, { loading: isLoading, error }] = useMutation(
        UpdateTenantMutation,
        {
            variables: {
                tenant: {
                    configuration: {
                        ...tenant.configuration,
                        userMaxStorageConfig: String(value * MEGABYTE),
                    },
                },
            },
        }
    );

    return (
        <>
            <Typography variant={'h5'}>Speicherplatz-Beschränkungen</Typography>
            <div>
                <Typography id={`user-storage-limit`} gutterBottom>
                    Freier Speicher für jeden Nutzer
                </Typography>
                <ErrorMessage error={error} />
                <p>
                    <small>
                        Der freie Speicher für jeden Nutzer bestimmt, wie viel
                        persönlicher Speicherplatz jeder Nutzer durch seine
                        Anmeldung zur Verfügung gestellt bekommt.
                    </small>
                </p>
                <p>
                    <small>
                        Er bestimmt neben dem Speicher, den der Nutzer durch
                        seine Gruppen zur Verfügung gestellt bekommt, wie viele
                        Medien Nutzer online vorhalten können.
                    </small>
                </p>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={!isLimitSet}
                            onChange={(_e, checked) =>
                                setValue(checked ? -1 : lastSetLimitRef.current)
                            }
                        />
                    }
                    label={
                        'Datenmenge, die Nutzer hochladen können, nicht begrenzen'
                    }
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isLimitSet}
                            onChange={(_e, checked) =>
                                setValue(checked ? lastSetLimitRef.current : -1)
                            }
                        />
                    }
                    label={
                        'Datenmenge, die Nutzer hochladen können, begrenzen auf:'
                    }
                />
                <animated.div style={springProps}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <SdStorage />
                        </Grid>
                        <Grid item xs>
                            <Slider
                                value={value}
                                onChange={(_e, value) =>
                                    setValue(value as number)
                                }
                                aria-labelledby={'user-storage-limit'}
                                step={50}
                                min={0}
                                max={8192}
                                marks={true}
                            />
                        </Grid>
                        <Grid item>
                            <Label label={'Begrenzung in MB'}>
                                <Input
                                    value={
                                        isLimitSet
                                            ? value
                                            : lastSetLimitRef.current
                                    }
                                    onChange={({ currentTarget }) => {
                                        if (currentTarget.value) {
                                            setValue(
                                                parseInt(currentTarget.value)
                                            );
                                        }
                                    }}
                                    step={50}
                                    min={0}
                                    type={'number'}
                                    aria-labelledby={'user-storage-limit'}
                                />
                            </Label>
                        </Grid>
                    </Grid>
                </animated.div>
                <Button onClick={() => updateTenant()} disabled={isLoading}>
                    Speichern
                </Button>
            </div>
        </>
    );
});
