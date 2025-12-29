import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Chip } from "primereact/chip";
import PageHeader from "app/shared/components/page-header/page-header";
import MonumentFormDialog from "./MonumentFormDialog";
import { Trash2, Plus, AlertTriangle, Inbox, PenLine } from "lucide-react";

const MonumentsPage = (props) => {
  // Mock data
  const mockMonumentTypes = [
    { id: "1", nameEn: "Temple", nameAr: "معبد" },
    { id: "2", nameEn: "Palace", nameAr: "قصر" },
    { id: "3", nameEn: "Fortress", nameAr: "قلعة" },
    { id: "4", nameEn: "Tomb", nameAr: "مقبرة" },
  ];

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

  const mockDynasties = [
    {
      id: "1",
      nameEn: "First Dynasty",
      nameAr: "الأسرة الأولى",
      eraId: "2",
      from: "3100 BC",
      to: "2890 BC",
      Hijri_from: "",
      Hijri_to: "",
    },
    {
      id: "2",
      nameEn: "Fourth Dynasty",
      nameAr: "الأسرة الرابعة",
      eraId: "3",
      from: "2613 BC",
      to: "2494 BC",
      Hijri_from: "",
      Hijri_to: "",
    },
  ];
  const [monuments, setMonuments] = useState([]);
  const [monumentTypes] = useState(mockMonumentTypes);
  const [eras] = useState(mockEras);
  const [dynasties] = useState(mockDynasties);
  const [visible, setVisible] = useState(false);
  const [selectedMonument, setSelectedMonument] = useState(null);
  const [formData, setFormData] = useState({});

  const openNew = () => {
    setFormData({});
    setSelectedMonument(null);
    setVisible(true);
  };

  const openEdit = (monument) => {
    setFormData(monument);
    setSelectedMonument(monument);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setFormData({});
    setSelectedMonument(null);
  };

  const saveMonument = () => {
    hideDialog();
  };

  const confirmDelete = (monument) => {
    confirmDialog({
      message: `Are you sure you want to delete ${monument.nameEn}?`,
      header: "Confirm Deletion",
      icon: <AlertTriangle size={24} className="text-red-500" />,
      acceptClassName: "p-button-danger",
      // accept: () => {
      //   setMonuments(monuments.filter((m) => m.id !== monument.id));
      // },
    });
  };

  const getTypeName = (typeId: string) => {
    const type = monumentTypes.find((t) => t.id === typeId);
    return type ? type.nameEn : "-";
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
    return (
      <Chip
        label={getTypeName(rowData.typeId)}
        style={{
          backgroundColor: "var(--primary-50)",
          color: "var(--primary-600)",
        }}
      />
    );
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

      <div className="kemetra-page-table-container">
        <DataTable
          value={monuments}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage={
            <div className="kemetra-empty-state-container">
              <Inbox size={48} className="kemetra-empty-state-icon" />
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
            body={typeBodyTemplate}
            header="Type"
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell"
          />
          <Column
            field="monumentDate"
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
    </div>
  );
};

export default MonumentsPage;
