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
import { columns, clients } from "./clientData";
import { RenderClientCell } from "./render-client-cell";
import { AxiosError } from "axios";
import { deleteClients, getClients } from "@/services/clientService";
import { getAuthFromLocalStorage } from "@/utils/localStorageUtils";
import { Client, User } from "@/helpers/types";

export const ClientTableWrapper = ({searchQuery,setSearchQuery, setCount,count}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [user, setUser] = useState<User | null>(null);
  const [clientList, setClientList] = useState<Client[]>([]);
  const [error, setError] = useState();
  // const [searchQuery, setSearchQuery] = useState<string>("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page
  
  useEffect(() => {
    const storedUser = getAuthFromLocalStorage();
    setUser(storedUser ? (storedUser as User) : null); // Safely set user
  }, []);

  useEffect(() => {
    console.log('cont chnage in table', count)
    if (user?.id) {
      fetchClients(user.id);
    }
  }, [user, count, onOpenChange]);

  const fetchClients = useCallback(async (id: number) => {
    try {
      let response = await getClients(id);
      console.log("response", response);
      setClientList(response.reverse());
    } catch (err: unknown) {
      console.log("Login error:", err);

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
          case 404:
            addToast({
              title: "No data",
              description: "No Customers found.",
              color: "success",
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
    }
  }, [addToast, setError]);

  const deleteClient = useCallback(async (id: number) => {
    try {
      let response = await deleteClients(id);
      console.log("response", response);
      setCount(prev => prev + 1);
    } catch (err: unknown) {
      console.log("delete error:", err);

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
    }
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // Filter clients based on search query
  const filteredClients = clientList.filter(client => {
    return (
      client.company_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      client.first_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const currentItems = filteredClients.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Total pages
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when search query changes
  };

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
            <TableRow>
              {(columnKey) => (
                <TableCell>
                  {RenderClientCell({
                    client: item,
                    columnKey: columnKey,
                    setCount: setCount,
                    deleteClient: deleteClient,
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
