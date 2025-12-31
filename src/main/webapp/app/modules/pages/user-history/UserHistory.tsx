import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Tag } from "primereact/tag";
import { Avatar } from "primereact/avatar";
import PageHeader from "app/shared/components/page-header/page-header";
import { Inbox, Eye, Download, User as UserIcon } from "lucide-react";
import UserHistoryDetailDialog from "./UserHistoryDetailDialog";
import { useAppDispatch, useAppSelector } from "app/config/store";
import { getUserHistoryListData } from "./user-history.reducer";

const UserHistoryPage = () => {
  const dispatch = useAppDispatch();

  const [history, setHistory] = useState([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const $UserHistoryList = useAppSelector(
    (state) => state.UserHistory.userHistoryList,
  );
  const loading = useAppSelector((state) => state.UserHistory.loading);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if ($UserHistoryList) {
      if ($UserHistoryList.data && Array.isArray($UserHistoryList.data)) {
        setHistory($UserHistoryList.data);
      } else if (Array.isArray($UserHistoryList)) {
        setHistory($UserHistoryList);
      }
    }
  }, [$UserHistoryList]);

  const fetchData = async () => {
    await dispatch(getUserHistoryListData());
  };

  const viewDetails = (record) => {
    setSelectedHistory(record);
    setDetailVisible(true);
  };

  const hideDetailDialog = () => {
    setDetailVisible(false);
    setSelectedHistory(null);
  };

  const exportHistory = () => {};

  const userBodyTemplate = (rowData) => {
    return (
      <div className="kemetra-user-cell">
        <Avatar
          icon={<UserIcon size={16} />}
          shape="circle"
          className="kemetra-avatar-small kemetra-avatar-gold"
        />
        <div>
          <div className="kemetra-user-cell-name">{rowData.userName}</div>
          <div className="kemetra-user-cell-email">{rowData.userEmail}</div>
        </div>
      </div>
    );
  };

  const actionTypeBodyTemplate = (rowData) => {
    const getSeverity = (type: string) => {
      switch (type) {
        case "Create":
          return "success";
        case "Update":
          return "info";
        case "Delete":
          return "danger";
        case "Login":
          return "success";
        case "Logout":
          return "warning";
        default:
          return "secondary";
      }
    };

    return (
      <Tag
        value={rowData.actionType}
        severity={getSeverity(rowData.actionType) as any}
      />
    );
  };

  const timestampBodyTemplate = (rowData) => {
    const date = new Date(rowData.timestamp);
    return (
      <div>
        <div className="text-sm">{date.toLocaleDateString()}</div>
        <div className="text-xs text-gray-500">{date.toLocaleTimeString()}</div>
      </div>
    );
  };

  const targetBodyTemplate = (rowData) => {
    if (!rowData.targetEntity)
      return <span className="kemetra-text-secondary">-</span>;
    return (
      <div>
        <div className="text-sm">{rowData.targetEntity}</div>
        {rowData.targetId && (
          <div className="text-xs text-gray-500">{rowData.targetId}</div>
        )}
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon={<Eye size={16} />}
          rounded
          text
          tooltip="View Details"
          onClick={() => viewDetails(rowData)}
          className="kemetra-action-btn-view"
        />
      </div>
    );
  };

  return (
    <div>
      <ConfirmDialog />

      <PageHeader
        title="User History Management"
        description="View and manage user activity history"
        actionLabel="Export History"
        actionIcon={<Download size={20} />}
        onAction={exportHistory}
      />

      <div className="kemetra-table-container">
        <DataTable
          value={history}
          loading={loading}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage={
            <div className="kemetra-empty-state-container">
              <Inbox size={48} className="kemetra-empty-state-icon" />
              <p className="text-lg font-medium mb-2 kemetra-empty-state-title">
                No user history found
              </p>
              <p className="text-sm mb-4 kemetra-empty-state-description">
                User activity will appear here
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
            field="action"
            header="Action"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-secondary"
          />
          <Column
            body={actionTypeBodyTemplate}
            header="Type"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell"
          />
          <Column
            body={targetBodyTemplate}
            header="Target"
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell"
          />
          <Column
            body={timestampBodyTemplate}
            header="Timestamp"
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

      <UserHistoryDetailDialog
        visible={detailVisible}
        selectedHistory={selectedHistory}
        onHide={hideDetailDialog}
      />
    </div>
  );
};

export default UserHistoryPage;
