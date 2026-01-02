import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { BookText, X, Save } from "lucide-react";

const BookFormDialog = (props) => {
  return (
    <Dialog
      visible={props.visible}
      style={{ width: "90%", maxWidth: "800px" }}
      header={
        <div className="flex items-center gap-3">
          <div className="kemetra-dialog-header-icon-box">
            <BookText size={20} className="kemetra-dialog-header-icon-color" />
          </div>
          <div>
            <h3 className="kemetra-dialog-title-text">
              {props.selectedBook ? "Edit Book" : "Add New Book"}
            </h3>
            <p className="kemetra-dialog-subtitle-text">
              {props.selectedBook
                ? "Update book information"
                : "Create a new book entry"}
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
              English Author <span className="kemetra-field-required">*</span>
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
              Arabic Author <span className="kemetra-field-required">*</span>
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

        {/* Cover Image and Publication Year */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="coverImage" className="kemetra-field-label">
              Cover Image URL
            </label>
            <InputText
              id="coverImage"
              value={props.formData?.coverImage || ""}
              onChange={(e) =>
                props.onFormDataChange({
                  ...props.formData,
                  coverImage: e.target.value,
                })
              }
              placeholder="Enter cover image URL"
              className="w-full kemetra-field-input"
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

        {/* Publisher, ISBN, and Pages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <label htmlFor="pages" className="kemetra-field-label">
              Pages
            </label>
            <InputText
              id="pages"
              value={props.formData?.pages || ""}
              onChange={(e) =>
                props.onFormDataChange({
                  ...props.formData,
                  pages: parseInt(e.target.value, 10) || null,
                })
              }
              placeholder="e.g., 256"
              className="w-full kemetra-field-input"
              keyfilter="int"
            />
          </div>
        </div>

        {/* Language and Edition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="language" className="kemetra-field-label">
              Language
            </label>
            <InputText
              id="language"
              value={props.formData?.language || ""}
              onChange={(e) =>
                props.onFormDataChange({
                  ...props.formData,
                  language: e.target.value,
                })
              }
              placeholder="e.g., en, ar"
              className="w-full kemetra-field-input"
            />
          </div>

          <div>
            <label htmlFor="edition" className="kemetra-field-label">
              Edition
            </label>
            <InputText
              id="edition"
              value={props.formData?.edition || ""}
              onChange={(e) =>
                props.onFormDataChange({
                  ...props.formData,
                  edition: e.target.value,
                })
              }
              placeholder="e.g., 1st Edition"
              className="w-full kemetra-field-input"
            />
          </div>
        </div>

        {/* Read URL and Purchase URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="readUrl" className="kemetra-field-label">
              Read URL
            </label>
            <InputText
              id="readUrl"
              value={props.formData?.readUrl || ""}
              onChange={(e) =>
                props.onFormDataChange({
                  ...props.formData,
                  readUrl: e.target.value,
                })
              }
              placeholder="https://archive.org/..."
              className="w-full kemetra-field-input"
            />
          </div>

          <div>
            <label htmlFor="purchaseUrl" className="kemetra-field-label">
              Purchase URL
            </label>
            <InputText
              id="purchaseUrl"
              value={props.formData?.purchaseUrl || ""}
              onChange={(e) =>
                props.onFormDataChange({
                  ...props.formData,
                  purchaseUrl: e.target.value,
                })
              }
              placeholder="https://amazon.com/..."
              className="w-full kemetra-field-input"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="kemetra-field-label">
            Description
          </label>
          <InputTextarea
            id="description"
            value={props.formData?.description || ""}
            onChange={(e) =>
              props.onFormDataChange({
                ...props.formData,
                description: e.target.value,
              })
            }
            placeholder="Enter book description"
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
          label="Save Book"
          icon={<Save size={18} />}
          onClick={props.onSave}
          className="kemetra-btn-save"
        />
      </div>
    </Dialog>
  );
};

export default BookFormDialog;
