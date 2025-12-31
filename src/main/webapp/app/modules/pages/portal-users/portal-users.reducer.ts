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
  GET_PortalUsers_API,
  CREATE_PortalUser_API,
  UPDATE_PortalUser_API,
  DELETE_PortalUser_API,
} from "app/config/constants";

const initialState: any = {
  errorMessage: null,
  loading: false,
  portalUsersList: null,
};

export type IPortalUsersListState = Readonly<typeof initialState>;

// Actions
export const getPortalUsersListData = createAsyncThunk(
  "PortalUsers/GET_PORTAL_USERS_List",
  async () => getVerifiedRequest(GET_PortalUsers_API),
  {
    serializeError: serializeAxiosError,
  },
);

export const createPortalUser = createAsyncThunk(
  "PortalUsers/CREATE_PORTAL_USER",
  async (data: any) => postVerifiedRequest(CREATE_PortalUser_API, data),
  {
    serializeError: serializeAxiosError,
  },
);

export const updatePortalUser = createAsyncThunk(
  "PortalUsers/UPDATE_PORTAL_USER",
  async ({ id, data }: { id: string | number; data: any }) => {
    const url = `${UPDATE_PortalUser_API}/${id}`;
    return putVerifiedRequest(url, data);
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const deletePortalUser = createAsyncThunk(
  "PortalUsers/DELETE_PORTAL_USER",
  async (id: string | number) =>
    deleteVerifiedRequest(`${DELETE_PortalUser_API}/${id}`, {}),
  {
    serializeError: serializeAxiosError,
  },
);

export const PortalUsersState = createSlice({
  name: "PortalUsers",
  initialState: initialState as IPortalUsersListState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      // Get PortalUsers List
      .addCase(getPortalUsersListData.fulfilled, (state, action) => {
        state.loading = false;
        state.portalUsersList = action.payload.data;
      })
      // Create PortalUser
      .addCase(createPortalUser.fulfilled, (state) => {
        state.loading = false;
      })
      // Update PortalUser
      .addCase(updatePortalUser.fulfilled, (state) => {
        state.loading = false;
      })
      // Delete PortalUser
      .addCase(deletePortalUser.fulfilled, (state) => {
        state.loading = false;
      })
      // Pending states
      .addMatcher(
        isPending(
          getPortalUsersListData,
          createPortalUser,
          updatePortalUser,
          deletePortalUser,
        ),
        (state) => {
          state.loading = true;
          state.errorMessage = null;
        },
      )
      // Rejected states
      .addMatcher(
        isRejected(
          getPortalUsersListData,
          createPortalUser,
          updatePortalUser,
          deletePortalUser,
        ),
        (state, action) => {
          state.loading = false;
          state.errorMessage = action.error.message;
        },
      );
  },
});

export const { reset } = PortalUsersState.actions;

// Reducer
export default PortalUsersState.reducer;
