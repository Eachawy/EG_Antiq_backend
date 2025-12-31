import { Storage } from "react-jhipster";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";

import { AppThunk } from "app/config/store";
import { setLocale } from "app/shared/reducers/locale";

import { serializeAxiosError } from "./reducer.utils";
import { AUTH_LOGIN } from "app/config/constants";

const AUTH_TOKEN_KEY = "token";

export const initialState = {
  loading: false,
  isAuthenticated: false,
  loginSuccess: false,
  loginError: false, // Errors returned from server side
  showModalLogin: false,
  account: {} as any,
  errorMessage: null as unknown as string, // Errors returned from server side
  redirectMessage: null as unknown as string,
  sessionHasBeenFetched: false,
  logoutUrl: null as unknown as string,
};

export type AuthenticationState = Readonly<typeof initialState>;

// Actions

export const getSession =
  (response): AppThunk =>
  async (dispatch, getState) => {
    await dispatch(getAccount(response));

    const { account } = getState().authentication;
  };

export const getAccount = createAsyncThunk(
  "authentication/get_account",
  (response: any) => response,
);

interface IAuthParams {
  email: string;
  password: string;
}

export const authenticate = createAsyncThunk(
  "AUTHENTICATION / GET_ACCOUNT",
  async (auth: IAuthParams) => axios.post<any>(AUTH_LOGIN, auth),
  {
    serializeError: serializeAxiosError,
  },
);

export const login: (username: string, password: string) => AppThunk =
  (email, password) => async (dispatch) => {
    const result = await dispatch(authenticate({ email, password }));
    const response = result.payload as AxiosResponse;
    const Token = response?.data?.data?.accessToken;
    Storage.session.set(AUTH_TOKEN_KEY, Token);
    dispatch(getSession(response));
  };

export const clearAuthToken = () => {
  if (Storage.local.get(AUTH_TOKEN_KEY)) {
    Storage.local.remove(AUTH_TOKEN_KEY);
  }
  if (Storage.session.get(AUTH_TOKEN_KEY)) {
    Storage.session.remove(AUTH_TOKEN_KEY);
  }
};

export const logout: () => AppThunk = () => (dispatch) => {
  clearAuthToken();
  dispatch(logoutSession());
};

export const clearAuthentication = (messageKey) => (dispatch) => {
  clearAuthToken();
  dispatch(authError(messageKey));
  dispatch(clearAuth());
};

export const AuthenticationSlice = createSlice({
  name: "authentication",
  initialState: initialState as AuthenticationState,
  reducers: {
    logoutSession() {
      return {
        ...initialState,
        showModalLogin: true,
      };
    },
    authError(state, action) {
      return {
        ...state,
        showModalLogin: true,
        redirectMessage: action.payload,
      };
    },
    clearAuth(state) {
      return {
        ...state,
        loading: false,
        showModalLogin: true,
        isAuthenticated: false,
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(authenticate.rejected, (state, action) => ({
        ...initialState,
        errorMessage: action.error.message,
        showModalLogin: true,
        loginError: true,
      }))
      .addCase(authenticate.fulfilled, (state) => ({
        ...state,
        loading: false,
        loginError: false,
        showModalLogin: false,
        loginSuccess: true,
      }))
      .addCase(getAccount.rejected, (state, action) => ({
        ...state,
        loading: false,
        isAuthenticated: false,
        sessionHasBeenFetched: true,
        showModalLogin: true,
        errorMessage: action.error.message,
      }))
      .addCase(getAccount.fulfilled, (state, action) => {
        const isAuthenticated = action.payload.data.data.user.roles.length > 0;
        return {
          ...state,
          isAuthenticated,
          loading: false,
          sessionHasBeenFetched: true,
          account: action.payload.data.data.user,
        };
      })
      .addCase(authenticate.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAccount.pending, (state) => {
        state.loading = true;
      });
  },
});

export const { logoutSession, authError, clearAuth } =
  AuthenticationSlice.actions;

// Reducer
export default AuthenticationSlice.reducer;
