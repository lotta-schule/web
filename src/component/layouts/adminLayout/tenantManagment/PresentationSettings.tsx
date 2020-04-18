import React, { memo, useEffect, useState } from 'react';
import { Button, Card, CardContent, Grid, Typography, makeStyles, Theme, useTheme } from '@material-ui/core';
import { useMutation } from '@apollo/react-hooks';
import { useTenant } from 'util/client/useTenant';
import { UpdateTenantMutation } from 'api/mutation/UpdateTenantMutation';
import { ErrorMessage } from 'component/general/ErrorMessage';
import { SelectFileOverlay } from 'component/edit/SelectFileOverlay';
import { PlaceholderImage } from 'component/placeholder/PlaceholderImage';
import { ColorSettingRow } from './ColorSettingRow';
import { SelectTemplateButton } from './SelectTemplateButton';
import get from 'lodash/get';
import merge from 'lodash/merge';
import Img from 'react-cloudimage-responsive';

const useStyles = makeStyles(theme => ({
    section: {
        marginBottom: theme.spacing(2)
    },
    gridContainer: {
        marginBottom: theme.spacing(3),
    }
}));

export const PresentationSettings = memo(() => {
    const styles = useStyles();
    const tenant = useTenant();
    const theme = useTheme();

    const [allThemes, setAllThemes] = useState<{ title: string; theme: Partial<Theme> }[]>([{ title: 'Standard', theme: {} }]);

    const [customTheme, setCustomTheme] = useState<any>(tenant.customTheme || {});
    const [backgroundImage, setBackgroundImage] = useState(tenant.backgroundImageFile);

    const [updateTenant, { loading: isLoading, error }] = useMutation(UpdateTenantMutation);

    const getFromTheme = (key: string): any => {
        return get(customTheme, key, get(theme, key));
    }

    useEffect(() => {
        Promise.all(['Königsblau', 'Leipzig'].map(async title => {
            const pureName = title
                .toLowerCase()
                .replace(/ö/g, 'oe');
            const partialTheme = await fetch(`/theme/${pureName}/theme.json`).then(res => res.json())
            return { title, theme: merge({}, theme, partialTheme) };
        })).then(customThemes => setAllThemes([{ title: 'Standard', theme: {} }, ...customThemes]));
    }, [theme]);

    return (
        <>
            <section className={styles.section}>
                <Typography variant={'h6'}>
                    Vorlagen
                </Typography>
                <Grid container>
                    {allThemes.map(({ title, theme: partialTheme }, index) => {
                        return (
                            <Grid item sm={3} key={index}>
                                <SelectTemplateButton
                                    title={title}
                                    theme={partialTheme}
                                    onClick={() => setCustomTheme(partialTheme)}
                                />
                            </Grid>
                        );
                    })}
                </Grid>
            </section>

            <section className={styles.section}>
                <Typography variant={'h6'}>
                    Farben
                </Typography>
                <ErrorMessage error={error} />
                <Grid container className={styles.gridContainer}>
                    <Grid item sm={6}>
                        <ColorSettingRow
                            label={'Primärfarbe'}
                            hint={'Hintergrund der Navigationsleiste, Farbe der Links'}
                            value={getFromTheme('palette.primary.main')}
                            onChange={value => setCustomTheme(merge({}, customTheme, {
                                palette: {
                                    primary: { main: value }
                                }
                            }))}
                        />
                        <ColorSettingRow
                            label={'Akzentfarbe'}
                            hint={'Farbe der Buttons und für Farbakzente im Seitenlayout'}
                            value={getFromTheme('palette.secondary.main')}
                            onChange={value => setCustomTheme(merge({}, customTheme, {
                                palette: {
                                    secondary: { main: value }
                                }
                            }))}
                        />
                        <ColorSettingRow
                            label={'Hintergrund'}
                            hint={'Hintergrund der Seite'}
                            value={getFromTheme('palette.background.default')}
                            onChange={value => setCustomTheme(merge({}, customTheme, {
                                palette: {
                                    background: { default: value }
                                }
                            }))}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <ColorSettingRow
                            label={'primäre Textfarbe'}
                            hint={'Standard-Text und Überschriften'}
                            value={getFromTheme('palette.text.primary')}
                            onChange={value => setCustomTheme(merge({}, customTheme, {
                                palette: {
                                    text: { primary: value }
                                }
                            }))}
                        />
                        <ColorSettingRow
                            label={'sekundäre Textfarbe'}
                            hint={'Hinweistext, Vorschautext'}
                            value={getFromTheme('palette.text.secondary')}
                            onChange={value => setCustomTheme(merge({}, customTheme, {
                                palette: {
                                    text: { secondary: value }
                                }
                            }))}
                        />
                    </Grid>
                </Grid>

                <Grid container className={styles.gridContainer}>
                    <Grid item sm={6}>
                        <Card>
                            <CardContent>
                                <SelectFileOverlay label={'Hintergrundbild ändern'} onSelectFile={backgroundImage => setBackgroundImage(backgroundImage)} allowDeletion>
                                    {backgroundImage ? (
                                        <Img operation={'height'} size={'400x200'} src={backgroundImage.remoteLocation} />
                                    ) : <PlaceholderImage width={'100%'} height={200} />}
                                </SelectFileOverlay>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item sm={6}>
                        <Typography>
                            Für eine optimale Darstellung sollte das Hintergrundbild <i>mindestens</i> eine Auflösung von 1280x800 Pixeln haben.
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container justify={'flex-end'}>
                    <Grid item sm={6} md={4} lg={3}>
                        <Button
                            fullWidth
                            disabled={isLoading}
                            variant={'outlined'}
                            color={'secondary'}
                            onClick={() => updateTenant({
                                variables: {
                                    tenant: { customTheme: JSON.stringify(customTheme), backgroundImageFile: backgroundImage }
                                }
                            })}
                        >
                            speichern
                        </Button>
                    </Grid>
                </Grid>
            </section>
        </>
    );
});