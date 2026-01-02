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
  GET_Books_API,
  CREATE_Book_API,
  UPDATE_Book_API,
  DELETE_Book_API,
  IMPORT_Books_CSV_API,
} from "app/config/constants";

const initialState: any = {
  errorMessage: null,
  loading: false,
  booksList: null,
};

export type IBooksListState = Readonly<typeof initialState>;

// Actions
export const getBooksListData = createAsyncThunk(
  "Books/GET_BOOKS_List",
  async () => getVerifiedRequest(GET_Books_API),
  {
    serializeError: serializeAxiosError,
  },
);

export const createBook = createAsyncThunk(
  "Books/CREATE_BOOK",
  async (data: any) => postVerifiedRequest(CREATE_Book_API, data),
  {
    serializeError: serializeAxiosError,
  },
);

export const updateBook = createAsyncThunk(
  "Books/UPDATE_BOOK",
  async ({ id, data }: { id: string | number; data: any }) => {
    const url = `${UPDATE_Book_API}/${id}`;
    return putVerifiedRequest(url, data);
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const deleteBook = createAsyncThunk(
  "Books/DELETE_BOOK",
  async (id: string | number) =>
    deleteVerifiedRequest(`${DELETE_Book_API}/${id}`, {}),
  {
    serializeError: serializeAxiosError,
  },
);

export const importBooksCSV = createAsyncThunk(
  "Books/IMPORT_CSV",
  async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return postVerifiedRequest(IMPORT_Books_CSV_API, formData);
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const BooksState = createSlice({
  name: "Books",
  initialState: initialState as IBooksListState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      // Get Books List
      .addCase(getBooksListData.fulfilled, (state, action) => {
        state.loading = false;
        state.booksList = action.payload.data;
      })
      // Create Book
      .addCase(createBook.fulfilled, (state) => {
        state.loading = false;
      })
      // Update Book
      .addCase(updateBook.fulfilled, (state) => {
        state.loading = false;
      })
      // Delete Book
      .addCase(deleteBook.fulfilled, (state) => {
        state.loading = false;
      })
      // Import CSV
      .addCase(importBooksCSV.fulfilled, (state) => {
        state.loading = false;
      })
      // Pending states
      .addMatcher(
        isPending(
          getBooksListData,
          createBook,
          updateBook,
          deleteBook,
          importBooksCSV,
        ),
        (state) => {
          state.loading = true;
          state.errorMessage = null;
        },
      )
      // Rejected states
      .addMatcher(
        isRejected(
          getBooksListData,
          createBook,
          updateBook,
          deleteBook,
          importBooksCSV,
        ),
        (state, action) => {
          state.loading = false;
          state.errorMessage = action.error.message;
        },
      );
  },
});

export const { reset } = BooksState.actions;

// Reducer
export default BooksState.reducer;
