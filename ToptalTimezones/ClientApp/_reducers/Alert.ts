import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface AlertState {
    type?: string;
    message?: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

interface AlertSuccessAction { type: 'ALERT_SUCCESS', message: string }
interface AlertErrorAction { type: 'ALERT_ERROR', message: string }
interface AlertClearAction { type: 'ALERT_CLEAR' }

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = AlertSuccessAction | AlertErrorAction | AlertClearAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    success: (message: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        return { type: 'ALERT_SUCCESS', message };
    },
    error: (message: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        return { type: 'ALERT_ERROR', message };
    },
    clear: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        return { type: 'ALERT_CLEAR' };
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<AlertState> = (state: AlertState, action: KnownAction) => {
    switch (action.type) {
        case 'ALERT_SUCCESS':
            return { type: 'alert-success', message: action.message };
        case 'ALERT_ERROR':
            return { type: 'alert-danger', message: action.message };
        case 'ALERT_CLEAR':
            return {};
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    // For unrecognized actions (or in cases where actions have no effect), must return the existing state
    //  (or default initial state if none was supplied)
    return state || {};
};
