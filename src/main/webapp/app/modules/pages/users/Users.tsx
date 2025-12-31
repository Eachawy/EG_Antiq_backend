import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Tag } from "primereact/tag";
import PageHeader from "app/shared/components/page-header/page-header";
import UserFormDialog from "./UserFormDialog";
import { Plus, Inbox, PenLine, Trash2, AlertTriangle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "app/config/store";
import {
  getUsersListData,
  createUser,
  updateUser,
  deleteUser,
} from "./users.reducer";
import { toast } from "react-toastify";

const UsersPage = () => {
  const dispatch = useAppDispatch();

  const statusOptions = [
    { label: "Active", value: "ACTIVE" },
    { label: "Suspended", value: "SUSPENDED" },
    { label: "Pending Verification", value: "PENDING_VERIFICATION" },
    { label: "Deactivated", value: "DEACTIVATED" },
  ];

  const [users, setUsers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState<any>({});

  const $UsersList = useAppSelector((state) => state.Users.usersList);
  const loading = useAppSelector((state) => state.Users.loading);

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

  const fetchData = async () => {
    try {
      await dispatch(getUsersListData());
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const openNew = () => {
    setFormData({ status: "ACTIVE" });
    setSelectedUser(null);
    setVisible(true);
  };

  const openEdit = (user) => {
    // Only copy editable fields to formData
    setFormData({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      password: "", // Always start with empty password
    });
    setSelectedUser(user);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setFormData({});
    setSelectedUser(null);
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const save = async () => {
    try {
      if (selectedUser) {
        // Update existing user - only send fields that have values
        const updateData: any = {};

        if (formData.email) {
          updateData.email = formData.email;
        }
        if (formData.firstName) {
          updateData.firstName = formData.firstName;
        }
        if (formData.lastName) {
          updateData.lastName = formData.lastName;
        }
        if (formData.status) {
          updateData.status = formData.status;
        }
        // Only include password if it's provided and not empty
        if (formData.password && formData.password.trim() !== "") {
          updateData.password = formData.password;
        }

        await dispatch(
          updateUser({ id: selectedUser.id, data: updateData }),
        ).unwrap();
        toast.success("User updated successfully!");
      } else {
        // Create new user - only send required fields
        const createData = {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          status: formData.status || "ACTIVE",
        };

        await dispatch(createUser(createData)).unwrap();
        toast.success("User created successfully!");
      }
      hideDialog();
      await dispatch(getUsersListData());
    } catch (error: any) {
      // Extract error message from backend response (AxiosError structure)
      const errorMessage =
        error?.response?.data?.error?.message ||
        error?.error?.message ||
        error?.message ||
        "An error occurred while saving the user.";
      toast.error(errorMessage);
      console.error("Save error:", error);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      toast.success("User deleted successfully!");
      await dispatch(getUsersListData());
    } catch (error: any) {
      // Extract error message from backend response (AxiosError structure)
      const errorMessage =
        error?.response?.data?.error?.message ||
        error?.error?.message ||
        error?.message ||
        "An error occurred while deleting the user.";
      toast.error(errorMessage);
      console.error("Delete error:", error);
    }
  };

  const confirmDelete = (user) => {
    confirmDialog({
      message: `Are you sure you want to delete user "${user.firstName} ${user.lastName}"?`,
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
          tooltip="Edit"
          tooltipOptions={{ position: "top" }}
          onClick={() => openEdit(rowData)}
          className="kemetra-action-btn-edit"
        />
        <Button
          icon={<Trash2 size={16} />}
          rounded
          text
          tooltip="Delete"
          tooltipOptions={{ position: "top" }}
          onClick={() => confirmDelete(rowData)}
          className="kemetra-action-btn-delete"
        />
      </div>
    );
  };

  const statusBodyTemplate = (rowData) => {
    const getSeverity = (status: string) => {
      switch (status) {
        case "Active":
          return "success";
        case "Inactive":
          return "warning";
        default:
          return "info";
      }
    };

    return (
      <Tag
        value={rowData.status}
        severity={getSeverity(rowData.status)}
        className="kemetra-portal-status-tag"
      />
    );
  };

  const nameBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm kemetra-user-name-avatar">
          {rowData.firstName.charAt(0)}
          {rowData.lastName.charAt(0)}
        </div>
        <span className="kemetra-user-name-text">
          {rowData.firstName} {rowData.lastName}
        </span>
      </div>
    );
  };

  return (
    <div>
      <ConfirmDialog />

      <PageHeader
        title="Users Management"
        description="Manage system users and permissions"
        actionLabel="Add User"
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
              <p className="kemetra-empty-state-title">No users found</p>
              <p className="kemetra-empty-state-description">
                Get started by adding your first user
              </p>
              <Button
                label="Add User"
                icon={<Plus size={18} />}
                onClick={openNew}
                className="kemetra-empty-state-button"
              />
            </div>
          }
          rowHover
          stripedRows
          pt={{
            header: {
              className: "kemetra-table-header",
            },
            thead: {
              className: "kemetra-table-thead",
            },
            tbody: {
              className: "kemetra-table-tbody",
            },
            bodyRow: {
              className: "kemetra-table-row-transition",
            },
          }}
        >
          <Column
            field="email"
            header="Email"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-email"
          />
          <Column
            field="firstName"
            header="First Name"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-name"
          />
          <Column
            field="lastName"
            header="Last Name"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-name"
          />
          <Column
            body={statusBodyTemplate}
            header="Status"
            sortable
            field="status"
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-padding"
          />
          <Column
            body={actionBodyTemplate}
            header="Actions"
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-padding"
          />
        </DataTable>
      </div>

      <UserFormDialog
        visible={visible}
        selectedUser={selectedUser}
        formData={formData}
        onHide={hideDialog}
        onSave={save}
        onFormDataChange={setFormData}
      />
    </div>
  );
};

export default UsersPage;
