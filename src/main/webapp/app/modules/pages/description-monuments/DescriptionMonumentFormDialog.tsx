import React from "react";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { FileText, X, Check } from "lucide-react";

const DescriptionMonumentFormDialog = (props) => {
  // Item templates for dropdowns
  const eraItemTemplate = (option: any) => {
    return <span>{option?.nameEn || option?.name_en || "Unknown Era"}</span>;
  };

  const dynastyItemTemplate = (option: any) => {
    return (
      <span>{option?.nameEn || option?.name_en || "Unknown Dynasty"}</span>
    );
  };

  const monumentTypeItemTemplate = (option: any) => {
    return <span>{option?.nameEn || option?.name_en || "Unknown Type"}</span>;
  };

  return (
    <Dialog
      visible={props.visible}
      style={{ width: "90%", maxWidth: "800px" }}
      header={
        <div className="flex items-center gap-3">
          <div className="kemetra-dialog-header-icon-box">
            <FileText size={20} className="kemetra-dialog-header-icon-color" />
          </div>
          <div>
            <h3 className="kemetra-dialog-title-text">
              {props.selectedDesc ? "Edit Description" : "Add New Description"}
            </h3>
            <p className="kemetra-dialog-subtitle-text">
              {props.selectedDesc
                ? "Update description information"
                : "Create a new monument description"}
            </p>
          </div>
        </div>
      }
      modal
      className="p-fluid"
      onHide={props.onHide}
      draggable={false}
    >
      <div className="space-y-5 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="eraId" className="kemetra-field-label">
              Era <span className="kemetra-field-required">*</span>
            </label>
            <Dropdown
              id="eraId"
              value={props.formData.eraId}
              options={props.eras}
              optionValue="id"
              itemTemplate={eraItemTemplate}
              valueTemplate={eraItemTemplate}
              onChange={(e) =>
                props.setFormData({ ...props.formData, eraId: e.value })
              }
              placeholder="Select an era"
              filter
              className="kemetra-field-input"
            />
          </div>

          <div>
            <label htmlFor="dynastyId" className="kemetra-field-label">
              Dynasty <span className="kemetra-field-required">*</span>
            </label>
            <Dropdown
              id="dynastyId"
              value={props.formData.dynastyId}
              options={props.dynasties}
              optionValue="id"
              itemTemplate={dynastyItemTemplate}
              valueTemplate={dynastyItemTemplate}
              onChange={(e) =>
                props.setFormData({ ...props.formData, dynastyId: e.value })
              }
              placeholder="Select a dynasty"
              filter
              className="kemetra-field-input"
            />
          </div>

          <div>
            <label htmlFor="monumentsTypeId" className="kemetra-field-label">
              Monument Type <span className="kemetra-field-required">*</span>
            </label>
            <Dropdown
              id="monumentsTypeId"
              value={props.formData.monumentsTypeId}
              options={props.monumentTypes}
              itemTemplate={monumentTypeItemTemplate}
              valueTemplate={monumentTypeItemTemplate}
              optionValue="id"
              onChange={(e) =>
                props.setFormData({
                  ...props.formData,
                  monumentsTypeId: e.value,
                })
              }
              placeholder="Select a type"
              filter
              className="kemetra-field-input"
            />
          </div>
        </div>

        <div>
          <label htmlFor="descriptionEn" className="kemetra-field-label">
            Description (English){" "}
            <span className="kemetra-field-required">*</span>
          </label>
          <InputTextarea
            id="descriptionEn"
            value={props.formData.descriptionEn || ""}
            onChange={(e) =>
              props.setFormData({
                ...props.formData,
                descriptionEn: e.target.value,
              })
            }
            rows={8}
            placeholder="Enter detailed description in English"
            className="kemetra-field-input"
          />
        </div>

        <div>
          <label htmlFor="descriptionAr" className="kemetra-field-label">
            Description (Arabic){" "}
            <span className="kemetra-field-required">*</span>
          </label>
          <InputTextarea
            id="descriptionAr"
            value={props.formData.descriptionAr || ""}
            onChange={(e) =>
              props.setFormData({
                ...props.formData,
                descriptionAr: e.target.value,
              })
            }
            rows={8}
            placeholder="أدخل وصف مفصل بالعربية"
            className="kemetra-field-input-rtl"
          />
        </div>
      </div>

      <div className="kemetra-dialog-footer">
        <Button
          label="Cancel"
          icon={<X size={18} />}
          outlined
          onClick={props.onHide}
          className="kemetra-btn-cancel"
        />
        <Button
          label="Save Description"
          icon={<Check size={18} />}
          onClick={props.onSave}
          className="kemetra-btn-save"
        />
      </div>
    </Dialog>
  );
};

export default DescriptionMonumentFormDialog;
