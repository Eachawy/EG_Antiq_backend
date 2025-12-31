import {
  getVerifiedRequest,
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
  GET_BrowsingHistory_API,
  DELETE_BrowsingHistory_API,
} from "app/config/constants";

const initialState: any = {
  errorMessage: null,
  loading: false,
  userHistoryList: null,
  deleteSuccess: false,
};

export type IUserHistoryListState = Readonly<typeof initialState>;

// Actions
export const getUserHistoryListData = createAsyncThunk(
  "UserHistory/GET_USER_HISTORY_List",
  async () => getVerifiedRequest(GET_BrowsingHistory_API),
  {
    serializeError: serializeAxiosError,
  },
);

export const deleteUserHistoryData = createAsyncThunk(
  "UserHistory/DELETE_USER_HISTORY",
  async (id: string) =>
    deleteVerifiedRequest(`${DELETE_BrowsingHistory_API}/${id}`, {}),
  {
    serializeError: serializeAxiosError,
  },
);

export const UserHistoryState = createSlice({
  name: "UserHistory",
  initialState: initialState as IUserHistoryListState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      // Get UserHistory List
      .addCase(getUserHistoryListData.fulfilled, (state, action) => {
        state.loading = false;
        state.userHistoryList = action.payload.data;
      })
      // Delete UserHistory
      .addCase(deleteUserHistoryData.fulfilled, (state) => {
        state.loading = false;
        state.deleteSuccess = true;
      })
      // Pending states
      .addMatcher(
        isPending(getUserHistoryListData, deleteUserHistoryData),
        (state) => {
          state.loading = true;
          state.errorMessage = null;
          state.deleteSuccess = false;
        },
      )
      // Rejected states
      .addMatcher(
        isRejected(getUserHistoryListData, deleteUserHistoryData),
        (state, action) => {
          state.loading = false;
          state.errorMessage = action.error.message;
          state.deleteSuccess = false;
        },
      );
  },
});

export const { reset } = UserHistoryState.actions;

// Reducer
export default UserHistoryState.reducer;
