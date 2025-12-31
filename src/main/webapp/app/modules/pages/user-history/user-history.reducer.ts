import { getVerifiedRequest } from "app/config/network-server-reducer";
import {
  createAsyncThunk,
  createSlice,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";
import { serializeAxiosError } from "app/shared/reducers/reducer.utils";
import { GET_UserHistory_API } from "app/config/constants";

const initialState: any = {
  errorMessage: null,
  loading: false,
  userHistoryList: null,
};

export type IUserHistoryListState = Readonly<typeof initialState>;

// Actions
export const getUserHistoryListData = createAsyncThunk(
  "UserHistory/GET_USER_HISTORY_List",
  async () => getVerifiedRequest(GET_UserHistory_API),
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
      // Pending states
      .addMatcher(isPending(getUserHistoryListData), (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      // Rejected states
      .addMatcher(isRejected(getUserHistoryListData), (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      });
  },
});

export const { reset } = UserHistoryState.actions;

// Reducer
export default UserHistoryState.reducer;
