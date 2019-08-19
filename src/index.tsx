import './index.scss';
import * as Sentry from '@sentry/browser';
import { ApolloProvider } from 'react-apollo';
import { App } from './component/App';
import { client } from 'api/client';
import { CloudimageProvider } from 'react-cloudimage-responsive';
import { Provider } from 'react-redux';
import { theme } from './theme';
import { ThemeProvider } from '@material-ui/styles';
import { UploadQueueService } from 'api/UploadQueueService';
import { createSetUploadsAction, createAddFileAction } from 'store/actions/userFiles';
import { UploadQueueContext } from 'context/UploadQueueContext';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import * as serviceWorker from './serviceWorker';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import ReactDOM from 'react-dom';
import store from './store/Store';
import { de } from 'date-fns/locale';
import Matomo from 'matomo-ts';

Matomo.default().init(
    process.env.REACT_APP_MATOMO_URL,
    process.env.REACT_APP_MATOMO_SITEID,
    window.location.href.includes(process.env.REACT_APP_APP_BASE_DOMAIN) ?
        { cookieDomain: `*.${process.env.REACT_APP_APP_BASE_DOMAIN}` } :
        {}
);

try {
    Sentry.init({ dsn: process.env.REACT_APP_SENTRY_URL });
} catch { }


const uploadQueue = new UploadQueueService(
    uploads => store.dispatch(createSetUploadsAction(uploads)),
    file => store.dispatch(createAddFileAction(file))
);

ReactDOM.render(
    (
        <ThemeProvider theme={theme}>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={de}>
                <CloudimageProvider config={{ token: process.env.REACT_APP_CLOUDIMG_TOKEN }}>
                    <ApolloProvider client={client}>
                        <Provider store={store}>
                            <UploadQueueContext.Provider value={uploadQueue}>
                                <App />
                            </UploadQueueContext.Provider>
                        </Provider >
                    </ApolloProvider >
                </CloudimageProvider>
            </MuiPickersUtilsProvider>
        </ThemeProvider >
    ),
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
