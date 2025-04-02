import { Invoice, User } from "@/helpers/types";
import { getInvoiceById, getInvoices } from "@/services/invoiceService";
import { getAuthFromLocalStorage } from "@/utils/localStorageUtils";
import { addToast, Avatar, Card, CardBody } from "@heroui/react";
import { AxiosError } from "axios";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";

// const items = [
//   {
//     name: "Jose Perez",
//     picture: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
//     amount: "4500 USD",
//     date: "9/20/2021",
//   },
//   {
//     name: "Jose Perez",
//     picture: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
//     amount: "4500 USD",
//     date: "9/20/2021",
//   },
//   {
//     name: "Jose Perez",
//     picture: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
//     amount: "4500 USD",
//     date: "9/20/2021",
//   },
//   {
//     name: "Jose Perez",
//     picture: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
//     amount: "4500 USD",
//     date: "9/20/2021",
//   },
//   {
//     name: "Jose Perez",
//     picture: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
//     amount: "4500 USD",
//     date: "9/20/2021",
//   },
// ];

export const CardTransactions = () => {

   
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState([]);


useEffect(() => {
  const storedUser = getAuthFromLocalStorage();
  setUser(storedUser ? (storedUser as User) : null); // Safely set user
}, []);

useEffect(() => {
  if (user?.id) {
    fetchInvoices(user.id);
  }
}, [user]); 

const fetchInvoices = useCallback(async (id: number) => {
  try {
    let response = await getInvoices(id);
    console.log("response", response);
    setItems(response.reverse())
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
    <Card className=" bg-default-50 rounded-xl shadow-md px-3">
      <CardBody className="py-5 gap-4">
        <div className="flex gap-2.5 justify-center">
          <div className="flex flex-col border-dashed border-2 border-divider py-2 px-6 rounded-xl">
            <span className="text-default-900 text-xl font-semibold">
              Latest Invoices
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-6 ">
          {items.map((item:Invoice) => (
            <div key={item.id} className="grid grid-cols-4 w-full">
              {/* <div className="w-full">
                <Avatar
                  isBordered
                  color="secondary"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                />
              </div> */}

              <span className="text-default-900  text-xs">
                {item?.customer.company_name != null? item?.customer.company_name:item?.customer.first_name}
              </span>
              <span className="text-default-500  text-xs">
              {item?.inv_prefix}{item?.inv_number}
              </span>
              <div>
                <span className="text-success text-xs">{item.inv_total}</span>
              </div>
              <div>
                <span className="text-default-500 text-xs">{moment(item.inv_date).format('DD-MM-YYYY')}</span>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
