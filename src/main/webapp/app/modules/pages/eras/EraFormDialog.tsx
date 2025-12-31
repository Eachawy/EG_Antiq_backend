import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Clock, X, Save } from "lucide-react";

const EraFormDialog = (props) => {
  return (
    <Dialog
      visible={props.visible}
      style={{ width: "90%", maxWidth: "600px" }}
      header={
        <div className="flex items-center gap-3">
          <div className="kemetra-dialog-header-icon-box">
            <Clock size={20} className="kemetra-dialog-header-icon-color" />
          </div>
          <div>
            <h3 className="kemetra-dialog-title-text">
              {props.selectedEra ? "Edit Era" : "Add New Era"}
            </h3>
            <p className="kemetra-dialog-subtitle-text">
              {props.selectedEra
                ? "Update era information"
                : "Create a new historical era"}
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
            English Name <span className="kemetra-field-required">*</span>
          </label>
          <InputText
            id="nameEn"
            value={props.formData?.nameEn || ""}
            onChange={(e) =>
              props.onFormDataChange({
                ...props.formData,
                nameEn: e.target.value,
              })
            }
            placeholder="Enter era name in English"
            className="w-full kemetra-field-input"
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="nameAr" className="kemetra-field-label">
            Arabic Name <span className="kemetra-field-required">*</span>
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
            placeholder="أدخل اسم العصر باعربية"
            className="w-full kemetra-field-input"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dateFrom" className="kemetra-field-label">
              From (Birth Date){" "}
              <span className="kemetra-field-required">*</span>
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
              placeholder="e.g., 5500 BC"
              className="kemetra-field-input"
            />
          </div>

          <div>
            <label htmlFor="dateTo" className="kemetra-field-label">
              To (Birth Date) <span className="kemetra-field-required">*</span>
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
              placeholder="e.g., 332 BC"
              className="kemetra-field-input"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="hijriFrom" className="kemetra-field-label">
              From (Hijri Date)
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
              placeholder="e.g., 19 H or -"
              className="kemetra-field-input"
            />
          </div>

          <div>
            <label htmlFor="hijriTo" className="kemetra-field-label">
              To (Hijri Date)
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
              placeholder="e.g., 41 H or -"
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
          label="Save Era"
          icon={<Save size={18} />}
          onClick={props.onSave}
          className="kemetra-btn-save"
        />
      </div>
    </Dialog>
  );
};

export default EraFormDialog;
