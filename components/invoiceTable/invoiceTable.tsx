import {
  addToast,
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@heroui/react";
import React, { useCallback, useEffect, useState } from "react";
import { columns, invoices } from "./invoiceData";
import { RenderInvoiceCell } from "./render-invoice-cell";
import { AxiosError } from "axios";
import { Invoice, User } from "@/helpers/types";
import { getAuthFromLocalStorage } from "@/utils/localStorageUtils";
import { deleteInvoice, getInvoices } from "@/services/invoiceService";
import { getClients } from "@/services/clientService";

export const InvoiceTableWrapper = ({searchQuery, setSearchQuery,count, setCount}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [user, setUser] = useState<User | null>(null);
  const [ClientsList, setClientsList] = useState<Invoice[]>([]);
  const [invoiceList, setInvoiceList] = useState<Invoice[]>([]);
  const [error, setError] = useState();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page


  useEffect(() => {
    const storedUser = getAuthFromLocalStorage();
    setUser(storedUser ? (storedUser as User) : null); // Safely set user
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchClients(user.id);
      fetchInvoices(user.id);
    }
  }, [user, count, onOpenChange]);

  const fetchClients = useCallback(async (id: number) => {
    try {
      let response = await getClients(id);
      console.log("response", response);
      setClientsList(response);
    } catch (err: unknown) {
      console.log("Login error:", err);
      handleError(err);
    }
  }, [addToast, setError]);

  const fetchInvoices = useCallback(async (id: number) => {
    try {
      let response = await getInvoices(id);
      console.log("response", response);
      setInvoiceList(response.reverse());
    } catch (err: unknown) {
      console.log("Login error:", err);
      handleError(err);
    }
  }, [addToast, setError]);

  const removeInvoice = useCallback(async (id: number) => {
    try {
      let response = await deleteInvoice(id);
      console.log("response", response);
      setCount(prev => prev + 1);
    } catch (err: unknown) {
      console.log("delete error:", err);
      handleError(err);
    }
  }, []);

  const handleError = (err: unknown) => {
    if (err instanceof AxiosError) {
      const status = err.response?.status;
      switch (status) {
        case 400:
          addToast({
            title: "Bad Request",
            description: "Please check your input and try again.",
            color: "danger",
          });
          break;
        case 401:
          addToast({
            title: "Unauthorized",
            description: "Invalid credentials. Please try again.",
            color: "danger",
          });
          break;
        case 500:
          addToast({
            title: "Server Error",
            description: "An error occurred on the server. Please try again later.",
            color: "danger",
          });
          break;
        default:
          addToast({
            title: "Error",
            description: "An unexpected error occurred. Please try again.",
            color: "danger",
          });
          break;
      }
    } else {
      addToast({
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again.",
        color: "danger",
      });
    }
  };

  // Apply search filter to invoiceList
  const filteredInvoiceList = invoiceList.filter(invoice => {
    return (
      invoice?.customer?.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      invoice?.customer?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      invoice?.inv_number?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInvoiceList.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Total pages
  const totalPages = Math.ceil(filteredInvoiceList.length / itemsPerPage);

  return (
    <div className="w-full flex flex-col gap-4">

      <Table aria-label="Example table with custom cells">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              hideHeader={column.uid === "actions"}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={currentItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {RenderInvoiceCell({
                    invoice: item,
                    columnKey: columnKey,
                    setCount: setCount,
                    deleteInvoice: removeInvoice,
                  })}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination controls */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`px-4 py-2 rounded-lg ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};
