import React, { useState, useEffect } from "react";
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
import { useAppDispatch, useAppSelector } from "app/config/store";
import {
  getFavouritesListData,
  createFavourite,
  deleteFavourite,
} from "./favourites.reducer";
import { getPortalUsersListData } from "../portal-users/portal-users.reducer";
import { getMonumentsListData } from "../monuments/monuments.reducer";
import { toast } from "react-toastify";

const FavouritesPage = (props) => {
  const dispatch = useAppDispatch();

  const [favourites, setFavourites] = useState([]);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({});

  const $FavouritesList = useAppSelector(
    (state) => state.Favourites.favouritesList,
  );
  const loading = useAppSelector((state) => state.Favourites.loading);

  const $PortalUsersList = useAppSelector(
    (state) => state.PortalUsers.portalUsersList,
  );
  const $MonumentsList = useAppSelector(
    (state) => state.Monuments.monumentsList,
  );

  const [portalUsers, setPortalUsers] = useState([]);
  const [monuments, setMonuments] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if ($FavouritesList) {
      if ($FavouritesList.data && Array.isArray($FavouritesList.data)) {
        setFavourites($FavouritesList.data);
      } else if (Array.isArray($FavouritesList)) {
        setFavourites($FavouritesList);
      }
    }
  }, [$FavouritesList]);

  useEffect(() => {
    if ($PortalUsersList) {
      if ($PortalUsersList.data && Array.isArray($PortalUsersList.data)) {
        setPortalUsers($PortalUsersList.data);
      } else if (Array.isArray($PortalUsersList)) {
        setPortalUsers($PortalUsersList);
      }
    }
  }, [$PortalUsersList]);

  useEffect(() => {
    if ($MonumentsList) {
      if ($MonumentsList.data && Array.isArray($MonumentsList.data)) {
        setMonuments($MonumentsList.data);
      } else if (Array.isArray($MonumentsList)) {
        setMonuments($MonumentsList);
      }
    }
  }, [$MonumentsList]);

  const fetchData = async () => {
    await dispatch(getFavouritesListData());
    await dispatch(getPortalUsersListData());
    await dispatch(getMonumentsListData());
  };

  const openNew = () => {
    setFormData({});
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
  };

  const saveFavourite = async () => {
    try {
      await dispatch(createFavourite(formData)).unwrap();
      toast.success("Favourite added successfully!");
      hideDialog();
      await dispatch(getFavouritesListData());
    } catch (error) {
      toast.error("An error occurred while adding the favourite.");
      console.error("Save error:", error);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await dispatch(deleteFavourite(id)).unwrap();
      toast.success("Favourite removed successfully!");
      await dispatch(getFavouritesListData());
    } catch (error) {
      toast.error("An error occurred while removing the favourite.");
      console.error("Delete error:", error);
    }
  };

  const confirmDelete = (favourite) => {
    confirmDialog({
      message: "Are you sure you want to remove this favourite?",
      header: "Delete Confirmation",
      icon: <AlertTriangle className="kemetra-confirm-icon" />,
      acceptClassName: "kemetra-btn-danger",
      accept: () => handleDelete(favourite.id),
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
          loading={loading}
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
        portalUsers={portalUsers}
        monuments={monuments}
        setFormData={setFormData}
        onHide={hideDialog}
        onSave={saveFavourite}
      />
    </div>
  );
};

export default FavouritesPage;
