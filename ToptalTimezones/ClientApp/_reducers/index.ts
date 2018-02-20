import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import * as Authentication from './Authantication';
import * as Registration from './Registration';
import * as Alert from './Alert';
import * as Clock from "./Clock";
import * as User from "./User"

// The top-level state object
export interface ApplicationState {
    alert: Alert.AlertState;
    authantication: Authentication.AuthanticationState;
    registration: Registration.RegistrationState;
    clocks: Clock.ClocksState;
    users: User.UsersState;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    alert: Alert.reducer,
    authantication: Authentication.reducer,
    registration: Registration.reducer,
    clocks: Clock.reducer,
    users: User.reducer
};

export const rootReducer = combineReducers<ApplicationState>(Object.assign({}, reducers, { routing: routerReducer }));

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
