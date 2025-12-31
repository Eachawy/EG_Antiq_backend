import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Crown, X, Check } from "lucide-react";

const DynastyFormDialog = (props) => {
  return (
    <Dialog
      visible={props.visible}
      style={{ width: "90%", maxWidth: "800px" }}
      header={
        <div className="flex items-center gap-3">
          <div className="kemetra-dialog-header-icon-box">
            <Crown size={20} className="kemetra-dialog-header-icon-color" />
          </div>
          <div>
            <h3 className="kemetra-dialog-title-text">
              {props.selectedDynasty ? "Edit Dynasty" : "Add New Dynasty"}
            </h3>
            <p className="kemetra-dialog-subtitle-text">
              {props.selectedDynasty
                ? "Update dynasty information"
                : "Create a new dynasty"}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="Enter dynasty name in English"
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
              placeholder="أدخل اسم الأسرة بالعربية"
              className="w-full kemetra-field-input-rtl"
            />
          </div>
        </div>

        <div>
          <label htmlFor="eraId" className="kemetra-field-label">
            Era <span className="kemetra-field-required">*</span>
          </label>
          <Dropdown
            id="eraId"
            value={props.formData.eraId}
            onChange={(e) =>
              props.onFormDataChange({ ...props.formData, eraId: e.value })
            }
            options={props.eras}
            optionLabel="nameEn"
            optionValue="id"
            placeholder="Select an era"
            className="w-full kemetra-field-input"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dateFrom" className="kemetra-field-label">
              From <span className="kemetra-field-required">*</span>
            </label>
            <InputText
              id="dateFrom"
              value={props.formData.dateFrom || ""}
              onChange={(e) =>
                props.onFormDataChange({
                  ...props.formData,
                  dateFrom: e.target.value,
                })
              }
              placeholder="e.g., 3100 BC"
              className="kemetra-field-input"
            />
          </div>

          <div>
            <label htmlFor="dateTo" className="kemetra-field-label">
              To <span className="kemetra-field-required">*</span>
            </label>
            <InputText
              id="dateTo"
              value={props.formData.dateTo || ""}
              onChange={(e) =>
                props.onFormDataChange({
                  ...props.formData,
                  dateTo: e.target.value,
                })
              }
              placeholder="e.g., 2686 BC"
              className="kemetra-field-input"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="hijriFrom" className="kemetra-field-label">
              Hijri Date From <span className="kemetra-field-required">*</span>
            </label>
            <InputText
              id="hijriFrom"
              value={props.formData.hijriFrom || ""}
              onChange={(e) =>
                props.onFormDataChange({
                  ...props.formData,
                  hijriFrom: e.target.value,
                })
              }
              placeholder="e.g., 1 AH"
              className="kemetra-field-input"
            />
          </div>

          <div>
            <label htmlFor="hijriTo" className="kemetra-field-label">
              Hijri Date To <span className="kemetra-field-required">*</span>
            </label>
            <InputText
              id="hijriTo"
              value={props.formData.hijriTo || ""}
              onChange={(e) =>
                props.onFormDataChange({
                  ...props.formData,
                  hijriTo: e.target.value,
                })
              }
              placeholder="e.g., 40 AH"
              className="kemetra-field-input"
            />
          </div>
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
          label="Save Dynasty"
          icon={<Check size={18} />}
          onClick={props.onSave}
          className="kemetra-btn-save"
        />
      </div>
    </Dialog>
  );
};

export default DynastyFormDialog;
