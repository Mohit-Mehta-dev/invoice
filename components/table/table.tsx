import {
  addToast,
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import React, { useCallback, useEffect, useState } from "react";
import { columns, users } from "./data";
import { RenderCell } from "./render-cell";
import { AxiosError } from "axios";
import { getAuthFromLocalStorage } from "@/utils/localStorageUtils";
import { Client, User } from "@/helpers/types";
import { getClients } from "@/services/clientService";

export const TableWrapper = () => {

   
const [user, setUser] = useState<User | null>(null);
const [clientList, setClientList] = useState<Client[]>([]);


useEffect(() => {
  const storedUser = getAuthFromLocalStorage();
  setUser(storedUser ? (storedUser as User) : null); // Safely set user
}, []);

useEffect(() => {
  if (user?.id) {
    fetchDashboard(user.id);
  }
}, [user]); 

const fetchDashboard = useCallback(async (id: number) => {
  try {
    let response = await getClients(id);
    console.log("response", response);
    setClientList(response.data)
  } catch (err: unknown) {
    console.log("Data error:", err);

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
            description: "No Income / Expense found.",
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
}, [addToast]);

  return (
    <div className=" w-full flex flex-col gap-4">
      {clientList&&<Table aria-label="Example table with custom cells">
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
        <TableBody items={clientList||[]}>
          {(client) => (
            <TableRow>
              {(columnKey) => (
                <TableCell>
                  {RenderCell({ client: client, columnKey: columnKey })}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>}
    </div>
  );
};
