export const AUTH_LOGIN = "AUTH_LOGIN";
export const AUTH_LOGIN_SUCCESS = "AUTH_LOGIN_SUCCESS";
export const AUTH_LOGIN_FAILURE = "AUTH_LOGIN_FAILURE";
// Check sessions
export const AUTH_GET_STATUS = "AUTH_GET_STATUS";
export const AUTH_GET_STATUS_SUCCESS = "AUTH_GET_STATUS_SUCCESS";
export const AUTH_GET_STATUS_FAILURE = "AUTH_GET_STATUS_FAILURE";
export const AUTH_LOGOUT = "AUTH_LOGOUT";

//const ip = '13.124.141.28:3002';
const ip = 'localhost:3000';

/* LOGIN */
export function loginRequest(id, password) {
  return (dispatch) => {
    // Inform Login API is starting
    dispatch(login());

    // API REQUEST
    return fetch("http://"+ip+"/manager", {
        method: "POST",
        credentials: 'include',
        headers: {
        'Content-type': 'application/json'
        },
        body: JSON.stringify({
            id, password
        })
    })
    .then(response => response.json())
    .then((response) => {
        console.log(response)
        if(response.success){
            // SUCCEED
            dispatch(loginSuccess(response));
        }else{
            // FAILED
            dispatch(loginFailure());
        }
    });
  };
}

export function login() {
    return {
        type: AUTH_LOGIN
    };
}
 
export function loginSuccess(info) {
    return {
        type: AUTH_LOGIN_SUCCESS,
        id:info.id,
        fitness_no:info.fitness_no,
        fitness_name:info.fitness_name,
        manager_name:info.manager_name,
    };
}
 
export function loginFailure() {
    return {
        type: AUTH_LOGIN_FAILURE
    };
}


export function getStatusRequest() {
    return (dispatch) => {
        // inform Get Status API is starting

        console.log('____getStatus', getStatus())

        dispatch(getStatus());
        return fetch("http://"+ip+"/manager", {
            method: "GET",
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then((response) => {
            if(response.err==undefined){
                // SUCCEED
                dispatch(getStatusSuccess(response.info));
            }else{
                // FAILED
                dispatch(getStatusFailure());
            }
        });
        
    };
}
 
export function getStatus() {
    return {
        type: AUTH_GET_STATUS
    };
}
 
export function getStatusSuccess(info) {
    return {
        type: AUTH_GET_STATUS_SUCCESS,
        id:info.id,
        fitness_no:info.fitness_no,
        fitness_name:info.fitness_name,
        manager_name:info.manager_name,
    };
}
 
export function getStatusFailure() {
    return {
        type: AUTH_GET_STATUS_FAILURE
    };
}
export function logoutRequest() {
    return (dispatch) => {
        return fetch("http://"+ip+"/manager", {
            method: "DELETE",
            credentials: 'include'
        })
        .then((response) => {
            dispatch(logout());
        });

    };
}
 
export function logout() {
    return {
        type: AUTH_LOGOUT
    };
}
