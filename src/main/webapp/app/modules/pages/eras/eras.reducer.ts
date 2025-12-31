import {
  getVerifiedRequest,
  postVerifiedRequest,
} from "app/config/network-server-reducer";
import {
  createAsyncThunk,
  createSlice,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";
import { serializeAxiosError } from "app/shared/reducers/reducer.utils";
import { GET_Eras_API } from "app/config/constants";

const initialState: any = {
  errorMessage: null,
  loading: false,
  earsList: null,
};

export type IDashboardState = Readonly<typeof initialState>;

// Actions
export const getErasListData = createAsyncThunk(
  "Eras/GET_ERAS_List",
  async () => getVerifiedRequest(GET_Eras_API),
  {
    serializeError: serializeAxiosError,
  },
);

// export const getFilesTableData = createAsyncThunk(
//   "DASHBOARD/GET_FILES_TABLE_DATA",
//   async (data: any) => postVerifiedRequest(getFilesTableDataAPI, data),
//   {
//     serializeError: serializeAxiosError,
//   },
// );

export const ErasState = createSlice({
  name: "Eras",
  initialState: initialState as IDashboardState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getErasListData.fulfilled, (state, action) => {
        state.loading = false;
        state.earsList = action.payload.data;
      })
      .addMatcher(isPending(getErasListData), (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addMatcher(isRejected(getErasListData), (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      });
  },
});

export const { reset } = ErasState.actions;

// Reducer
export default ErasState.reducer;
