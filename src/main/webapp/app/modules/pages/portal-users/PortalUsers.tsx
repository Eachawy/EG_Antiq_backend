import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import PageHeader from "app/shared/components/page-header/page-header";
import { Plus, Inbox, PenLine, Trash2, AlertTriangle } from "lucide-react";
import PortalUserFormDialog from "./PortalUserFormDialog";
import { useAppDispatch, useAppSelector } from "app/config/store";
import {
  getPortalUsersListData,
  createPortalUser,
  updatePortalUser,
  deletePortalUser,
} from "./portal-users.reducer";
import { toast } from "react-toastify";

const PortalUsersPage = () => {
  const dispatch = useAppDispatch();

  const [users, setUsers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});

  const $PortalUsersList = useAppSelector(
    (state) => state.PortalUsers.portalUsersList,
  );
  const loading = useAppSelector((state) => state.PortalUsers.loading);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if ($PortalUsersList) {
      if ($PortalUsersList.data && Array.isArray($PortalUsersList.data)) {
        setUsers($PortalUsersList.data);
      } else if (Array.isArray($PortalUsersList)) {
        setUsers($PortalUsersList);
      }
    }
  }, [$PortalUsersList]);

  const fetchData = async () => {
    await dispatch(getPortalUsersListData());
  };

  const openNew = () => {
    setFormData({ status: "Active", emailVerified: false });
    setSelectedUser(null);
    setVisible(true);
  };

  const openEdit = (user) => {
    setFormData(user);
    setSelectedUser(user);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setFormData({});
    setSelectedUser(null);
  };

  const save = async () => {
    try {
      if (selectedUser) {
        // Update existing portal user
        await dispatch(
          updatePortalUser({ id: selectedUser.id, data: formData }),
        ).unwrap();
        toast.success("Portal user updated successfully!");
      } else {
        // Create new portal user
        await dispatch(createPortalUser(formData)).unwrap();
        toast.success("Portal user created successfully!");
      }
      hideDialog();
      await dispatch(getPortalUsersListData());
    } catch (error) {
      toast.error("An error occurred while saving the portal user.");
      console.error("Save error:", error);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await dispatch(deletePortalUser(id)).unwrap();
      toast.success("Portal user deleted successfully!");
      await dispatch(getPortalUsersListData());
    } catch (error) {
      toast.error("An error occurred while deleting the portal user.");
      console.error("Delete error:", error);
    }
  };

  const confirmDelete = (user) => {
    confirmDialog({
      message: `Are you sure you want to delete portal user "${user.firstName} ${user.lastName}"?`,
      header: "Confirm Deletion",
      icon: <AlertTriangle size={24} className="text-red-500" />,
      acceptClassName: "p-button-danger",
      accept: () => handleDelete(user.id),
    });
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon={<PenLine size={16} />}
          rounded
          text
          tooltip={"Edit"}
          onClick={() => openEdit(rowData)}
          className="kemetra-action-btn-edit"
        />
        <Button
          icon={<Trash2 size={16} />}
          rounded
          text
          tooltip={"Delete"}
          onClick={() => confirmDelete(rowData)}
          className="kemetra-action-btn-delete"
        />
      </div>
    );
  };

  return (
    <div>
      <ConfirmDialog />
      <PageHeader
        title={"Portal Users Managemen"}
        description={"Manage portal users and access"}
        actionLabel={"Add Portal User"}
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
                {"No portal users found"}
              </p>
              <Button
                label={"Add Portal User"}
                icon={<Plus size={18} />}
                onClick={openNew}
                className="kemetra-empty-state-button"
              />
            </div>
          }
          rowHover
          stripedRows
        >
          <Column
            field="email"
            header={"Email"}
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-email"
          />
          <Column
            field="firstName"
            header={"First Name"}
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-name"
          />
          <Column
            field="lastName"
            header={"Last Name"}
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-name"
          />
          <Column
            body={actionBodyTemplate}
            header={"Actions"}
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-padding"
          />
        </DataTable>
      </div>

      <PortalUserFormDialog
        visible={visible}
        selectedUser={selectedUser}
        formData={formData}
        setFormData={setFormData}
        onHide={hideDialog}
        onSave={save}
      />
    </div>
  );
};

export default PortalUsersPage;
