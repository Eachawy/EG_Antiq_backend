import { Storage } from "react-jhipster";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";

import { AppThunk } from "app/config/store";
import { setLocale } from "app/shared/reducers/locale";

import { serializeAxiosError } from "./reducer.utils";
import {
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from "app/config/constants";

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
    const accessToken = response?.data?.data?.accessToken;
    const refreshToken = response?.data?.data?.refreshToken;

    // Store both access and refresh tokens
    Storage.session.set(AUTH_TOKEN_KEY, accessToken);
    Storage.session.set(REFRESH_TOKEN_KEY, refreshToken);

    dispatch(getSession(response));
  };

export const clearAuthToken = () => {
  if (Storage.session.get(AUTH_TOKEN_KEY)) {
    Storage.session.remove(AUTH_TOKEN_KEY);
  }
  if (Storage.session.get(REFRESH_TOKEN_KEY)) {
    Storage.session.remove(REFRESH_TOKEN_KEY);
  }
  if (Storage.session.get("isAuthenticated")) {
    Storage.session.remove("isAuthenticated");
  }
  if (Storage.session.get("account")) {
    Storage.session.remove("account");
  }
  // if (Storage.session.get("sessionHasBeenFetched")) {
  //   Storage.session.remove("sessionHasBeenFetched");
  // }
  if (Storage.session.get("isAdmin")) {
    Storage.session.remove("isAdmin");
  }
};

export const logout: () => AppThunk = () => async (dispatch) => {
  try {
    // Clear tokens from storage
    clearAuthToken();
    dispatch(logoutSession());
    // Get refresh token before clearing
    const refreshToken =
      Storage.local.get(REFRESH_TOKEN_KEY) ||
      Storage.session.get(REFRESH_TOKEN_KEY);

    // Call backend logout endpoint to invalidate refresh token
    if (refreshToken) {
      await axios.post(AUTH_LOGOUT, { refreshToken });
    }
  } catch (error) {
    // Continue with logout even if backend call fails
    console.error("Logout error:", error);
  }
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
