import {fetch, addTask} from 'domain-task';
import {Action, Reducer} from 'redux';
import {AppThunkAction} from './';
import {authHeader, config} from "../_helpers";
import {User} from "../domain";

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface UsersState {
    isLoading: boolean;
    startDateIndex?: number;
    users: User[];
    editingUser: User,
    userSaving: boolean
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestUsersAction {
    type: 'REQUEST_USERS';
}

interface ReceiveUsersAction {
    type: 'RECEIVE_USERS';
    users: User[];
}

interface UserSaveSubmitAction {
    type: 'SAVE_SUBMIT_USER';
}

interface UserSaveCompleteAction {
    type: 'SAVE_COMPLETE_USER';
    user: User;
}

interface UserDeleteAction {
    type: 'DELETE_USER';
    user: User;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestUsersAction | ReceiveUsersAction | UserSaveSubmitAction | UserSaveCompleteAction
    | UserDeleteAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestUser: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const requestOptions = {
            method: 'GET',
            headers: authHeader()
        };
        let fetchTask = fetch(config.apiUrl + `/api/Users`, requestOptions)
            .then(response => response.json() as Promise<User[]>)
            .then(data => {
                dispatch({type: 'RECEIVE_USERS', users: data});
            });

        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        dispatch({type: 'REQUEST_USERS'});
    },
    saveUser: (user: User): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if (user.id) {
            const requestOptions = {
                method: 'PUT',
                headers: {'Content-Type': 'application/json', ...authHeader()},
                body: JSON.stringify(user)
            };
            let fetchTask = fetch(config.apiUrl + `/api/Users/` + user.id, requestOptions)
                .then(response => response.json() as Promise<User>)
                .then(data => {
                    dispatch({type: 'SAVE_COMPLETE_USER', user: data});
                });
            addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        } else {
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json', ...authHeader()},
                body: JSON.stringify(user)
            };
            let fetchTask = fetch(config.apiUrl + `/api/Users/register`, requestOptions)
                .then(response => response.json() as Promise<User>)
                .then(data => {
                    dispatch({type: 'SAVE_COMPLETE_USER', user: data});
                });
            addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        }

        dispatch({type: 'SAVE_SUBMIT_USER'});
    },
    deleteUser: (user: User): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const requestOptions = {
            method: 'DELETE',
            headers: authHeader(),
        };
        let fetchTask = fetch(config.apiUrl + `/api/Users/` + user.id, requestOptions)
            .then(data => {
                dispatch({type: 'DELETE_USER', user: user});
            });
        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: UsersState = {users: [], editingUser: <User>{}, userSaving: false, isLoading: false};

export const reducer: Reducer<UsersState> = (state: UsersState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_USERS':
            return {
                isLoading: true,
                users: [],
                userSaving: false,
                editingUser: <User>{}
            };
        case 'RECEIVE_USERS':
            return {
                users: action.users,
                isLoading: false,
                userSaving: false,
                editingUser: <User>{}
            };
        case 'SAVE_SUBMIT_USER':
            return {
                users: state.users,
                isLoading: false,
                userSaving: true,
                editingUser: state.editingUser
            };
        case 'SAVE_COMPLETE_USER':
            let ii = -1;
            for (let i in state.users) {
                if (state.users[i].id == action.user.id) {
                    state.users[i] = action.user;
                    ii = Number(i);
                    break;
                }
            }
            if (ii == -1) {
                state.users.push(action.user);
            }
            return {
                users: state.users,
                isLoading: false,
                userSaving: false,
                editingUser: <User>{}
            };
        case 'DELETE_USER':
            let j = -1;
            for (let i in state.users) {
                if (state.users[i].id == action.user.id) {
                    j = Number(i);
                    break;
                }
            }
            if (j != -1) {
                state.users.splice(j, 1);
            }
            return {
                users: state.users,
                isLoading: false,
                userSaving: false,
                editingUser: <User>{}
            };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
