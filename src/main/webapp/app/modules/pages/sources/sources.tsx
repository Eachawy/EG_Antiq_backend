import "./sources.scss";

import React, { useEffect, useState, useRef } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { useAppDispatch, useAppSelector } from "app/config/store";
import {
  PenLine,
  Trash2,
  Plus,
  AlertCircle,
  PackageOpen,
  Upload,
} from "lucide-react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { FileUpload } from "primereact/fileupload";
import PageHeader from "app/shared/components/page-header/page-header";
import SourceFormDialog from "./SourceFormDialog";
import {
  getSourcesListData,
  createSource,
  updateSource,
  deleteSource,
  importSourcesCSV,
} from "./sources.reducer";
import { toast } from "react-toastify";

export const SourcesManagement = () => {
  const dispatch = useAppDispatch();
  const fileUploadRef = useRef(null);

  const [sources, setSources] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [formData, setFormData]: any = useState({});

  const $SourcesList = useAppSelector((state) => state.Sources.sourcesList);
  const loading = useAppSelector((state) => state.Sources.loading);

  useEffect(() => {
    getSourcesDataFN();
  }, []);

  useEffect(() => {
    if ($SourcesList) {
      if ($SourcesList.data && Array.isArray($SourcesList.data)) {
        setSources($SourcesList.data);
      } else if (Array.isArray($SourcesList)) {
        setSources($SourcesList);
      }
    }
  }, [$SourcesList]);

  const getSourcesDataFN = async () => {
    await dispatch(getSourcesListData());
  };

  const openNew = () => {
    setFormData({});
    setSelectedSource(null);
    setVisible(true);
  };

  const openEdit = (source: any) => {
    setFormData(source);
    setSelectedSource(source);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setFormData({});
    setSelectedSource(null);
  };

  const saveSource = async () => {
    try {
      if (selectedSource) {
        // Update existing source
        const sourceData = {
          titleAr: formData.titleAr,
          titleEn: formData.titleEn,
          authorAr: formData.authorAr,
          authorEn: formData.authorEn,
          publicationYear: formData.publicationYear,
          publisher: formData.publisher,
          sourceType: formData.sourceType,
          url: formData.url,
          pages: formData.pages,
          volume: formData.volume,
          issue: formData.issue,
          isbn: formData.isbn,
          doi: formData.doi,
          notes: formData.notes,
        };
        await dispatch(
          updateSource({ id: selectedSource.id, data: sourceData }),
        ).unwrap();
        toast.success("Source updated successfully!");
      } else {
        // Create new source
        await dispatch(createSource(formData)).unwrap();
        toast.success("Source created successfully!");
      }
      hideDialog();
      await dispatch(getSourcesListData());
    } catch (error) {
      toast.error("An error occurred while saving the source.");
      console.error("Save error:", error);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await dispatch(deleteSource(id)).unwrap();
      toast.success("Source deleted successfully!");
      await dispatch(getSourcesListData());
    } catch (error) {
      toast.error("An error occurred while deleting the source.");
      console.error("Delete error:", error);
    }
  };

  const confirmDelete = (source: any) => {
    confirmDialog({
      message: `Are you sure you want to delete ${source.titleEn || source.title_en}?`,
      header: "Confirm Deletion",
      icon: <AlertCircle size={24} className="text-red-500" />,
      acceptClassName: "p-button-danger",
      accept: () => handleDelete(source.id),
    });
  };

  const handleCSVUpload = async (event: any) => {
    const file = event.files[0];
    try {
      await dispatch(importSourcesCSV(file)).unwrap();
      toast.success("CSV imported successfully!");
      await dispatch(getSourcesListData());
      fileUploadRef.current?.clear();
    } catch (error) {
      toast.error("An error occurred while importing CSV.");
      console.error("Import error:", error);
    }
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

  const sourceTypeBodyTemplate = (rowData: any) => {
    return rowData.sourceType || "-";
  };

  return (
    <div>
      <ConfirmDialog />
      <PageHeader
        title="Sources Management"
        description="Manage academic sources and references"
        actionLabel="Add Source"
        onAction={openNew}
      />

      <div className="mb-4">
        <FileUpload
          ref={fileUploadRef}
          mode="basic"
          name="file"
          accept=".csv"
          maxFileSize={10000000}
          customUpload
          uploadHandler={handleCSVUpload}
          auto
          chooseLabel="Import CSV"
          className="kemetra-btn-upload"
        />
      </div>

      <div className="kemetra-page-table-container">
        <DataTable
          value={sources}
          loading={loading}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage={
            <div className="kemetra-empty-state-container">
              <PackageOpen size={48} className="kemetra-empty-state-icon" />
              <p className="kemetra-empty-state-title">No sources found</p>
              <p className="kemetra-empty-state-desc">
                Get started by adding your first source
              </p>
              <Button
                label="Add Source"
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
            field="titleEn"
            body={(rowData) => rowData.titleEn || rowData.title_en || "-"}
            header="English Title"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-primary"
          />
          <Column
            field="titleAr"
            body={(rowData) => rowData.titleAr || rowData.title_ar || "-"}
            header="Arabic Title"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-arabic"
          />
          <Column
            field="authorEn"
            body={(rowData) => rowData.authorEn || rowData.author_en || "-"}
            header="Author"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-secondary"
          />
          <Column
            field="sourceType"
            body={sourceTypeBodyTemplate}
            header="Type"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-secondary"
          />
          <Column
            field="publicationYear"
            body={(rowData) =>
              rowData.publicationYear || rowData.publication_year || "-"
            }
            header="Year"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-secondary"
          />
          <Column
            field="publisher"
            body={(rowData) => rowData.publisher || "-"}
            header="Publisher"
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

      <SourceFormDialog
        visible={visible}
        selectedSource={selectedSource}
        formData={formData}
        onHide={hideDialog}
        onSave={saveSource}
        onFormDataChange={setFormData}
      />
    </div>
  );
};

export default SourcesManagement;
