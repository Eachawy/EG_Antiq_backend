import {
  getVerifiedRequest,
  postVerifiedRequest,
  putVerifiedRequest,
  deleteVerifiedRequest,
} from "app/config/network-server-reducer";
import {
  createAsyncThunk,
  createSlice,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";
import { serializeAxiosError } from "app/shared/reducers/reducer.utils";
import {
  GET_Users_API,
  CREATE_User_API,
  UPDATE_User_API,
  DELETE_User_API,
} from "app/config/constants";

const initialState: any = {
  errorMessage: null,
  loading: false,
  usersList: null,
};

export type IUsersListState = Readonly<typeof initialState>;

// Actions
export const getUsersListData = createAsyncThunk(
  "Users/GET_USERS_List",
  async () => getVerifiedRequest(GET_Users_API),
  {
    serializeError: serializeAxiosError,
  },
);

export const createUser = createAsyncThunk(
  "Users/CREATE_USER",
  async (data: any) => postVerifiedRequest(CREATE_User_API, data),
  {
    serializeError: serializeAxiosError,
  },
);

export const updateUser = createAsyncThunk(
  "Users/UPDATE_USER",
  async ({ id, data }: { id: string | number; data: any }) => {
    const url = `${UPDATE_User_API}/${id}`;
    return putVerifiedRequest(url, data);
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const deleteUser = createAsyncThunk(
  "Users/DELETE_USER",
  async (id: string | number) =>
    deleteVerifiedRequest(`${DELETE_User_API}/${id}`, {}),
  {
    serializeError: serializeAxiosError,
  },
);

export const UsersState = createSlice({
  name: "Users",
  initialState: initialState as IUsersListState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      // Get Users List
      .addCase(getUsersListData.fulfilled, (state, action) => {
        state.loading = false;
        state.usersList = action.payload.data;
      })
      // Create User
      .addCase(createUser.fulfilled, (state) => {
        state.loading = false;
      })
      // Update User
      .addCase(updateUser.fulfilled, (state) => {
        state.loading = false;
      })
      // Delete User
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
      })
      // Pending states
      .addMatcher(
        isPending(getUsersListData, createUser, updateUser, deleteUser),
        (state) => {
          state.loading = true;
          state.errorMessage = null;
        },
      )
      // Rejected states
      .addMatcher(
        isRejected(getUsersListData, createUser, updateUser, deleteUser),
        (state, action) => {
          state.loading = false;
          state.errorMessage = action.error.message;
        },
      );
  },
});

export const { reset } = UsersState.actions;

// Reducer
export default UsersState.reducer;
