import "./sources.scss";

import React, { useEffect, useState } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { useAppDispatch, useAppSelector } from "app/config/store";
import {
  PenLine,
  Trash2,
  Plus,
  AlertCircle,
  X,
  PackageOpen,
} from "lucide-react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import PageHeader from "app/shared/components/page-header/page-header";
import SourceFormDialog from "./SourceFormDialog";
import SourcesCsvImportDialog from "./SourcesCsvImportDialog";
import { Tag } from "primereact/tag";
import {
  getSourcesListData,
  createSource,
  updateSource,
  deleteSource,
} from "./sources.reducer";
import { toast } from "react-toastify";
import { InputText } from "primereact/inputtext";

export const SourcesManagement = () => {
  const dispatch = useAppDispatch();

  const [sources, setSources] = useState([]);
  const [visible, setVisible] = useState(false);
  const [csvImportVisible, setCsvImportVisible] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [formData, setFormData] = useState<any>({});
  const [searchTitleEn, setSearchTitleEn]: any = useState("");
  const [searchTitleAr, setSearchTitleAr]: any = useState("");

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

  const handleCsvImportComplete = async () => {
    await getSourcesDataFN();
    setCsvImportVisible(false);
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

  // Filter sources by English and Arabic title
  const filteredSources = sources.filter((source: any) => {
    const titleEn = (source.titleEn || source.title_en || "").toLowerCase();
    const titleAr = source.titleAr || source.title_ar || "";
    const searchEn = searchTitleEn.toLowerCase();
    const searchAr = searchTitleAr;

    const matchesEn = searchTitleEn === "" || titleEn.includes(searchEn);
    const matchesAr = searchTitleAr === "" || titleAr.includes(searchAr);

    return matchesEn && matchesAr;
  });

  const handleClearFilters = () => {
    setSearchTitleEn("");
    setSearchTitleAr("");
  };

  const hasActiveFilters = searchTitleEn !== "" || searchTitleAr !== "";

  return (
    <div>
      <ConfirmDialog />
      <PageHeader
        title="Sources Management"
        description="Manage academic sources and references"
        actionLabel="Add Source"
        onAction={openNew}
        csvImport={() => setCsvImportVisible(true)}
      />

      {/* Search and Filter Section */}
      <div className="mb-6 kemetra-search-filter-section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* English Title Search */}
          <div>
            <label
              htmlFor="searchTitleEn"
              className="block text-sm font-semibold mb-2 kemetra-monument-search-label"
            >
              Search by English Title
            </label>
            <InputText
              id="searchTitleEn"
              value={searchTitleEn}
              onChange={(e) => setSearchTitleEn(e.target.value)}
              placeholder="Enter English title..."
              className="w-full"
            />
          </div>

          {/* Arabic Title Search */}
          <div>
            <label
              htmlFor="searchTitleAr"
              className="block text-sm font-semibold mb-2 kemetra-monument-search-label"
            >
              Search by Arabic Title
            </label>
            <InputText
              id="searchTitleAr"
              value={searchTitleAr}
              onChange={(e) => setSearchTitleAr(e.target.value)}
              placeholder="أدخل العنوان بالعربية..."
              className="w-full"
            />
          </div>
        </div>

        {/* Filter Status and Clear Button */}
        {hasActiveFilters && (
          <div className="mt-4 flex items-center justify-between kemetra-filter-status">
            <div className="flex items-center gap-2">
              <span className="text-sm kemetra-monument-search-results">
                Found {filteredSources.length} source
                {filteredSources.length !== 1 ? "s" : ""}
              </span>
              <Tag
                value={`${filteredSources.length} ${filteredSources.length === 1 ? "result" : "results"}`}
                className="kemetra-gallery-count-tag"
              />
            </div>
            <Button
              label="Clear Filters"
              icon={<X size={16} />}
              outlined
              size="small"
              onClick={handleClearFilters}
              className="kemetra-btn-clear-filter"
            />
          </div>
        )}
      </div>

      <div className="kemetra-page-table-container">
        <DataTable
          value={filteredSources}
          loading={loading}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage={
            <div className="kemetra-empty-state-container">
              <PackageOpen size={48} className="kemetra-empty-state-icon" />
              <p className="kemetra-empty-state-title">
                {hasActiveFilters
                  ? "No sources found matching your search"
                  : "No sources found"}
              </p>
              <p className="kemetra-empty-state-desc">
                {hasActiveFilters
                  ? "Try adjusting your search criteria or clear the filters"
                  : "Get started by adding your first source"}
              </p>
              {!hasActiveFilters && (
                <Button
                  label="Add Source"
                  icon={<Plus size={18} />}
                  onClick={openNew}
                  className="kemetra-empty-state-btn"
                />
              )}
              {hasActiveFilters && (
                <Button
                  label="Clear Filters"
                  icon={<X size={18} />}
                  onClick={handleClearFilters}
                  outlined
                  className="kemetra-empty-state-btn"
                />
              )}
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

      <SourcesCsvImportDialog
        visible={csvImportVisible}
        onHide={() => setCsvImportVisible(false)}
        onImportComplete={handleCsvImportComplete}
      />
    </div>
  );
};

export default SourcesManagement;
