import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import PageHeader from "app/shared/components/page-header/page-header";
import { Trash2, Plus, AlertTriangle, Inbox, PenLine } from "lucide-react";
import MonumentsEraFormDialog from "./MonumentsEraFormDialog";
import { useAppDispatch, useAppSelector } from "app/config/store";
import {
  getMonumentsEraListData,
  createMonumentsEra,
  updateMonumentsEra,
  deleteMonumentsEra,
} from "./monuments-era.reducer";
import { getMonumentsTypeListData } from "../monuments-type/monuments-type.reducer";
import { getErasListData } from "../eras/eras.reducer";

const MonumentsEraPage = () => {
  const dispatch = useAppDispatch();
  const toast = useRef<Toast>(null);

  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState<any>({});

  // Redux state
  const $MonumentsEraList = useAppSelector(
    (state) => state.MonumentsEra.monumentsEraList,
  );
  const $MonumentsTypeList = useAppSelector(
    (state) => state.MonumentsType.monumentsTypeList,
  );
  const $ErasList = useAppSelector((state) => state.Eras.earsList);
  const loading = useAppSelector((state) => state.MonumentsEra.loading);
  const loadingTypes = useAppSelector((state) => state.MonumentsType.loading);
  const loadingEras = useAppSelector((state) => state.Eras.loading);

  // Load data on mount
  useEffect(() => {
    dispatch(getMonumentsEraListData());
    dispatch(getMonumentsTypeListData());
    dispatch(getErasListData());
  }, [dispatch]);

  // Prepare dropdown options for monument types
  const monumentTypes = React.useMemo(() => {
    if (!$MonumentsTypeList) return [];
    const monumentTypesData = $MonumentsTypeList.data || $MonumentsTypeList;
    if (!Array.isArray(monumentTypesData)) return [];
    return monumentTypesData.map((mt) => ({
      label: mt.nameEn || mt.name_en || `Type ${mt.id}`,
      value: mt.id,
    }));
  }, [$MonumentsTypeList]);

  const eras = React.useMemo(() => {
    if (!$ErasList) return [];
    const erasData = $ErasList.data || $ErasList;
    if (!Array.isArray(erasData)) return [];
    return erasData.map((e) => ({
      label: e.nameEn || e.name_en || `Era ${e.id}`,
      value: e.id,
    }));
  }, [$ErasList]);

  // Get monuments-era list with enriched data (monument type and era names)
  const monumentsEra = React.useMemo(() => {
    // Wait for all data to be loaded
    if (!$MonumentsEraList) return [];
    if (!monumentTypes || monumentTypes.length === 0) return [];
    if (!eras || eras.length === 0) return [];

    const data = $MonumentsEraList.data || $MonumentsEraList;
    if (!Array.isArray(data)) return [];

    // Enrich each row with monument type and era names
    return data.map((item) => {
      const monumentsTypeId = item.monumentsTypeId || item.monuments_type_id;
      const eraId = item.eraId || item.era_id;

      const monumentType = monumentTypes.find(
        (mt) => mt.value === monumentsTypeId,
      );
      const era = eras.find((e) => e.value === eraId);

      return {
        ...item,
        monumentTypeName: monumentType?.label || `Type #${monumentsTypeId}`,
        eraName: era?.label || `Era #${eraId}`,
      };
    });
  }, [$MonumentsEraList, monumentTypes, eras]);

  const openNew = () => {
    setFormData({});
    setSelectedItem(null);
    setVisible(true);
  };

  const openEdit = (item) => {
    setFormData({
      monumentsTypeId: item.monumentsTypeId || item.monuments_type_id,
      eraId: item.eraId || item.era_id,
    });
    setSelectedItem(item);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setFormData({});
    setSelectedItem(null);
  };

  const save = async () => {
    if (!formData.monumentsTypeId || !formData.eraId) {
      toast.current?.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Please select both monument type and era",
        life: 3000,
      });
      return;
    }

    try {
      if (selectedItem) {
        // Update existing link
        await dispatch(
          updateMonumentsEra({
            id: selectedItem.id,
            data: {
              monumentsTypeId: formData.monumentsTypeId,
              eraId: formData.eraId,
            },
          }),
        ).unwrap();

        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Monument type-era link updated successfully",
          life: 3000,
        });
      } else {
        // Create new link
        await dispatch(
          createMonumentsEra({
            monumentsTypeId: formData.monumentsTypeId,
            eraId: formData.eraId,
          }),
        ).unwrap();

        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Monument type-era link created successfully",
          life: 3000,
        });
      }

      // Reload data
      dispatch(getMonumentsEraListData());
      hideDialog();
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to save monument type-era link",
        life: 3000,
      });
    }
  };

  const confirmDelete = (item) => {
    confirmDialog({
      message: "Are you sure you want to delete this link?",
      header: "Confirm Deletion",
      icon: <AlertTriangle size={24} className="text-red-500" />,
      acceptClassName: "p-button-danger",
      async accept() {
        try {
          await dispatch(deleteMonumentsEra(item.id)).unwrap();

          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: "Monument-era link deleted successfully",
            life: 3000,
          });

          // Reload data
          dispatch(getMonumentsEraListData());
        } catch (error) {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: error.message || "Failed to delete monument-era link",
            life: 3000,
          });
        }
      },
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

  const monumentTypeBodyTemplate = (rowData) => {
    return rowData.monumentTypeName || "-";
  };

  const eraBodyTemplate = (rowData) => {
    return rowData.eraName || "-";
  };

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />

      <PageHeader
        title="Monument Types Era Management"
        description="Link monument types to historical eras"
        actionLabel="Link Monument Type to Era"
        onAction={openNew}
      />

      <div className="kemetra-page-table-container">
        <DataTable
          value={monumentsEra}
          loading={loading || loadingTypes || loadingEras}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage={
            <div className="kemetra-empty-state-container">
              <Inbox size={48} className="kemetra-empty-state-icon" />
              <p className="kemetra-empty-state-title">
                No monument type-era links found
              </p>
              <p className="kemetra-empty-state-desc">
                Get started by linking a monument type to an era
              </p>
              <Button
                label="Link Monument Type to Era"
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
            body={monumentTypeBodyTemplate}
            header="Monument Type"
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
        monumentTypes={monumentTypes}
        eras={eras}
        onHide={hideDialog}
        onSave={save}
        onFormDataChange={setFormData}
      />
    </div>
  );
};

export default MonumentsEraPage;
