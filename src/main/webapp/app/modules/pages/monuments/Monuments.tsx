import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Chip } from "primereact/chip";
import PageHeader from "app/shared/components/page-header/page-header";
import MonumentFormDialog from "./MonumentFormDialog";
import CsvImportDialog from "./CsvImportDialog";
import {
  Trash2,
  Plus,
  AlertCircle,
  PackageOpen,
  PenLine,
  FileUp,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "app/config/store";
import {
  getMonumentsListData,
  createMonument,
  updateMonument,
  deleteMonument,
} from "./monuments.reducer";
import { getErasListData } from "app/modules/pages/eras/eras.reducer";
import { getDynastiesListData } from "app/modules/pages/dynasty/dynasty.reducer";
import { getMonumentsTypeListData } from "app/modules/pages/monuments-type/monuments-type.reducer";
import { getDescriptionMonumentsListData } from "app/modules/pages/description-monuments/description-monuments.reducer";
import { toast } from "react-toastify";

const MonumentsPage = () => {
  const dispatch = useAppDispatch();

  const [monuments, setMonuments] = useState([]);
  const [monumentTypes, setMonumentTypes] = useState([]);
  const [eras, setEras] = useState([]);
  const [dynasties, setDynasties] = useState([]);
  const [visible, setVisible] = useState(false);
  const [csvImportVisible, setCsvImportVisible] = useState(false);
  const [selectedMonument, setSelectedMonument] = useState(null);
  const [formData, setFormData]: any = useState({});

  const $MonumentsList = useAppSelector(
    (state) => state.Monuments.monumentsList,
  );
  const loading = useAppSelector((state) => state.Monuments.loading);
  const $MonumentTypesList = useAppSelector(
    (state) => state.MonumentsType.monumentsTypeList,
  );
  const $ErasList = useAppSelector((state) => state.Eras.earsList);
  const $DynastiesList = useAppSelector(
    (state) => state.Dynasties.dynastiesList,
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if ($MonumentsList) {
      if ($MonumentsList.data && Array.isArray($MonumentsList.data)) {
        setMonuments($MonumentsList.data);
      } else if (Array.isArray($MonumentsList)) {
        setMonuments($MonumentsList);
      }
    }
  }, [$MonumentsList]);

  useEffect(() => {
    if ($MonumentTypesList) {
      if ($MonumentTypesList.data && Array.isArray($MonumentTypesList.data)) {
        setMonumentTypes($MonumentTypesList.data);
      } else if (Array.isArray($MonumentTypesList)) {
        setMonumentTypes($MonumentTypesList);
      }
    }
  }, [$MonumentTypesList]);

  useEffect(() => {
    if ($ErasList) {
      if ($ErasList.data && Array.isArray($ErasList.data)) {
        setEras($ErasList.data);
      } else if (Array.isArray($ErasList)) {
        setEras($ErasList);
      }
    }
  }, [$ErasList]);

  useEffect(() => {
    if ($DynastiesList) {
      if ($DynastiesList.data && Array.isArray($DynastiesList.data)) {
        setDynasties($DynastiesList.data);
      } else if (Array.isArray($DynastiesList)) {
        setDynasties($DynastiesList);
      }
    }
  }, [$DynastiesList]);

  const fetchData = async () => {
    await dispatch(getMonumentsListData());
    await dispatch(getMonumentsTypeListData());
    await dispatch(getErasListData());
    await dispatch(getDynastiesListData());
  };

  const openNew = () => {
    setFormData({});
    setSelectedMonument(null);
    setVisible(true);
  };

  const openEdit = (monument) => {
    // Extract description from monumentDescriptions array to populate form fields
    const firstDescription = monument.monumentDescriptions?.[0];
    const formDataWithDescription = {
      ...monument,
      descriptionEn: firstDescription?.descriptionEn || "",
      descriptionAr: firstDescription?.descriptionAr || "",
    };
    setFormData(formDataWithDescription);
    setSelectedMonument(monument);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setFormData({});
    setSelectedMonument(null);
  };

  const saveMonument = async () => {
    try {
      // Filter out read-only fields that API doesn't accept
      const {
        id,
        createdAt,
        monumentType,
        era,
        dynasty,
        descriptionEn,
        descriptionAr,
        ...allowedData
      } = formData;

      // Transform flat description fields into descriptions array format
      const monumentData = {
        ...allowedData,
        // Only add descriptions array if both fields have values
        ...(descriptionEn || descriptionAr
          ? {
              descriptions: [
                {
                  descriptionEn: descriptionEn || "",
                  descriptionAr: descriptionAr || "",
                  eraId: allowedData.eraId,
                  monumentsTypeId: allowedData.monumentsTypeId,
                  dynastyId: allowedData.dynastyId,
                },
              ],
            }
          : {}),
      };

      if (selectedMonument) {
        // Update existing monument
        await dispatch(
          updateMonument({ id: selectedMonument.id, data: monumentData }),
        ).unwrap();
        toast.success("Monument updated successfully!");
      } else {
        // Create new monument
        await dispatch(createMonument(monumentData)).unwrap();
        toast.success("Monument created successfully!");
      }
      hideDialog();
      // Refresh both monuments and descriptions
      await dispatch(getMonumentsListData());
      await dispatch(getDescriptionMonumentsListData());
    } catch (error) {
      toast.error("An error occurred while saving the monument.");
      console.error("Save error:", error);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await dispatch(deleteMonument(id)).unwrap();
      toast.success("Monument deleted successfully!");
      // Refresh both monuments and descriptions
      await dispatch(getMonumentsListData());
      await dispatch(getDescriptionMonumentsListData());
    } catch (error) {
      toast.error("An error occurred while deleting the monument.");
      console.error("Delete error:", error);
    }
  };

  const confirmDelete = (monument: any) => {
    confirmDialog({
      message: `Are you sure you want to delete ${monument.monumentNameEn || monument.nameEn || monument.name_en}?`,
      header: "Confirm Deletion",
      icon: <AlertCircle size={24} className="text-red-500" />,
      acceptClassName: "p-button-danger",
      accept: () => handleDelete(monument.id),
    });
  };

  const getTypeName = (typeId: string) => {
    const type = monumentTypes.find((t) => t.id === typeId);
    return type ? type.nameEn || type.name_en : "-";
  };

  const getEraName = (eraId: number) => {
    const era = eras.find((e) => e.id === eraId);
    return era ? era.nameEn || era.name_en : "-";
  };

  const getDynastyName = (dynastyId: number) => {
    const dynasty = dynasties.find((d) => d.id === dynastyId);
    return dynasty ? dynasty.nameEn || dynasty.name_en : "-";
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

  const typeBodyTemplate = (rowData) => {
    const typeName =
      rowData.monumentType?.nameEn || getTypeName(rowData.monumentsTypeId);
    return (
      <Chip
        label={typeName}
        style={{
          backgroundColor: "var(--primary-50)",
          color: "var(--primary-600)",
        }}
      />
    );
  };

  const eraBodyTemplate = (rowData) => {
    const eraName = rowData.era?.nameEn || getEraName(rowData.eraId);
    return eraName;
  };

  const dynastyBodyTemplate = (rowData) => {
    const dynastyName =
      rowData.dynasty?.nameEn || getDynastyName(rowData.dynastyId);
    return dynastyName;
  };

  const handleCsvImportComplete = async () => {
    await fetchData();
    setCsvImportVisible(false);
  };

  return (
    <div>
      <ConfirmDialog />

      <PageHeader
        title="Monuments Management"
        description="Manage monuments with descriptions"
        actionLabel="Add Monument"
        onAction={openNew}
      />

      {/* Import CSV Button */}
      <div className="mb-4 flex justify-end">
        <Button
          label="Import from CSV"
          icon={<FileUp size={18} />}
          onClick={() => setCsvImportVisible(true)}
          outlined
          severity="secondary"
          className="kemetra-btn-secondary"
        />
      </div>

      <div className="kemetra-page-table-container">
        <DataTable
          value={monuments}
          loading={loading}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage={
            <div className="kemetra-empty-state-container">
              <PackageOpen size={48} className="kemetra-empty-state-icon" />
              <p className="kemetra-empty-state-title">No monuments found</p>
              <p className="kemetra-empty-state-desc">
                Get started by adding your first monument
              </p>
              <Button
                label="Add Monument"
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
            field="monumentNameEn"
            body={(rowData) =>
              rowData.monumentNameEn || rowData.nameEn || rowData.name_en || "-"
            }
            header="Name (English)"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-primary"
          />
          <Column
            field="monumentNameAr"
            body={(rowData) =>
              rowData.monumentNameAr || rowData.nameAr || rowData.name_ar || "-"
            }
            header="Name (Arabic)"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-arabic"
          />
          <Column
            body={typeBodyTemplate}
            header="Type"
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell"
          />
          <Column
            body={eraBodyTemplate}
            header="Era"
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell"
          />
          <Column
            body={dynastyBodyTemplate}
            header="Dynasty"
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell"
          />
          <Column
            field="mDate"
            body={(rowData) => rowData.mDate || rowData.monumentDate || "-"}
            header="Date"
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

      <MonumentFormDialog
        visible={visible}
        selectedMonument={selectedMonument}
        formData={formData}
        monumentTypes={monumentTypes}
        eras={eras}
        dynasties={dynasties}
        onHide={hideDialog}
        onSave={saveMonument}
        onFormDataChange={setFormData}
      />

      <CsvImportDialog
        visible={csvImportVisible}
        onHide={() => setCsvImportVisible(false)}
        onImportComplete={handleCsvImportComplete}
      />
    </div>
  );
};

export default MonumentsPage;
