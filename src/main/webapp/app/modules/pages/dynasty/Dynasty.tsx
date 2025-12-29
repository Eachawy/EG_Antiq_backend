import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import PageHeader from "app/shared/components/page-header/page-header";
import { Trash2, Plus, AlertTriangle, Inbox, PenLine } from "lucide-react";
import DynastyFormDialog from "./DynastyFormDialog";

const DynastyPage = (props) => {
  // Mock eras data
  const mockEras = [
    {
      id: "1",
      nameEn: "Prehistoric Era",
      nameAr: "عصر ما قبل التاريخ",
      from: "10000 BC",
      to: "3100 BC",
      Hijri_from: "",
      Hijri_to: "",
    },
    {
      id: "2",
      nameEn: "Early Dynastic Period",
      nameAr: "العصر العتيق",
      from: "3100 BC",
      to: "2686 BC",
      Hijri_from: "",
      Hijri_to: "",
    },
    {
      id: "3",
      nameEn: "Old Kingdom",
      nameAr: "الدولة القديمة",
      from: "2686 BC",
      to: "2181 BC",
      Hijri_from: "",
      Hijri_to: "",
    },
  ];
  const [dynasties, setDynasties] = useState([]);
  const [eras] = useState(mockEras);
  const [visible, setVisible] = useState(false);
  const [selectedDynasty, setSelectedDynasty] = useState(null);
  const [formData, setFormData] = useState({});

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

  const saveDynasty = () => {
    hideDialog();
  };

  const confirmDelete = (dynasty) => {
    confirmDialog({
      message: `Are you sure you want to delete ${dynasty.nameEn}?`,
      header: "Confirm Deletion",
      icon: <AlertTriangle size={24} className="text-red-500" />,
      acceptClassName: "p-button-danger",
      // accept: () => {
      //   setDynasties(dynasties.filter((d) => d.id !== dynasty.id));
      // },
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
          paginator
          rows={10}
          dataKey="id"
          emptyMessage={
            <div className="kemetra-empty-state-container">
              <Inbox size={48} className="kemetra-empty-state-icon" />
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
            field="from"
            header="From"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-secondary"
          />
          <Column
            field="to"
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
