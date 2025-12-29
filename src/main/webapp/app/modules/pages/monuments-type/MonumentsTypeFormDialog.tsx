import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Layers, X, Check } from "lucide-react";

const MonumentsTypeFormDialog = (props) => {
  return (
    <Dialog
      visible={props.visible}
      style={{ width: "90%", maxWidth: "600px" }}
      header={
        <div className="flex items-center gap-3">
          <div className="kemetra-dialog-header-icon-box">
            <Layers size={20} className="kemetra-dialog-header-icon-color" />
          </div>
          <div>
            <h3 className="kemetra-dialog-title-text">
              {props.selectedType
                ? "Edit Monument Type"
                : "Add New Monument Type"}
            </h3>
            <p className="kemetra-dialog-subtitle-text">
              {props.selectedType
                ? "Update monument type information"
                : "Create a new monument type"}
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
          <label htmlFor="nameEn" className="kemetra-field-label">
            Name (English) <span className="kemetra-field-required">*</span>
          </label>
          <InputText
            id="nameEn"
            value={props.formData.nameEn || ""}
            onChange={(e) =>
              props.onFormDataChange({
                ...props.formData,
                nameEn: e.target.value,
              })
            }
            placeholder="Enter monument type name in English"
            className="w-full kemetra-field-input"
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="nameAr" className="kemetra-field-label">
            Name (Arabic) <span className="kemetra-field-required">*</span>
          </label>
          <InputText
            id="nameAr"
            value={props.formData.nameAr || ""}
            onChange={(e) =>
              props.onFormDataChange({
                ...props.formData,
                nameAr: e.target.value,
              })
            }
            placeholder="أدخل اسم نوع الأثر بالعربية"
            className="w-full kemetra-field-input-rtl"
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
          label="Save Type"
          icon={<Check size={18} />}
          onClick={props.onSave}
          className="kemetra-btn-save"
        />
      </div>
    </Dialog>
  );
};

export default MonumentsTypeFormDialog;
