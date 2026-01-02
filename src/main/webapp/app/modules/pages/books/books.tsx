import "./books.scss";

import React, { useEffect, useState, useRef } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { useAppDispatch, useAppSelector } from "app/config/store";
import {
  PenLine,
  Trash2,
  Plus,
  AlertCircle,
  PackageOpen,
  Upload,
} from "lucide-react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { FileUpload } from "primereact/fileupload";
import PageHeader from "app/shared/components/page-header/page-header";
import BookFormDialog from "./BookFormDialog";
import {
  getBooksListData,
  createBook,
  updateBook,
  deleteBook,
  importBooksCSV,
} from "./books.reducer";
import { toast } from "react-toastify";

export const BooksManagement = () => {
  const dispatch = useAppDispatch();
  const fileUploadRef = useRef(null);

  const [books, setBooks] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData]: any = useState({});

  const $BooksList = useAppSelector((state) => state.Books.booksList);
  const loading = useAppSelector((state) => state.Books.loading);

  useEffect(() => {
    getBooksDataFN();
  }, []);

  useEffect(() => {
    if ($BooksList) {
      if ($BooksList.data && Array.isArray($BooksList.data)) {
        setBooks($BooksList.data);
      } else if (Array.isArray($BooksList)) {
        setBooks($BooksList);
      }
    }
  }, [$BooksList]);

  const getBooksDataFN = async () => {
    await dispatch(getBooksListData());
  };

  const openNew = () => {
    setFormData({});
    setSelectedBook(null);
    setVisible(true);
  };

  const openEdit = (book: any) => {
    setFormData(book);
    setSelectedBook(book);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setFormData({});
    setSelectedBook(null);
  };

  const saveBook = async () => {
    try {
      if (selectedBook) {
        // Update existing book
        const bookData = {
          titleAr: formData.titleAr,
          titleEn: formData.titleEn,
          authorAr: formData.authorAr,
          authorEn: formData.authorEn,
          coverImage: formData.coverImage,
          publicationYear: formData.publicationYear,
          publisher: formData.publisher,
          isbn: formData.isbn,
          pages: formData.pages,
          description: formData.description,
          readUrl: formData.readUrl,
          purchaseUrl: formData.purchaseUrl,
          language: formData.language,
          edition: formData.edition,
        };
        await dispatch(
          updateBook({ id: selectedBook.id, data: bookData }),
        ).unwrap();
        toast.success("Book updated successfully!");
      } else {
        // Create new book
        await dispatch(createBook(formData)).unwrap();
        toast.success("Book created successfully!");
      }
      hideDialog();
      await dispatch(getBooksListData());
    } catch (error) {
      toast.error("An error occurred while saving the book.");
      console.error("Save error:", error);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await dispatch(deleteBook(id)).unwrap();
      toast.success("Book deleted successfully!");
      await dispatch(getBooksListData());
    } catch (error) {
      toast.error("An error occurred while deleting the book.");
      console.error("Delete error:", error);
    }
  };

  const confirmDelete = (book: any) => {
    confirmDialog({
      message: `Are you sure you want to delete ${book.titleEn || book.title_en}?`,
      header: "Confirm Deletion",
      icon: <AlertCircle size={24} className="text-red-500" />,
      acceptClassName: "p-button-danger",
      accept: () => handleDelete(book.id),
    });
  };

  const handleCSVUpload = async (event: any) => {
    const file = event.files[0];
    try {
      await dispatch(importBooksCSV(file)).unwrap();
      toast.success("CSV imported successfully!");
      await dispatch(getBooksListData());
      fileUploadRef.current?.clear();
    } catch (error) {
      toast.error("An error occurred while importing CSV.");
      console.error("Import error:", error);
    }
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
        <Button
          icon={<PenLine size={16} />}
          rounded
          text
          tooltip="Edit"
          tooltipOptions={{ position: "top" }}
          onClick={() => openEdit(rowData)}
          className="kemetra-action-btn-edit"
        />
        <Button
          icon={<Trash2 size={16} />}
          rounded
          text
          tooltip="Delete"
          tooltipOptions={{ position: "top" }}
          onClick={() => confirmDelete(rowData)}
          className="kemetra-action-btn-delete"
        />
      </div>
    );
  };

  const coverImageBodyTemplate = (rowData: any) => {
    if (rowData.coverImage || rowData.cover_image) {
      return (
        <img
          src={rowData.coverImage || rowData.cover_image}
          alt="Cover"
          className="w-12 h-16 object-cover rounded"
        />
      );
    }
    return "-";
  };

  return (
    <div>
      <ConfirmDialog />
      <PageHeader
        title="Books Management"
        description="Manage related books and publications"
        actionLabel="Add Book"
        onAction={openNew}
      />

      <div className="mb-4">
        <FileUpload
          ref={fileUploadRef}
          mode="basic"
          name="file"
          accept=".csv"
          maxFileSize={10000000}
          customUpload
          uploadHandler={handleCSVUpload}
          auto
          chooseLabel="Import CSV"
          className="kemetra-btn-upload"
        />
      </div>

      <div className="kemetra-page-table-container">
        <DataTable
          value={books}
          loading={loading}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage={
            <div className="kemetra-empty-state-container">
              <PackageOpen size={48} className="kemetra-empty-state-icon" />
              <p className="kemetra-empty-state-title">No books found</p>
              <p className="kemetra-empty-state-desc">
                Get started by adding your first book
              </p>
              <Button
                label="Add Book"
                icon={<Plus size={18} />}
                onClick={openNew}
                className="kemetra-empty-state-btn"
              />
            </div>
          }
          rowHover
          stripedRows
          pt={{
            header: {
              className: "kemetra-table-header",
            },
            thead: {
              className: "kemetra-table-thead",
            },
            tbody: {
              className: "kemetra-table-tbody",
            },
            bodyRow: {
              className: "kemetra-table-row",
            },
          }}
        >
          <Column
            field="coverImage"
            body={coverImageBodyTemplate}
            header="Cover"
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell"
            style={{ width: "100px" }}
          />
          <Column
            field="titleEn"
            body={(rowData) => rowData.titleEn || rowData.title_en || "-"}
            header="English Title"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-primary"
          />
          <Column
            field="titleAr"
            body={(rowData) => rowData.titleAr || rowData.title_ar || "-"}
            header="Arabic Title"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-arabic"
          />
          <Column
            field="authorEn"
            body={(rowData) => rowData.authorEn || rowData.author_en || "-"}
            header="Author"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-secondary"
          />
          <Column
            field="publicationYear"
            body={(rowData) =>
              rowData.publicationYear || rowData.publication_year || "-"
            }
            header="Year"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-secondary"
          />
          <Column
            field="publisher"
            body={(rowData) => rowData.publisher || "-"}
            header="Publisher"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-secondary"
          />
          <Column
            body={actionBodyTemplate}
            header="Actions"
            style={{ width: "120px" }}
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell"
          />
        </DataTable>
      </div>

      <BookFormDialog
        visible={visible}
        selectedBook={selectedBook}
        formData={formData}
        onHide={hideDialog}
        onSave={saveBook}
        onFormDataChange={setFormData}
      />
    </div>
  );
};

export default BooksManagement;
