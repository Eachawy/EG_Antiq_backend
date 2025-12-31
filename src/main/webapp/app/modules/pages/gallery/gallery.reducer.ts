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
  GET_Gallery_API,
  CREATE_Gallery_API,
  UPDATE_Gallery_API,
  DELETE_Gallery_API,
} from "app/config/constants";

const initialState: any = {
  errorMessage: null,
  loading: false,
  galleryList: null,
};

export type IGalleryListState = Readonly<typeof initialState>;

// Actions
export const getGalleryListData = createAsyncThunk(
  "Gallery/GET_GALLERY_List",
  async () => getVerifiedRequest(GET_Gallery_API),
  {
    serializeError: serializeAxiosError,
  },
);

export const createGallery = createAsyncThunk(
  "Gallery/CREATE_GALLERY",
  async (data: any) => postVerifiedRequest(CREATE_Gallery_API, data),
  {
    serializeError: serializeAxiosError,
  },
);

export const updateGallery = createAsyncThunk(
  "Gallery/UPDATE_GALLERY",
  async ({ id, data }: { id: string | number; data: any }) => {
    const url = `${UPDATE_Gallery_API}/${id}`;
    return putVerifiedRequest(url, data);
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const deleteGallery = createAsyncThunk(
  "Gallery/DELETE_GALLERY",
  async (id: string | number) =>
    deleteVerifiedRequest(`${DELETE_Gallery_API}/${id}`, {}),
  {
    serializeError: serializeAxiosError,
  },
);

export const GalleryState = createSlice({
  name: "Gallery",
  initialState: initialState as IGalleryListState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      // Get Gallery List
      .addCase(getGalleryListData.fulfilled, (state, action) => {
        state.loading = false;
        state.galleryList = action.payload.data;
      })
      // Create Gallery
      .addCase(createGallery.fulfilled, (state) => {
        state.loading = false;
      })
      // Update Gallery
      .addCase(updateGallery.fulfilled, (state) => {
        state.loading = false;
      })
      // Delete Gallery
      .addCase(deleteGallery.fulfilled, (state) => {
        state.loading = false;
      })
      // Pending states
      .addMatcher(
        isPending(
          getGalleryListData,
          createGallery,
          updateGallery,
          deleteGallery,
        ),
        (state) => {
          state.loading = true;
          state.errorMessage = null;
        },
      )
      // Rejected states
      .addMatcher(
        isRejected(
          getGalleryListData,
          createGallery,
          updateGallery,
          deleteGallery,
        ),
        (state, action) => {
          state.loading = false;
          state.errorMessage = action.error.message;
        },
      );
  },
});

export const { reset } = GalleryState.actions;

// Reducer
export default GalleryState.reducer;
