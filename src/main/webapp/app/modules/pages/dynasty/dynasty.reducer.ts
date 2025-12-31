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
  GET_Dynasties_API,
  CREATE_Dynasty_API,
  UPDATE_Dynasty_API,
  DELETE_Dynasty_API,
} from "app/config/constants";

const initialState: any = {
  errorMessage: null,
  loading: false,
  dynastiesList: null,
};

export type IDynastiesListState = Readonly<typeof initialState>;

// Actions
export const getDynastiesListData = createAsyncThunk(
  "Dynasties/GET_DYNASTIES_List",
  async () => getVerifiedRequest(GET_Dynasties_API),
  {
    serializeError: serializeAxiosError,
  },
);

export const createDynasty = createAsyncThunk(
  "Dynasties/CREATE_DYNASTY",
  async (data: any) => postVerifiedRequest(CREATE_Dynasty_API, data),
  {
    serializeError: serializeAxiosError,
  },
);

export const updateDynasty = createAsyncThunk(
  "Dynasties/UPDATE_DYNASTY",
  async ({ id, data }: { id: string | number; data: any }) => {
    const url = `${UPDATE_Dynasty_API}/${id}`;
    return putVerifiedRequest(url, data);
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const deleteDynasty = createAsyncThunk(
  "Dynasties/DELETE_DYNASTY",
  async (id: string | number) =>
    deleteVerifiedRequest(`${DELETE_Dynasty_API}/${id}`, {}),
  {
    serializeError: serializeAxiosError,
  },
);

export const DynastiesState = createSlice({
  name: "Dynasties",
  initialState: initialState as IDynastiesListState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      // Get Dynasties List
      .addCase(getDynastiesListData.fulfilled, (state, action) => {
        state.loading = false;
        state.dynastiesList = action.payload.data;
      })
      // Create Dynasty
      .addCase(createDynasty.fulfilled, (state) => {
        state.loading = false;
      })
      // Update Dynasty
      .addCase(updateDynasty.fulfilled, (state) => {
        state.loading = false;
      })
      // Delete Dynasty
      .addCase(deleteDynasty.fulfilled, (state) => {
        state.loading = false;
      })
      // Pending states
      .addMatcher(
        isPending(
          getDynastiesListData,
          createDynasty,
          updateDynasty,
          deleteDynasty,
        ),
        (state) => {
          state.loading = true;
          state.errorMessage = null;
        },
      )
      // Rejected states
      .addMatcher(
        isRejected(
          getDynastiesListData,
          createDynasty,
          updateDynasty,
          deleteDynasty,
        ),
        (state, action) => {
          state.loading = false;
          state.errorMessage = action.error.message;
        },
      );
  },
});

export const { reset } = DynastiesState.actions;

// Reducer
export default DynastiesState.reducer;
