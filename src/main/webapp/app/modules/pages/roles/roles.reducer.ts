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
  GET_Roles_API,
  CREATE_Role_API,
  UPDATE_Role_API,
  DELETE_Role_API,
} from "app/config/constants";

const initialState: any = {
  errorMessage: null,
  loading: false,
  rolesList: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
};

export type IRolesListState = Readonly<typeof initialState>;

// Actions
export const getRolesListData = createAsyncThunk(
  "Roles/GET_ROLES_List",
  async () => getVerifiedRequest(GET_Roles_API),
  {
    serializeError: serializeAxiosError,
  },
);

export const createRoleData = createAsyncThunk(
  "Roles/CREATE_ROLE",
  async (data: any) => postVerifiedRequest(CREATE_Role_API, data),
  {
    serializeError: serializeAxiosError,
  },
);

export const updateRoleData = createAsyncThunk(
  "Roles/UPDATE_ROLE",
  async ({ id, data }: { id: string; data: any }) =>
    putVerifiedRequest(`${UPDATE_Role_API}/${id}`, data),
  {
    serializeError: serializeAxiosError,
  },
);

export const deleteRoleData = createAsyncThunk(
  "Roles/DELETE_ROLE",
  async (id: string) => deleteVerifiedRequest(`${DELETE_Role_API}/${id}`, {}),
  {
    serializeError: serializeAxiosError,
  },
);

export const RolesState = createSlice({
  name: "Roles",
  initialState: initialState as IRolesListState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      // Get Roles List
      .addCase(getRolesListData.fulfilled, (state, action) => {
        state.loading = false;
        state.rolesList = action.payload.data;
      })
      // Create Role
      .addCase(createRoleData.fulfilled, (state) => {
        state.loading = false;
        state.createSuccess = true;
      })
      // Update Role
      .addCase(updateRoleData.fulfilled, (state) => {
        state.loading = false;
        state.updateSuccess = true;
      })
      // Delete Role
      .addCase(deleteRoleData.fulfilled, (state) => {
        state.loading = false;
        state.deleteSuccess = true;
      })
      // Pending states
      .addMatcher(
        isPending(
          getRolesListData,
          createRoleData,
          updateRoleData,
          deleteRoleData,
        ),
        (state) => {
          state.loading = true;
          state.errorMessage = null;
          state.createSuccess = false;
          state.updateSuccess = false;
          state.deleteSuccess = false;
        },
      )
      // Rejected states
      .addMatcher(
        isRejected(
          getRolesListData,
          createRoleData,
          updateRoleData,
          deleteRoleData,
        ),
        (state, action) => {
          state.loading = false;
          state.errorMessage = action.error.message;
          state.createSuccess = false;
          state.updateSuccess = false;
          state.deleteSuccess = false;
        },
      );
  },
});

export const { reset } = RolesState.actions;

// Reducer
export default RolesState.reducer;
