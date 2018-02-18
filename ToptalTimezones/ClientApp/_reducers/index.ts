import { combineReducers } from 'redux';
import { routerReducer, RouterState } from 'react-router-redux';
import * as WeatherForecasts from './WeatherForecasts';
import * as Counter from './Counter';
import * as Authentication from './Authantication';
import * as Registration from './Registration';
import * as Alert from './Alert';


// The top-level state object
export interface ApplicationState {
    counter: Counter.CounterState;
    weatherForecasts: WeatherForecasts.WeatherForecastsState;
    alert: Alert.AlertState;
    authantication: Authentication.AuthanticationState;
    registration: Registration.RegistrationState;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    counter: Counter.reducer,
    weatherForecasts: WeatherForecasts.reducer,
    alert: Alert.reducer,
    authantication: Authentication.reducer,
    registration: Registration.reducer
};

export const rootReducer = combineReducers<ApplicationState>(Object.assign({}, reducers, { routing: routerReducer }));

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
