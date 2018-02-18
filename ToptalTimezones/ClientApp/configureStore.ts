import { createStore, applyMiddleware, compose, GenericStoreEnhancer, Store, StoreEnhancerStoreCreator } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import * as StoreModule from './_reducers';
import { ApplicationState } from './_reducers';
import { History } from 'history';

export default function configureStore(history: History, initialState?: ApplicationState) {
    // Build middleware. These are functions that can process the actions before they reach the store.
    const windowIfDefined = typeof window === 'undefined' ? null : window as any;
    // If devTools is installed, connect to it
    const devToolsExtension = windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__ as () => GenericStoreEnhancer;
    const createStoreWithMiddleware = compose(
        applyMiddleware(thunk, routerMiddleware(history)),
        devToolsExtension ? devToolsExtension() : <S>(next: StoreEnhancerStoreCreator<S>) => next
    )(createStore);

    // Combine all reducers and instantiate the app-wide store instance
    const store = createStoreWithMiddleware(StoreModule.rootReducer, initialState) as Store<ApplicationState>;

    // Enable Webpack hot module replacement for reducers
    if (module.hot) {
        module.hot.accept('./_reducers', () => {
            const nextRootReducer = require<typeof StoreModule>('./_reducers');
            store.replaceReducer(nextRootReducer.rootReducer);
        });
    }

    return store;
}