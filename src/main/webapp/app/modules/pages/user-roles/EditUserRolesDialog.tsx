import React from "react";
import { Dialog } from "primereact/dialog";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { Shield, X, Check } from "lucide-react";

const EditUserRolesDialog = (props) => {
  return (
    <Dialog
      visible={props.visible}
      onHide={props.onHide}
      header={
        <div className="kemetra-dialog-header">
          <Shield className="kemetra-dialog-header-icon" />
          <span className="kemetra-dialog-header-title">
            Manage User Roles - {props.userName}
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
            label="Save Changes"
            icon={<Check size={18} />}
            onClick={props.onSave}
            className="kemetra-btn-primary"
          />
        </div>
      }
      className="kemetra-dialog kemetra-dialog-width-60"
    >
      <div className="kemetra-form">
        <div className="kemetra-form-field">
          <label className="kemetra-form-label">
            Assigned Roles <span className="kemetra-form-required">*</span>
          </label>
          <MultiSelect
            value={props.selectedRoleIds}
            options={props.roles.map((role) => ({
              label: role.name,
              value: role.id,
              disabled: role.isSystem,
            }))}
            onChange={(e) => props.setSelectedRoleIds(e.value)}
            placeholder="Select roles for this user"
            filter
            className="kemetra-dropdown w-full"
            display="chip"
            showSelectAll={false}
          />
          <small className="text-gray-500 mt-2 block">
            You can select multiple roles. System roles cannot be modified.
          </small>
        </div>

        <div className="mt-4">
          <label className="kemetra-form-label">Current Roles:</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {props.currentRoles && props.currentRoles.length > 0 ? (
              props.currentRoles.map((role) => (
                <div
                  key={role.id}
                  className={`px-3 py-1 rounded-full text-sm ${
                    role.isSystem
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {role.name}
                  {role.isSystem && (
                    <span className="ml-1 text-xs">(System)</span>
                  )}
                </div>
              ))
            ) : (
              <span className="text-gray-500 text-sm">No roles assigned</span>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default EditUserRolesDialog;
