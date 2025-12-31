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
  GET_Users_API,
  GET_Roles_API,
  ASSIGN_Role_API,
  REMOVE_Role_API,
} from "app/config/constants";

const initialState: any = {
  errorMessage: null,
  loading: false,
  usersList: null,
  rolesList: null,
  assignSuccess: false,
  removeSuccess: false,
};

export type IUserRolesState = Readonly<typeof initialState>;

// Actions
export const getUsersListData = createAsyncThunk(
  "UserRoles/GET_USERS_List",
  async () => getVerifiedRequest(GET_Users_API),
  {
    serializeError: serializeAxiosError,
  },
);

export const getRolesListData = createAsyncThunk(
  "UserRoles/GET_ROLES_List",
  async () => getVerifiedRequest(GET_Roles_API),
  {
    serializeError: serializeAxiosError,
  },
);

export const assignRoleData = createAsyncThunk(
  "UserRoles/ASSIGN_ROLE",
  async (data: { userId: string; roleId: string }) =>
    postVerifiedRequest(ASSIGN_Role_API, data),
  {
    serializeError: serializeAxiosError,
  },
);

export const removeRoleData = createAsyncThunk(
  "UserRoles/REMOVE_ROLE",
  async ({ roleId, userId }: { roleId: string; userId: string }) =>
    deleteVerifiedRequest(`${REMOVE_Role_API}/${roleId}/users/${userId}`, {}),
  {
    serializeError: serializeAxiosError,
  },
);

export const UserRolesState = createSlice({
  name: "UserRoles",
  initialState: initialState as IUserRolesState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      // Get Users List
      .addCase(getUsersListData.fulfilled, (state, action) => {
        state.loading = false;
        state.usersList = action.payload.data;
      })
      // Get Roles List
      .addCase(getRolesListData.fulfilled, (state, action) => {
        state.loading = false;
        state.rolesList = action.payload.data;
      })
      // Assign Role
      .addCase(assignRoleData.fulfilled, (state) => {
        state.loading = false;
        state.assignSuccess = true;
      })
      // Remove Role
      .addCase(removeRoleData.fulfilled, (state) => {
        state.loading = false;
        state.removeSuccess = true;
      })
      // Pending states
      .addMatcher(
        isPending(
          getUsersListData,
          getRolesListData,
          assignRoleData,
          removeRoleData,
        ),
        (state) => {
          state.loading = true;
          state.errorMessage = null;
          state.assignSuccess = false;
          state.removeSuccess = false;
        },
      )
      // Rejected states
      .addMatcher(
        isRejected(
          getUsersListData,
          getRolesListData,
          assignRoleData,
          removeRoleData,
        ),
        (state, action) => {
          state.loading = false;
          state.errorMessage = action.error.message;
          state.assignSuccess = false;
          state.removeSuccess = false;
        },
      );
  },
});

export const { reset } = UserRolesState.actions;

// Reducer
export default UserRolesState.reducer;
