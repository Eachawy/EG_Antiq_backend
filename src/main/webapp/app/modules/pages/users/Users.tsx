import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Tag } from "primereact/tag";
import PageHeader from "app/shared/components/page-header/page-header";
import UserFormDialog from "./UserFormDialog";
import { Plus, Inbox, PenLine, Trash2, AlertTriangle } from "lucide-react";

const UsersPage = () => {
  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
    { label: "Suspended", value: "Suspended" },
  ];

  // Mock initial data
  const initialUsers = [
    {
      id: "1",
      email: "ahmed.hassan@kemetra.eg",
      firstName: "Ahmed",
      lastName: "Hassan",
      status: "Active",
    },
    {
      id: "2",
      email: "fatima.mohamed@kemetra.eg",
      firstName: "Fatima",
      lastName: "Mohamed",
      status: "Active",
    },
    {
      id: "3",
      email: "omar.ali@kemetra.eg",
      firstName: "Omar",
      lastName: "Ali",
      status: "Inactive",
    },
    {
      id: "4",
      email: "sarah.ibrahim@kemetra.eg",
      firstName: "Sarah",
      lastName: "Ibrahim",
      status: "Active",
    },
    {
      id: "5",
      email: "youssef.kamal@kemetra.eg",
      firstName: "Youssef",
      lastName: "Kamal",
      status: "Suspended",
    },
  ];
  const [users, setUsers] = useState(initialUsers);
  const [visible, setVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});

  const openNew = () => {
    setFormData({ status: "Active" });
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

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const save = () => {
    // Validation
    hideDialog();
  };

  const confirmDelete = (user) => {
    confirmDialog({
      message: `Are you sure you want to delete user "${user.firstName} ${user.lastName}"?`,
      header: "Confirm Deletion",
      icon: <AlertTriangle size={24} className="text-red-500" />,
      acceptClassName: "p-button-danger",
      // accept: () => {
      //   setUsers(users.filter((u) => u.id !== user.id));
      // },
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
