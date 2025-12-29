import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import PageHeader from "app/shared/components/page-header/page-header";
import { Trash2, Plus, AlertTriangle, Inbox, PenLine } from "lucide-react";
import MonumentsEraFormDialog from "./MonumentsEraFormDialog";

const MonumentsEraPage = () => {
  const [monumentsEra, setMonumentsEra] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});

  // Mock data
  const monuments = [
    { label: "Pyramids of Giza", value: "1" },
    { label: "Karnak Temple", value: "2" },
    { label: "Abu Simbel", value: "3" },
  ];

  const eras = [
    { label: "Old Kingdom", value: "1" },
    { label: "Middle Kingdom", value: "2" },
    { label: "New Kingdom", value: "3" },
  ];

  const openNew = () => {
    setFormData({});
    setSelectedItem(null);
    setVisible(true);
  };

  const openEdit = (item) => {
    setFormData(item);
    setSelectedItem(item);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setFormData({});
    setSelectedItem(null);
  };

  const save = () => {
    hideDialog();
  };

  const confirmDelete = (item) => {
    confirmDialog({
      message: "Are you sure you want to delete this link?",
      header: "Confirm Deletion",
      icon: <AlertTriangle size={24} className="text-red-500" />,
      acceptClassName: "p-button-danger",
      // accept: () => {
      //   setMonumentsEra(monumentsEra.filter(me => me.id !== item.id));
      // }
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

  const monumentBodyTemplate = (rowData) => {
    return (
      monuments.find((m) => m.value === rowData.monumentId)?.label ||
      rowData.monumentId
    );
  };

  const eraBodyTemplate = (rowData) => {
    return eras.find((e) => e.value === rowData.eraId)?.label || rowData.eraId;
  };

  return (
    <div>
      <ConfirmDialog />

      <PageHeader
        title="Monuments Era Management"
        description="Link monuments to historical eras"
        actionLabel="Link Monument to Era"
        onAction={openNew}
      />

      <div className="kemetra-page-table-container">
        <DataTable
          value={monumentsEra}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage={
            <div className="kemetra-empty-state-container">
              <Inbox size={48} className="kemetra-empty-state-icon" />
              <p className="kemetra-empty-state-title">
                No monument-era links found
              </p>
              <p className="kemetra-empty-state-desc">
                Get started by linking a monument to an era
              </p>
              <Button
                label="Link Monument to Era"
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
            body={monumentBodyTemplate}
            header="Monument"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-primary"
          />
          <Column
            body={eraBodyTemplate}
            header="Era"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-primary"
          />
          <Column
            body={actionBodyTemplate}
            header="Actions"
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell"
          />
        </DataTable>
      </div>

      <MonumentsEraFormDialog
        visible={visible}
        selectedItem={selectedItem}
        formData={formData}
        monuments={monuments}
        eras={eras}
        onHide={hideDialog}
        onSave={save}
        onFormDataChange={setFormData}
      />
    </div>
  );
};

export default MonumentsEraPage;
