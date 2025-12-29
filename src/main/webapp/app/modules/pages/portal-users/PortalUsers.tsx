import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import PageHeader from "app/shared/components/page-header/page-header";
import { Plus, Inbox, PenLine, Trash2, AlertTriangle } from "lucide-react";
import PortalUserFormDialog from "./PortalUserFormDialog";

const PortalUsersPage = () => {
  const initialPortalUsers = [
    {
      id: "1",
      avatar: "https://i.pravatar.cc/150?img=12",
      email: "nour.elsayed@example.com",
      firstName: "Nour",
      lastName: "El-Sayed",
      phone: "+20 100 123 4567",
      location: "Cairo, Egypt",
      emailVerified: true,
      status: "Active",
    },
  ];
  const [users, setUsers] = useState(initialPortalUsers);
  const [visible, setVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});

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

  const save = () => {
    hideDialog();
  };

  const confirmDelete = (user) => {
    confirmDialog({
      message: `${"Are you sure you want to delete portal user"} "${user.firstName} ${user.lastName}"?`,
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
