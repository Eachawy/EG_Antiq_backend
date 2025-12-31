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
import { useNavigate } from "react-router";
import { getErasListData } from "./eras.reducer";

export const ErasManagement = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [eras, setEras] = useState();
  const [visible, setVisible] = useState(false);
  const [selectedEra, setSelectedEra] = useState(null);
  const [formData, setFormData]: any = useState({});

  const $ErasList = useAppSelector((state) => state.Eras.earsList);

  useEffect(() => {
    getCompletedChartsDataFN();
  }, []);

  useEffect(() => {
    if ($ErasList) {
      // eslint-disable-next-line no-console
      console.log($ErasList.data);
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

  const openEdit = (era) => {
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

  const confirmDelete = (era) => {
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
        title="Eras Management"
        description="Manage historical eras and time periods"
        actionLabel="Add Era"
        onAction={openNew}
      />

      <div className="kemetra-page-table-container">
        <DataTable
          value={eras}
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
            bodyClassName="kemetra-table-cell-arabic"
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
