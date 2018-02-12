import { Action, Reducer } from 'redux';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface RegistrationState {
    registering?: boolean
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

interface RegisterRequestAction { type: 'USERS_REGISTER_REQUEST' }
interface RegisterSuccessAction { type: 'USERS_REGISTER_SUCCESS' }
interface RegisterFailureAction { type: 'USERS_REGISTER_FAILURE' }


// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RegisterRequestAction | RegisterSuccessAction | RegisterFailureAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    register_request: () => <RegisterRequestAction>{ type: 'USERS_REGISTER_REQUEST' },
    register_success: () => <RegisterSuccessAction>{ type: 'USERS_REGISTER_SUCCESS' },
    register_failure: () => <RegisterFailureAction>{ type: 'USERS_REGISTER_FAILURE' },
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<RegistrationState> = (state: RegistrationState = {}, action: KnownAction) => {
    switch (action.type) {
        case 'USERS_REGISTER_REQUEST':
            return { registering: true };
        case 'USERS_REGISTER_SUCCESS':
            return {};
        case 'USERS_REGISTER_FAILURE':
            return {};
    default:
        // The following line guarantees that every action in the KnownAction union has been covered by a case above
        const exhaustiveCheck: never = action;
    }

    // For unrecognized actions (or in cases where actions have no effect), must return the existing state
    //  (or default initial state if none was supplied)
    return state;
};