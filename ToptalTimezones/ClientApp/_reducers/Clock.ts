import {fetch, addTask} from 'domain-task';
import {Action, Reducer} from 'redux';
import {AppThunkAction} from './';
import {authHeader, config} from "../_helpers";

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface ClocksState {
    isLoading: boolean;
    startDateIndex?: number;
    clocks: Clock[];
    editingClock: Clock,
    clockSaving: boolean
}

export interface Clock {
    id?: number;
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

interface ClockSaveSubmitAction {
    type: 'SAVE_SUBMIT_CLOCK';
}

interface ClockSaveCompleteAction {
    type: 'SAVE_COMPLETE_CLOCK';
    clock: Clock;
}

interface ClockDeleteAction {
    type: 'DELETE_CLOCK';
    clock: Clock;
}


// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestClocksAction | ReceiveClocksAction | ClockSaveSubmitAction | ClockSaveCompleteAction
    | ClockDeleteAction;

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
        let fetchTask = fetch(config.apiUrl + `/api/Clocks`, requestOptions)
            .then(response => response.json() as Promise<Clock[]>)
            .then(data => {
                dispatch({type: 'RECEIVE_CLOCKS', clocks: data});
            });

        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        dispatch({type: 'REQUEST_CLOCKS'});
    },
    saveClock: (clock: Clock): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if (clock.id) {
            const requestOptions = {
                method: 'PUT',
                headers: {'Content-Type': 'application/json', ...authHeader()},
                body: JSON.stringify(clock)
            };
            let fetchTask = fetch(config.apiUrl + `/api/Clocks/` + clock.id, requestOptions)
                .then(response => response.json() as Promise<Clock>)
                .then(data => {
                    dispatch({type: 'SAVE_COMPLETE_CLOCK', clock: data});
                });
            addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        } else {
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json', ...authHeader()},
                body: JSON.stringify(clock)
            };
            let fetchTask = fetch(config.apiUrl + `/api/Clocks/`, requestOptions)
                .then(response => response.json() as Promise<Clock>)
                .then(data => {
                    dispatch({type: 'SAVE_COMPLETE_CLOCK', clock: data});
                });
            addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        }

        dispatch({type: 'SAVE_SUBMIT_CLOCK'});
    },
    deleteClock: (clock: Clock): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const requestOptions = {
            method: 'DELETE',
            headers: authHeader(),
        };
        let fetchTask = fetch(config.apiUrl + `/api/Clocks/` + clock.id, requestOptions)
            .then(data => {
                dispatch({type: 'DELETE_CLOCK', clock: clock});
            });
        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: ClocksState = {clocks: [], editingClock: <Clock>{}, clockSaving: false, isLoading: false};

export const reducer: Reducer<ClocksState> = (state: ClocksState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_CLOCKS':
            return {
                isLoading: true,
                clocks: [],
                clockSaving: false,
                editingClock: <Clock>{}
            };
        case 'RECEIVE_CLOCKS':
            return {
                clocks: action.clocks,
                isLoading: false,
                clockSaving: false,
                editingClock: <Clock>{}
            };
        case 'SAVE_SUBMIT_CLOCK':
            return {
                clocks: state.clocks,
                isLoading: false,
                clockSaving: true,
                editingClock: state.editingClock
            };
        case 'SAVE_COMPLETE_CLOCK':
            let ii = -1;
            for (let i in state.clocks) {
                if (state.clocks[i].id == action.clock.id) {
                    state.clocks[i] = action.clock;
                    ii = Number(i);
                    break;
                }
            }
            if (ii == -1) {
                state.clocks.push(action.clock);
            }
            return {
                clocks: state.clocks,
                isLoading: false,
                clockSaving: false,
                editingClock: <Clock>{}
            };
        case 'DELETE_CLOCK':
            let j = -1;
            for (let i in state.clocks) {
                if (state.clocks[i].id == action.clock.id) {
                    j = Number(i);
                    break;
                }
            }
            if (j != -1) {
                state.clocks.splice(j, 1);
            }
            return {
                clocks: state.clocks,
                isLoading: false,
                clockSaving: false,
                editingClock: <Clock>{}
            };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
