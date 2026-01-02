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
  GET_Sources_API,
  CREATE_Source_API,
  UPDATE_Source_API,
  DELETE_Source_API,
  IMPORT_Sources_CSV_API,
} from "app/config/constants";

const initialState: any = {
  errorMessage: null,
  loading: false,
  sourcesList: null,
};

export type ISourcesListState = Readonly<typeof initialState>;

// Actions
export const getSourcesListData = createAsyncThunk(
  "Sources/GET_SOURCES_List",
  async () => getVerifiedRequest(GET_Sources_API),
  {
    serializeError: serializeAxiosError,
  },
);

export const createSource = createAsyncThunk(
  "Sources/CREATE_SOURCE",
  async (data: any) => postVerifiedRequest(CREATE_Source_API, data),
  {
    serializeError: serializeAxiosError,
  },
);

export const updateSource = createAsyncThunk(
  "Sources/UPDATE_SOURCE",
  async ({ id, data }: { id: string | number; data: any }) => {
    const url = `${UPDATE_Source_API}/${id}`;
    return putVerifiedRequest(url, data);
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const deleteSource = createAsyncThunk(
  "Sources/DELETE_SOURCE",
  async (id: string | number) =>
    deleteVerifiedRequest(`${DELETE_Source_API}/${id}`, {}),
  {
    serializeError: serializeAxiosError,
  },
);

export const importSourcesCSV = createAsyncThunk(
  "Sources/IMPORT_CSV",
  async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return postVerifiedRequest(IMPORT_Sources_CSV_API, formData);
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const SourcesState = createSlice({
  name: "Sources",
  initialState: initialState as ISourcesListState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      // Get Sources List
      .addCase(getSourcesListData.fulfilled, (state, action) => {
        state.loading = false;
        state.sourcesList = action.payload.data;
      })
      // Create Source
      .addCase(createSource.fulfilled, (state) => {
        state.loading = false;
      })
      // Update Source
      .addCase(updateSource.fulfilled, (state) => {
        state.loading = false;
      })
      // Delete Source
      .addCase(deleteSource.fulfilled, (state) => {
        state.loading = false;
      })
      // Import CSV
      .addCase(importSourcesCSV.fulfilled, (state) => {
        state.loading = false;
      })
      // Pending states
      .addMatcher(
        isPending(
          getSourcesListData,
          createSource,
          updateSource,
          deleteSource,
          importSourcesCSV,
        ),
        (state) => {
          state.loading = true;
          state.errorMessage = null;
        },
      )
      // Rejected states
      .addMatcher(
        isRejected(
          getSourcesListData,
          createSource,
          updateSource,
          deleteSource,
          importSourcesCSV,
        ),
        (state, action) => {
          state.loading = false;
          state.errorMessage = action.error.message;
        },
      );
  },
});

export const { reset } = SourcesState.actions;

// Reducer
export default SourcesState.reducer;
