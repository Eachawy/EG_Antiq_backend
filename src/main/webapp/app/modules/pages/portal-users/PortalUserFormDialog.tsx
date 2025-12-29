import React from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { User as UserIcon, X, Check } from "lucide-react";

const PortalUserFormDialog = (props) => {
  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
    { label: "Suspended", value: "Suspended" },
  ];

  const verificationOptions = [
    { label: "Verified", value: true },
    { label: "Unverified", value: false },
  ];

  return (
    <Dialog
      visible={props.visible}
      className="p-fluid kemetra-dialog-width-50"
      header={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center kemetra-dialog-header-icon-box">
            <UserIcon size={20} className="kemetra-dialog-header-icon-color" />
          </div>
          <div>
            <h3 className="text-xl font-semibold kemetra-dialog-title-text">
              {props.selectedUser ? "Edit Portal User" : "Add New Portal User"}
            </h3>
          </div>
        </div>
      }
      modal
      onHide={props.onHide}
    >
      <div className="space-y-5 pt-4">
        <div>
          <label className="kemetra-field-label">
            {"Email"}
            <span className="kemetra-field-required">{"*"}</span>
          </label>
          <InputText
            value={props.formData.email || ""}
            onChange={(e) =>
              props.setFormData({ ...props.formData, email: e.target.value })
            }
            placeholder={"user@example.com"}
            className="kemetra-field-input"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="kemetra-field-label">
              {"First Name"}
              <span className="kemetra-field-required">{"*"}</span>
            </label>
            <InputText
              value={props.formData.firstName || ""}
              onChange={(e) =>
                props.setFormData({
                  ...props.formData,
                  firstName: e.target.value,
                })
              }
              className="kemetra-field-input"
            />
          </div>
          <div>
            <label className="kemetra-field-label">
              {"Last Name"}
              <span className="kemetra-field-required">{"*"}</span>
            </label>
            <InputText
              value={props.formData.lastName || ""}
              onChange={(e) =>
                props.setFormData({
                  ...props.formData,
                  lastName: e.target.value,
                })
              }
              className="kemetra-field-input"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="kemetra-field-label">{"Phone"}</label>
            <InputText
              value={props.formData.phone || ""}
              onChange={(e) =>
                props.setFormData({ ...props.formData, phone: e.target.value })
              }
              className="kemetra-field-input"
            />
          </div>
          <div>
            <label className="kemetra-field-label">{"Location"}</label>
            <InputText
              value={props.formData.location || ""}
              onChange={(e) =>
                props.setFormData({
                  ...props.formData,
                  location: e.target.value,
                })
              }
              className="kemetra-field-input"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="kemetra-field-label">
              {"Email Verification"}
            </label>
            <Dropdown
              value={props.formData.emailVerified}
              options={verificationOptions}
              onChange={(e) =>
                props.setFormData({ ...props.formData, emailVerified: e.value })
              }
              className="kemetra-field-input"
            />
          </div>
          <div>
            <label className="kemetra-field-label">{"Status"}</label>
            <Dropdown
              value={props.formData.status}
              options={statusOptions}
              onChange={(e) =>
                props.setFormData({ ...props.formData, status: e.value })
              }
              className="kemetra-field-input"
            />
          </div>
        </div>
      </div>
      <div className="kemetra-dialog-footer">
        <Button
          label={"Cancel"}
          icon={<X size={18} />}
          outlined
          onClick={props.onHide}
          className="kemetra-btn-cancel"
        />
        <Button
          label={"Save Portal User"}
          icon={<Check size={18} />}
          onClick={props.onSave}
          className="kemetra-btn-save"
        />
      </div>
    </Dialog>
  );
};

export default PortalUserFormDialog;
