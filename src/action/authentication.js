import axios from 'axios';
import { SERVER_URL } from '../const/settings';

export const AUTH_LOGIN = 'AUTH_LOGIN';
export const AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS';
export const AUTH_LOGIN_FAILURE = 'AUTH_LOGIN_FAILURE';
export const AUTH_LOGIN_WAITING = 'AUTH_LOGIN_WAITING';
// Check sessions
export const AUTH_GET_STATUS = 'AUTH_GET_STATUS';
export const AUTH_GET_STATUS_SUCCESS = 'AUTH_GET_STATUS_SUCCESS';
export const AUTH_GET_STATUS_FAILURE = 'AUTH_GET_STATUS_FAILURE';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';

const ip = SERVER_URL;
//const ip = 'localhost:3000';

/* LOGIN */
export function loginRequest(id, password) {
  return (dispatch) => {
    // Inform Login API is starting
    dispatch(login());

    // API REQUEST
    return fetch(ip + '/manager?type=session', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        id,
        password,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        // console.log(response);
        // console.log(response.code);
        if (response.success) {
          // SUCCEED
          dispatch(loginSuccess(response));
        } else if (response.code == 5) {
          //alert('승인 대기중입니다.')
          dispatch(loginWaiting());
        } else {
          // FAILED
          dispatch(loginFailure());
        }
      });
  };
}
//choiceLogin
export function choiceLogin() {
  return (dispatch) => {
    dispatch(login());
    return axios
      .get(`${SERVER_URL}/manager?type='session`, {})
      .then((response) => response.data);
  };
}

export function login() {
  return {
    type: AUTH_LOGIN,
  };
}

export function loginSuccess(info) {
  return {
    type: AUTH_LOGIN_SUCCESS,
    id: info.id,
    fitness_no: info.fitness_no,
    fitness_name: info.fitness_name,
    manager_name: info.manager_name,
    loginWhether: info.loginWhether,
    joinNo: info.joinNo,
  };
}

export function loginFailure() {
  return {
    type: AUTH_LOGIN_FAILURE,
  };
}

export function loginWaiting() {
  return {
    type: AUTH_LOGIN_WAITING,
  };
}

export function getStatusRequest() {
  return (dispatch) => {
    // inform Get Status API is starting

    // console.log('____getStatus', getStatus())

    dispatch(getStatus());
    return fetch(ip + '/manager?type=session', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((response) => {
        // console.log(response.info);
        // console.log(response.info.loginWhether);
        if (response.err == undefined) {
          // SUCCEED
          dispatch(getStatusSuccess(response.info));
          if (response.info.loginWhether === 2) {
            // console.log('회원');
          } else if (response.info.loginWhether === 1) {
            // console.log('트레이너');
          } else {
            // console.log('헬스장');
          }
        } else {
          // FAILED
          dispatch(getStatusFailure());
        }
      });
  };
}

export function getStatus() {
  return {
    type: AUTH_GET_STATUS,
  };
}

export function getStatusSuccess(info) {
  return {
    type: AUTH_GET_STATUS_SUCCESS,
    id: info.id,
    fitness_no: info.fitness_no,
    fitness_name: info.fitness_name,
    manager_name: info.manager_name,
    loginWhether: info.loginWhether,
    joinNo: info.joinNo,
  };
}

export function getStatusFailure() {
  return {
    type: AUTH_GET_STATUS_FAILURE,
  };
}
export function logoutRequest() {
  return (dispatch) => {
    return fetch(ip + '/manager?type=session', {
      method: 'DELETE',
      credentials: 'include',
    }).then((response) => {
      dispatch(logout());
    });
  };
}

export function logout() {
  return {
    type: AUTH_LOGOUT,
  };
}
