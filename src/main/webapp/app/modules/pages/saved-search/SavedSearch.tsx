import React, { useState } from "react";
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

const SavedSearchPage = () => {
  const mockPortalUsers = [
    {
      id: "1",
      firstName: "Nour",
      lastName: "El-Sayed",
      email: "nour.elsayed@example.com",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
  ];

  const mockEras = [
    { id: "1", nameEn: "Pharaonic", nameAr: "الفرعونية" },
    { id: "2", nameEn: "Ptolemaic", nameAr: "البطلمي" },
  ];
  const [searches, setSearches] = useState([]);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({});

  const openNew = () => {
    setFormData({ resultCount: 0 });
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
  };

  const saveSearch = () => {
    hideDialog();
  };

  const confirmDelete = (search) => {
    confirmDialog({
      message: "Are you sure you want to delete this saved search?",
      header: "Delete Confirmation",
      icon: <AlertTriangle className="kemetra-confirm-icon" />,
      acceptClassName: "kemetra-btn-danger",
      // accept: () => {
      //   setSearches(searches.filter((s) => s.id !== search.id));
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

  const keywordBodyTemplate = (rowData) => {
    return (
      <span className="kemetra-keyword-cell">
        {rowData.keyword || <span className="kemetra-text-secondary">-</span>}
      </span>
    );
  };

  const eraBodyTemplate = (rowData) => {
    const era = rowData.era;
    if (!era) return <span className="kemetra-text-secondary">-</span>;
    return (
      <div className="kemetra-bilingual-cell">
        <div className="kemetra-bilingual-cell-en">{era.nameEn}</div>
        <div className="kemetra-bilingual-cell-ar">{era.nameAr}</div>
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
          value={searches}
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
        portalUsers={mockPortalUsers}
        eras={mockEras}
        setFormData={setFormData}
        onHide={hideDialog}
        onSave={saveSearch}
      />
    </div>
  );
};

export default SavedSearchPage;
