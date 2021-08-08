import * as React from 'react';
import { BaseLayoutMainContent } from './BaseLayoutMainContent';
import {
    Card,
    CardContent,
    Grid,
    Link,
    Typography,
    makeStyles,
} from '@material-ui/core';
import { useLocationSearchQuery } from 'util/useLocationSearchQuery';
import { CollisionLink } from 'component/general/CollisionLink';
import { ErrorMessage } from 'component/general/ErrorMessage';
import { useHistory } from 'react-router-dom';
import { ResetPasswordMutation } from 'api/mutation/ResetPasswordMutation';
import { useApolloClient, useMutation } from '@apollo/client';
import { Input } from 'component/general/form/input/Input';
import { Button } from 'component/general/button/Button';
import { Label } from 'component/general/label/Label';

const useStyles = makeStyles((theme) => ({
    helpText: {
        [theme.breakpoints.up('md')]: {
            paddingLeft: theme.spacing(2),
        },
    },
    gridContainer: {
        [theme.breakpoints.up('md')]: {
            flexDirection: 'row-reverse',
        },
    },
}));

export const ResetPasswordLayout = React.memo(() => {
    const styles = useStyles();

    const [data, setData] = React.useState();
    const { replace } = useHistory();
    const apolloClient = useApolloClient();
    const [sendResetPassword, { error, loading: isLoading }] = useMutation(
        ResetPasswordMutation,
        {
            errorPolicy: 'all',
            onCompleted: (data) => {
                if (data['resetPassword']) {
                    apolloClient.resetStore();
                    localStorage.setItem(
                        'id',
                        data['resetPassword'].accessToken
                    );
                    setData(data);
                    replace('/');
                }
            },
        }
    );
    const [password, setPassword] = React.useState('');
    const [mutationError, setError] = React.useState<string | null>(null);
    const [passwordRepetition, setPasswordRepetition] = React.useState('');
    const { e, t: token } = useLocationSearchQuery<{ e: string; t: string }>();
    const email = e && atob(e);

    const linkToRequestResetPasswordPage = (
        <Link
            component={CollisionLink}
            color="inherit"
            underline="none"
            to={'/password/request-reset'}
        >
            Zurücksetzen des Passworts neu anfragen
        </Link>
    );

    const asLayout = (content: any) => (
        <BaseLayoutMainContent>
            <Card>
                <CardContent>{content}</CardContent>
            </Card>
        </BaseLayoutMainContent>
    );

    if (data) {
        return asLayout(
            <p style={{ color: 'green' }}>
                Dein Passwort wurde geändert. Du wirst gleich angemeldet und zur
                Startseite weitergeleitet.
            </p>
        );
    }

    if (!email || !token) {
        return asLayout(
            <>
                <p>Diese Seite ist nicht gültig.</p>
                {linkToRequestResetPasswordPage}
                <p>&nbsp;</p>
            </>
        );
    }

    return (
        <BaseLayoutMainContent>
            <Card>
                <CardContent>
                    <Typography variant={'h4'}>
                        Passwort wiederherstellen
                    </Typography>
                    <Grid
                        container
                        direction={'row-reverse'}
                        className={styles.gridContainer}
                    >
                        <Grid item sm={12} md={4} className={styles.helpText}>
                            <p>
                                Wähle ein neues Passwort. Achte darauf, dass
                                dein Passwort aus mindestens 6 Zeichen besteht
                                und nicht leicht zu erraten ist. Benutze
                                Passwörter nicht mehrmals.
                            </p>
                            <p>
                                Ein Passwort-Manager ist die beim Verwalten
                                deiner Passwörter behilflich.
                            </p>
                        </Grid>
                        <Grid item sm={12} md={8}>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (password !== passwordRepetition) {
                                        setError(
                                            'Passwort und Wiederholung sind nicht gleich.'
                                        );
                                        return;
                                    }
                                    sendResetPassword({
                                        variables: {
                                            email,
                                            password,
                                            token,
                                        },
                                    });
                                }}
                            >
                                <ErrorMessage error={error || mutationError}>
                                    {mutationError &&
                                        linkToRequestResetPasswordPage}
                                </ErrorMessage>
                                <Label label="Dein neues Passwort:">
                                    <Input
                                        autoFocus
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.currentTarget.value)
                                        }
                                        disabled={!!data || isLoading}
                                        placeholder="Passwort"
                                        minLength={6}
                                        maxLength={150}
                                    />
                                </Label>
                                <Label label="Wiederhole dein neues Passwort zur Sicherheit:">
                                    <Input
                                        id="password-repetition"
                                        type="password"
                                        value={passwordRepetition}
                                        onChange={(e) =>
                                            setPasswordRepetition(
                                                e.currentTarget.value
                                            )
                                        }
                                        disabled={!!data || isLoading}
                                        placeholder="Wiederhole dein neues Passwort zur Sicherheit"
                                    />
                                </Label>
                                <Button
                                    type={'submit'}
                                    disabled={!!data || isLoading}
                                    style={{ float: 'right' }}
                                >
                                    Passwort setzen
                                </Button>
                            </form>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </BaseLayoutMainContent>
    );
});
export default ResetPasswordLayout;
