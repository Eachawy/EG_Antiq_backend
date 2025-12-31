import React from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { UserPlus, X, Check } from "lucide-react";

const AssignRoleDialog = (props) => {
  return (
    <Dialog
      visible={props.visible}
      onHide={props.onHide}
      header={
        <div className="kemetra-dialog-header">
          <UserPlus className="kemetra-dialog-header-icon" />
          <span className="kemetra-dialog-header-title">
            Assign Role to User
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
            label="Assign"
            icon={<Check size={18} />}
            onClick={props.onSave}
            className="kemetra-btn-primary"
            disabled={!props.formData.userId || !props.formData.roleId}
          />
        </div>
      }
      className="kemetra-dialog kemetra-dialog-width-50"
    >
      <div className="kemetra-form">
        <div className="kemetra-form-field">
          <label className="kemetra-form-label">
            User <span className="kemetra-form-required">*</span>
          </label>
          <Dropdown
            value={props.formData.userId}
            options={props.users.map((user) => ({
              label: `${user.firstName} ${user.lastName} (${user.email})`,
              value: user.id,
            }))}
            onChange={(e) =>
              props.setFormData({ ...props.formData, userId: e.value })
            }
            placeholder="Select a user"
            filter
            className="kemetra-dropdown"
          />
        </div>
        <div className="kemetra-form-field">
          <label className="kemetra-form-label">
            Role <span className="kemetra-form-required">*</span>
          </label>
          <Dropdown
            value={props.formData.roleId}
            options={props.roles.map((role) => ({
              label: role.name,
              value: role.id,
            }))}
            onChange={(e) =>
              props.setFormData({ ...props.formData, roleId: e.value })
            }
            placeholder="Select a role"
            filter
            className="kemetra-dropdown"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default AssignRoleDialog;
