import './css/site.css';
import 'bootstrap';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { browserHistory } from './_helpers';
import configureStore from './configureStore';
import { ApplicationState } from './_reducers'
import {App} from "./App";

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = (window as any).initialReduxState as ApplicationState;
const store = configureStore(browserHistory, initialState);


const renderRoot = (app: JSX.Element) => {
    ReactDOM.render(app, document.getElementById('react-app'));
};

if (process.env.NODE_ENV === 'production') {
    renderRoot((
        <App store={store} browserHistory={browserHistory} />
    ));
} else { // removed in production, hot-reload config
         // tslint:disable-next-line:no-var-requires
    const AppContainer = require('react-hot-loader').AppContainer;
    renderRoot((
        <AppContainer>
            <App store={store} browserHistory={browserHistory} />
        </AppContainer>
    ));

    if (module.hot) {
        // app
        module.hot.accept('./App', () => {
            const NextApp = require('./App').App;
            renderRoot((
                <AppContainer>
                    <NextApp store={store} history={browserHistory} />
                </AppContainer>
            ));
        });
    }
}