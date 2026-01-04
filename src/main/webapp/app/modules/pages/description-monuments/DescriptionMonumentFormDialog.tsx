import React from "react";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { FileText, X, Check } from "lucide-react";

const DescriptionMonumentFormDialog = (props) => {
  // Item template for monuments dropdown
  const monumentItemTemplate = (option: any) => {
    return (
      <span>
        {option?.monumentNameEn ||
          option?.nameEn ||
          option?.name_en ||
          "Unknown Monument"}
      </span>
    );
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
        <div>
          <label htmlFor="monumentId" className="kemetra-field-label">
            Monument <span className="kemetra-field-required">*</span>
          </label>
          <Dropdown
            id="monumentId"
            value={props.formData.monumentId}
            options={props.monuments}
            optionValue="id"
            itemTemplate={monumentItemTemplate}
            valueTemplate={monumentItemTemplate}
            onChange={(e) =>
              props.setFormData({ ...props.formData, monumentId: e.value })
            }
            placeholder="Select a monument"
            filter
            className="kemetra-field-input"
          />
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
