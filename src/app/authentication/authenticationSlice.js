import { createSlice } from '@reduxjs/toolkit';
import { Credentials } from './model/credentials';
import { User } from './model/user';
import axios from 'axios';
import config from '../../config';

const CREDENTIALS_ITEMNAME = 'credentials';

export const authenticationSlice = createSlice({
    name: 'authentication',
    initialState: {
        credentials: localStorage.getItem(CREDENTIALS_ITEMNAME) ? JSON.parse(localStorage.getItem(CREDENTIALS_ITEMNAME)) : Credentials.EMPTY,
        isAuthenticated: localStorage.getItem(CREDENTIALS_ITEMNAME) ? true : false,
        isLoginInprogress: false,
        isLogoutInprogress: false,
        errMess: null,

        user: User.EMPTY,
        isCheckJWTinprogress: true,
        checkJWTerrMess: null,
    },
    reducers: {
        loginRequest: (state) => {
            return {
                ...state,
                credentials: Credentials.EMPTY,
                isAuthenticated: false,
                isLoginInprogress: true,
                errMess: null,
            }
        },
        loginSuccess: (state, action) => {
            return {
                ...state,
                credentials: action.payload,
                isAuthenticated: true,
                isLoginInprogress: false,
                errMess: null,
            }
        },
        loginFailure: (state, action) => {
            return {
                ...state,
                credentials: Credentials.EMPTY,
                isAuthenticated: false,
                isLoginInprogress: false,
                errMess: action.payload,
            }
        },
        logoutRequest: (state) => {
            return {
                ...state,
                isLogoutInprogress: true,
                errMess: null
            }
        },
        logoutSuccess: (state) => {
            return {
                ...state,
                credentials: Credentials.EMPTY,
                isAuthenticated: false,
                isLoginInprogress: false,
                isLogoutInprogress: false,
                errMess: null
            }
        },

        checkJWTRequest: (state) => {
            return {
                ...state,
                user: User.EMPTY,
                isCheckJWTinprogress: true,
                checkJWTerrMess: null,
            }
        },
        checkJWTSuccess: (state, action) => {
            return {
                ...state,
                user: action.payload,
                isCheckJWTinprogress: false,
                checkJWTerrMess: null,
            }
        },
        checkJWTFailure: (state, action) => {
            return {
                ...state,
                user: User.EMPTY,
                isCheckJWTinprogress: false,
                checkJWTerrMess: action.payload,
            }
        },
    },
})

// Action creators are generated for each case reducer function
export const {loginRequest, loginSuccess, loginFailure, logoutRequest, logoutSuccess,
              checkJWTRequest, checkJWTSuccess, checkJWTFailure} = authenticationSlice.actions

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const doLogin = (loginData, completedCallback) => dispatch => {
    dispatch(loginRequest());
    
    axios.post(config.authenticationLogin, loginData)
      .then((response) => {
          let authResponse = response.data;
          if (authResponse.success) {
            let systemCredentials = {username: loginData.username, token: response.data.token};
            localStorage.setItem(CREDENTIALS_ITEMNAME, JSON.stringify(systemCredentials));
            
            dispatch(loginSuccess(systemCredentials));
            completedCallback(true);
          } else {
            dispatch(loginFailure(authResponse.err))
            completedCallback(false);
          }
      })
      .catch((error) => {
        dispatch(loginFailure(error.message));
        completedCallback(false);
      });
  };

export const doLogout = (completedCallback) => dispatch => {
    dispatch(logoutRequest());
    localStorage.removeItem(CREDENTIALS_ITEMNAME);
    dispatch(logoutSuccess())
    completedCallback?.();
  };

export const doCheckCredentials = (completedCallback) => dispatch => {
    dispatch(checkJWTRequest());

    let credentials = getCredentials();
    let securedAxios = axios.create({
        headers: { Authorization: `Bearer ${credentials.token}` }
    });

    securedAxios.get(config.authenticationCheckJWT)
      .then((response) => {
          let authResponse = response.data;
          if (authResponse.success) {
            dispatch(checkJWTSuccess(authResponse.user));
            completedCallback?.();
          } else {
            dispatch(checkJWTFailure(authResponse.err));
            dispatch(doLogout(() => completedCallback?.()));
          }
      })
      .catch((error) => {
        dispatch(checkJWTFailure(error.message));
        dispatch(doLogout(() => completedCallback?.()));
      });
  };

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectCredentials = state => state.authentication.credentials;
export const selectAuthentication = state => state.authentication;

// Exporting accessor functions
export function getCredentials() {
    return localStorage.getItem(CREDENTIALS_ITEMNAME) ? JSON.parse(localStorage.getItem(CREDENTIALS_ITEMNAME)) : Credentials.EMPTY;
}

// Exporting the reducer
export default authenticationSlice.reducer