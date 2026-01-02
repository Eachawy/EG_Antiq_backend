import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Link2, X, Check } from "lucide-react";

const MonumentBookFormDialog = (props) => {
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
              {props.selectedItem ? "Edit Link" : "Link Book to Monument"}
            </h3>
            <p className="kemetra-dialog-subtitle-text">
              {props.selectedItem
                ? "Update monument-book connection"
                : "Link a related book to a monument"}
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
          <label htmlFor="bookId" className="kemetra-field-label">
            Book <span className="kemetra-field-required">*</span>
          </label>
          <Dropdown
            id="bookId"
            value={props.formData.bookId}
            options={props.books}
            onChange={(e) =>
              props.onFormDataChange({ ...props.formData, bookId: e.value })
            }
            placeholder="Select a book"
            filter
            className="kemetra-field-input"
          />
        </div>

        <div>
          <label htmlFor="relevance" className="kemetra-field-label">
            Relevance
          </label>
          <InputText
            id="relevance"
            value={props.formData.relevance || ""}
            onChange={(e) =>
              props.onFormDataChange({
                ...props.formData,
                relevance: e.target.value,
              })
            }
            placeholder="e.g., Main reference, Historical context..."
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

export default MonumentBookFormDialog;
