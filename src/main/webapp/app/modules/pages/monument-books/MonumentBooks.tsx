import "./monument-books.scss";

import React, { useEffect, useState } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { useAppDispatch, useAppSelector } from "app/config/store";
import { PenLine, Trash2, Plus, AlertCircle, PackageOpen } from "lucide-react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import PageHeader from "app/shared/components/page-header/page-header";
import MonumentBookFormDialog from "./MonumentBookFormDialog";
import {
  getMonumentBooksListData,
  createMonumentBook,
  updateMonumentBook,
  deleteMonumentBook,
} from "./monument-books.reducer";
import { getMonumentsListData } from "../monuments/monuments.reducer";
import { getBooksListData } from "../books/books.reducer";
import { toast } from "react-toastify";

export const MonumentBooksManagement = () => {
  const dispatch = useAppDispatch();

  const [monumentBooks, setMonumentBooks] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData]: any = useState({});
  const [monuments, setMonuments] = useState([]);
  const [books, setBooks] = useState([]);

  const $MonumentBooksList = useAppSelector(
    (state) => state.MonumentBooks.monumentBooksList,
  );
  const $MonumentsList = useAppSelector(
    (state) => state.Monuments.monumentsList,
  );
  const $BooksList = useAppSelector((state) => state.Books.booksList);
  const loading = useAppSelector((state) => state.MonumentBooks.loading);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if ($MonumentBooksList) {
      if ($MonumentBooksList.data && Array.isArray($MonumentBooksList.data)) {
        setMonumentBooks($MonumentBooksList.data);
      } else if (Array.isArray($MonumentBooksList)) {
        setMonumentBooks($MonumentBooksList);
      }
    }
  }, [$MonumentBooksList]);

  useEffect(() => {
    if ($MonumentsList) {
      const monumentsData = $MonumentsList.data || $MonumentsList;
      if (Array.isArray(monumentsData)) {
        const options = monumentsData.map((m) => ({
          label: m.monumentNameEn || m.monument_name_en || `Monument ${m.id}`,
          value: m.id,
        }));
        setMonuments(options);
      }
    }
  }, [$MonumentsList]);

  useEffect(() => {
    if ($BooksList) {
      const booksData = $BooksList.data || $BooksList;
      if (Array.isArray(booksData)) {
        const options = booksData.map((b) => ({
          label: b.titleEn || b.title_en || `Book ${b.id}`,
          value: b.id,
        }));
        setBooks(options);
      }
    }
  }, [$BooksList]);

  const getData = async () => {
    await dispatch(getMonumentBooksListData());
    await dispatch(getMonumentsListData());
    await dispatch(getBooksListData());
  };

  const openNew = () => {
    setFormData({});
    setSelectedItem(null);
    setVisible(true);
  };

  const openEdit = (item: any) => {
    setFormData(item);
    setSelectedItem(item);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setFormData({});
    setSelectedItem(null);
  };

  const saveMonumentBook = async () => {
    try {
      if (selectedItem) {
        const linkData = {
          monumentId: formData.monumentId,
          bookId: formData.bookId,
          relevance: formData.relevance,
          displayOrder: formData.displayOrder,
        };
        await dispatch(
          updateMonumentBook({ id: selectedItem.id, data: linkData }),
        ).unwrap();
        toast.success("Monument-Book link updated successfully!");
      } else {
        await dispatch(createMonumentBook(formData)).unwrap();
        toast.success("Monument-Book link created successfully!");
      }
      hideDialog();
      await dispatch(getMonumentBooksListData());
    } catch (error) {
      toast.error("An error occurred while saving the link.");
      console.error("Save error:", error);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await dispatch(deleteMonumentBook(id)).unwrap();
      toast.success("Monument-Book link deleted successfully!");
      await dispatch(getMonumentBooksListData());
    } catch (error) {
      toast.error("An error occurred while deleting the link.");
      console.error("Delete error:", error);
    }
  };

  const confirmDelete = (item: any) => {
    confirmDialog({
      message: "Are you sure you want to delete this link?",
      header: "Confirm Deletion",
      icon: <AlertCircle size={24} className="text-red-500" />,
      acceptClassName: "p-button-danger",
      accept: () => handleDelete(item.id),
    });
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

  const monumentBodyTemplate = (rowData: any) => {
    const monument = rowData.monument;
    if (monument) {
      return monument.monumentNameEn || monument.monument_name_en || "-";
    }
    return "-";
  };

  const bookBodyTemplate = (rowData: any) => {
    const book = rowData.book;
    if (book) {
      return book.titleEn || book.title_en || "-";
    }
    return "-";
  };

  return (
    <div>
      <ConfirmDialog />
      <PageHeader
        title="Monument-Books Management"
        description="Link monuments to related books and publications"
        actionLabel="Link Book to Monument"
        onAction={openNew}
      />

      <div className="kemetra-page-table-container">
        <DataTable
          value={monumentBooks}
          loading={loading}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage={
            <div className="kemetra-empty-state-container">
              <PackageOpen size={48} className="kemetra-empty-state-icon" />
              <p className="kemetra-empty-state-title">
                No monument-book links found
              </p>
              <p className="kemetra-empty-state-desc">
                Get started by linking a monument to a book
              </p>
              <Button
                label="Link Book to Monument"
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
            body={monumentBodyTemplate}
            header="Monument"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-primary"
          />
          <Column
            body={bookBodyTemplate}
            header="Book"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-primary"
          />
          <Column
            field="relevance"
            body={(rowData) => rowData.relevance || "-"}
            header="Relevance"
            sortable
            headerClassName="kemetra-table-column-header"
            bodyClassName="kemetra-table-cell-secondary"
          />
          <Column
            field="displayOrder"
            body={(rowData) =>
              rowData.displayOrder || rowData.display_order || "-"
            }
            header="Order"
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

      <MonumentBookFormDialog
        visible={visible}
        selectedItem={selectedItem}
        formData={formData}
        monuments={monuments}
        books={books}
        onHide={hideDialog}
        onSave={saveMonumentBook}
        onFormDataChange={setFormData}
      />
    </div>
  );
};

export default MonumentBooksManagement;
