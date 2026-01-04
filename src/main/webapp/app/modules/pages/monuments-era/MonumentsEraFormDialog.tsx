import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Link2, X, Check } from "lucide-react";

const MonumentsEraFormDialog = (props) => {
  return (
    <Dialog
      visible={props.visible}
      className="p-fluid kemetra-dialog-width-md"
      header={
        <div className="flex items-center gap-3">
          <div className="kemetra-dialog-header-icon-box">
            <Link2 size={20} className="kemetra-dialog-header-icon-color" />
          </div>
          <div>
            <h3 className="kemetra-dialog-title-text">
              {props.selectedItem ? "Edit Link" : "Add Monument Type-Era Link"}
            </h3>
            <p className="kemetra-dialog-subtitle-text">
              {props.selectedItem
                ? "Update monument type-era connection"
                : "Link a monument type to a historical era"}
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
          <label htmlFor="monumentsTypeId" className="kemetra-field-label">
            Monument Type <span className="kemetra-field-required">*</span>
          </label>
          <Dropdown
            id="monumentsTypeId"
            value={props.formData.monumentsTypeId}
            options={props.monumentTypes}
            onChange={(e) =>
              props.onFormDataChange({
                ...props.formData,
                monumentsTypeId: e.value,
              })
            }
            placeholder="Select a monument type"
            filter
            className="kemetra-field-input"
          />
        </div>

        <div>
          <label htmlFor="eraId" className="kemetra-field-label">
            Era <span className="kemetra-field-required">*</span>
          </label>
          <Dropdown
            id="eraId"
            value={props.formData.eraId}
            options={props.eras}
            onChange={(e) =>
              props.onFormDataChange({ ...props.formData, eraId: e.value })
            }
            placeholder="Select an era"
            filter
            className="kemetra-field-input"
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
          label="Save Link"
          icon={<Check size={18} />}
          onClick={props.onSave}
          className="kemetra-btn-save"
        />
      </div>
    </Dialog>
  );
};
export default MonumentsEraFormDialog;
