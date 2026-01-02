import "./monument-sources.scss";

import React, { useEffect, useState } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { useAppDispatch, useAppSelector } from "app/config/store";
import { PenLine, Trash2, Plus, AlertCircle, PackageOpen } from "lucide-react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import PageHeader from "app/shared/components/page-header/page-header";
import MonumentSourceFormDialog from "./MonumentSourceFormDialog";
import {
  getMonumentSourcesListData,
  createMonumentSource,
  updateMonumentSource,
  deleteMonumentSource,
} from "./monument-sources.reducer";
import { getMonumentsListData } from "../monuments/monuments.reducer";
import { getSourcesListData } from "../sources/sources.reducer";
import { toast } from "react-toastify";

export const MonumentSourcesManagement = () => {
  const dispatch = useAppDispatch();

  const [monumentSources, setMonumentSources] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData]: any = useState({});
  const [monuments, setMonuments] = useState([]);
  const [sources, setSources] = useState([]);

  const $MonumentSourcesList = useAppSelector(
    (state) => state.MonumentSources.monumentSourcesList,
  );
  const $MonumentsList = useAppSelector(
    (state) => state.Monuments.monumentsList,
  );
  const $SourcesList = useAppSelector((state) => state.Sources.sourcesList);
  const loading = useAppSelector((state) => state.MonumentSources.loading);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if ($MonumentSourcesList) {
      if (
        $MonumentSourcesList.data &&
        Array.isArray($MonumentSourcesList.data)
      ) {
        setMonumentSources($MonumentSourcesList.data);
      } else if (Array.isArray($MonumentSourcesList)) {
        setMonumentSources($MonumentSourcesList);
      }
    }
  }, [$MonumentSourcesList]);

  useEffect(() => {
    if ($MonumentsList) {
      const monumentsData = $MonumentsList.data || $MonumentsList;
      if (Array.isArray(monumentsData)) {
        const options = monumentsData.map((m) => ({
          label: m.monumentNameEn || m.monument_name_en || `Monument ${m.id}`,
          value: m.id,
        }));
        setMonuments(options);
      }
    }
  }, [$MonumentsList]);

  useEffect(() => {
    if ($SourcesList) {
      const sourcesData = $SourcesList.data || $SourcesList;
      if (Array.isArray(sourcesData)) {
        const options = sourcesData.map((s) => ({
          label: s.titleEn || s.title_en || `Source ${s.id}`,
          value: s.id,
        }));
        setSources(options);
      }
    }
  }, [$SourcesList]);

  const getData = async () => {
    await dispatch(getMonumentSourcesListData());
    await dispatch(getMonumentsListData());
    await dispatch(getSourcesListData());
  };

  const openNew = () => {
    setFormData({});
    setSelectedItem(null);
    setVisible(true);
  };

  const openEdit = (item: any) => {
    setFormData(item);
    setSelectedItem(item);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setFormData({});
    setSelectedItem(null);
  };

  const saveMonumentSource = async () => {
    try {
      if (selectedItem) {
        const linkData = {
          monumentId: formData.monumentId,
          sourceId: formData.sourceId,
          pageNumbers: formData.pageNumbers,
          notes: formData.notes,
          displayOrder: formData.displayOrder,
        };
        await dispatch(
          updateMonumentSource({ id: selectedItem.id, data: linkData }),
        ).unwrap();
        toast.success("Monument-Source link updated successfully!");
      } else {
        await dispatch(createMonumentSource(formData)).unwrap();
        toast.success("Monument-Source link created successfully!");
      }
      hideDialog();
      await dispatch(getMonumentSourcesListData());
    } catch (error) {
      toast.error("An error occurred while saving the link.");
      console.error("Save error:", error);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await dispatch(deleteMonumentSource(id)).unwrap();
      toast.success("Monument-Source link deleted successfully!");
      await dispatch(getMonumentSourcesListData());
    } catch (error) {
      toast.error("An error occurred while deleting the link.");
      console.error("Delete error:", error);
    }
  };

  const confirmDelete = (item: any) => {
    confirmDialog({
      message: "Are you sure you want to delete this link?",
      header: "Confirm Deletion",
      icon: <AlertCircle size={24} className="text-red-500" />,
      acceptClassName: "p-button-danger",
      accept: () => handleDelete(item.id),
    });
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

  const monumentBodyTemplate = (rowData: any) => {
    const monument = rowData.monument;
    if (monument) {
      return monument.monumentNameEn || monument.monument_name_en || "-";
    }
    return "-";
  };

  const sourceBodyTemplate = (rowData: any) => {
    const source = rowData.source;
    if (source) {
      return source.titleEn || source.title_en || "-";
    }
    return "-";
  };

  return (
    <div>
      <ConfirmDialog />
      <PageHeader
        title="Monument-Sources Management"
        description="Link monuments to academic sources and references"
        actionLabel="Link Source to Monument"
        onAction={openNew}
      />

      <div className="kemetra-page-table-container">
        <DataTable
          value={monumentSources}
          loading={loading}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage={
            <div className="kemetra-empty-state-container">
              <PackageOpen size={48} className="kemetra-empty-state-icon" />
              <p className="kemetra-empty-state-title">
                No monument-source links found
              </p>
              <p className="kemetra-empty-state-desc">
                Get started by linking a monument to a source
              </p>
              <Button
                label="Link Source to Monument"
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
            body={sourceBodyTemplate}
            header="Source"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-primary"
          />
          <Column
            field="pageNumbers"
            body={(rowData) =>
              rowData.pageNumbers || rowData.page_numbers || "-"
            }
            header="Pages"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-secondary"
          />
          <Column
            field="displayOrder"
            body={(rowData) =>
              rowData.displayOrder || rowData.display_order || "-"
            }
            header="Order"
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

      <MonumentSourceFormDialog
        visible={visible}
        selectedItem={selectedItem}
        formData={formData}
        monuments={monuments}
        sources={sources}
        onHide={hideDialog}
        onSave={saveMonumentSource}
        onFormDataChange={setFormData}
      />
    </div>
  );
};

export default MonumentSourcesManagement;
