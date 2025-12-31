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
  GET_MonumentsType_API,
  CREATE_MonumentsType_API,
  UPDATE_MonumentsType_API,
  DELETE_MonumentsType_API,
} from "app/config/constants";

const initialState: any = {
  errorMessage: null,
  loading: false,
  monumentsTypeList: null,
};

export type IMonumentsTypeListState = Readonly<typeof initialState>;

// Actions
export const getMonumentsTypeListData = createAsyncThunk(
  "MonumentsType/GET_MONUMENTS_TYPE_List",
  async () => getVerifiedRequest(GET_MonumentsType_API),
  {
    serializeError: serializeAxiosError,
  },
);

export const createMonumentsType = createAsyncThunk(
  "MonumentsType/CREATE_MONUMENTS_TYPE",
  async (data: any) => postVerifiedRequest(CREATE_MonumentsType_API, data),
  {
    serializeError: serializeAxiosError,
  },
);

export const updateMonumentsType = createAsyncThunk(
  "MonumentsType/UPDATE_MONUMENTS_TYPE",
  async ({ id, data }: { id: string | number; data: any }) => {
    const url = `${UPDATE_MonumentsType_API}/${id}`;
    return putVerifiedRequest(url, data);
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const deleteMonumentsType = createAsyncThunk(
  "MonumentsType/DELETE_MONUMENTS_TYPE",
  async (id: string | number) =>
    deleteVerifiedRequest(`${DELETE_MonumentsType_API}/${id}`, {}),
  {
    serializeError: serializeAxiosError,
  },
);

export const MonumentsTypeState = createSlice({
  name: "MonumentsType",
  initialState: initialState as IMonumentsTypeListState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      // Get MonumentsType List
      .addCase(getMonumentsTypeListData.fulfilled, (state, action) => {
        state.loading = false;
        state.monumentsTypeList = action.payload.data;
      })
      // Create MonumentsType
      .addCase(createMonumentsType.fulfilled, (state) => {
        state.loading = false;
      })
      // Update MonumentsType
      .addCase(updateMonumentsType.fulfilled, (state) => {
        state.loading = false;
      })
      // Delete MonumentsType
      .addCase(deleteMonumentsType.fulfilled, (state) => {
        state.loading = false;
      })
      // Pending states
      .addMatcher(
        isPending(
          getMonumentsTypeListData,
          createMonumentsType,
          updateMonumentsType,
          deleteMonumentsType,
        ),
        (state) => {
          state.loading = true;
          state.errorMessage = null;
        },
      )
      // Rejected states
      .addMatcher(
        isRejected(
          getMonumentsTypeListData,
          createMonumentsType,
          updateMonumentsType,
          deleteMonumentsType,
        ),
        (state, action) => {
          state.loading = false;
          state.errorMessage = action.error.message;
        },
      );
  },
});

export const { reset } = MonumentsTypeState.actions;

// Reducer
export default MonumentsTypeState.reducer;
