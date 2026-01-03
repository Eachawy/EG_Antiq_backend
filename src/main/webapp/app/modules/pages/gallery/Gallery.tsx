import React, { useState, useEffect } from "react";
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
import { useAppDispatch, useAppSelector } from "app/config/store";
import {
  getGalleryListData,
  createGallery,
  updateGallery,
  deleteGallery,
} from "./gallery.reducer";
import { getMonumentsListData } from "app/modules/pages/monuments/monuments.reducer";
import { toast } from "react-toastify";
import { Storage } from "react-jhipster";
import {
  AUTH_TOKEN_KEY,
  GATEWAY_SERVER_API_URL,
  SERVER_API_URL,
} from "app/config/constants";

import {
  Trash2,
  Plus,
  Images as ImagesIcon,
  AlertTriangle,
  X,
  Check,
  Inbox,
  Upload,
  Filter,
} from "lucide-react";
import { PenLine } from "lucide-react";

const GalleryPage = (props) => {
  const dispatch = useAppDispatch();

  const [galleryItems, setGalleryItems] = useState([]);
  const [monuments, setMonuments] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData]: any = useState({ images: [] });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [filterMonumentId, setFilterMonumentId] = useState<number | null>(null);
  const fileUploadRef = React.useRef<FileUpload>(null);

  const $GalleryList = useAppSelector((state) => state.Gallery.galleryList);
  const loading = useAppSelector((state) => state.Gallery.loading);
  const $MonumentsList = useAppSelector(
    (state) => state.Monuments.monumentsList,
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if ($GalleryList) {
      if ($GalleryList.data && Array.isArray($GalleryList.data)) {
        setGalleryItems($GalleryList.data);
      } else if (Array.isArray($GalleryList)) {
        setGalleryItems($GalleryList);
      }
    }
  }, [$GalleryList]);

  useEffect(() => {
    if ($MonumentsList) {
      if ($MonumentsList.data && Array.isArray($MonumentsList.data)) {
        setMonuments($MonumentsList.data);
      } else if (Array.isArray($MonumentsList)) {
        setMonuments($MonumentsList);
      }
    }
  }, [$MonumentsList]);

  const fetchData = async () => {
    await dispatch(getGalleryListData());
    await dispatch(getMonumentsListData());
  };

  const openNew = () => {
    setFormData({ monumentId: null, images: [] });
    setUploadedFiles([]);
    setSelectedItem(null);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setFormData({ monumentId: null, images: [] });
    setUploadedFiles([]);
    setSelectedItem(null);
    if (fileUploadRef.current) {
      fileUploadRef.current.clear();
    }
  };

  const save = async () => {
    try {
      // Get the selected monument to extract related IDs
      const selectedMonument = monuments.find(
        (m) => m.id === formData.monumentId,
      );

      if (!selectedMonument) {
        toast.error("Please select a monument");
        return;
      }

      if (!uploadedFiles || uploadedFiles.length === 0) {
        toast.error("Please upload at least one image");
        return;
      }

      // Upload files to server first
      const formDataToUpload = new FormData();
      uploadedFiles.forEach((file) => {
        formDataToUpload.append("files", file);
      });

      // Get token from storage (checks both local and session)
      const token =
        Storage.local.get(AUTH_TOKEN_KEY) ||
        Storage.session.get(AUTH_TOKEN_KEY);

      if (!token) {
        toast.error("Authentication required. Please login again.");
        return;
      }

      // Upload files to server
      const uploadResponse = await fetch(
        `${GATEWAY_SERVER_API_URL}/v1/upload/images`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToUpload,
        },
      );

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        const errorMessage =
          errorData?.error?.message ||
          errorData?.message ||
          "Failed to upload images";
        throw new Error(errorMessage);
      }

      const uploadResult = await uploadResponse.json();
      const uploadedImagePaths = uploadResult.data;

      // Create gallery records with the uploaded file paths
      for (const uploadedImage of uploadedImagePaths) {
        const galleryData = {
          galleryPath: uploadedImage.path,
          monumentsId: formData.monumentId,
          dynastyId: selectedMonument.dynastyId,
          eraId: selectedMonument.eraId,
          monumentsTypeId: selectedMonument.monumentsTypeId,
        };

        await dispatch(createGallery(galleryData)).unwrap();
      }

      toast.success(
        `${uploadedFiles.length} gallery image${uploadedFiles.length > 1 ? "s" : ""} created successfully!`,
      );
      hideDialog();
      await dispatch(getGalleryListData());
    } catch (error: any) {
      const errorMessage =
        error?.message || "An error occurred while saving the gallery.";
      toast.error(errorMessage);
      console.error("Save error:", error);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await dispatch(deleteGallery(id)).unwrap();
      toast.success("Gallery image deleted successfully!");
      await dispatch(getGalleryListData());
    } catch (error) {
      toast.error("An error occurred while deleting the gallery image.");
      console.error("Delete error:", error);
    }
  };

  const confirmDelete = (item) => {
    confirmDialog({
      message: "Are you sure you want to delete this gallery image?",
      header: "Confirm Deletion",
      icon: <AlertTriangle size={24} className="text-red-500" />,
      acceptClassName: "p-button-danger",
      accept: () => handleDelete(item.id),
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

  const getMonumentName = (monumentsId: number) => {
    const monument = monuments.find((m) => m.id === monumentsId);
    return monument
      ? monument.monumentNameEn || monument.nameEn || monument.name_en
      : "-";
  };

  const monumentItemTemplate = (option: any) => {
    return (
      <span>
        {option?.monumentNameEn ||
          option?.nameEn ||
          option?.name_en ||
          "Unknown Type"}
      </span>
    );
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
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
    // The backend includes the full monument object, use it directly
    return (
      rowData.monument?.monumentNameEn ||
      rowData.monument?.nameEn ||
      rowData.monument?.name_en ||
      getMonumentName(rowData.monumentsId)
    );
  };

  const imageBodyTemplate = (rowData: any) => {
    // Convert path to full URL if it starts with /uploads
    const imageSrc = rowData.galleryPath?.startsWith("/uploads")
      ? `${SERVER_API_URL}${rowData.galleryPath}`
      : rowData.galleryPath || "https://picsum.photos/seed/default/80";

    return (
      <Image
        src={imageSrc}
        alt="Gallery Image"
        width="80"
        height="80"
        preview
        className="rounded object-cover border kemetra-gallery-image-preview"
        onError={(e: any) => {
          e.target.src = "https://picsum.photos/seed/default/80";
        }}
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

  // Filter gallery items by monument
  const filteredGalleryItems = filterMonumentId
    ? galleryItems.filter((item: any) => item.monumentsId === filterMonumentId)
    : galleryItems;

  return (
    <div>
      <ConfirmDialog />

      <PageHeader
        title="Gallery Management"
        description="Manage monument gallery images"
        actionLabel="Add Gallery Images"
        onAction={openNew}
      />

      {/* Filter Section */}
      <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-600" />
            <span className="font-semibold text-gray-700">
              Filter by Monument:
            </span>
          </div>
          <div className="flex-1 max-w-md">
            <Dropdown
              value={filterMonumentId}
              options={monuments}
              optionLabel="monumentNameEn"
              optionValue="id"
              onChange={(e) => setFilterMonumentId(e.value)}
              placeholder="Select a monument to filter"
              filter
              showClear
              className="w-full"
            />
          </div>
          {filterMonumentId && (
            <Button
              label="Clear Filter"
              icon={<X size={16} />}
              outlined
              severity="secondary"
              onClick={() => setFilterMonumentId(null)}
              className="kemetra-btn-cancel"
            />
          )}
          {filterMonumentId && (
            <div className="ml-auto text-sm text-gray-600">
              Showing {filteredGalleryItems.length} of {galleryItems.length}
              images
            </div>
          )}
        </div>
      </div>

      <div className="kemetra-table-container">
        <DataTable
          value={filteredGalleryItems}
          loading={loading}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage={
            <div className="kemetra-empty-state-container">
              <Inbox size={48} className="kemetra-empty-state-icon" />
              <p className="text-lg font-medium mb-2 kemetra-empty-state-title">
                {filterMonumentId
                  ? "No images found for selected monument"
                  : "No gallery images found"}
              </p>
              <p className="text-sm mb-4 kemetra-empty-state-description">
                {filterMonumentId
                  ? "Try selecting a different monument or clear the filter"
                  : "Get started by adding your first gallery images"}
              </p>
              {!filterMonumentId && (
                <Button
                  label="Add Gallery Images"
                  icon={<Plus size={18} />}
                  onClick={openNew}
                  className="kemetra-empty-state-button"
                />
              )}
              {filterMonumentId && (
                <Button
                  label="Clear Filter"
                  icon={<X size={18} />}
                  onClick={() => setFilterMonumentId(null)}
                  outlined
                  className="kemetra-empty-state-button"
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
            body={imageBodyTemplate}
            header="Image"
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-padding"
          />
          <Column
            field="galleryPath"
            header="Image Path"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-secondary"
            body={(rowData) => (
              <div className="max-w-md truncate" title={rowData.galleryPath}>
                {rowData.galleryPath || "-"}
              </div>
            )}
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
                Add Gallery Images
              </h3>
              <p className="text-sm kemetra-gallery-dialog-subtitle">
                Upload multiple images to the gallery
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
              optionLabel="monumentNameEn"
              itemTemplate={monumentItemTemplate}
              valueTemplate={monumentItemTemplate}
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
