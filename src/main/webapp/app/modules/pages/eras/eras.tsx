import "./eras.scss";

import React, { useState } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";

import { useAppSelector } from "app/config/store";
import { ToastContainer } from "react-toastify";
import {
  PenLine,
  Trash2,
  Plus,
  Clock,
  AlertCircle,
  X,
  Save,
  PackageOpen,
  Sparkles,
} from "lucide-react";
import { Era } from "../types";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { PageHeader } from "app/shared/components/page-header/page-header";

export const ErasManagement = () => {
  const account = useAppSelector((state) => state.authentication.account);
  const [eras, setEras] = useState<Era[]>([
    {
      id: "1",
      nameEn: "Pharaonic",
      nameAr: "الفرعونية",
      from: "5500 BC",
      to: "332 BC",
      Hijri_from: "-",
      Hijri_to: "-",
    },
    {
      id: "2",
      nameEn: "Ptolemaic",
      nameAr: "البطلمي",
      from: "332 BC",
      to: "30 BC",
      Hijri_from: "-",
      Hijri_to: "-",
    },
    {
      id: "3",
      nameEn: "Roman",
      nameAr: "الروماني",
      from: "30 BC",
      to: "395 AD",
      Hijri_from: "-",
      Hijri_to: "-",
    },
    {
      id: "4",
      nameEn: "Byzantine",
      nameAr: "البيزنطي",
      from: "395 AD",
      to: "641 AD",
      Hijri_from: "-",
      Hijri_to: "-",
    },
    {
      id: "5",
      nameEn: "Islamic",
      nameAr: "الإسلامي",
      from: "640 AD",
      to: "-",
      Hijri_from: "19 H",
      Hijri_to: "41 H",
    },
  ]);
  const [visible, setVisible] = useState(false);
  const [selectedEra, setSelectedEra] = useState<Era | null>(null);
  const [formData, setFormData] = useState<Partial<Era>>({});

  const openNew = () => {
    setFormData({});
    setSelectedEra(null);
    setVisible(true);
  };

  const openEdit = (era: Era) => {
    setFormData(era);
    setSelectedEra(era);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setFormData({});
    setSelectedEra(null);
  };

  const saveEra = () => {
    hideDialog();
  };

  const confirmDelete = (era: Era) => {
    confirmDialog({
      message: `Are you sure you want to delete ${era.nameEn}?`,
      header: "Confirm Deletion",
      icon: <AlertCircle size={24} className="text-red-500" />,
      acceptClassName: "p-button-danger",
      // accept: () => {
      //   setEras(eras.filter((e) => e.id !== era.id));
      // },
    });
  };

  const actionBodyTemplate = (rowData: Era) => {
    return (
      <div className="flex gap-2">
        <Button
          icon={<PenLine size={16} />}
          rounded
          text
          tooltip="Edit"
          tooltipOptions={{ position: "top" }}
          onClick={() => openEdit(rowData)}
          className="kemetra-btn-icon-edit"
        />
        <Button
          icon={<Trash2 size={16} />}
          rounded
          text
          tooltip="Delete"
          tooltipOptions={{ position: "top" }}
          onClick={() => confirmDelete(rowData)}
          className="kemetra-btn-icon-delete"
        />
      </div>
    );
  };

  return (
    <div>
      <ConfirmDialog />

      <PageHeader
        title="Eras Management"
        description="Manage historical eras and time periods"
        actionLabel="Add Era"
        onAction={openNew}
      />

      <div className="kemetra-table-container">
        <DataTable
          value={eras}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage={
            <div className="kemetra-empty-state">
              <PackageOpen
                size={48}
                className="mx-auto mb-4"
                style={{ color: "var(--color-text-tertiary)" }}
              />
              <p className="text-lg font-medium mb-2 kemetra-dialog-title">
                No eras found
              </p>
              <p className="text-sm mb-4 kemetra-page-description">
                Get started by adding your first era
              </p>
              <Button
                label="Add Era"
                icon={<Plus size={18} />}
                onClick={openNew}
                className="p-button-rounded kemetra-primary-btn"
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
              className: "kemetra-table-header",
            },
            tbody: {
              style: {
                backgroundColor: "var(--color-surface)",
              },
            },
            bodyRow: {
              className: "kemetra-table-row",
            },
          }}
        >
          <Column
            field="nameEn"
            header="English Name"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-primary"
          />
          <Column
            field="nameAr"
            header="Arabic Name"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-secondary"
          />
          <Column
            field="from"
            header="From (Birth Date)"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-secondary"
          />
          <Column
            field="to"
            header="To (Birth Date)"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-secondary"
          />
          <Column
            field="Hijri_from"
            header="From (Hijri)"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-secondary"
          />
          <Column
            field="Hijri_to"
            header="To (Hijri)"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-secondary"
          />
          <Column
            body={actionBodyTemplate}
            header="Actions"
            style={{ width: "120px" }}
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-secondary"
          />
        </DataTable>
      </div>

      <Dialog
        visible={visible}
        style={{ width: "90%", maxWidth: "600px" }}
        header={
          <div className="flex items-center gap-3">
            <div className="kemetra-dialog-header-icon">
              <Clock size={20} style={{ color: "#C9A24D" }} />
            </div>
            <div>
              <h3 className="kemetra-dialog-title">
                {selectedEra ? "Edit Era" : "Add New Era"}
              </h3>
              <p className="kemetra-dialog-subtitle">
                {selectedEra
                  ? "Update era information"
                  : "Create a new historical era"}
              </p>
            </div>
          </div>
        }
        modal
        className="p-fluid"
        onHide={hideDialog}
        draggable={false}
      >
        <div className="space-y-5 pt-4">
          <div>
            <label htmlFor="nameEn" className="kemetra-form-label">
              English Name <span className="kemetra-form-required">*</span>
            </label>
            <InputText
              id="nameEn"
              value={formData.nameEn || ""}
              onChange={(e) =>
                setFormData({ ...formData, nameEn: e.target.value })
              }
              placeholder="Enter era name in English"
              className="w-full kemetra-form-input"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="nameAr" className="kemetra-form-label">
              Arabic Name <span className="kemetra-form-required">*</span>
            </label>
            <InputText
              id="nameAr"
              value={formData.nameAr || ""}
              onChange={(e) =>
                setFormData({ ...formData, nameAr: e.target.value })
              }
              placeholder="أدخل اسم العصر باعربية"
              className="w-full kemetra-form-input"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="from" className="kemetra-form-label">
                From (Birth Date){" "}
                <span className="kemetra-form-required">*</span>
              </label>
              <InputText
                id="from"
                value={formData.from || ""}
                onChange={(e) =>
                  setFormData({ ...formData, from: e.target.value })
                }
                placeholder="e.g., 5500 BC"
                className="kemetra-form-input"
              />
            </div>

            <div>
              <label htmlFor="to" className="kemetra-form-label">
                To (Birth Date) <span className="kemetra-form-required">*</span>
              </label>
              <InputText
                id="to"
                value={formData.to || ""}
                onChange={(e) =>
                  setFormData({ ...formData, to: e.target.value })
                }
                placeholder="e.g., 332 BC"
                className="kemetra-form-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="Hijri_from" className="kemetra-form-label">
                From (Hijri Date)
              </label>
              <InputText
                id="Hijri_from"
                value={formData.Hijri_from || ""}
                onChange={(e) =>
                  setFormData({ ...formData, Hijri_from: e.target.value })
                }
                placeholder="e.g., 19 H or -"
                className="kemetra-form-input"
              />
            </div>

            <div>
              <label htmlFor="Hijri_to" className="kemetra-form-label">
                To (Hijri Date)
              </label>
              <InputText
                id="Hijri_to"
                value={formData.Hijri_to || ""}
                onChange={(e) =>
                  setFormData({ ...formData, Hijri_to: e.target.value })
                }
                placeholder="e.g., 41 H or -"
                className="kemetra-form-input"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 kemetra-dialog-footer">
          <Button
            label="Cancel"
            icon={<X size={18} />}
            outlined
            onClick={hideDialog}
            className="kemetra-btn-cancel"
          />
          <Button
            label="Save Era"
            icon={<Save size={18} />}
            onClick={saveEra}
            className="kemetra-primary-btn"
          />
        </div>
      </Dialog>
    </div>
  );
};

export default ErasManagement;
