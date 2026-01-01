import React, { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Message } from "primereact/message";
import {
  Upload,
  X,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
} from "lucide-react";
import { Storage } from "react-jhipster";
import { AUTH_TOKEN_KEY } from "app/config/constants";
import { toast } from "react-toastify";

interface CsvImportDialogProps {
  visible: boolean;
  onHide: () => void;
  onImportComplete: () => void;
}

const CsvImportDialog: React.FC<CsvImportDialogProps> = ({
  visible,
  onHide,
  onImportComplete,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const fileUploadRef = useRef<FileUpload>(null);

  const handleFileSelect = (e: FileUploadSelectEvent) => {
    const file = e.files[0];
    if (file) {
      // Validate file type
      if (!file.name.endsWith(".csv")) {
        toast.error("Please select a CSV file");
        return;
      }
      setSelectedFile(file);
      setImportResult(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("Please select a CSV file");
      return;
    }

    setUploading(true);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Get token from storage
      const token =
        Storage.local.get(AUTH_TOKEN_KEY) ||
        Storage.session.get(AUTH_TOKEN_KEY);

      if (!token) {
        toast.error("Authentication required. Please login again.");
        setUploading(false);
        return;
      }

      const response = await fetch(
        "http://localhost:3000/api/v1/monuments/import-csv",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error?.message || result?.message || "Import failed",
        );
      }

      setImportResult(result.data);

      if (result.data.errors === 0) {
        toast.success(
          `Successfully imported ${result.data.created} monument(s)!`,
        );
      } else {
        toast.warning(
          `Imported ${result.data.created} monument(s) with ${result.data.errors} error(s)`,
        );
      }

      // Refresh the monuments list
      onImportComplete();
    } catch (error: any) {
      const errorMessage =
        error?.message || "An error occurred while importing the CSV file.";
      toast.error(errorMessage);
      console.error("Import error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setImportResult(null);
    setUploading(false);
    if (fileUploadRef.current) {
      fileUploadRef.current.clear();
    }
    onHide();
  };

  const downloadTemplate = () => {
    // Create a sample CSV template
    const csvContent = `monumentNameAr,monumentNameEn,monumentBiographyAr,monumentBiographyEn,lat,lng,image,mDate,monumentsTypeId,eraId,dynastyId,zoom,center,descriptionEn,descriptionAr
معبد الكرنك,Karnak Temple,معبد الكرنك هو مجمع معابد ضخم,The Karnak Temple Complex comprises a vast mix of decayed temples,25.718833,32.657444,uploads/monuments/karnak.jpg,23/09/2025,1,1,1,11,25.718833;32.657444,Temple description in English,وصف المعبد بالعربية`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "monuments_template.csv");
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Template downloaded successfully!");
  };

  return (
    <Dialog
      visible={visible}
      className="p-fluid"
      style={{ width: "600px" }}
      header={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center kemetra-gallery-dialog-icon-bg">
            <FileText size={20} className="kemetra-gallery-dialog-icon-color" />
          </div>
          <div>
            <h3 className="text-xl font-semibold kemetra-gallery-dialog-title">
              Import Monuments from CSV
            </h3>
            <p className="text-sm kemetra-gallery-dialog-subtitle">
              Bulk import monuments data from a CSV file
            </p>
          </div>
        </div>
      }
      modal
      onHide={handleClose}
      draggable={false}
    >
      <div className="space-y-5 pt-4">
        {/* Download Template Button */}
        <div className="mb-4">
          <Button
            label="Download CSV Template"
            icon={<Download size={16} />}
            onClick={downloadTemplate}
            outlined
            className="w-full"
          />
          <p className="text-sm text-gray-600 mt-2">
            Download a sample CSV file with the required format and columns.
          </p>
        </div>

        {/* CSV Format Info */}
        <Message
          severity="info"
          text="Required columns: monumentNameAr, monumentNameEn, monumentBiographyAr, monumentBiographyEn, lat, lng, image, mDate, monumentsTypeId, eraId, dynastyId, zoom, center. Optional: descriptionEn, descriptionAr"
          className="mb-4"
        />

        {/* File Upload */}
        <div>
          <label className="block text-sm font-semibold mb-2 kemetra-gallery-label">
            Select CSV File{" "}
            <span className="kemetra-gallery-label-required">*</span>
          </label>
          <div className="p-4 rounded-lg border-2 border-dashed kemetra-gallery-upload-border">
            <FileUpload
              ref={fileUploadRef}
              name="csv"
              accept=".csv"
              maxFileSize={5000000}
              onSelect={handleFileSelect}
              auto={false}
              chooseLabel="Choose CSV File"
              chooseOptions={{
                icon: <Upload size={16} />,
                iconOnly: false,
                className: "p-button-outlined kemetra-gallery-choose-btn",
              }}
              emptyTemplate={
                <div className="text-center py-4">
                  <FileText size={48} className="mx-auto mb-2 text-gray-400" />
                  <p className="font-medium mb-1">Select a CSV file</p>
                  <p className="text-sm text-gray-500">
                    Max file size: 5MB (CSV format)
                  </p>
                </div>
              }
            />
          </div>
          {selectedFile && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-blue-600" />
                <div>
                  <p className="font-semibold text-sm">{selectedFile.name}</p>
                  <p className="text-xs text-gray-600">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <Button
                icon={<X size={16} />}
                rounded
                text
                severity="danger"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileUploadRef.current) {
                    fileUploadRef.current.clear();
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* Progress */}
        {uploading && (
          <div>
            <label className="block text-sm font-semibold mb-2">
              Importing...
            </label>
            <ProgressBar mode="indeterminate" style={{ height: "6px" }} />
          </div>
        )}

        {/* Import Result */}
        {importResult && (
          <div className="space-y-3">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={20} className="text-green-600" />
                <span className="font-semibold text-green-800">
                  Import Summary
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Total Rows</p>
                  <p className="font-bold text-lg">{importResult.total}</p>
                </div>
                <div>
                  <p className="text-gray-600">Successfully Imported</p>
                  <p className="font-bold text-lg text-green-600">
                    {importResult.created}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Errors</p>
                  <p className="font-bold text-lg text-red-600">
                    {importResult.errors}
                  </p>
                </div>
              </div>
            </div>

            {/* Error Details */}
            {importResult.errorDetails &&
              importResult.errorDetails.length > 0 && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200 max-h-60 overflow-y-auto">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={20} className="text-red-600" />
                    <span className="font-semibold text-red-800">
                      Error Details
                    </span>
                  </div>
                  <ul className="text-sm space-y-1 text-red-700">
                    {importResult.errorDetails.map(
                      (error: string, index: number) => (
                        <li key={index} className="list-disc ml-4">
                          {error}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t kemetra-gallery-dialog-footer">
        <Button
          label="Cancel"
          icon={<X size={18} />}
          outlined
          onClick={handleClose}
          className="kemetra-btn-cancel"
          disabled={uploading}
        />
        <Button
          label={uploading ? "Importing..." : "Import CSV"}
          icon={<Upload size={18} />}
          onClick={handleImport}
          className="kemetra-btn-save"
          disabled={!selectedFile || uploading}
          loading={uploading}
        />
      </div>
    </Dialog>
  );
};

export default CsvImportDialog;
