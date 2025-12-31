import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import PageHeader from "app/shared/components/page-header/page-header";
import { Trash2, Plus, AlertTriangle, Inbox, PenLine } from "lucide-react";
import DescriptionMonumentFormDialog from "./DescriptionMonumentFormDialog";
import { useAppDispatch, useAppSelector } from "app/config/store";
import {
  getDescriptionMonumentsListData,
  createDescriptionMonument,
  updateDescriptionMonument,
  deleteDescriptionMonument,
} from "./description-monuments.reducer";
import { getMonumentsListData } from "app/modules/pages/monuments/monuments.reducer";
import { getErasListData } from "app/modules/pages/eras/eras.reducer";
import { getDynastiesListData } from "app/modules/pages/dynasty/dynasty.reducer";
import { getMonumentsTypeListData } from "app/modules/pages/monuments-type/monuments-type.reducer";
import { toast } from "react-toastify";

const DescriptionMonumentsPage = (props) => {
  const dispatch = useAppDispatch();

  const [descriptions, setDescriptions] = useState([]);
  const [monuments, setMonuments] = useState([]);
  const [eras, setEras] = useState([]);
  const [dynasties, setDynasties] = useState([]);
  const [monumentTypes, setMonumentTypes] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedDesc, setSelectedDesc] = useState(null);
  const [formData, setFormData] = useState({});

  const $DescriptionMonumentsList = useAppSelector(
    (state) => state.DescriptionMonuments.descriptionMonumentsList,
  );
  const loading = useAppSelector((state) => state.DescriptionMonuments.loading);
  const $MonumentsList = useAppSelector(
    (state) => state.Monuments.monumentsList,
  );
  const $ErasList = useAppSelector((state) => state.Eras.earsList);
  const $DynastiesList = useAppSelector(
    (state) => state.Dynasties.dynastiesList,
  );
  const $MonumentTypesList = useAppSelector(
    (state) => state.MonumentsType.monumentsTypeList,
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if ($DescriptionMonumentsList) {
      if (
        $DescriptionMonumentsList.data &&
        Array.isArray($DescriptionMonumentsList.data)
      ) {
        setDescriptions($DescriptionMonumentsList.data);
      } else if (Array.isArray($DescriptionMonumentsList)) {
        setDescriptions($DescriptionMonumentsList);
      }
    }
  }, [$DescriptionMonumentsList]);

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

  useEffect(() => {
    if ($MonumentTypesList) {
      if ($MonumentTypesList.data && Array.isArray($MonumentTypesList.data)) {
        setMonumentTypes($MonumentTypesList.data);
      } else if (Array.isArray($MonumentTypesList)) {
        setMonumentTypes($MonumentTypesList);
      }
    }
  }, [$MonumentTypesList]);

  const fetchData = async () => {
    await dispatch(getDescriptionMonumentsListData());
    await dispatch(getMonumentsListData());
    await dispatch(getErasListData());
    await dispatch(getDynastiesListData());
    await dispatch(getMonumentsTypeListData());
  };

  const openNew = () => {
    setFormData({});
    setSelectedDesc(null);
    setVisible(true);
  };

  const openEdit = (desc) => {
    setFormData(desc);
    setSelectedDesc(desc);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setFormData({});
    setSelectedDesc(null);
  };

  const save = async () => {
    try {
      // Build description data with only allowed fields
      const descriptionData = {
        descriptionEn: formData["descriptionEn"] || "",
        descriptionAr: formData["descriptionAr"] || "",
        eraId: formData["eraId"],
        monumentsTypeId: formData["monumentsTypeId"],
        dynastyId: formData["dynastyId"],
      };

      if (selectedDesc) {
        // Update existing description
        await dispatch(
          updateDescriptionMonument({
            id: selectedDesc.id,
            data: descriptionData,
          }),
        ).unwrap();
        toast.success("Description updated successfully!");
      } else {
        // Create new description
        await dispatch(createDescriptionMonument(descriptionData)).unwrap();
        toast.success("Description created successfully!");
      }
      hideDialog();
      await dispatch(getDescriptionMonumentsListData());
    } catch (error) {
      toast.error("An error occurred while saving the description.");
      console.error("Save error:", error);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await dispatch(deleteDescriptionMonument(id)).unwrap();
      toast.success("Description deleted successfully!");
      await dispatch(getDescriptionMonumentsListData());
    } catch (error) {
      toast.error("An error occurred while deleting the description.");
      console.error("Delete error:", error);
    }
  };

  const confirmDelete = (desc) => {
    confirmDialog({
      message: "Are you sure you want to delete this description?",
      header: "Confirm Deletion",
      icon: <AlertTriangle size={24} className="text-red-500" />,
      acceptClassName: "p-button-danger",
      accept: () => handleDelete(desc.id),
    });
  };

  const getMonumentName = (monumentId: number) => {
    if (!monumentId) return "N/A";
    const monument = monuments?.find((m) => m.id === monumentId);
    return monument
      ? monument?.monumentNameEn || monument?.nameEn || monument?.name_en
      : "-";
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
        {/* <Button
          icon={<Trash2 size={16} />}
          rounded
          text
          tooltip="Delete"
          tooltipOptions={{ position: "top" }}
          onClick={() => confirmDelete(rowData)}
          className="kemetra-action-btn-delete"
        /> */}
      </div>
    );
  };

  const monumentBodyTemplate = (rowData) => {
    return <span>{getMonumentName(rowData.monumentId)}</span>;
  };

  return (
    <div>
      <ConfirmDialog />

      <PageHeader
        title="Monument Descriptions"
        description="Manage detailed descriptions for monuments"
        actionLabel="Add Description"
        onAction={openNew}
      />

      <div className="kemetra-page-table-container">
        <DataTable
          value={descriptions}
          loading={loading}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage={
            <div className="kemetra-empty-state-container">
              <Inbox size={48} className="kemetra-empty-state-icon" />
              <p className="kemetra-empty-state-title">No descriptions found</p>
              <p className="kemetra-empty-state-desc">
                Get started by adding your first description
              </p>
              <Button
                label="Add Description"
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
            field="descriptionEn"
            header="Description (English)"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-secondary"
            body={(rowData) => (
              <div className="max-w-md truncate">{rowData.descriptionEn}</div>
            )}
          />
          <Column
            field="descriptionAr"
            header="Description (Arabic)"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-arabic-rtl"
            body={(rowData) => (
              <div className="max-w-md truncate">{rowData.descriptionAr}</div>
            )}
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

      <DescriptionMonumentFormDialog
        visible={visible}
        selectedDesc={selectedDesc}
        formData={formData}
        monuments={monuments}
        eras={eras}
        dynasties={dynasties}
        monumentTypes={monumentTypes}
        setFormData={setFormData}
        onHide={hideDialog}
        onSave={save}
      />
    </div>
  );
};

export default DescriptionMonumentsPage;
