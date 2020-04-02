import './index.scss';
import Honeybadger from 'honeybadger-js';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from 'react-apollo';
import { App } from './component/App';
import { client } from 'api/client';
import { CloudimageProvider } from 'react-cloudimage-responsive';
import { Provider } from 'react-redux';
import { theme } from './theme';
import { ThemeProvider } from '@material-ui/styles';
import { UploadQueueService } from 'api/UploadQueueService';
import { createSetUploadsAction } from 'store/actions/userFiles';
import { UploadQueueContext } from 'context/UploadQueueContext';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { de } from 'date-fns/locale';
import Matomo from 'matomo-ts';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import ReactDOM from 'react-dom';
import store from './store/Store';

if (process.env.REACT_APP_MATOMO_URL) {
    Matomo.default().init(
        process.env.REACT_APP_MATOMO_URL,
        document.location.hostname,
        {
            async: true,
            srcUri: `${process.env.REACT_APP_MATOMO_URL}/matomo.js`
        }
    );
}

try {
    Honeybadger.configure({
        apiKey: process.env.REACT_APP_HONEYBADGER_API_KEY,
        environment: process.env.REACT_APP_APP_ENVIRONMENT,
        revision: process.env.REACT_APP_APP_REVISION
    });
} catch (e) {
    console.error(e);
}


const uploadQueue = new UploadQueueService(
    uploads => store.dispatch(createSetUploadsAction(uploads)),
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
