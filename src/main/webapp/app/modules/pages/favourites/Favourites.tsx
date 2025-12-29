import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Avatar } from "primereact/avatar";
import PageHeader from "app/shared/components/page-header/page-header";
import {
  Plus,
  Inbox,
  Trash2,
  AlertTriangle,
  User as UserIcon,
} from "lucide-react";
import FavouriteFormDialog from "./FavouriteFormDialog";

const FavouritesPage = (props) => {
  const mockPortalUsers = [
    {
      id: "1",
      firstName: "Nour",
      lastName: "El-Sayed",
      email: "nour.elsayed@example.com",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
  ];

  const mockMonuments = [
    { id: "1", nameEn: "Great Pyramid of Giza", nameAr: "الهرم الأكبر" },
    { id: "2", nameEn: "Karnak Temple", nameAr: "معبد الكرنك" },
  ];
  const [favourites, setFavourites] = useState([]);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({});

  const openNew = () => {
    setFormData({});
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
  };

  const saveFavourite = () => {
    hideDialog();
  };

  const confirmDelete = (favourite) => {
    confirmDialog({
      message: "Are you sure you want to remove this favourite?",
      header: "Delete Confirmation",
      icon: <AlertTriangle className="kemetra-confirm-icon" />,
      acceptClassName: "kemetra-btn-danger",
      // accept: () => {
      //   setFavourites(favourites.filter((f) => f.id !== favourite.id));
      // },
    });
  };

  const portalUserBodyTemplate = (rowData) => {
    const user = rowData.portalUser;
    if (!user)
      return <span className="kemetra-text-secondary">Unknown User</span>;
    return (
      <div className="kemetra-user-cell">
        {user.avatar ? (
          <Avatar
            image={user.avatar}
            shape="circle"
            className="kemetra-avatar-small"
          />
        ) : (
          <Avatar
            icon={<UserIcon size={16} />}
            shape="circle"
            className="kemetra-avatar-small kemetra-avatar-gold"
          />
        )}
        <div>
          <div className="kemetra-user-cell-name">
            {user.firstName} {user.lastName}
          </div>
          <div className="kemetra-user-cell-email">{user.email}</div>
        </div>
      </div>
    );
  };

  const monumentBodyTemplate = (rowData) => {
    const monument = rowData.monument;
    if (!monument)
      return <span className="kemetra-text-secondary">Unknown Monument</span>;
    return (
      <div className="kemetra-monument-cell">
        <div className="kemetra-monument-cell-name-en">{monument.nameEn}</div>
        <div className="kemetra-monument-cell-name-ar">{monument.nameAr}</div>
      </div>
    );
  };

  const actionsBodyTemplate = (rowData) => {
    return (
      <div className="kemetra-table-actions">
        <Button
          icon={<Trash2 size={18} />}
          className="kemetra-btn-icon-danger"
          onClick={() => confirmDelete(rowData)}
          tooltip="Delete"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  return (
    <div>
      <ConfirmDialog />
      <PageHeader
        title="Favourites Management"
        description="Manage user favourites and bookmarked monuments"
        actionLabel="Add Favourite"
        actionIcon={<Plus size={20} />}
        onAction={openNew}
      />

      <div className="kemetra-table-container">
        <DataTable
          value={favourites}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage={
            <div className="kemetra-empty-state-container">
              <Inbox size={48} className="kemetra-empty-state-icon" />
              <p className="kemetra-empty-state-title">No favourites found</p>
              <Button
                label="Add Favourite"
                icon={<Plus size={18} />}
                className="kemetra-empty-state-button"
                onClick={openNew}
              />
            </div>
          }
          rowHover
          stripedRows
        >
          <Column
            field="portalUser"
            header="Portal User"
            body={portalUserBodyTemplate}
            sortable
            headerClassName="kemetra-table-header-cell"
            bodyClassName="kemetra-table-body-cell"
          />
          <Column
            field="monument"
            header="Monument"
            body={monumentBodyTemplate}
            sortable
            headerClassName="kemetra-table-header-cell"
            bodyClassName="kemetra-table-body-cell"
          />
          <Column
            body={actionsBodyTemplate}
            headerClassName="kemetra-table-header-cell"
            bodyClassName="kemetra-table-body-cell"
          />
        </DataTable>
      </div>

      <FavouriteFormDialog
        visible={visible}
        formData={formData}
        portalUsers={mockPortalUsers}
        monuments={mockMonuments}
        setFormData={setFormData}
        onHide={hideDialog}
        onSave={saveFavourite}
      />
    </div>
  );
};

export default FavouritesPage;
