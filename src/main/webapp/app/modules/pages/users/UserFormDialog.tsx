import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { User as UserIcon, X, Check } from "lucide-react";

const statusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Suspended", value: "SUSPENDED" },
  { label: "Pending Verification", value: "PENDING_VERIFICATION" },
  { label: "Deactivated", value: "DEACTIVATED" },
];
const UserFormDialog = (props) => {
  return (
    <Dialog
      visible={props.visible}
      className="p-fluid kemetra-dialog-width-md"
      header={
        <div className="flex items-center gap-3">
          <div className="kemetra-dialog-header-icon-box">
            <UserIcon size={20} className="kemetra-dialog-header-icon-color" />
          </div>
          <div>
            <h3 className="kemetra-dialog-title-text">
              {props.selectedUser ? "Edit User" : "Add New User"}
            </h3>
            <p className="kemetra-dialog-subtitle-text">
              {props.selectedUser
                ? "Update user information"
                : "Create a new user account"}
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
          <label htmlFor="email" className="kemetra-field-label">
            Email <span className="kemetra-field-required">*</span>
          </label>
          <InputText
            id="email"
            value={props.formData.email || ""}
            onChange={(e) =>
              props.onFormDataChange({
                ...props.formData,
                email: e.target.value,
              })
            }
            placeholder="user@kemetra.eg"
            className="kemetra-field-input"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="kemetra-field-label">
              First Name <span className="kemetra-field-required">*</span>
            </label>
            <InputText
              id="firstName"
              value={props.formData.firstName || ""}
              onChange={(e) =>
                props.onFormDataChange({
                  ...props.formData,
                  firstName: e.target.value,
                })
              }
              placeholder="Enter first name"
              className="kemetra-field-input"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="kemetra-field-label">
              Last Name <span className="kemetra-field-required">*</span>
            </label>
            <InputText
              id="lastName"
              value={props.formData.lastName || ""}
              onChange={(e) =>
                props.onFormDataChange({
                  ...props.formData,
                  lastName: e.target.value,
                })
              }
              placeholder="Enter last name"
              className="kemetra-field-input"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="kemetra-field-label">
            Password{" "}
            {!props.selectedUser && (
              <span className="kemetra-field-required">*</span>
            )}
            {props.selectedUser && (
              <span className="text-xs text-gray-500 ml-2">
                (leave blank to keep current)
              </span>
            )}
          </label>
          <InputText
            id="password"
            type="password"
            value={props.formData.password || ""}
            onChange={(e) =>
              props.onFormDataChange({
                ...props.formData,
                password: e.target.value,
              })
            }
            placeholder={
              props.selectedUser
                ? "Enter new password to change"
                : "Minimum 8 characters"
            }
            className="kemetra-field-input"
          />
        </div>

        <div>
          <label htmlFor="status" className="kemetra-field-label">
            Status <span className="kemetra-field-required">*</span>
          </label>
          <Dropdown
            id="status"
            value={props.formData.status}
            options={statusOptions}
            onChange={(e) =>
              props.onFormDataChange({ ...props.formData, status: e.value })
            }
            placeholder="Select status"
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
          label="Save User"
          icon={<Check size={18} />}
          onClick={props.onSave}
          className="kemetra-btn-save"
        />
      </div>
    </Dialog>
  );
};

export default UserFormDialog;
