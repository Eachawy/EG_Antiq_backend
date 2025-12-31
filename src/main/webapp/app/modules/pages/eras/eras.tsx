import "./eras.scss";

import React, { useEffect, useState } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";

import { useAppDispatch, useAppSelector } from "app/config/store";
import { PenLine, Trash2, Plus, AlertCircle, PackageOpen } from "lucide-react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import PageHeader from "app/shared/components/page-header/page-header";
import EraFormDialog from "./EraFormDialog";
import {
  getErasListData,
  createEra,
  updateEra,
  deleteEra,
} from "./eras.reducer";
import { toast } from "react-toastify";

export const ErasManagement = () => {
  const dispatch = useAppDispatch();

  const [eras, setEras] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedEra, setSelectedEra] = useState(null);
  const [formData, setFormData]: any = useState({});

  const $ErasList = useAppSelector((state) => state.Eras.earsList);
  const loading = useAppSelector((state) => state.Eras.loading);

  useEffect(() => {
    getCompletedChartsDataFN();
  }, []);

  useEffect(() => {
    if ($ErasList) {
      // eslint-disable-next-line no-console
      console.log("Full $ErasList:", $ErasList);

      // Check if data is nested in $ErasList.data or directly in $ErasList
      if ($ErasList.data && Array.isArray($ErasList.data)) {
        // eslint-disable-next-line no-console
        console.log("Eras data (nested):", $ErasList.data);
        // eslint-disable-next-line no-console
        console.log("First era sample:", $ErasList.data[0]);
        setEras($ErasList.data);
      } else if (Array.isArray($ErasList)) {
        // eslint-disable-next-line no-console
        console.log("Eras data (direct array):", $ErasList);
        // eslint-disable-next-line no-console
        console.log("First era sample:", $ErasList[0]);
        setEras($ErasList);
      }
    }
  }, [$ErasList]);

  const getCompletedChartsDataFN = async () => {
    await dispatch(getErasListData());
  };

  const openNew = () => {
    setFormData({});
    setSelectedEra(null);
    setVisible(true);
  };

  const openEdit = (era: any) => {
    setFormData(era);
    setSelectedEra(era);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setFormData({});
    setSelectedEra(null);
  };

  const saveEra = async () => {
    try {
      if (selectedEra) {
        // Update existing era - send only the required fields
        const earData = {
          nameAr: formData.nameAr,
          nameEn: formData.nameEn,
          dateFrom: formData.dateFrom,
          dateTo: formData.dateTo,
          hijriFrom: formData.hijriFrom,
          hijriTo: formData.hijriTo,
        };
        await dispatch(
          updateEra({ id: selectedEra.id, data: earData }),
        ).unwrap();
        toast.success("Era updated successfully!");
      } else {
        // Create new era
        await dispatch(createEra(formData)).unwrap();
        toast.success("Era created successfully!");
      }
      hideDialog();
      // Refresh the list
      await dispatch(getErasListData());
    } catch (error) {
      toast.error("An error occurred while saving the era.");
      console.error("Save error:", error);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await dispatch(deleteEra(id)).unwrap();
      toast.success("Era deleted successfully!");
      // Refresh the list
      await dispatch(getErasListData());
    } catch (error) {
      toast.error("An error occurred while deleting the era.");
      console.error("Delete error:", error);
    }
  };

  const confirmDelete = (era: any) => {
    confirmDialog({
      message: `Are you sure you want to delete ${era.nameEn || era.name_en}?`,
      header: "Confirm Deletion",
      icon: <AlertCircle size={24} className="text-red-500" />,
      acceptClassName: "p-button-danger",
      accept: () => handleDelete(era.id),
    });
  };

  const actionBodyTemplate = (rowData: any) => {
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
        title="Eras Management"
        description="Manage historical eras and time periods"
        actionLabel="Add Era"
        onAction={openNew}
      />

      <div className="kemetra-page-table-container">
        <DataTable
          value={eras}
          loading={loading}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage={
            <div className="kemetra-empty-state-container">
              <PackageOpen size={48} className="kemetra-empty-state-icon" />
              <p className="kemetra-empty-state-title">No eras found</p>
              <p className="kemetra-empty-state-desc">
                Get started by adding your first era
              </p>
              <Button
                label="Add Era"
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
            body={(rowData) => rowData.nameEn || rowData.name_en || "-"}
            header="English Name"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-primary"
          />
          <Column
            field="nameAr"
            body={(rowData) => rowData.nameAr || rowData.name_ar || "-"}
            header="Arabic Name"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-arabic"
          />
          <Column
            field="from"
            body={(rowData) => rowData.dateFrom || "-"}
            header="From (Birth Date)"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-secondary"
          />
          <Column
            field="to"
            body={(rowData) => rowData.dateTo || "-"}
            header="To (Birth Date)"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-secondary"
          />
          <Column
            field="hijriFrom"
            body={(rowData) => rowData.hijriFrom || "-"}
            header="From (Hijri)"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-secondary"
          />
          <Column
            field="hijriTo"
            body={(rowData) => rowData.hijriTo || "-"}
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
            bodyClassName="kemetra-table-cell"
          />
        </DataTable>
      </div>

      <EraFormDialog
        visible={visible}
        selectedEra={selectedEra}
        formData={formData}
        onHide={hideDialog}
        onSave={saveEra}
        onFormDataChange={setFormData}
      />
    </div>
  );
};

export default ErasManagement;
