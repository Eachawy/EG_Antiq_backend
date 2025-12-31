import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import PageHeader from "app/shared/components/page-header/page-header";
import { Trash2, Plus, AlertCircle, PackageOpen, PenLine } from "lucide-react";
import DynastyFormDialog from "./DynastyFormDialog";
import { useAppDispatch, useAppSelector } from "app/config/store";
import {
  getDynastiesListData,
  createDynasty,
  updateDynasty,
  deleteDynasty,
} from "./dynasty.reducer";
import { getErasListData } from "app/modules/pages/eras/eras.reducer";
import { toast } from "react-toastify";

const DynastyPage = () => {
  const dispatch = useAppDispatch();

  const [dynasties, setDynasties] = useState([]);
  const [eras, setEras] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedDynasty, setSelectedDynasty] = useState(null);
  const [formData, setFormData]: any = useState({});

  const $DynastiesList = useAppSelector(
    (state) => state.Dynasties.dynastiesList,
  );
  const loading = useAppSelector((state) => state.Dynasties.loading);
  const $ErasList = useAppSelector((state) => state.Eras.earsList);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if ($DynastiesList) {
      if ($DynastiesList.data && Array.isArray($DynastiesList.data)) {
        setDynasties($DynastiesList.data);
      } else if (Array.isArray($DynastiesList)) {
        setDynasties($DynastiesList);
      }
    }
  }, [$DynastiesList]);

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
    await dispatch(getDynastiesListData());
    await dispatch(getErasListData());
  };

  const openNew = () => {
    setFormData({});
    setSelectedDynasty(null);
    setVisible(true);
  };

  const openEdit = (dynasty) => {
    setFormData(dynasty);
    setSelectedDynasty(dynasty);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setFormData({});
    setSelectedDynasty(null);
  };

  const saveDynasty = async () => {
    try {
      if (selectedDynasty) {
        // Update existing dynasty - map to correct backend field names
        const dynastyData = {
          nameAr: formData.nameAr,
          nameEn: formData.nameEn,
          dateFrom: formData.dateFrom,
          dateTo: formData.dateTo,
          hijriFrom: formData.hijriFrom,
          hijriTo: formData.hijriTo,
          eraId: formData.eraId,
        };
        await dispatch(
          updateDynasty({ id: selectedDynasty.id, data: dynastyData }),
        ).unwrap();
        toast.success("Dynasty updated successfully!");
      } else {
        // Create new dynasty - map to correct backend field names
        const dynastyData = {
          nameAr: formData.nameAr,
          nameEn: formData.nameEn,
          dateFrom: formData.dateFrom,
          dateTo: formData.dateTo,
          hijriFrom: formData.hijriFrom,
          hijriTo: formData.hijriTo,
          eraId: formData.eraId,
        };
        await dispatch(createDynasty(dynastyData)).unwrap();
        toast.success("Dynasty created successfully!");
      }
      hideDialog();
      await dispatch(getDynastiesListData());
    } catch (error) {
      toast.error("An error occurred while saving the dynasty.");
      console.error("Save error:", error);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await dispatch(deleteDynasty(id)).unwrap();
      toast.success("Dynasty deleted successfully!");
      await dispatch(getDynastiesListData());
    } catch (error) {
      toast.error("An error occurred while deleting the dynasty.");
      console.error("Delete error:", error);
    }
  };

  const confirmDelete = (dynasty: any) => {
    confirmDialog({
      message: `Are you sure you want to delete ${dynasty.nameEn || dynasty.name_en}?`,
      header: "Confirm Deletion",
      icon: <AlertCircle size={24} className="text-red-500" />,
      acceptClassName: "p-button-danger",
      accept: () => handleDelete(dynasty.id),
    });
  };

  const getEraName = (eraId: string) => {
    const era = eras.find((e) => e.id === eraId);
    return era ? era.nameEn : "-";
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
        title="Dynasty Management"
        description="Manage historical dynasties and ruling families"
        actionLabel="Add Dynasty"
        onAction={openNew}
      />

      <div className="kemetra-page-table-container">
        <DataTable
          value={dynasties}
          loading={loading}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage={
            <div className="kemetra-empty-state-container">
              <PackageOpen size={48} className="kemetra-empty-state-icon" />
              <p className="kemetra-empty-state-title">No dynasties found</p>
              <p className="kemetra-empty-state-desc">
                Get started by adding your first dynasty
              </p>
              <Button
                label="Add Dynasty"
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
            field="eraId"
            header="Era"
            sortable
            headerClassName="kemetra-table-column-header"
            body={(rowData) => (
              <span className="kemetra-table-cell-secondary">
                {getEraName(rowData.eraId)}
              </span>
            )}
          />
          <Column
            field="dateFrom"
            header="From"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-secondary"
          />
          <Column
            field="dateTo"
            header="To"
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

      <DynastyFormDialog
        visible={visible}
        selectedDynasty={selectedDynasty}
        formData={formData}
        eras={eras}
        onHide={hideDialog}
        onSave={saveDynasty}
        onFormDataChange={setFormData}
      />
    </div>
  );
};

export default DynastyPage;
