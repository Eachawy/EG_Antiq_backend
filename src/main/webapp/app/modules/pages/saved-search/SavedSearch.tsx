import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import PageHeader from "app/shared/components/page-header/page-header";
import {
  Plus,
  Inbox,
  Trash2,
  AlertTriangle,
  User as UserIcon,
  Hash,
} from "lucide-react";
import SavedSearchFormDialog from "./SavedSearchFormDialog";
import { useAppDispatch, useAppSelector } from "app/config/store";
import {
  getSavedSearchesListData,
  createSavedSearch,
  deleteSavedSearch,
} from "./saved-search.reducer";
import { getPortalUsersListData } from "../portal-users/portal-users.reducer";
import { getErasListData } from "../eras/eras.reducer";
import { toast } from "react-toastify";

const SavedSearchPage = () => {
  const dispatch = useAppDispatch();

  const [searches, setSearches] = useState([]);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({});

  const $SavedSearchesList = useAppSelector(
    (state) => state.SavedSearches.savedSearchesList,
  );
  const loading = useAppSelector((state) => state.SavedSearches.loading);

  const $PortalUsersList = useAppSelector(
    (state) => state.PortalUsers.portalUsersList,
  );
  const $ErasList = useAppSelector((state) => state.Eras.earsList);
  const erasLoading = useAppSelector((state) => state.Eras.loading);

  const [portalUsers, setPortalUsers] = useState([]);
  const [eras, setEras] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if ($SavedSearchesList) {
      if ($SavedSearchesList.data && Array.isArray($SavedSearchesList.data)) {
        setSearches($SavedSearchesList.data);
      } else if (Array.isArray($SavedSearchesList)) {
        setSearches($SavedSearchesList);
      }
    }
  }, [$SavedSearchesList]);

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
    if ($ErasList) {
      if ($ErasList.data && Array.isArray($ErasList.data)) {
        setEras($ErasList.data);
      } else if (Array.isArray($ErasList)) {
        setEras($ErasList);
      }
    }
  }, [$ErasList]);

  const fetchData = async () => {
    await dispatch(getSavedSearchesListData());
    await dispatch(getPortalUsersListData());
    await dispatch(getErasListData());
  };

  const openNew = () => {
    setFormData({ resultCount: 0 });
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
  };

  const saveSearch = async () => {
    try {
      await dispatch(createSavedSearch(formData)).unwrap();
      toast.success("Search saved successfully!");
      hideDialog();
      await dispatch(getSavedSearchesListData());
    } catch (error) {
      toast.error("An error occurred while saving the search.");
      console.error("Save error:", error);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await dispatch(deleteSavedSearch(id)).unwrap();
      toast.success("Saved search deleted successfully!");
      await dispatch(getSavedSearchesListData());
    } catch (error) {
      toast.error("An error occurred while deleting the saved search.");
      console.error("Delete error:", error);
    }
  };

  const confirmDelete = (search) => {
    confirmDialog({
      message: "Are you sure you want to delete this saved search?",
      header: "Delete Confirmation",
      icon: <AlertTriangle className="kemetra-confirm-icon" />,
      acceptClassName: "kemetra-btn-danger",
      accept: () => handleDelete(search.id),
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

  const keywordBodyTemplate = (rowData) => {
    return (
      <span className="kemetra-keyword-cell">
        {rowData.keyword || <span className="kemetra-text-secondary">-</span>}
      </span>
    );
  };

  const eraBodyTemplate = (rowData: any) => {
    // SavedSearch stores eraIds as an array
    const eraIds = rowData.eraIds || [];

    // If no eras selected in this search
    if (!eraIds || eraIds.length === 0) {
      return <span className="kemetra-text-secondary">-</span>;
    }

    // If eras data not loaded yet, show loading
    if (!eras || eras.length === 0) {
      return <span className="kemetra-text-secondary">Loading...</span>;
    }

    // Get era names for all IDs in the array
    const eraNames = eraIds
      .map((eraId: number) => {
        const era = eras.find((e: any) => e.id === eraId);
        return era ? era.nameEn || era.name_en : null;
      })
      .filter(Boolean);

    // If couldn't find any matching eras
    if (eraNames.length === 0) {
      return <span className="kemetra-text-secondary">-</span>;
    }

    return (
      <div className="kemetra-bilingual-cell">
        <div className="kemetra-bilingual-cell-en">{eraNames.join(", ")}</div>
      </div>
    );
  };

  const resultCountBodyTemplate = (rowData) => {
    return (
      <div className="kemetra-result-count-cell">
        <Hash size={16} className="kemetra-result-count-icon" />
        <Badge
          value={rowData.resultCount}
          className="kemetra-badge-result-count"
        />
        <span className="kemetra-result-count-label">results</span>
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
        title="Saved Search Management"
        description="Manage user saved searches and queries"
        actionLabel="Add Saved Search"
        actionIcon={<Plus size={20} />}
        onAction={openNew}
      />

      <div className="kemetra-table-container">
        <DataTable
          key={`datatable-${eras.length}`}
          value={searches}
          loading={loading || erasLoading}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage={
            <div className="kemetra-empty-state-container">
              <Inbox size={48} className="kemetra-empty-state-icon" />
              <p className="kemetra-empty-state-title">
                No saved searches found
              </p>
              <Button
                label="Add Saved Search"
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
            field="keyword"
            header="Keyword"
            body={keywordBodyTemplate}
            sortable
            headerClassName="kemetra-table-header-cell"
            bodyClassName="kemetra-table-body-cell"
          />
          <Column
            field="era"
            header="Era"
            body={eraBodyTemplate}
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

      <SavedSearchFormDialog
        visible={visible}
        formData={formData}
        portalUsers={portalUsers}
        eras={eras}
        setFormData={setFormData}
        onHide={hideDialog}
        onSave={saveSearch}
      />
    </div>
  );
};

export default SavedSearchPage;
