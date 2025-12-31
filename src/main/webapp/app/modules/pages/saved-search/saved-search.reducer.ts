import {
  getVerifiedRequest,
  postVerifiedRequest,
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
  GET_SavedSearches_API,
  CREATE_SavedSearch_API,
  DELETE_SavedSearch_API,
} from "app/config/constants";

const initialState: any = {
  errorMessage: null,
  loading: false,
  savedSearchesList: null,
};

export type ISavedSearchesListState = Readonly<typeof initialState>;

// Actions
export const getSavedSearchesListData = createAsyncThunk(
  "SavedSearches/GET_SAVED_SEARCHES_List",
  async () => getVerifiedRequest(GET_SavedSearches_API),
  {
    serializeError: serializeAxiosError,
  },
);

export const createSavedSearch = createAsyncThunk(
  "SavedSearches/CREATE_SAVED_SEARCH",
  async (data: any) => postVerifiedRequest(CREATE_SavedSearch_API, data),
  {
    serializeError: serializeAxiosError,
  },
);

export const deleteSavedSearch = createAsyncThunk(
  "SavedSearches/DELETE_SAVED_SEARCH",
  async (id: string | number) =>
    deleteVerifiedRequest(`${DELETE_SavedSearch_API}/${id}`, {}),
  {
    serializeError: serializeAxiosError,
  },
);

export const SavedSearchesState = createSlice({
  name: "SavedSearches",
  initialState: initialState as ISavedSearchesListState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      // Get SavedSearches List
      .addCase(getSavedSearchesListData.fulfilled, (state, action) => {
        state.loading = false;
        state.savedSearchesList = action.payload.data;
      })
      // Create SavedSearch
      .addCase(createSavedSearch.fulfilled, (state) => {
        state.loading = false;
      })
      // Delete SavedSearch
      .addCase(deleteSavedSearch.fulfilled, (state) => {
        state.loading = false;
      })
      // Pending states
      .addMatcher(
        isPending(
          getSavedSearchesListData,
          createSavedSearch,
          deleteSavedSearch,
        ),
        (state) => {
          state.loading = true;
          state.errorMessage = null;
        },
      )
      // Rejected states
      .addMatcher(
        isRejected(
          getSavedSearchesListData,
          createSavedSearch,
          deleteSavedSearch,
        ),
        (state, action) => {
          state.loading = false;
          state.errorMessage = action.error.message;
        },
      );
  },
});

export const { reset } = SavedSearchesState.actions;

// Reducer
export default SavedSearchesState.reducer;
