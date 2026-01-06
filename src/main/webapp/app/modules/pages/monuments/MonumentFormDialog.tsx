import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { TabView, TabPanel } from "primereact/tabview";
import { MapPin, X, Check, Info, AlignLeft, Upload } from "lucide-react";

const MonumentFormDialog = (props) => {
  return (
    <Dialog
      visible={props.visible}
      style={{ width: "95%", maxWidth: "1000px" }}
      header={
        <div className="flex items-center gap-3">
          <div className="kemetra-dialog-header-icon-box">
            <MapPin size={20} className="kemetra-dialog-header-icon-color" />
          </div>
          <div>
            <h3 className="kemetra-dialog-title-text">
              {props.selectedMonument ? "Edit Monument" : "Add New Monument"}
            </h3>
            <p className="kemetra-dialog-subtitle-text">
              Complete monument information with descriptions
            </p>
          </div>
        </div>
      }
      modal
      className="p-fluid"
      onHide={props.onHide}
      maximizable
    >
      <TabView className="mt-4">
        <TabPanel
          header={
            <span className="flex items-center gap-2">
              <Info size={16} /> Basic Info
            </span>
          }
        >
          <div className="space-y-5 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="kemetra-field-label">
                  Monuments English{" "}
                  <span className="kemetra-field-required">*</span>
                </label>
                <InputText
                  value={props.formData.monumentNameEn || ""}
                  onChange={(e) =>
                    props.onFormDataChange({
                      ...props.formData,
                      monumentNameEn: e.target.value,
                    })
                  }
                  placeholder="Enter monument name in English"
                  className="kemetra-field-input"
                />
              </div>
              <div>
                <label className="kemetra-field-label">
                  Monuments Arabic{" "}
                  <span className="kemetra-field-required">*</span>
                </label>
                <InputText
                  value={props.formData.monumentNameAr || ""}
                  onChange={(e) =>
                    props.onFormDataChange({
                      ...props.formData,
                      monumentNameAr: e.target.value,
                    })
                  }
                  placeholder="أدخل اسم الأثر بالعربية"
                  className="kemetra-field-input-rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="kemetra-field-label">
                  Monument Biography English
                </label>
                <InputTextarea
                  value={props.formData.monumentBiographyEn || ""}
                  onChange={(e) =>
                    props.onFormDataChange({
                      ...props.formData,
                      monumentBiographyEn: e.target.value,
                    })
                  }
                  rows={4}
                  placeholder="Enter monument biography in English"
                  className="kemetra-field-input"
                />
              </div>
              <div>
                <label className="kemetra-field-label">
                  Monument Biography Arabic
                </label>
                <InputTextarea
                  value={props.formData.monumentBiographyAr || ""}
                  onChange={(e) =>
                    props.onFormDataChange({
                      ...props.formData,
                      monumentBiographyAr: e.target.value,
                    })
                  }
                  rows={4}
                  placeholder="أدخل سيرة الأثر بالعربية"
                  className="kemetra-field-input-rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="kemetra-field-label">Latitude</label>
                <InputText
                  value={props.formData.lat || ""}
                  onChange={(e) =>
                    props.onFormDataChange({
                      ...props.formData,
                      lat: e.target.value,
                    })
                  }
                  placeholder="e.g., 29.9792"
                  className="kemetra-field-input"
                />
              </div>
              <div>
                <label className="kemetra-field-label">Longitude</label>
                <InputText
                  value={props.formData.lng || ""}
                  onChange={(e) =>
                    props.onFormDataChange({
                      ...props.formData,
                      lng: e.target.value,
                    })
                  }
                  placeholder="e.g., 31.1342"
                  className="kemetra-field-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="kemetra-field-label">Zoom</label>
                <InputText
                  value={props.formData.zoom || ""}
                  onChange={(e) =>
                    props.onFormDataChange({
                      ...props.formData,
                      zoom: e.target.value,
                    })
                  }
                  placeholder="e.g., 15"
                  className="kemetra-field-input"
                />
              </div>
              <div>
                <label className="kemetra-field-label">Center</label>
                <InputText
                  value={props.formData.center || ""}
                  onChange={(e) =>
                    props.onFormDataChange({
                      ...props.formData,
                      center: e.target.value,
                    })
                  }
                  placeholder="e.g., 29.9792, 31.1342"
                  className="kemetra-field-input"
                />
              </div>
            </div>

            <div>
              <label className="kemetra-field-label">Monument Image</label>
              <div className="p-4 rounded-lg border-2 border-dashed kemetra-gallery-upload-border">
                <FileUpload
                  name="monumentImage"
                  accept="image/*"
                  maxFileSize={5000000}
                  onSelect={props.onFileSelect}
                  emptyTemplate={
                    <div className="flex flex-col items-center gap-3 py-6">
                      <Upload
                        size={48}
                        className="kemetra-monument-upload-icon"
                      />
                      <div className="text-center">
                        <p className="font-medium mb-1 kemetra-monument-upload-title">
                          Drag and drop an image here
                        </p>
                        <p className="text-sm kemetra-monument-upload-subtitle">
                          or click to browse (Max 5MB)
                        </p>
                      </div>
                    </div>
                  }
                  chooseOptions={{
                    icon: <Upload size={16} />,
                    iconOnly: false,
                    className: "p-button-outlined kemetra-gallery-choose-btn",
                  }}
                />
                {props.uploadedFile && (
                  <div className="mt-3 p-3 rounded-lg kemetra-monument-current-file-bg">
                    <p className="text-sm kemetra-monument-current-file-text">
                      Selected: {props.uploadedFile.name} (
                      {(props.uploadedFile.size / 1024).toFixed(2)} KB)
                    </p>
                  </div>
                )}
                {!props.uploadedFile && props.formData.image && (
                  <div className="mt-3 p-3 rounded-lg kemetra-monument-current-file-bg">
                    <p className="text-sm kemetra-monument-current-file-text">
                      Current: {props.formData.image}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="kemetra-field-label">Monument Date</label>
                <InputText
                  value={props.formData.mDate || ""}
                  onChange={(e) =>
                    props.onFormDataChange({
                      ...props.formData,
                      mDate: e.target.value,
                    })
                  }
                  placeholder="e.g., 2560 BC"
                  className="kemetra-field-input"
                />
              </div>
              <div>
                <label className="kemetra-field-label">
                  Monument Date (Hijri)
                </label>
                <InputText
                  value={props.formData.mDateHijri || ""}
                  onChange={(e) =>
                    props.onFormDataChange({
                      ...props.formData,
                      mDateHijri: e.target.value,
                    })
                  }
                  placeholder="e.g., 15/03/1446"
                  className="kemetra-field-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="kemetra-field-label">
                  Monument Type{" "}
                  <span className="kemetra-field-required">*</span>
                </label>
                <Dropdown
                  value={props.formData.monumentsTypeId}
                  options={props.monumentTypes}
                  optionLabel="nameEn"
                  optionValue="id"
                  onChange={(e) =>
                    props.onFormDataChange({
                      ...props.formData,
                      monumentsTypeId: e.value,
                    })
                  }
                  placeholder="Select type"
                  className="kemetra-field-input"
                />
              </div>
              <div>
                <label className="kemetra-field-label">
                  Era <span className="kemetra-field-required">*</span>
                </label>
                <Dropdown
                  value={props.formData.eraId}
                  options={props.eras}
                  optionLabel="nameEn"
                  optionValue="id"
                  onChange={(e) =>
                    props.onFormDataChange({
                      ...props.formData,
                      eraId: e.value,
                    })
                  }
                  placeholder="Select era"
                  className="kemetra-field-input"
                />
              </div>
              <div>
                <label className="kemetra-field-label">
                  Dynasty <span className="kemetra-field-required">*</span>
                </label>
                <Dropdown
                  value={props.formData.dynastyId}
                  options={props.dynasties}
                  optionLabel="nameEn"
                  optionValue="id"
                  onChange={(e) =>
                    props.onFormDataChange({
                      ...props.formData,
                      dynastyId: e.value,
                    })
                  }
                  placeholder="Select dynasty"
                  className="kemetra-field-input"
                />
              </div>
            </div>
          </div>
        </TabPanel>

        <TabPanel
          header={
            <span className="flex items-center gap-2">
              <AlignLeft size={16} /> Descriptions
            </span>
          }
        >
          <div className="space-y-5 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="kemetra-field-label">
                  Description English
                </label>
                <InputTextarea
                  value={props.formData.descriptionEn || ""}
                  onChange={(e) =>
                    props.onFormDataChange({
                      ...props.formData,
                      descriptionEn: e.target.value,
                    })
                  }
                  rows={8}
                  placeholder="Enter monument description in English"
                  className="kemetra-field-input"
                />
              </div>
              <div>
                <label className="kemetra-field-label">
                  Description Arabic
                </label>
                <InputTextarea
                  value={props.formData.descriptionAr || ""}
                  onChange={(e) =>
                    props.onFormDataChange({
                      ...props.formData,
                      descriptionAr: e.target.value,
                    })
                  }
                  rows={8}
                  placeholder="أدخل وصف الأثر بالعربية"
                  className="kemetra-field-input-rtl"
                />
              </div>
            </div>
          </div>
        </TabPanel>
      </TabView>

      <div className="kemetra-dialog-footer">
        <Button
          label="Cancel"
          icon={<X size={18} />}
          outlined
          onClick={props.onHide}
          className="kemetra-btn-cancel"
        />
        <Button
          label="Save Monument"
          icon={<Check size={18} />}
          onClick={props.onSave}
          className="kemetra-btn-save"
        />
      </div>
    </Dialog>
  );
};

export default MonumentFormDialog;
