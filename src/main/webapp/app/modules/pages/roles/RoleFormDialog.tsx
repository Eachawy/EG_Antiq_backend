import React from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Shield, X, Check } from "lucide-react";

const RoleFormDialog = (props) => {
  return (
    <Dialog
      visible={props.visible}
      onHide={props.onHide}
      header={
        <div className="kemetra-dialog-header">
          <Shield className="kemetra-dialog-header-icon" />
          <span className="kemetra-dialog-header-title">
            {props.isEdit ? "Edit Role" : "Add New Role"}
          </span>
        </div>
      }
      footer={
        <div className="kemetra-dialog-footer">
          <Button
            label="Cancel"
            icon={<X size={18} />}
            onClick={props.onHide}
            className="kemetra-btn-secondary"
          />
          <Button
            label={props.isEdit ? "Update" : "Save"}
            icon={<Check size={18} />}
            onClick={props.onSave}
            className="kemetra-btn-primary"
            disabled={!props.formData.name}
          />
        </div>
      }
      className="kemetra-dialog kemetra-dialog-width-50"
    >
      <div className="kemetra-form">
        <div className="kemetra-form-field">
          <label className="kemetra-form-label">
            Role Name <span className="kemetra-form-required">*</span>
          </label>
          <InputText
            value={props.formData.name || ""}
            onChange={(e) =>
              props.setFormData({ ...props.formData, name: e.target.value })
            }
            placeholder="Enter role name"
            className="kemetra-input"
          />
        </div>
        <div className="kemetra-form-field">
          <label className="kemetra-form-label">Description</label>
          <InputTextarea
            value={props.formData.description || ""}
            onChange={(e) =>
              props.setFormData({
                ...props.formData,
                description: e.target.value,
              })
            }
            placeholder="Enter role description"
            rows={4}
            className="kemetra-input"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default RoleFormDialog;
