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
  GET_MonumentSources_API,
  CREATE_MonumentSource_API,
  UPDATE_MonumentSource_API,
  DELETE_MonumentSource_API,
  BULK_LINK_MonumentSources_API,
} from "app/config/constants";

const initialState: any = {
  errorMessage: null,
  loading: false,
  monumentSourcesList: null,
};

export type IMonumentSourcesListState = Readonly<typeof initialState>;

// Actions
export const getMonumentSourcesListData = createAsyncThunk(
  "MonumentSources/GET_MONUMENT_SOURCES_List",
  async () => getVerifiedRequest(GET_MonumentSources_API),
  {
    serializeError: serializeAxiosError,
  },
);

export const createMonumentSource = createAsyncThunk(
  "MonumentSources/CREATE_MONUMENT_SOURCE",
  async (data: any) => postVerifiedRequest(CREATE_MonumentSource_API, data),
  {
    serializeError: serializeAxiosError,
  },
);

export const bulkLinkSources = createAsyncThunk(
  "MonumentSources/BULK_LINK_SOURCES",
  async (data: any) => postVerifiedRequest(BULK_LINK_MonumentSources_API, data),
  {
    serializeError: serializeAxiosError,
  },
);

export const updateMonumentSource = createAsyncThunk(
  "MonumentSources/UPDATE_MONUMENT_SOURCE",
  async ({ id, data }: { id: string | number; data: any }) => {
    const url = `${UPDATE_MonumentSource_API}/${id}`;
    return putVerifiedRequest(url, data);
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const deleteMonumentSource = createAsyncThunk(
  "MonumentSources/DELETE_MONUMENT_SOURCE",
  async (id: string | number) =>
    deleteVerifiedRequest(`${DELETE_MonumentSource_API}/${id}`, {}),
  {
    serializeError: serializeAxiosError,
  },
);

export const MonumentSourcesState = createSlice({
  name: "MonumentSources",
  initialState: initialState as IMonumentSourcesListState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      // Get MonumentSources List
      .addCase(getMonumentSourcesListData.fulfilled, (state, action) => {
        state.loading = false;
        state.monumentSourcesList = action.payload.data;
      })
      // Create MonumentSource
      .addCase(createMonumentSource.fulfilled, (state) => {
        state.loading = false;
      })
      // Bulk Link Sources
      .addCase(bulkLinkSources.fulfilled, (state) => {
        state.loading = false;
      })
      // Update MonumentSource
      .addCase(updateMonumentSource.fulfilled, (state) => {
        state.loading = false;
      })
      // Delete MonumentSource
      .addCase(deleteMonumentSource.fulfilled, (state) => {
        state.loading = false;
      })
      // Pending states
      .addMatcher(
        isPending(
          getMonumentSourcesListData,
          createMonumentSource,
          bulkLinkSources,
          updateMonumentSource,
          deleteMonumentSource,
        ),
        (state) => {
          state.loading = true;
          state.errorMessage = null;
        },
      )
      // Rejected states
      .addMatcher(
        isRejected(
          getMonumentSourcesListData,
          createMonumentSource,
          bulkLinkSources,
          updateMonumentSource,
          deleteMonumentSource,
        ),
        (state, action) => {
          state.loading = false;
          state.errorMessage = action.error.message;
        },
      );
  },
});

export const { reset } = MonumentSourcesState.actions;

// Reducer
export default MonumentSourcesState.reducer;
