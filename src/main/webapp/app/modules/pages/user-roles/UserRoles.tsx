import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Tag } from "primereact/tag";
import { Avatar } from "primereact/avatar";
import PageHeader from "app/shared/components/page-header/page-header";
import { Inbox, UserPlus, Trash2, Edit, User as UserIcon } from "lucide-react";
import AssignRoleDialog from "./AssignRoleDialog";
import EditUserRolesDialog from "./EditUserRolesDialog";
import { useAppDispatch, useAppSelector } from "app/config/store";
import {
  getUsersListData,
  getRolesListData,
  assignRoleData,
  removeRoleData,
} from "./user-roles.reducer";

const UserRolesPage = () => {
  const dispatch = useAppDispatch();
  const toast = useRef<Toast>(null);

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);

  const $UsersList = useAppSelector((state) => state.UserRoles.usersList);
  const $RolesList = useAppSelector((state) => state.UserRoles.rolesList);
  const loading = useAppSelector((state) => state.UserRoles.loading);
  const assignSuccess = useAppSelector(
    (state) => state.UserRoles.assignSuccess,
  );
  const removeSuccess = useAppSelector(
    (state) => state.UserRoles.removeSuccess,
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if ($UsersList) {
      if ($UsersList.data && Array.isArray($UsersList.data)) {
        setUsers($UsersList.data);
      } else if (Array.isArray($UsersList)) {
        setUsers($UsersList);
      }
    }
  }, [$UsersList]);

  useEffect(() => {
    if ($RolesList) {
      if ($RolesList.data && Array.isArray($RolesList.data)) {
        setRoles($RolesList.data);
      } else if (Array.isArray($RolesList)) {
        setRoles($RolesList);
      }
    }
  }, [$RolesList]);

  useEffect(() => {
    if (assignSuccess) {
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Role assigned to user successfully",
        life: 3000,
      });
      fetchData();
    }
  }, [assignSuccess]);

  useEffect(() => {
    if (removeSuccess) {
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Role removed from user successfully",
        life: 3000,
      });
      fetchData();
    }
  }, [removeSuccess]);

  const fetchData = async () => {
    await dispatch(getUsersListData());
    await dispatch(getRolesListData());
  };

  const openNew = () => {
    setFormData({ userId: "", roleId: "" });
    setFormVisible(true);
  };

  const hideDialog = () => {
    setFormVisible(false);
    setFormData({});
  };

  const saveAssignment = async () => {
    if (!formData.userId || !formData.roleId) {
      toast.current?.show({
        severity: "warn",
        summary: "Validation Error",
        detail: "Please select both user and role",
        life: 3000,
      });
      return;
    }

    await dispatch(
      assignRoleData({
        userId: formData.userId,
        roleId: formData.roleId,
      }),
    );

    hideDialog();
  };

  const confirmRemove = (
    userId: string,
    roleId: string,
    userName: string,
    roleName: string,
  ) => {
    confirmDialog({
      message: `Are you sure you want to remove the role "${roleName}" from user "${userName}"?`,
      header: "Confirm Remove",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => handleRemove(userId, roleId),
    });
  };

  const handleRemove = async (userId: string, roleId: string) => {
    await dispatch(removeRoleData({ userId, roleId }));
  };

  const openEditDialog = (user) => {
    setSelectedUser(user);
    const currentRoleIds = user.userRoles?.map((ur) => ur.role.id) || [];
    setSelectedRoleIds(currentRoleIds);
    setEditDialogVisible(true);
  };

  const hideEditDialog = () => {
    setEditDialogVisible(false);
    setSelectedUser(null);
    setSelectedRoleIds([]);
  };

  const saveRoleChanges = async () => {
    if (!selectedUser) return;

    const currentRoleIds =
      selectedUser.userRoles?.map((ur) => ur.role.id) || [];

    // Find roles to add (in selectedRoleIds but not in currentRoleIds)
    const rolesToAdd = selectedRoleIds.filter(
      (roleId) => !currentRoleIds.includes(roleId),
    );

    // Find roles to remove (in currentRoleIds but not in selectedRoleIds)
    const rolesToRemove = currentRoleIds.filter(
      (roleId) => !selectedRoleIds.includes(roleId) && !isSystemRole(roleId),
    );

    try {
      // Add new roles
      for (const roleId of rolesToAdd) {
        await dispatch(
          assignRoleData({
            userId: selectedUser.id,
            roleId,
          }),
        );
      }

      // Remove unselected roles (except system roles)
      for (const roleId of rolesToRemove) {
        await dispatch(
          removeRoleData({
            userId: selectedUser.id,
            roleId,
          }),
        );
      }

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "User roles updated successfully",
        life: 3000,
      });

      fetchData();
      hideEditDialog();
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update user roles",
        life: 3000,
      });
    }
  };

  const isSystemRole = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    return role?.isSystem || false;
  };

  const userBodyTemplate = (rowData) => {
    return (
      <div className="kemetra-user-cell">
        <Avatar
          icon={<UserIcon size={16} />}
          shape="circle"
          className="kemetra-avatar-small kemetra-avatar-gold"
        />
        <div>
          <div className="kemetra-user-cell-name">
            {rowData.firstName} {rowData.lastName}
          </div>
          <div className="kemetra-user-cell-email">{rowData.email}</div>
        </div>
      </div>
    );
  };

  const rolesBodyTemplate = (rowData) => {
    if (!rowData.userRoles || rowData.userRoles.length === 0) {
      return <span className="text-sm text-gray-500">No roles assigned</span>;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {rowData.userRoles.map((userRole) => (
          <Tag
            key={userRole.role.id}
            value={userRole.role.name}
            severity={userRole.role.isSystem ? "info" : "success"}
          />
        ))}
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon={<Edit size={16} />}
          rounded
          text
          tooltip="Edit User Roles"
          onClick={() => openEditDialog(rowData)}
          className="kemetra-action-btn-edit"
        />
        {rowData.userRoles && rowData.userRoles.length > 0 && (
          <Button
            icon={<Trash2 size={16} />}
            rounded
            text
            severity="danger"
            tooltip="Remove All Roles"
            onClick={() => confirmRemoveAll(rowData)}
            className="kemetra-action-btn-delete"
          />
        )}
      </div>
    );
  };

  const confirmRemoveAll = (user) => {
    const customRoles = user.userRoles?.filter((ur) => !ur.role.isSystem) || [];
    if (customRoles.length === 0) {
      toast.current?.show({
        severity: "info",
        summary: "Info",
        detail: "No custom roles to remove. System roles cannot be removed.",
        life: 3000,
      });
      return;
    }

    confirmDialog({
      message: `Are you sure you want to remove all custom roles from "${user.firstName} ${user.lastName}"?`,
      header: "Confirm Remove All",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => handleRemoveAll(user),
    });
  };

  const handleRemoveAll = async (user) => {
    const customRoles = user.userRoles?.filter((ur) => !ur.role.isSystem) || [];

    try {
      for (const userRole of customRoles) {
        await dispatch(
          removeRoleData({
            userId: user.id,
            roleId: userRole.role.id,
          }),
        );
      }

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "All custom roles removed successfully",
        life: 3000,
      });

      fetchData();
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to remove roles",
        life: 3000,
      });
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />

      <PageHeader
        title="User Role Assignments"
        description="Assign and manage user roles"
        actionLabel="Assign Role"
        actionIcon={<UserPlus size={20} />}
        onAction={openNew}
      />

      <div className="kemetra-table-container">
        <DataTable
          value={users}
          loading={loading}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage={
            <div className="kemetra-empty-state-container">
              <Inbox size={48} className="kemetra-empty-state-icon" />
              <p className="text-lg font-medium mb-2 kemetra-empty-state-title">
                No users found
              </p>
              <p className="text-sm mb-4 kemetra-empty-state-description">
                Users will appear here once created
              </p>
            </div>
          }
          rowHover
          stripedRows
        >
          <Column
            body={userBodyTemplate}
            header="User"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-primary"
          />
          <Column
            body={rolesBodyTemplate}
            header="Assigned Roles"
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-secondary"
          />
          <Column
            body={actionBodyTemplate}
            header="Actions"
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-padding"
          />
        </DataTable>
      </div>

      <AssignRoleDialog
        visible={formVisible}
        formData={formData}
        setFormData={setFormData}
        users={users}
        roles={roles}
        onHide={hideDialog}
        onSave={saveAssignment}
      />

      <EditUserRolesDialog
        visible={editDialogVisible}
        userName={
          selectedUser
            ? `${selectedUser.firstName} ${selectedUser.lastName}`
            : ""
        }
        roles={roles}
        currentRoles={selectedUser?.userRoles?.map((ur) => ur.role) || []}
        selectedRoleIds={selectedRoleIds}
        setSelectedRoleIds={setSelectedRoleIds}
        onHide={hideEditDialog}
        onSave={saveRoleChanges}
      />
    </div>
  );
};

export default UserRolesPage;
