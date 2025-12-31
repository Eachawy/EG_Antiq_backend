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
  GET_Monuments_API,
  CREATE_Monument_API,
  UPDATE_Monument_API,
  DELETE_Monument_API,
} from "app/config/constants";

const initialState: any = {
  errorMessage: null,
  loading: false,
  monumentsList: null,
};

export type IMonumentsListState = Readonly<typeof initialState>;

// Actions
export const getMonumentsListData = createAsyncThunk(
  "Monuments/GET_MONUMENTS_List",
  async () => getVerifiedRequest(GET_Monuments_API),
  {
    serializeError: serializeAxiosError,
  },
);

export const createMonument = createAsyncThunk(
  "Monuments/CREATE_MONUMENT",
  async (data: any) => postVerifiedRequest(CREATE_Monument_API, data),
  {
    serializeError: serializeAxiosError,
  },
);

export const updateMonument = createAsyncThunk(
  "Monuments/UPDATE_MONUMENT",
  async ({ id, data }: { id: string | number; data: any }) => {
    const url = `${UPDATE_Monument_API}/${id}`;
    return putVerifiedRequest(url, data);
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const deleteMonument = createAsyncThunk(
  "Monuments/DELETE_MONUMENT",
  async (id: string | number) =>
    deleteVerifiedRequest(`${DELETE_Monument_API}/${id}`, {}),
  {
    serializeError: serializeAxiosError,
  },
);

export const MonumentsState = createSlice({
  name: "Monuments",
  initialState: initialState as IMonumentsListState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      // Get Monuments List
      .addCase(getMonumentsListData.fulfilled, (state, action) => {
        state.loading = false;
        state.monumentsList = action.payload.data;
      })
      // Create Monument
      .addCase(createMonument.fulfilled, (state) => {
        state.loading = false;
      })
      // Update Monument
      .addCase(updateMonument.fulfilled, (state) => {
        state.loading = false;
      })
      // Delete Monument
      .addCase(deleteMonument.fulfilled, (state) => {
        state.loading = false;
      })
      // Pending states
      .addMatcher(
        isPending(
          getMonumentsListData,
          createMonument,
          updateMonument,
          deleteMonument,
        ),
        (state) => {
          state.loading = true;
          state.errorMessage = null;
        },
      )
      // Rejected states
      .addMatcher(
        isRejected(
          getMonumentsListData,
          createMonument,
          updateMonument,
          deleteMonument,
        ),
        (state, action) => {
          state.loading = false;
          state.errorMessage = action.error.message;
        },
      );
  },
});

export const { reset } = MonumentsState.actions;

// Reducer
export default MonumentsState.reducer;
