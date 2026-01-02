import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Link2, X, Check } from "lucide-react";

const MonumentSourceFormDialog = (props) => {
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
              {props.selectedItem ? "Edit Link" : "Link Source to Monument"}
            </h3>
            <p className="kemetra-dialog-subtitle-text">
              {props.selectedItem
                ? "Update monument-source connection"
                : "Link an academic source to a monument"}
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
          <label htmlFor="monumentId" className="kemetra-field-label">
            Monument <span className="kemetra-field-required">*</span>
          </label>
          <Dropdown
            id="monumentId"
            value={props.formData.monumentId}
            options={props.monuments}
            onChange={(e) =>
              props.onFormDataChange({
                ...props.formData,
                monumentId: e.value,
              })
            }
            placeholder="Select a monument"
            filter
            className="kemetra-field-input"
          />
        </div>

        <div>
          <label htmlFor="sourceId" className="kemetra-field-label">
            Source <span className="kemetra-field-required">*</span>
          </label>
          <Dropdown
            id="sourceId"
            value={props.formData.sourceId}
            options={props.sources}
            onChange={(e) =>
              props.onFormDataChange({ ...props.formData, sourceId: e.value })
            }
            placeholder="Select a source"
            filter
            className="kemetra-field-input"
          />
        </div>

        <div>
          <label htmlFor="pageNumbers" className="kemetra-field-label">
            Page Numbers
          </label>
          <InputText
            id="pageNumbers"
            value={props.formData.pageNumbers || ""}
            onChange={(e) =>
              props.onFormDataChange({
                ...props.formData,
                pageNumbers: e.target.value,
              })
            }
            placeholder="e.g., 45-67, 120"
            className="kemetra-field-input"
          />
        </div>

        <div>
          <label htmlFor="displayOrder" className="kemetra-field-label">
            Display Order
          </label>
          <InputText
            id="displayOrder"
            value={props.formData.displayOrder || ""}
            onChange={(e) =>
              props.onFormDataChange({
                ...props.formData,
                displayOrder: parseInt(e.target.value, 10) || null,
              })
            }
            placeholder="e.g., 1, 2, 3..."
            className="kemetra-field-input"
            keyfilter="int"
          />
        </div>

        <div>
          <label htmlFor="notes" className="kemetra-field-label">
            Notes
          </label>
          <InputTextarea
            id="notes"
            value={props.formData.notes || ""}
            onChange={(e) =>
              props.onFormDataChange({
                ...props.formData,
                notes: e.target.value,
              })
            }
            placeholder="Enter any additional notes"
            rows={3}
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

export default MonumentSourceFormDialog;
