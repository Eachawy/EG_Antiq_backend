import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { Avatar } from "primereact/avatar";
import PageHeader from "app/shared/components/page-header/page-header";
import {
  Inbox,
  Eye,
  Download,
  Trash2,
  User as UserIcon,
  FileText,
  FileSpreadsheet,
  FileJson,
  X,
} from "lucide-react";
import UserHistoryDetailDialog from "./UserHistoryDetailDialog";
import { useAppDispatch, useAppSelector } from "app/config/store";
import {
  getUserHistoryListData,
  deleteUserHistoryData,
} from "./user-history.reducer";

const UserHistoryPage = () => {
  const dispatch = useAppDispatch();
  const toast = useRef<Toast>(null);

  const [history, setHistory] = useState([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [exportDialogVisible, setExportDialogVisible] = useState(false);

  const $UserHistoryList = useAppSelector(
    (state) => state.UserHistory.userHistoryList,
  );
  const loading = useAppSelector((state) => state.UserHistory.loading);
  const deleteSuccess = useAppSelector(
    (state) => state.UserHistory.deleteSuccess,
  );

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

  useEffect(() => {
    if (deleteSuccess) {
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Browsing history entry deleted successfully",
        life: 3000,
      });
      fetchData();
    }
  }, [deleteSuccess]);

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

  const confirmDelete = (record) => {
    confirmDialog({
      message: `Are you sure you want to delete this browsing history entry?`,
      header: "Confirm Delete",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => handleDelete(record.id),
    });
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteUserHistoryData(id));
  };

  const exportHistory = () => {
    setExportDialogVisible(true);
  };

  const handleExport = (format: string) => {
    if (!history || history.length === 0) {
      toast.current?.show({
        severity: "warn",
        summary: "No Data",
        detail: "No browsing history data to export",
        life: 3000,
      });
      setExportDialogVisible(false);
      return;
    }

    try {
      if (format === "CSV") {
        exportAsCSV();
      } else if (format === "Excel") {
        exportAsExcel();
      } else if (format === "JSON") {
        exportAsJSON();
      }

      toast.current?.show({
        severity: "success",
        summary: "Export Successful",
        detail: `Browsing history exported as ${format}`,
        life: 3000,
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Export Failed",
        detail: "Failed to export browsing history",
        life: 3000,
      });
    }

    setExportDialogVisible(false);
  };

  const exportAsCSV = () => {
    // CSV Headers
    const headers = [
      "Portal User",
      "Email",
      "Monument (EN)",
      "Monument (AR)",
      "Visit Date",
      "Visit Time",
      "Duration (seconds)",
    ];

    // Convert data to CSV rows
    const rows = history.map((item) => [
      `${item.portalUser?.firstName || ""} ${item.portalUser?.lastName || ""}`,
      item.portalUser?.email || "",
      item.monument?.monumentNameEn || "",
      item.monument?.monumentNameAr || "",
      new Date(item.visitedAt).toLocaleDateString(),
      new Date(item.visitedAt).toLocaleTimeString(),
      item.durationSeconds || 0,
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    // Download file
    downloadFile(csvContent, "browsing-history.csv", "text/csv");
  };

  const exportAsExcel = () => {
    // Create Excel-compatible CSV with BOM for proper encoding
    const headers = [
      "Portal User",
      "Email",
      "Monument (EN)",
      "Monument (AR)",
      "Visit Date",
      "Visit Time",
      "Duration (seconds)",
    ];

    const rows = history.map((item) => [
      `${item.portalUser?.firstName || ""} ${item.portalUser?.lastName || ""}`,
      item.portalUser?.email || "",
      item.monument?.monumentNameEn || "",
      item.monument?.monumentNameAr || "",
      new Date(item.visitedAt).toLocaleDateString(),
      new Date(item.visitedAt).toLocaleTimeString(),
      item.durationSeconds || 0,
    ]);

    const csvContent = [
      headers.join("\t"),
      ...rows.map((row) => row.join("\t")),
    ].join("\n");

    // Add BOM for UTF-8 encoding in Excel
    const bom = "\uFEFF";
    downloadFile(
      bom + csvContent,
      "browsing-history.xls",
      "application/vnd.ms-excel",
    );
  };

  const exportAsJSON = () => {
    const jsonData = history.map((item) => ({
      id: item.id,
      portalUser: {
        name: `${item.portalUser?.firstName || ""} ${item.portalUser?.lastName || ""}`,
        email: item.portalUser?.email || "",
      },
      monument: {
        nameEn: item.monument?.monumentNameEn || "",
        nameAr: item.monument?.monumentNameAr || "",
      },
      visitedAt: item.visitedAt,
      durationSeconds: item.durationSeconds || 0,
    }));

    const jsonContent = JSON.stringify(jsonData, null, 2);
    downloadFile(jsonContent, "browsing-history.json", "application/json");
  };

  const downloadFile = (
    content: string,
    fileName: string,
    mimeType: string,
  ) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const userBodyTemplate = (rowData) => {
    const user = rowData.portalUser;
    if (!user)
      return <span className="kemetra-text-secondary">Unknown User</span>;
    return (
      <div className="kemetra-user-cell">
        <Avatar
          icon={<UserIcon size={16} />}
          shape="circle"
          className="kemetra-avatar-small kemetra-avatar-gold"
        />
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
        <div className="kemetra-monument-cell-name-en">
          {monument.monumentNameEn}
        </div>
        <div className="kemetra-monument-cell-name-ar">
          {monument.monumentNameAr}
        </div>
      </div>
    );
  };

  const visitedAtBodyTemplate = (rowData) => {
    const date = new Date(rowData.visitedAt);
    return (
      <div>
        <div className="text-sm">{date.toLocaleDateString()}</div>
        <div className="text-xs text-gray-500">{date.toLocaleTimeString()}</div>
      </div>
    );
  };

  const durationBodyTemplate = (rowData) => {
    if (!rowData.durationSeconds)
      return <span className="kemetra-text-secondary">-</span>;
    const minutes = Math.floor(rowData.durationSeconds / 60);
    const seconds = rowData.durationSeconds % 60;
    return (
      <div className="text-sm">
        {minutes > 0 && `${minutes}m `}
        {seconds}s
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
        <Button
          icon={<Trash2 size={16} />}
          rounded
          text
          severity="danger"
          tooltip="Delete Entry"
          onClick={() => confirmDelete(rowData)}
          className="kemetra-action-btn-delete"
        />
      </div>
    );
  };

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />

      <PageHeader
        title="Browsing History Management"
        description="View and manage portal users' monument browsing history"
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
                No browsing history found
              </p>
              <p className="text-sm mb-4 kemetra-empty-state-description">
                Monument visits will appear here
              </p>
            </div>
          }
          rowHover
          stripedRows
        >
          <Column
            body={userBodyTemplate}
            header="Portal User"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-primary"
          />
          <Column
            body={monumentBodyTemplate}
            header="Monument Visited"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-secondary"
          />
          <Column
            body={visitedAtBodyTemplate}
            header="Visit Date"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell"
          />
          <Column
            body={durationBodyTemplate}
            header="Duration"
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

      <Dialog
        visible={exportDialogVisible}
        onHide={() => setExportDialogVisible(false)}
        header={
          <div className="kemetra-dialog-header">
            <Download className="kemetra-dialog-header-icon" />
            <span className="kemetra-dialog-header-title">
              Export Browsing History
            </span>
          </div>
        }
        footer={
          <div className="kemetra-dialog-footer">
            <Button
              label="Cancel"
              icon={<X size={18} />}
              onClick={() => setExportDialogVisible(false)}
              className="kemetra-btn-secondary"
            />
          </div>
        }
        className="kemetra-dialog kemetra-dialog-width-40"
      >
        <div className="kemetra-form">
          <p className="text-sm text-gray-600 mb-4">
            Select a format to export the browsing history data:
          </p>
          <div className="flex flex-col gap-3">
            <Button
              label="Export as CSV"
              icon={<FileText size={18} />}
              onClick={() => handleExport("CSV")}
              className="kemetra-btn-secondary w-full justify-start"
            />
            <Button
              label="Export as Excel"
              icon={<FileSpreadsheet size={18} />}
              onClick={() => handleExport("Excel")}
              className="kemetra-btn-secondary w-full justify-start"
            />
            <Button
              label="Export as JSON"
              icon={<FileJson size={18} />}
              onClick={() => handleExport("JSON")}
              className="kemetra-btn-secondary w-full justify-start"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default UserHistoryPage;
