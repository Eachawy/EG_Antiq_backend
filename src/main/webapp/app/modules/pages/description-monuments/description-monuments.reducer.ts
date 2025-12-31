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
  GET_DescriptionMonuments_API,
  CREATE_DescriptionMonument_API,
  UPDATE_DescriptionMonument_API,
  DELETE_DescriptionMonument_API,
} from "app/config/constants";

const initialState: any = {
  errorMessage: null,
  loading: false,
  descriptionMonumentsList: null,
};

export type IDescriptionMonumentsListState = Readonly<typeof initialState>;

// Actions
export const getDescriptionMonumentsListData = createAsyncThunk(
  "DescriptionMonuments/GET_DESCRIPTION_MONUMENTS_List",
  async () => getVerifiedRequest(GET_DescriptionMonuments_API),
  {
    serializeError: serializeAxiosError,
  },
);

export const createDescriptionMonument = createAsyncThunk(
  "DescriptionMonuments/CREATE_DESCRIPTION_MONUMENT",
  async (data: any) =>
    postVerifiedRequest(CREATE_DescriptionMonument_API, data),
  {
    serializeError: serializeAxiosError,
  },
);

export const updateDescriptionMonument = createAsyncThunk(
  "DescriptionMonuments/UPDATE_DESCRIPTION_MONUMENT",
  async ({ id, data }: { id: string | number; data: any }) => {
    const url = `${UPDATE_DescriptionMonument_API}/${id}`;
    return putVerifiedRequest(url, data);
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const deleteDescriptionMonument = createAsyncThunk(
  "DescriptionMonuments/DELETE_DESCRIPTION_MONUMENT",
  async (id: string | number) =>
    deleteVerifiedRequest(`${DELETE_DescriptionMonument_API}/${id}`, {}),
  {
    serializeError: serializeAxiosError,
  },
);

export const DescriptionMonumentsState = createSlice({
  name: "DescriptionMonuments",
  initialState: initialState as IDescriptionMonumentsListState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      // Get DescriptionMonuments List
      .addCase(getDescriptionMonumentsListData.fulfilled, (state, action) => {
        state.loading = false;
        state.descriptionMonumentsList = action.payload.data;
      })
      // Create DescriptionMonument
      .addCase(createDescriptionMonument.fulfilled, (state) => {
        state.loading = false;
      })
      // Update DescriptionMonument
      .addCase(updateDescriptionMonument.fulfilled, (state) => {
        state.loading = false;
      })
      // Delete DescriptionMonument
      .addCase(deleteDescriptionMonument.fulfilled, (state) => {
        state.loading = false;
      })
      // Pending states
      .addMatcher(
        isPending(
          getDescriptionMonumentsListData,
          createDescriptionMonument,
          updateDescriptionMonument,
          deleteDescriptionMonument,
        ),
        (state) => {
          state.loading = true;
          state.errorMessage = null;
        },
      )
      // Rejected states
      .addMatcher(
        isRejected(
          getDescriptionMonumentsListData,
          createDescriptionMonument,
          updateDescriptionMonument,
          deleteDescriptionMonument,
        ),
        (state, action) => {
          state.loading = false;
          state.errorMessage = action.error.message;
        },
      );
  },
});

export const { reset } = DescriptionMonumentsState.actions;

// Reducer
export default DescriptionMonumentsState.reducer;
