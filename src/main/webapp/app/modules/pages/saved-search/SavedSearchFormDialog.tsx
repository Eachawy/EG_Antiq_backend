import React from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Search, X, Check } from "lucide-react";

const SavedSearchFormDialog = (props) => {
  return (
    <Dialog
      visible={props.visible}
      onHide={props.onHide}
      header={
        <div className="kemetra-dialog-header">
          <Search className="kemetra-dialog-header-icon" />
          <span className="kemetra-dialog-header-title">Add Saved Search</span>
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
      className="kemetra-dialog kemetra-dialog-width-60"
    >
      <div className="kemetra-form">
        <div className="kemetra-form-field">
          <label className="kemetra-form-label">
            Portal User <span className="kemetra-form-required">*</span>
          </label>
          <Dropdown
            value={props.formData.portalUserId}
            options={props.portalUsers}
            onChange={(e) =>
              props.setFormData({ ...props.formData, portalUserId: e.value })
            }
            optionLabel={"firstName"}
            optionValue="id"
            placeholder="Select a portal user"
            filter
            className="kemetra-dropdown"
          />
        </div>
        <div className="kemetra-form-field">
          <label className="kemetra-form-label">Keyword</label>
          <InputText
            value={props.formData.keyword || ""}
            onChange={(e) =>
              props.setFormData({ ...props.formData, keyword: e.target.value })
            }
            placeholder="Enter search keyword"
            className="kemetra-input"
          />
        </div>
        <div className="kemetra-form-field">
          <label className="kemetra-form-label">Era</label>
          <Dropdown
            value={props.formData?.eraId}
            options={props.eras}
            onChange={(e) =>
              props.setFormData({ ...props.formData, eraId: e.value })
            }
            optionLabel={`nameEn`}
            optionValue="id"
            placeholder="Select an era"
            filter
            className="kemetra-dropdown"
          />
        </div>
        <div className="kemetra-form-field">
          <label className="kemetra-form-label">
            Result Count <span className="kemetra-form-required">*</span>
          </label>
          <InputNumber
            value={props.formData.resultCount || 0}
            onValueChange={(e) =>
              props.setFormData({
                ...props.formData,
                resultCount: e.value || 0,
              })
            }
            placeholder="Enter result count"
            min={0}
            className="kemetra-input-number"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default SavedSearchFormDialog;
