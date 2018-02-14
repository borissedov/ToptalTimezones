export const alertActions = {
    success,
    error,
    clear
};

function success(message: string) {
    return {
        type: 'ALERT_SUCCESS',
        message
    };
}

function error(message: string) {
    return {
        type: 'ALERT_ERROR', message
    };
}

function clear() {
    return {
        type: 'ALERT_CLEAR'
    };
}