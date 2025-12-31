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
  GET_MonumentsEra_API,
  CREATE_MonumentsEra_API,
  UPDATE_MonumentsEra_API,
  DELETE_MonumentsEra_API,
} from "app/config/constants";

const initialState: any = {
  errorMessage: null,
  loading: false,
  monumentsEraList: null,
};

export type IMonumentsEraListState = Readonly<typeof initialState>;

// Actions
export const getMonumentsEraListData = createAsyncThunk(
  "MonumentsEra/GET_MONUMENTS_ERA_List",
  async () => getVerifiedRequest(GET_MonumentsEra_API),
  {
    serializeError: serializeAxiosError,
  },
);

export const createMonumentsEra = createAsyncThunk(
  "MonumentsEra/CREATE_MONUMENTS_ERA",
  async (data: any) => postVerifiedRequest(CREATE_MonumentsEra_API, data),
  {
    serializeError: serializeAxiosError,
  },
);

export const updateMonumentsEra = createAsyncThunk(
  "MonumentsEra/UPDATE_MONUMENTS_ERA",
  async ({ id, data }: { id: string | number; data: any }) => {
    const url = `${UPDATE_MonumentsEra_API}/${id}`;
    return putVerifiedRequest(url, data);
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const deleteMonumentsEra = createAsyncThunk(
  "MonumentsEra/DELETE_MONUMENTS_ERA",
  async (id: string | number) =>
    deleteVerifiedRequest(`${DELETE_MonumentsEra_API}/${id}`, {}),
  {
    serializeError: serializeAxiosError,
  },
);

export const MonumentsEraState = createSlice({
  name: "MonumentsEra",
  initialState: initialState as IMonumentsEraListState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      // Get MonumentsEra List
      .addCase(getMonumentsEraListData.fulfilled, (state, action) => {
        state.loading = false;
        state.monumentsEraList = action.payload.data;
      })
      // Create MonumentsEra
      .addCase(createMonumentsEra.fulfilled, (state) => {
        state.loading = false;
      })
      // Update MonumentsEra
      .addCase(updateMonumentsEra.fulfilled, (state) => {
        state.loading = false;
      })
      // Delete MonumentsEra
      .addCase(deleteMonumentsEra.fulfilled, (state) => {
        state.loading = false;
      })
      // Pending states
      .addMatcher(
        isPending(
          getMonumentsEraListData,
          createMonumentsEra,
          updateMonumentsEra,
          deleteMonumentsEra,
        ),
        (state) => {
          state.loading = true;
          state.errorMessage = null;
        },
      )
      // Rejected states
      .addMatcher(
        isRejected(
          getMonumentsEraListData,
          createMonumentsEra,
          updateMonumentsEra,
          deleteMonumentsEra,
        ),
        (state, action) => {
          state.loading = false;
          state.errorMessage = action.error.message;
        },
      );
  },
});

export const { reset } = MonumentsEraState.actions;

// Reducer
export default MonumentsEraState.reducer;
