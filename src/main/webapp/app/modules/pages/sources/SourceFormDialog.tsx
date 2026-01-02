import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { BookOpen, X, Save } from "lucide-react";

const SOURCE_TYPES = [
  { label: "Journal", value: "JOURNAL" },
  { label: "Book", value: "BOOK" },
  { label: "Website", value: "WEBSITE" },
  { label: "Report", value: "REPORT" },
  { label: "Thesis", value: "THESIS" },
  { label: "Conference", value: "CONFERENCE" },
  { label: "Encyclopedia", value: "ENCYCLOPEDIA" },
];

const SourceFormDialog = (props) => {
  return (
    <Dialog
      visible={props.visible}
      style={{ width: "90%", maxWidth: "800px" }}
      header={
        <div className="flex items-center gap-3">
          <div className="kemetra-dialog-header-icon-box">
            <BookOpen size={20} className="kemetra-dialog-header-icon-color" />
          </div>
          <div>
            <h3 className="kemetra-dialog-title-text">
              {props.selectedSource ? "Edit Source" : "Add New Source"}
            </h3>
            <p className="kemetra-dialog-subtitle-text">
              {props.selectedSource
                ? "Update source information"
                : "Create a new academic source"}
            </p>
          </div>
        </div>
      }
      modal
      className="p-fluid"
      onHide={props.onHide}
      draggable={false}
    >
      <div className="space-y-5 pt-4">
        {/* Title Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="titleEn" className="kemetra-field-label">
              English Title <span className="kemetra-field-required">*</span>
            </label>
            <InputText
              id="titleEn"
              value={props.formData?.titleEn || ""}
              onChange={(e) =>
                props.onFormDataChange({
                  ...props.formData,
                  titleEn: e.target.value,
                })
              }
              placeholder="Enter title in English"
              className="w-full kemetra-field-input"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="titleAr" className="kemetra-field-label">
              Arabic Title <span className="kemetra-field-required">*</span>
            </label>
            <InputText
              id="titleAr"
              value={props.formData?.titleAr || ""}
              onChange={(e) =>
                props.onFormDataChange({
                  ...props.formData,
                  titleAr: e.target.value,
                })
              }
              placeholder="أدخل العنوان بالعربية"
              className="w-full kemetra-field-input"
            />
          </div>
        </div>

        {/* Author Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="authorEn" className="kemetra-field-label">
              English Author
            </label>
            <InputText
              id="authorEn"
              value={props.formData?.authorEn || ""}
              onChange={(e) =>
                props.onFormDataChange({
                  ...props.formData,
                  authorEn: e.target.value,
                })
              }
              placeholder="Enter author name in English"
              className="w-full kemetra-field-input"
            />
          </div>

          <div>
            <label htmlFor="authorAr" className="kemetra-field-label">
              Arabic Author
            </label>
            <InputText
              id="authorAr"
              value={props.formData?.authorAr || ""}
              onChange={(e) =>
                props.onFormDataChange({
                  ...props.formData,
                  authorAr: e.target.value,
                })
              }
              placeholder="أدخل اسم المؤلف بالعربية"
              className="w-full kemetra-field-input"
            />
          </div>
        </div>

        {/* Source Type and Publication Year */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sourceType" className="kemetra-field-label">
              Source Type
            </label>
            <Dropdown
              id="sourceType"
              value={props.formData?.sourceType || null}
              onChange={(e) =>
                props.onFormDataChange({
                  ...props.formData,
                  sourceType: e.value,
                })
              }
              options={SOURCE_TYPES}
              placeholder="Select source type"
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="publicationYear" className="kemetra-field-label">
              Publication Year
            </label>
            <InputText
              id="publicationYear"
              value={props.formData?.publicationYear || ""}
              onChange={(e) =>
                props.onFormDataChange({
                  ...props.formData,
                  publicationYear: parseInt(e.target.value, 10) || null,
                })
              }
              placeholder="e.g., 2020"
              className="w-full kemetra-field-input"
              keyfilter="int"
            />
          </div>
        </div>

        {/* Publisher and URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="publisher" className="kemetra-field-label">
              Publisher
            </label>
            <InputText
              id="publisher"
              value={props.formData?.publisher || ""}
              onChange={(e) =>
                props.onFormDataChange({
                  ...props.formData,
                  publisher: e.target.value,
                })
              }
              placeholder="Enter publisher name"
              className="w-full kemetra-field-input"
            />
          </div>

          <div>
            <label htmlFor="url" className="kemetra-field-label">
              URL
            </label>
            <InputText
              id="url"
              value={props.formData?.url || ""}
              onChange={(e) =>
                props.onFormDataChange({
                  ...props.formData,
                  url: e.target.value,
                })
              }
              placeholder="https://example.com"
              className="w-full kemetra-field-input"
            />
          </div>
        </div>

        {/* Pages, Volume, Issue */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="pages" className="kemetra-field-label">
              Pages
            </label>
            <InputText
              id="pages"
              value={props.formData?.pages || ""}
              onChange={(e) =>
                props.onFormDataChange({
                  ...props.formData,
                  pages: e.target.value,
                })
              }
              placeholder="e.g., 45-67"
              className="w-full kemetra-field-input"
            />
          </div>

          <div>
            <label htmlFor="volume" className="kemetra-field-label">
              Volume
            </label>
            <InputText
              id="volume"
              value={props.formData?.volume || ""}
              onChange={(e) =>
                props.onFormDataChange({
                  ...props.formData,
                  volume: e.target.value,
                })
              }
              placeholder="e.g., Vol. 12"
              className="w-full kemetra-field-input"
            />
          </div>

          <div>
            <label htmlFor="issue" className="kemetra-field-label">
              Issue
            </label>
            <InputText
              id="issue"
              value={props.formData?.issue || ""}
              onChange={(e) =>
                props.onFormDataChange({
                  ...props.formData,
                  issue: e.target.value,
                })
              }
              placeholder="e.g., Issue 3"
              className="w-full kemetra-field-input"
            />
          </div>
        </div>

        {/* ISBN and DOI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="isbn" className="kemetra-field-label">
              ISBN
            </label>
            <InputText
              id="isbn"
              value={props.formData?.isbn || ""}
              onChange={(e) =>
                props.onFormDataChange({
                  ...props.formData,
                  isbn: e.target.value,
                })
              }
              placeholder="e.g., 978-3-16-148410-0"
              className="w-full kemetra-field-input"
            />
          </div>

          <div>
            <label htmlFor="doi" className="kemetra-field-label">
              DOI
            </label>
            <InputText
              id="doi"
              value={props.formData?.doi || ""}
              onChange={(e) =>
                props.onFormDataChange({
                  ...props.formData,
                  doi: e.target.value,
                })
              }
              placeholder="e.g., 10.1000/xyz123"
              className="w-full kemetra-field-input"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="kemetra-field-label">
            Notes
          </label>
          <InputTextarea
            id="notes"
            value={props.formData?.notes || ""}
            onChange={(e) =>
              props.onFormDataChange({
                ...props.formData,
                notes: e.target.value,
              })
            }
            placeholder="Enter any additional notes"
            rows={3}
            className="w-full kemetra-field-input"
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
          label="Save Source"
          icon={<Save size={18} />}
          onClick={props.onSave}
          className="kemetra-btn-save"
        />
      </div>
    </Dialog>
  );
};

export default SourceFormDialog;
