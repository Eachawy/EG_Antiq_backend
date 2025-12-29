import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import {
  FileUpload,
  FileUploadHeaderTemplateOptions,
  FileUploadSelectEvent,
  ItemTemplateOptions,
} from "primereact/fileupload";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Image } from "primereact/image";
import { Tag } from "primereact/tag";
import PageHeader from "app/shared/components/page-header/page-header";

import {
  Trash2,
  Plus,
  Images as ImagesIcon,
  AlertTriangle,
  X,
  Check,
  Inbox,
  Upload,
} from "lucide-react";
import { PenLine } from "lucide-react";

const GalleryPage = (props) => {
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
  const [galleryItems, setGalleryItems] = useState([]);
  const [monuments] = useState(mockMonuments);
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData]: any = useState({ images: [] });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileUploadRef = React.useRef<FileUpload>(null);

  const openNew = () => {
    setFormData({ images: [] });
    setUploadedFiles([]);
    setSelectedItem(null);
    setVisible(true);
  };

  const openEdit = (item) => {
    setFormData(item);
    setUploadedFiles([]);
    setSelectedItem(item);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setFormData({ images: [] });
    setUploadedFiles([]);
    setSelectedItem(null);
    if (fileUploadRef.current) {
      fileUploadRef.current.clear();
    }
  };

  const save = () => {
    hideDialog();
  };

  const confirmDelete = (item) => {
    confirmDialog({
      message: "Are you sure you want to delete this gallery?",
      header: "Confirm Deletion",
      icon: <AlertTriangle size={24} className="text-red-500" />,
      acceptClassName: "p-button-danger",
      // accept: () => {
      //   setGalleryItems(galleryItems.filter((g) => g.id !== item.id));
      // },
    });
  };

  const onFileSelect = (e: any) => {
    const files = e.files as File[];
    setUploadedFiles(files);

    // Simulate file upload and get URLs
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setFormData({
      ...formData,
      images: [...(formData.images || []), ...imageUrls],
    });
  };

  const onFileRemove = (file: any) => {
    const updatedFiles = uploadedFiles.filter((f) => f.name !== file.name);
    setUploadedFiles(updatedFiles);

    // Update image URLs
    const imageUrls = updatedFiles.map((f) => URL.createObjectURL(f));
    setFormData({ ...formData, images: imageUrls });
  };

  const removeExistingImage = (index: any) => {
    const updatedImages = (formData.images || []).filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  const getMonumentName = (monumentId: string) => {
    const monument = monuments.find((m) => m.id === monumentId);
    return monument ? monument.nameEn : "-";
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
    return getMonumentName(rowData.monumentId);
  };

  const imagesBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2 items-center">
        {rowData.images.slice(0, 3).map((img, index) => (
          <Image
            key={index}
            src={img || "https://via.placeholder.com/60"}
            alt={`Gallery ${index + 1}`}
            width="60"
            height="60"
            preview
            className="rounded object-cover border kemetra-gallery-image-preview"
          />
        ))}
        {rowData.images.length > 3 && (
          <Tag value={`+${rowData.images.length - 3}`} severity="info" />
        )}
      </div>
    );
  };

  const countBodyTemplate = (rowData) => {
    return (
      <Tag
        value={`${rowData.images.length} image${rowData.images.length !== 1 ? "s" : ""}`}
        className="kemetra-gallery-count-tag"
      />
    );
  };

  const headerTemplate = (options) => {
    const { chooseButton, cancelButton } = options;

    return (
      <div className="flex justify-between items-center kemetra-gallery-upload-header">
        <div className="flex gap-2">
          {chooseButton}
          {cancelButton}
        </div>
        <span className="kemetra-gallery-upload-counter">
          {uploadedFiles.length > 0
            ? `${uploadedFiles.length} file(s) selected`
            : "No files selected"}
        </span>
      </div>
    );
  };

  const itemTemplate = (inFile: object, i: any) => {
    const file = inFile as File;
    return (
      <div className="flex items-center justify-between p-3 rounded-lg mb-2 kemetra-gallery-file-item">
        <div className="flex items-center gap-3">
          <img
            alt={file.name}
            role="presentation"
            src={URL.createObjectURL(file)}
            width={60}
            height={60}
            className="rounded object-cover"
          />
          <div>
            <p className="font-semibold mb-1 kemetra-gallery-file-name">
              {file.name}
            </p>
            <p className="text-sm kemetra-gallery-file-size">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        </div>
        <Button
          type="button"
          icon={<X size={16} />}
          rounded
          text
          severity="danger"
          onClick={() => {
            onFileRemove(file);
            i.onRemove();
          }}
        />
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <Upload size={48} className="kemetra-gallery-upload-empty-icon" />
        <div className="text-center">
          <p className="font-medium mb-1 kemetra-gallery-upload-empty-title">
            Drag and drop images here
          </p>
          <p className="text-sm kemetra-gallery-upload-empty-subtitle">
            or click to browse (Max 5MB per file)
          </p>
        </div>
      </div>
    );
  };

  return (
    <div>
      <ConfirmDialog />

      <PageHeader
        title="Gallery Management"
        description="Manage monument gallery images"
        actionLabel="Add Gallery"
        onAction={openNew}
      />

      <div className="kemetra-table-container">
        <DataTable
          value={galleryItems}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage={
            <div className="kemetra-empty-state-container">
              <Inbox size={48} className="kemetra-empty-state-icon" />
              <p className="text-lg font-medium mb-2 kemetra-empty-state-title">
                No gallery items found
              </p>
              <p className="text-sm mb-4 kemetra-empty-state-description">
                Get started by adding your first gallery
              </p>
              <Button
                label="Add Gallery"
                icon={<Plus size={18} />}
                onClick={openNew}
                className="kemetra-empty-state-button"
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
              className: "kemetra-table-row-transition",
            },
          }}
        >
          <Column
            body={monumentBodyTemplate}
            header="Monument"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-monument"
          />
          <Column
            body={imagesBodyTemplate}
            header="Preview"
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-padding"
          />
          <Column
            body={countBodyTemplate}
            header="Images Count"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-padding"
          />
          <Column
            body={actionBodyTemplate}
            header="Actions"
            style={{ width: "120px" }}
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-padding"
          />
        </DataTable>
      </div>

      <Dialog
        visible={visible}
        className="p-fluid kemetra-gallery-dialog-width"
        header={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center kemetra-gallery-dialog-icon-bg">
              <ImagesIcon
                size={20}
                className="kemetra-gallery-dialog-icon-color"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold kemetra-gallery-dialog-title">
                {selectedItem ? "Edit Gallery" : "Add New Gallery"}
              </h3>
              <p className="text-sm kemetra-gallery-dialog-subtitle">
                {selectedItem
                  ? "Update gallery images"
                  : "Upload multiple images to the gallery"}
              </p>
            </div>
          </div>
        }
        modal
        onHide={hideDialog}
        draggable={false}
      >
        <div className="space-y-5 pt-4">
          <div>
            <label
              htmlFor="monumentId"
              className="block text-sm font-semibold mb-2 kemetra-gallery-label"
            >
              Monument <span className="kemetra-gallery-label-required">*</span>
            </label>
            <Dropdown
              id="monumentId"
              value={formData.monumentId}
              options={monuments}
              optionLabel="nameEn"
              optionValue="id"
              onChange={(e) =>
                setFormData({ ...formData, monumentId: e.value })
              }
              placeholder="Select a monument"
              filter
              className="kemetra-gallery-dropdown"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 kemetra-gallery-label">
              Gallery <span className="kemetra-gallery-label-required">*</span>
            </label>
            <div className="p-4 rounded-lg border-2 border-dashed kemetra-gallery-upload-border">
              <FileUpload
                ref={fileUploadRef}
                name="gallery[]"
                multiple
                accept="image/*"
                maxFileSize={5000000}
                onSelect={onFileSelect}
                headerTemplate={headerTemplate}
                itemTemplate={itemTemplate}
                emptyTemplate={emptyTemplate}
                chooseOptions={{
                  icon: <Upload size={16} />,
                  iconOnly: false,
                  className: "p-button-outlined kemetra-gallery-choose-btn",
                  label: "Choose Images",
                }}
                cancelOptions={{
                  icon: <X size={16} />,
                  iconOnly: false,
                  className: "p-button-outlined p-button-danger",
                  label: "Clear",
                }}
              />
            </div>
          </div>

          {formData.images && formData.images.length > 0 && (
            <div>
              <label className="block text-sm font-semibold mb-3 kemetra-gallery-label">
                Selected Images ({formData.images.length})
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg kemetra-gallery-selected-image"
                    />
                    <Button
                      icon={<Trash2 size={16} />}
                      rounded
                      severity="danger"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity kemetra-gallery-delete-btn"
                      onClick={() => removeExistingImage(index)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t kemetra-gallery-dialog-footer">
          <Button
            label="Cancel"
            icon={<X size={18} />}
            outlined
            onClick={hideDialog}
            className="kemetra-btn-cancel"
          />
          <Button
            label="Save Gallery"
            icon={<Check size={18} />}
            onClick={save}
            className="kemetra-btn-save"
          />
        </div>
      </Dialog>
    </div>
  );
};

export default GalleryPage;
