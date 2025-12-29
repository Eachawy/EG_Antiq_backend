import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import PageHeader from "app/shared/components/page-header/page-header";
import { Trash2, Plus, AlertTriangle, Inbox, PenLine } from "lucide-react";
import MonumentsTypeFormDialog from "./MonumentsTypeFormDialog";

const MonumentsTypePage = () => {
  const [types, setTypes] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData] = useState({});

  const openNew = () => {
    setFormData({});
    setSelectedType(null);
    setVisible(true);
  };

  const openEdit = (type) => {
    setFormData(type);
    setSelectedType(type);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setFormData({});
    setSelectedType(null);
  };

  const saveType = () => {
    hideDialog();
  };

  const confirmDelete = (type) => {
    confirmDialog({
      message: `Are you sure you want to delete ${type.nameEn}?`,
      header: "Confirm Deletion",
      icon: <AlertTriangle size={24} className="text-red-500" />,
      acceptClassName: "p-button-danger",
      // accept: () => {
      //   setTypes(types.filter((t) => t.id !== type.id));
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

  return (
    <div>
      <ConfirmDialog />

      <PageHeader
        title="Monuments Type Management"
        description="Manage different types of monuments"
        actionLabel="Add Type"
        onAction={openNew}
      />

      <div className="kemetra-page-table-container">
        <DataTable
          value={types}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage={
            <div className="kemetra-empty-state-container">
              <Inbox size={48} className="kemetra-empty-state-icon" />
              <p className="kemetra-empty-state-title">
                No monument types found
              </p>
              <p className="kemetra-empty-state-desc">
                Get started by adding your first monument type
              </p>
              <Button
                label="Add Type"
                icon={<Plus size={18} />}
                onClick={openNew}
                className="kemetra-empty-state-btn"
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
              className: "kemetra-table-row",
            },
          }}
        >
          <Column
            field="nameEn"
            header="Name (English)"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-primary"
          />
          <Column
            field="nameAr"
            header="Name (Arabic)"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-arabic-rtl"
          />
          <Column
            body={actionBodyTemplate}
            header="Actions"
            style={{ width: "120px" }}
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell"
          />
        </DataTable>
      </div>

      <MonumentsTypeFormDialog
        visible={visible}
        selectedType={selectedType}
        formData={formData}
        onHide={hideDialog}
        onSave={saveType}
        onFormDataChange={setFormData}
      />
    </div>
  );
};

export default MonumentsTypePage;
