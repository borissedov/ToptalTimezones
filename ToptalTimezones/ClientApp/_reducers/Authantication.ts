import { Action, Reducer } from 'redux';
import { User } from "../domain/User";

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface AuthanticationState {
    loggedIn?: boolean,
    user?: User;
}

//TODO
//let user: User = JSON.parse(localStorage.getItem('user') as string);
//const initialState: AuthanticationState = user ? { loggedIn: true, user } : {};
const initialState = <AuthanticationState>{};


// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

interface LoginRequestAction { type: 'USERS_LOGIN_REQUEST', user: User }
interface LoginSuccessAction { type: 'USERS_LOGIN_SUCCESS', user: User }
interface LoginFailureAction { type: 'USERS_LOGIN_FAILURE' }
interface LogoutAction { type: 'USERS_LOGOUT' }


// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = LoginRequestAction | LoginSuccessAction | LoginFailureAction | LogoutAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    login_request: (user: User) => <LoginRequestAction>{ type: 'USERS_LOGIN_REQUEST', user: user },
    login_success: (user: User) => <LoginSuccessAction>{ type: 'USERS_LOGIN_SUCCESS', user: user },
    login_failure: () => <LoginFailureAction>{ type: 'USERS_LOGIN_FAILURE' },
    logout: () => <LogoutAction>{ type: 'USERS_LOGOUT' }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<AuthanticationState> = (state: AuthanticationState = initialState, action: KnownAction) => {
    switch (action.type) {
        case 'USERS_LOGIN_REQUEST':
            return {
                loggingIn: true,
                user: action.user
            };
        case 'USERS_LOGIN_SUCCESS':
            return {
                loggedIn: true,
                user: action.user
            };
        case 'USERS_LOGIN_FAILURE':
            return {};
        case 'USERS_LOGOUT':
            return {};
    default:
        // The following line guarantees that every action in the KnownAction union has been covered by a case above
        const exhaustiveCheck: never = action;
    }

    // For unrecognized actions (or in cases where actions have no effect), must return the existing state
    //  (or default initial state if none was supplied)
    return state;
};
