import React from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Heart, X, Check } from "lucide-react";

const FavouriteFormDialog = (props) => {
  return (
    <Dialog
      visible={props.visible}
      onHide={props.nHide}
      header={
        <div className="kemetra-dialog-header">
          <Heart className="kemetra-dialog-header-icon" />
          <span className="kemetra-dialog-header-title">Add Favourite</span>
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
            label="Save"
            icon={<Check size={18} />}
            onClick={props.onSave}
            className="kemetra-btn-primary"
          />
        </div>
      }
      className="kemetra-dialog kemetra-dialog-width-50"
    >
      <div className="kemetra-form">
        <div className="kemetra-form-field">
          <label className="kemetra-form-label">
            Portal User <span className="kemetra-form-required">*</span>
          </label>
          <Dropdown
            value={props.formData.portalUserId}
            options={props.portalUsers.map((user) => ({
              label: `${user.firstName} ${user.lastName} (${user.email})`,
              value: user.id,
            }))}
            onChange={(e) =>
              props.setFormData({ ...props.formData, portalUserId: e.value })
            }
            placeholder="Select a portal user"
            filter
            className="kemetra-dropdown"
          />
        </div>
        <div className="kemetra-form-field">
          <label className="kemetra-form-label">
            Monument <span className="kemetra-form-required">*</span>
          </label>
          <Dropdown
            value={props.formData.monumentId}
            options={props.monuments.map((monument) => ({
              label: `${monument.monumentNameEn} - ${monument.monumentNameAr}`,
              value: monument.id,
            }))}
            onChange={(e) =>
              props.setFormData({ ...props.formData, monumentId: e.value })
            }
            placeholder="Select a monument"
            filter
            className="kemetra-dropdown"
          />
        </div>
        <div className="kemetra-form-field">
          <label className="kemetra-form-label">Notes</label>
          <InputTextarea
            value={props.formData.notes || ""}
            onChange={(e) =>
              props.setFormData({ ...props.formData, notes: e.target.value })
            }
            placeholder="Add notes about this favourite..."
            rows={4}
            className="kemetra-textarea"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default FavouriteFormDialog;
