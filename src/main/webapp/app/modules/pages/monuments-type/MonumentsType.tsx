import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import PageHeader from "app/shared/components/page-header/page-header";
import { Trash2, Plus, AlertCircle, PackageOpen, PenLine } from "lucide-react";
import MonumentsTypeFormDialog from "./MonumentsTypeFormDialog";
import { useAppDispatch, useAppSelector } from "app/config/store";
import {
  getMonumentsTypeListData,
  createMonumentsType,
  updateMonumentsType,
  deleteMonumentsType,
} from "./monuments-type.reducer";
import { toast } from "react-toastify";

const MonumentsTypePage = () => {
  const dispatch = useAppDispatch();

  const [types, setTypes] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData]: any = useState({});

  const $MonumentsTypeList = useAppSelector(
    (state) => state.MonumentsType.monumentsTypeList,
  );
  const loading = useAppSelector((state) => state.MonumentsType.loading);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if ($MonumentsTypeList) {
      if ($MonumentsTypeList.data && Array.isArray($MonumentsTypeList.data)) {
        setTypes($MonumentsTypeList.data);
      } else if (Array.isArray($MonumentsTypeList)) {
        setTypes($MonumentsTypeList);
      }
    }
  }, [$MonumentsTypeList]);

  const fetchData = async () => {
    await dispatch(getMonumentsTypeListData());
  };

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

  const saveType = async () => {
    try {
      if (selectedType) {
        // Update existing type
        const typeData = {
          nameAr: formData.nameAr,
          nameEn: formData.nameEn,
        };
        await dispatch(
          updateMonumentsType({ id: selectedType.id, data: typeData }),
        ).unwrap();
        toast.success("Monument type updated successfully!");
      } else {
        // Create new type
        await dispatch(createMonumentsType(formData)).unwrap();
        toast.success("Monument type created successfully!");
      }
      hideDialog();
      await dispatch(getMonumentsTypeListData());
    } catch (error) {
      toast.error("An error occurred while saving the monument type.");
      console.error("Save error:", error);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await dispatch(deleteMonumentsType(id)).unwrap();
      toast.success("Monument type deleted successfully!");
      await dispatch(getMonumentsTypeListData());
    } catch (error) {
      toast.error("An error occurred while deleting the monument type.");
      console.error("Delete error:", error);
    }
  };

  const confirmDelete = (type: any) => {
    confirmDialog({
      message: `Are you sure you want to delete ${type.nameEn || type.name_en}?`,
      header: "Confirm Deletion",
      icon: <AlertCircle size={24} className="text-red-500" />,
      acceptClassName: "p-button-danger",
      accept: () => handleDelete(type.id),
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
          loading={loading}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage={
            <div className="kemetra-empty-state-container">
              <PackageOpen size={48} className="kemetra-empty-state-icon" />
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
            body={(rowData) => rowData.nameEn || rowData.name_en || "-"}
            header="Name (English)"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-primary"
          />
          <Column
            field="nameAr"
            body={(rowData) => rowData.nameAr || rowData.name_ar || "-"}
            header="Name (Arabic)"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-arabic"
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
