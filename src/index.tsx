import './index.scss';
import { ApolloProvider } from 'react-apollo';
import { App } from './component/App';
import { client } from 'api/client';
import { Provider } from 'react-redux';
import { theme } from './theme';
import { ThemeProvider } from '@material-ui/styles';
import { UploadQueueService } from 'api/UploadQueueService';
import { createSetUploadsAction, createAddFileAction } from 'store/actions/userFiles';
import { UploadQueueContext } from 'context/UploadQueueContext';
import * as serviceWorker from './serviceWorker';
import React from 'react';
import ReactDOM from 'react-dom';
import store from './store/Store';

const uploadQueue = new UploadQueueService(
    uploads => store.dispatch(createSetUploadsAction(uploads)),
    file => store.dispatch(createAddFileAction(file))
);

ReactDOM.render(
    (
        <ThemeProvider theme={theme}>
            <ApolloProvider client={client}>
                <Provider store={store}>
                    <UploadQueueContext.Provider value={uploadQueue}>
                        <App />
                    </UploadQueueContext.Provider>
                </Provider >
            </ApolloProvider >
        </ThemeProvider >
    ),
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
