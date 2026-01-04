import "./books.scss";

import React, { useEffect, useState } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { useAppDispatch, useAppSelector } from "app/config/store";
import {
  PenLine,
  Trash2,
  Plus,
  AlertCircle,
  PackageOpen,
  X,
} from "lucide-react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import PageHeader from "app/shared/components/page-header/page-header";
import BookFormDialog from "./BookFormDialog";
import BooksCsvImportDialog from "./BooksCsvImportDialog";
import {
  getBooksListData,
  createBook,
  updateBook,
  deleteBook,
} from "./books.reducer";
import { toast } from "react-toastify";

export const BooksManagement = () => {
  const dispatch = useAppDispatch();

  const [books, setBooks] = useState([]);
  const [visible, setVisible] = useState(false);
  const [csvImportVisible, setCsvImportVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData]: any = useState({});
  const [searchTitleEn, setSearchTitleEn] = useState("");
  const [searchTitleAr, setSearchTitleAr] = useState("");
  const [searchAuthor, setSearchAuthor] = useState("");

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

  const handleCsvImportComplete = async () => {
    await getBooksDataFN();
    setCsvImportVisible(false);
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

  // Filter books by English title, Arabic title, and author
  const filteredBooks = books.filter((book: any) => {
    const titleEn = (book.titleEn || book.title_en || "").toLowerCase();
    const titleAr = book.titleAr || book.title_ar || "";
    const authorEn = (book.authorEn || book.author_en || "").toLowerCase();
    const authorAr = book.authorAr || book.author_ar || "";

    const searchEn = searchTitleEn.toLowerCase();
    const searchAr = searchTitleAr;
    const searchAuth = searchAuthor.toLowerCase();

    const matchesTitleEn = searchTitleEn === "" || titleEn.includes(searchEn);
    const matchesTitleAr = searchTitleAr === "" || titleAr.includes(searchAr);
    const matchesAuthor =
      searchAuthor === "" ||
      authorEn.includes(searchAuth) ||
      authorAr.includes(searchAuthor);

    return matchesTitleEn && matchesTitleAr && matchesAuthor;
  });

  const handleClearFilters = () => {
    setSearchTitleEn("");
    setSearchTitleAr("");
    setSearchAuthor("");
  };

  const hasActiveFilters =
    searchTitleEn !== "" || searchTitleAr !== "" || searchAuthor !== "";

  return (
    <div>
      <ConfirmDialog />
      <PageHeader
        title="Books Management"
        description="Manage related books and publications"
        actionLabel="Add Book"
        onAction={openNew}
        csvImport={() => setCsvImportVisible(true)}
      />

      {/* Search and Filter Section */}
      <div className="mb-6 kemetra-search-filter-section">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* English Title Search */}
          <div>
            <label
              htmlFor="searchTitleEn"
              className="block text-sm font-semibold mb-2 kemetra-monument-search-label"
            >
              Search by English Title
            </label>
            <InputText
              id="searchTitleEn"
              value={searchTitleEn}
              onChange={(e) => setSearchTitleEn(e.target.value)}
              placeholder="Enter English title..."
              className="w-full"
            />
          </div>

          {/* Arabic Title Search */}
          <div>
            <label
              htmlFor="searchTitleAr"
              className="block text-sm font-semibold mb-2 kemetra-monument-search-label"
            >
              Search by Arabic Title
            </label>
            <InputText
              id="searchTitleAr"
              value={searchTitleAr}
              onChange={(e) => setSearchTitleAr(e.target.value)}
              placeholder="أدخل العنوان بالعربية..."
              className="w-full"
            />
          </div>

          {/* Author Search */}
          <div>
            <label
              htmlFor="searchAuthor"
              className="block text-sm font-semibold mb-2 kemetra-monument-search-label"
            >
              Search by Author
            </label>
            <InputText
              id="searchAuthor"
              value={searchAuthor}
              onChange={(e) => setSearchAuthor(e.target.value)}
              placeholder="Enter author name..."
              className="w-full"
            />
          </div>
        </div>

        {/* Filter Status and Clear Button */}
        {hasActiveFilters && (
          <div className="mt-4 flex items-center justify-between kemetra-filter-status">
            <div className="flex items-center gap-2">
              <span className="text-sm kemetra-monument-search-results">
                Found {filteredBooks.length} book
                {filteredBooks.length !== 1 ? "s" : ""}
              </span>
              <Tag
                value={`${filteredBooks.length} ${filteredBooks.length === 1 ? "result" : "results"}`}
                className="kemetra-gallery-count-tag"
              />
            </div>
            <Button
              label="Clear Filters"
              icon={<X size={16} />}
              outlined
              size="small"
              onClick={handleClearFilters}
              className="kemetra-btn-clear-filter"
            />
          </div>
        )}
      </div>

      <div className="kemetra-page-table-container">
        <DataTable
          value={filteredBooks}
          loading={loading}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage={
            <div className="kemetra-empty-state-container">
              <PackageOpen size={48} className="kemetra-empty-state-icon" />
              <p className="kemetra-empty-state-title">
                {hasActiveFilters
                  ? "No books found matching your search"
                  : "No books found"}
              </p>
              <p className="kemetra-empty-state-desc">
                {hasActiveFilters
                  ? "Try adjusting your search criteria or clear the filters"
                  : "Get started by adding your first book"}
              </p>
              {!hasActiveFilters && (
                <Button
                  label="Add Book"
                  icon={<Plus size={18} />}
                  onClick={openNew}
                  className="kemetra-empty-state-btn"
                />
              )}
              {hasActiveFilters && (
                <Button
                  label="Clear Filters"
                  icon={<X size={18} />}
                  onClick={handleClearFilters}
                  outlined
                  className="kemetra-empty-state-btn"
                />
              )}
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

      <BooksCsvImportDialog
        visible={csvImportVisible}
        onHide={() => setCsvImportVisible(false)}
        onImportComplete={handleCsvImportComplete}
      />
    </div>
  );
};

export default BooksManagement;
