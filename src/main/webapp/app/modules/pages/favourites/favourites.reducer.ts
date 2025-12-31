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
  GET_Favourites_API,
  CREATE_Favourite_API,
  DELETE_Favourite_API,
} from "app/config/constants";

const initialState: any = {
  errorMessage: null,
  loading: false,
  favouritesList: null,
};

export type IFavouritesListState = Readonly<typeof initialState>;

// Actions
export const getFavouritesListData = createAsyncThunk(
  "Favourites/GET_FAVOURITES_List",
  async () => getVerifiedRequest(GET_Favourites_API),
  {
    serializeError: serializeAxiosError,
  },
);

export const createFavourite = createAsyncThunk(
  "Favourites/CREATE_FAVOURITE",
  async (data: any) => postVerifiedRequest(CREATE_Favourite_API, data),
  {
    serializeError: serializeAxiosError,
  },
);

export const deleteFavourite = createAsyncThunk(
  "Favourites/DELETE_FAVOURITE",
  async (id: string | number) =>
    deleteVerifiedRequest(`${DELETE_Favourite_API}/${id}`, {}),
  {
    serializeError: serializeAxiosError,
  },
);

export const FavouritesState = createSlice({
  name: "Favourites",
  initialState: initialState as IFavouritesListState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      // Get Favourites List
      .addCase(getFavouritesListData.fulfilled, (state, action) => {
        state.loading = false;
        state.favouritesList = action.payload.data;
      })
      // Create Favourite
      .addCase(createFavourite.fulfilled, (state) => {
        state.loading = false;
      })
      // Delete Favourite
      .addCase(deleteFavourite.fulfilled, (state) => {
        state.loading = false;
      })
      // Pending states
      .addMatcher(
        isPending(getFavouritesListData, createFavourite, deleteFavourite),
        (state) => {
          state.loading = true;
          state.errorMessage = null;
        },
      )
      // Rejected states
      .addMatcher(
        isRejected(getFavouritesListData, createFavourite, deleteFavourite),
        (state, action) => {
          state.loading = false;
          state.errorMessage = action.error.message;
        },
      );
  },
});

export const { reset } = FavouritesState.actions;

// Reducer
export default FavouritesState.reducer;
