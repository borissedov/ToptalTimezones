import { fetch, addTask } from 'domain-task';
import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import {authHeader, config} from "../_helpers";

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface ClocksState {
    isLoading: boolean;
    startDateIndex?: number;
    clocks: Clock[];
}

export interface Clock {
    id: number;
    name: string;
    cityName: string;
    timezone: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestClocksAction {
    type: 'REQUEST_CLOCKS';
}

interface ReceiveClocksAction {
    type: 'RECEIVE_CLOCKS';
    clocks: Clock[];
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestClocksAction | ReceiveClocksAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestClock: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const requestOptions = {
            method: 'GET',
            headers: authHeader()
        };
        let fetchTask = fetch(config.apiUrl +`/api/Clocks/Index`, requestOptions)
            .then(response => response.json() as Promise<Clock[]>)
            .then(data => {
                dispatch({ type: 'RECEIVE_CLOCKS', clocks: data });
            });

        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        dispatch({ type: 'REQUEST_CLOCKS' });
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: ClocksState = { clocks: [], isLoading: false };

export const reducer: Reducer<ClocksState> = (state: ClocksState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_CLOCKS':
            return {
                isLoading: true,
                clocks: []
            };
        case 'RECEIVE_CLOCKS':
            return {
                    clocks: action.clocks,
                    isLoading: false
                };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
