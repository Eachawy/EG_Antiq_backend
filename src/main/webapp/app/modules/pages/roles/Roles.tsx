import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Tag } from "primereact/tag";
import PageHeader from "app/shared/components/page-header/page-header";
import { Inbox, Plus, Edit, Trash2, Shield } from "lucide-react";
import RoleFormDialog from "./RoleFormDialog";
import { useAppDispatch, useAppSelector } from "app/config/store";
import {
  getRolesListData,
  createRoleData,
  updateRoleData,
  deleteRoleData,
} from "./roles.reducer";

const RolesPage = () => {
  const dispatch = useAppDispatch();
  const toast = useRef<Toast>(null);

  const [roles, setRoles] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [isEdit, setIsEdit] = useState(false);

  const $RolesList = useAppSelector((state) => state.Roles.rolesList);
  const loading = useAppSelector((state) => state.Roles.loading);
  const createSuccess = useAppSelector((state) => state.Roles.createSuccess);
  const updateSuccess = useAppSelector((state) => state.Roles.updateSuccess);
  const deleteSuccess = useAppSelector((state) => state.Roles.deleteSuccess);

  useEffect(() => {
    fetchData();
  }, []);

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
    if (createSuccess) {
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Role created successfully",
        life: 3000,
      });
      fetchData();
    }
  }, [createSuccess]);

  useEffect(() => {
    if (updateSuccess) {
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Role updated successfully",
        life: 3000,
      });
      fetchData();
    }
  }, [updateSuccess]);

  useEffect(() => {
    if (deleteSuccess) {
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Role deleted successfully",
        life: 3000,
      });
      fetchData();
    }
  }, [deleteSuccess]);

  const fetchData = async () => {
    await dispatch(getRolesListData());
  };

  const openNew = () => {
    setFormData({ name: "", description: "" });
    setIsEdit(false);
    setFormVisible(true);
  };

  const editRole = (role) => {
    setFormData({ ...role });
    setIsEdit(true);
    setFormVisible(true);
  };

  const hideDialog = () => {
    setFormVisible(false);
    setFormData({});
  };

  const saveRole = async () => {
    if (!formData.name) {
      toast.current?.show({
        severity: "warn",
        summary: "Validation Error",
        detail: "Role name is required",
        life: 3000,
      });
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description || "",
    };

    if (isEdit) {
      await dispatch(updateRoleData({ id: formData.id, data: payload }));
    } else {
      await dispatch(createRoleData(payload));
    }

    hideDialog();
  };

  const confirmDelete = (role) => {
    confirmDialog({
      message: `Are you sure you want to delete the role "${role.name}"?`,
      header: "Confirm Delete",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => handleDelete(role.id),
    });
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteRoleData(id));
  };

  const nameBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center gap-2">
        <Shield size={16} className="text-blue-600" />
        <span className="font-medium">{rowData.name}</span>
      </div>
    );
  };

  const descriptionBodyTemplate = (rowData) => {
    return (
      <span className="text-sm text-gray-600">
        {rowData.description || "-"}
      </span>
    );
  };

  const systemRoleBodyTemplate = (rowData) => {
    return rowData.isSystem ? (
      <Tag value="System" severity="info" />
    ) : (
      <Tag value="Custom" severity="success" />
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon={<Edit size={16} />}
          rounded
          text
          tooltip="Edit Role"
          onClick={() => editRole(rowData)}
          className="kemetra-action-btn-edit"
          disabled={rowData.isSystem}
        />
        <Button
          icon={<Trash2 size={16} />}
          rounded
          text
          severity="danger"
          tooltip="Delete Role"
          onClick={() => confirmDelete(rowData)}
          className="kemetra-action-btn-delete"
          disabled={rowData.isSystem}
        />
      </div>
    );
  };

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />

      <PageHeader
        title="Roles Management"
        description="Manage user roles and permissions"
        actionLabel="Add New Role"
        actionIcon={<Plus size={20} />}
        onAction={openNew}
      />

      <div className="kemetra-table-container">
        <DataTable
          value={roles}
          loading={loading}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage={
            <div className="kemetra-empty-state-container">
              <Inbox size={48} className="kemetra-empty-state-icon" />
              <p className="text-lg font-medium mb-2 kemetra-empty-state-title">
                No roles found
              </p>
              <p className="text-sm mb-4 kemetra-empty-state-description">
                Get started by creating a new role
              </p>
              <Button
                label="Add New Role"
                icon={<Plus size={18} />}
                onClick={openNew}
                className="kemetra-btn-primary"
              />
            </div>
          }
          rowHover
          stripedRows
        >
          <Column
            body={nameBodyTemplate}
            header="Role Name"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-primary"
          />
          <Column
            body={descriptionBodyTemplate}
            header="Description"
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-secondary"
          />
          <Column
            body={systemRoleBodyTemplate}
            header="Type"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell"
          />
          <Column
            body={actionBodyTemplate}
            header="Actions"
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-padding"
          />
        </DataTable>
      </div>

      <RoleFormDialog
        visible={formVisible}
        isEdit={isEdit}
        formData={formData}
        setFormData={setFormData}
        onHide={hideDialog}
        onSave={saveRole}
      />
    </div>
  );
};

export default RolesPage;
