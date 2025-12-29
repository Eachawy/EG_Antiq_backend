import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { Images as ImagesIcon, X, Check, Upload, Trash2 } from "lucide-react";

const GalleryFormDialog = (props) => {
  return (
    <Dialog
      visible={props.visible}
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
              {props.selectedItem ? "Edit Gallery" : "Add New Gallery"}
            </h3>
            <p className="text-sm kemetra-gallery-dialog-subtitle">
              {props.selectedItem
                ? "Update gallery images"
                : "Upload multiple images to the gallery"}
            </p>
          </div>
        </div>
      }
      modal
      onHide={props.onHide}
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
            value={props.formData.monumentId}
            options={props.monuments}
            optionLabel="nameEn"
            optionValue="id"
            onChange={(e) =>
              props.onFormDataChange({ ...props.formData, monumentId: e.value })
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
              ref={props.fileUploadRef}
              name="gallery[]"
              multiple
              accept="image/*"
              maxFileSize={5000000}
              onSelect={props.onFileSelect}
              headerTemplate={props.headerTemplate}
              itemTemplate={props.itemTemplate}
              emptyTemplate={props.emptyTemplate}
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

        {props.formData.images && props.formData.images.length > 0 && (
          <div>
            <label className="block text-sm font-semibold mb-3 kemetra-gallery-label">
              Selected Images ({props.formData.images.length})
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {props.formData.images.map((img, index) => (
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
                    onClick={() => props.onRemoveExistingImage(index)}
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
          onClick={props.onHide}
          className="kemetra-btn-cancel"
        />
        <Button
          label="Save Gallery"
          icon={<Check size={18} />}
          onClick={props.onSave}
          className="kemetra-btn-save"
        />
      </div>
    </Dialog>
  );
};

export default GalleryFormDialog;
