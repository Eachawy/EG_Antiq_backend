import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import PageHeader from "app/shared/components/page-header/page-header";
import { Trash2, Plus, AlertTriangle, Inbox, PenLine } from "lucide-react";
import DescriptionMonumentFormDialog from "./DescriptionMonumentFormDialog";

const DescriptionMonumentsPage = (props) => {
  // Mock monuments data
  const mockMonuments = [
    {
      id: "1",
      nameEn: "Great Pyramid of Giza",
      nameAr: "الهرم الأكبر",
      biographyEn: "The oldest and largest of the three pyramids",
      biographyAr: "أقدم وأكبر الأهرامات الثلاثة",
      latitude: "29.9792",
      longitude: "31.1342",
      zoom: "15",
      center: "29.9792, 31.1342",
      monumentImage: "",
      monumentDate: "2560 BC",
      typeId: "4",
      eraId: "3",
      dynastyId: "2",
      descriptionEn: "",
      descriptionAr: "",
    },
    {
      id: "2",
      nameEn: "Karnak Temple",
      nameAr: "معبد الكرنك",
      biographyEn: "Largest ancient religious site",
      biographyAr: "أكبر موقع ديني قديم",
      latitude: "25.7188",
      longitude: "32.6573",
      zoom: "15",
      center: "25.7188, 32.6573",
      monumentImage: "",
      monumentDate: "2055 BC",
      typeId: "1",
      eraId: "3",
      dynastyId: "2",
      descriptionEn: "",
      descriptionAr: "",
    },
    {
      id: "3",
      nameEn: "Abu Simbel",
      nameAr: "أبو سمبل",
      biographyEn: "Rock temple complex",
      biographyAr: "مجمع معبد صخري",
      latitude: "22.3372",
      longitude: "31.6258",
      zoom: "15",
      center: "22.3372, 31.6258",
      monumentImage: "",
      monumentDate: "1264 BC",
      typeId: "1",
      eraId: "3",
      dynastyId: "2",
      descriptionEn: "",
      descriptionAr: "",
    },
  ];
  const [descriptions, setDescriptions] = useState([]);
  const [monuments] = useState(mockMonuments);
  const [visible, setVisible] = useState(false);
  const [selectedDesc, setSelectedDesc] = useState(null);
  const [formData, setFormData] = useState({});

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

  const save = () => {
    hideDialog();
  };

  const confirmDelete = (desc) => {
    confirmDialog({
      message: "Are you sure you want to delete this description?",
      header: "Confirm Deletion",
      icon: <AlertTriangle size={24} className="text-red-500" />,
      acceptClassName: "p-button-danger",
      // accept: () => {
      //   setDescriptions(descriptions.filter((d) => d.id !== desc.id));
      // },
    });
  };

  const getMonumentName = (monumentId: string) => {
    const monument = monuments.find((m) => m.id === monumentId);
    return monument ? monument.nameEn : "-";
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
        setFormData={setFormData}
        onHide={hideDialog}
        onSave={save}
      />
    </div>
  );
};

export default DescriptionMonumentsPage;
