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
  GET_MonumentBooks_API,
  CREATE_MonumentBook_API,
  UPDATE_MonumentBook_API,
  DELETE_MonumentBook_API,
  BULK_LINK_MonumentBooks_API,
} from "app/config/constants";

const initialState: any = {
  errorMessage: null,
  loading: false,
  monumentBooksList: null,
};

export type IMonumentBooksListState = Readonly<typeof initialState>;

// Actions
export const getMonumentBooksListData = createAsyncThunk(
  "MonumentBooks/GET_MONUMENT_BOOKS_List",
  async () => getVerifiedRequest(GET_MonumentBooks_API),
  {
    serializeError: serializeAxiosError,
  },
);

export const createMonumentBook = createAsyncThunk(
  "MonumentBooks/CREATE_MONUMENT_BOOK",
  async (data: any) => postVerifiedRequest(CREATE_MonumentBook_API, data),
  {
    serializeError: serializeAxiosError,
  },
);

export const bulkLinkBooks = createAsyncThunk(
  "MonumentBooks/BULK_LINK_BOOKS",
  async (data: any) => postVerifiedRequest(BULK_LINK_MonumentBooks_API, data),
  {
    serializeError: serializeAxiosError,
  },
);

export const updateMonumentBook = createAsyncThunk(
  "MonumentBooks/UPDATE_MONUMENT_BOOK",
  async ({ id, data }: { id: string | number; data: any }) => {
    const url = `${UPDATE_MonumentBook_API}/${id}`;
    return putVerifiedRequest(url, data);
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const deleteMonumentBook = createAsyncThunk(
  "MonumentBooks/DELETE_MONUMENT_BOOK",
  async (id: string | number) =>
    deleteVerifiedRequest(`${DELETE_MonumentBook_API}/${id}`, {}),
  {
    serializeError: serializeAxiosError,
  },
);

export const MonumentBooksState = createSlice({
  name: "MonumentBooks",
  initialState: initialState as IMonumentBooksListState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      // Get MonumentBooks List
      .addCase(getMonumentBooksListData.fulfilled, (state, action) => {
        state.loading = false;
        state.monumentBooksList = action.payload.data;
      })
      // Create MonumentBook
      .addCase(createMonumentBook.fulfilled, (state) => {
        state.loading = false;
      })
      // Bulk Link Books
      .addCase(bulkLinkBooks.fulfilled, (state) => {
        state.loading = false;
      })
      // Update MonumentBook
      .addCase(updateMonumentBook.fulfilled, (state) => {
        state.loading = false;
      })
      // Delete MonumentBook
      .addCase(deleteMonumentBook.fulfilled, (state) => {
        state.loading = false;
      })
      // Pending states
      .addMatcher(
        isPending(
          getMonumentBooksListData,
          createMonumentBook,
          bulkLinkBooks,
          updateMonumentBook,
          deleteMonumentBook,
        ),
        (state) => {
          state.loading = true;
          state.errorMessage = null;
        },
      )
      // Rejected states
      .addMatcher(
        isRejected(
          getMonumentBooksListData,
          createMonumentBook,
          bulkLinkBooks,
          updateMonumentBook,
          deleteMonumentBook,
        ),
        (state, action) => {
          state.loading = false;
          state.errorMessage = action.error.message;
        },
      );
  },
});

export const { reset } = MonumentBooksState.actions;

// Reducer
export default MonumentBooksState.reducer;
