// import {
//   addToast,
//     Link,
//     Table,
//     TableBody,
//     TableCell,
//     TableColumn,
//     TableHeader,
//     TableRow,
//     useDisclosure,
//   } from "@heroui/react";
//   import React, { useCallback, useEffect, useState } from "react";
//   import { columns, incomeExpense } from "./incomeExpenseData";
//   import { AxiosError } from "axios";
// import { IncomeExpense, Invoice, User } from "@/helpers/types";
// import { getAuthFromLocalStorage } from "@/utils/localStorageUtils";
// import { deleteInvoice, getInvoices } from "@/services/invoiceService";
// import { getClients } from "@/services/clientService";
// import { RenderIncomeExpenseCell } from "./render-income-expense-cell";
// import { deleteIncomeExpense, getIncomeExpense } from "@/services/incomeExpenseService";
  
//   export const IncomeExpenseTableWrapper = () => {

//     const { isOpen, onOpen, onOpenChange } = useDisclosure();
//     const [user, setUser] = useState<User | null>(null);
//     const [count, setCount] = useState<number>(0);
//     const [ClientsList, setClientsList] = useState<Invoice[]>([]);
//     const [invoiceList, setInvoiceList] = useState<Invoice[]>([]);
//     const [incomeExpenseList, setIncomeExpenseList] = useState<IncomeExpense[]>([]);
//     const [error, setError] = useState();

//     // Pagination state
//       const [currentPage, setCurrentPage] = useState(1);
//       const itemsPerPage = 10; // Number of items per page
      

//     useEffect(() => {
//       const storedUser = getAuthFromLocalStorage();
//       setUser(storedUser ? (storedUser as User) : null); // Safely set user
//     }, []);
  
//     useEffect(() => {
//       if (user?.id) {
//         fetchClients(user.id);
//         fetchInvoices(user.id);
//         fetchIncomeExpense(user.id);
//       }
//     }, [user, count,onOpenChange]);  

//     const fetchClients = useCallback(async (id: number) => {
//         try {
//           let response = await getClients(id);
//           console.log("response", response);
//           setClientsList(response);
//         } catch (err: unknown) {
//           console.log("Login error:", err);
    
//           if (err instanceof AxiosError) {
//             const status = err.response?.status;
    
//             switch (status) {
//               case 400:
//                 addToast({
//                   title: "Bad Request",
//                   description: "Please check your input and try again.",
//                   color: "danger",
//                 });
//                 break;
//               case 401:
//                 addToast({
//                   title: "Unauthorized",
//                   description: "Invalid credentials. Please try again.",
//                   color: "danger",
//                 });
//                 break;
//               case 500:
//                 addToast({
//                   title: "Server Error",
//                   description: "An error occurred on the server. Please try again later.",
//                   color: "danger",
//                 });
//                 break;
//               default:
//                 addToast({
//                   title: "Error",
//                   description: "An unexpected error occurred. Please try again.",
//                   color: "danger",
//                 });
//                 break;
//             }
//           } else {
//             addToast({
//               title: "Unexpected Error",
//               description: "An unexpected error occurred. Please try again.",
//               color: "danger",
//             });
//           }
//         }
//       }, [addToast, setError]);
    


//     const fetchInvoices = useCallback(async (id: number) => {
//       try {
//         let response = await getInvoices(id);
//         console.log("response", response);
//         setInvoiceList(response.reverse());
//       } catch (err: unknown) {
//         console.log("Login error:", err);
  
//         if (err instanceof AxiosError) {
//           const status = err.response?.status;
  
//           switch (status) {
//             case 400:
//               addToast({
//                 title: "Bad Request",
//                 description: "Please check your input and try again.",
//                 color: "danger",
//               });
//               break;
//             case 401:
//               addToast({
//                 title: "Unauthorized",
//                 description: "Invalid credentials. Please try again.",
//                 color: "danger",
//               });
//               break;
//             case 500:
//               addToast({
//                 title: "Server Error",
//                 description: "An error occurred on the server. Please try again later.",
//                 color: "danger",
//               });
//               break;
//             default:
//               addToast({
//                 title: "Error",
//                 description: "An unexpected error occurred. Please try again.",
//                 color: "danger",
//               });
//               break;
//           }
//         } else {
//           addToast({
//             title: "Unexpected Error",
//             description: "An unexpected error occurred. Please try again.",
//             color: "danger",
//           });
//         }
//       }
//     }, [addToast, setError]);
    
//     const fetchIncomeExpense = useCallback(async (id: number) => {
//       try {
//         let response = await getIncomeExpense(id);
//         console.log("response", response);
//         // setIncomeExpenseList(response.reverse());
//         setIncomeExpenseList(response.reverse());
//       } catch (err: unknown) {
//         console.log("Data error:", err);
  
//         if (err instanceof AxiosError) {
//           const status = err.response?.status;
  
//           switch (status) {
//             case 400:
//               addToast({
//                 title: "Bad Request",
//                 description: "Please check your input and try again.",
//                 color: "danger",
//               });
//               break;
//             case 401:
//               addToast({
//                 title: "Unauthorized",
//                 description: "Invalid credentials. Please try again.",
//                 color: "danger",
//               });
//               break;
//             case 404:
//               addToast({
//                 title: "No data",
//                 description: "No Income / Expense found.",
//                 color: "success",
//               });
//               break;
//             case 500:
//               addToast({
//                 title: "Server Error",
//                 description: "An error occurred on the server. Please try again later.",
//                 color: "danger",
//               });
//               break;
//             default:
//               addToast({
//                 title: "Error",
//                 description: "An unexpected error occurred. Please try again.",
//                 color: "danger",
//               });
//               break;
//           }
//         } else {
//           addToast({
//             title: "Unexpected Error",
//             description: "An unexpected error occurred. Please try again.",
//             color: "danger",
//           });
//         }
//       }
//     }, [addToast, setError, count, onOpenChange]);

//     const removeIncomeExpense = useCallback(async (id: number) => {
//         try {
//           let response = await deleteIncomeExpense(id);
//           console.log("response", response);
//           setCount(prev=>prev+1)
//         } catch (err: unknown) {
//           console.log("delete error:", err);
    
//           if (err instanceof AxiosError) {
//             const status = err.response?.status;
    
//             switch (status) {
//               case 400:
//                 addToast({
//                   title: "Bad Request",
//                   description: "Please check your input and try again.",
//                   color: "danger",
//                 });
//                 break;
//               case 401:
//                 addToast({
//                   title: "Unauthorized",
//                   description: "Invalid credentials. Please try again.",
//                   color: "danger",
//                 });
//                 break;
//               case 500:
//                 addToast({
//                   title: "Server Error",
//                   description: "An error occurred on the server. Please try again later.",
//                   color: "danger",
//                 });
//                 break;
//               default:
//                 addToast({
//                   title: "Error",
//                   description: "An unexpected error occurred. Please try again.",
//                   color: "danger",
//                 });
//                 break;
//             }
//           } else {
//             addToast({
//               title: "Unexpected Error",
//               description: "An unexpected error occurred. Please try again.",
//               color: "danger",
//             });
//           }
//         }
//       }, []);
      

//     // Pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = invoiceList.slice(indexOfFirstItem, indexOfLastItem);

//   // Handle page change
//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

//   // Total pages
//   const totalPages = Math.ceil(invoiceList.length / itemsPerPage);
  
//     return (
//       <div className=" w-full flex flex-col gap-4">
//         <Table aria-label="Example table with custom cells">
//           <TableHeader columns={columns}>
//             {(column) => (
//               <TableColumn
//                 key={column.uid}
//                 hideHeader={column.uid === "actions"}
//                 align={column.uid === "actions" ? "center" : "start"}
//               >
//                 {column.name}
//               </TableColumn>
//             )}
//           </TableHeader>
//           <TableBody items={incomeExpenseList}>
//             {(item) => (
//               <TableRow>
//                 {(columnKey) => (
//                   <TableCell>
//                     {RenderIncomeExpenseCell({ incomeExpense: item, columnKey: columnKey, setCount:setCount, deleteInvoice:removeIncomeExpense })}
//                   </TableCell>
//                 )}
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>

//         {/* Pagination controls */}
//       <div className="flex justify-center gap-4 mt-4">
//         <button
//           onClick={() => paginate(currentPage - 1)}
//           disabled={currentPage === 1}
//           className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
//         >
//           Prev
//         </button>
//         {[...Array(totalPages)].map((_, index) => (
//           <button
//             key={index}
//             onClick={() => paginate(index + 1)}
//             className={`px-4 py-2 rounded-lg ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//           >
//             {index + 1}
//           </button>
//         ))}
//         <button
//           onClick={() => paginate(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//       </div>
//     );
//   };
  
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
import { columns, incomeExpense } from "./incomeExpenseData";
import { AxiosError } from "axios";
import { IncomeExpense, Invoice, User } from "@/helpers/types";
import { getAuthFromLocalStorage } from "@/utils/localStorageUtils";
import { deleteInvoice, getInvoices } from "@/services/invoiceService";
import { getClients } from "@/services/clientService";
import { RenderIncomeExpenseCell } from "./render-income-expense-cell";
import { deleteIncomeExpense, getIncomeExpense } from "@/services/incomeExpenseService";

export const IncomeExpenseTableWrapper = ({searchQuery, setSearchQuery, count, setCount}) => {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [user, setUser] = useState<User | null>(null);
  const [ClientsList, setClientsList] = useState<Invoice[]>([]);
  const [invoiceList, setInvoiceList] = useState<Invoice[]>([]);
  const [incomeExpenseList, setIncomeExpenseList] = useState<IncomeExpense[]>([]);
  const [filteredIncomeExpenseList, setFilteredIncomeExpenseList] = useState<IncomeExpense[]>([]);  // Filtered list for search
  // const [searchQuery, setSearchQuery] = useState<string>("");  // Search query state

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
      fetchIncomeExpense(user.id);
    }
  }, [user, count, onOpenChange]);

  const fetchClients = useCallback(async (id: number) => {
    try {
      let response = await getClients(id);
      console.log("response", response);
      setClientsList(response);
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

  const fetchInvoices = useCallback(async (id: number) => {
    try {
      let response = await getInvoices(id);
      console.log("response", response);
      setInvoiceList(response.reverse());
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

  const fetchIncomeExpense = useCallback(async (id: number) => {
    try {
      let response = await getIncomeExpense(id);
      console.log("response", response);
      setIncomeExpenseList(response.reverse());
      setFilteredIncomeExpenseList(response);  // Initialize the filtered list
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
  }, [addToast, setError, count, onOpenChange]);

  const removeIncomeExpense = useCallback(async (id: number) => {
    try {
      let response = await deleteIncomeExpense(id);
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

  // Handle search
  // const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const query = event.target.value;
  //   setSearchQuery(query);

  //   // Filter incomeExpenseList based on search query
  //   if (query === "") {
  //     setFilteredIncomeExpenseList(incomeExpenseList);
  //   } else {
      
  //   }
  // };
  const filteredList = incomeExpenseList.filter((item) =>
    item.customer?.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.customer?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.pay_for.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // setFilteredIncomeExpenseList(filteredList);

  // Pagination logic for filteredIncomeExpenseList
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Total pages for filteredIncomeExpenseList
  const totalPages = Math.ceil(filteredIncomeExpenseList.length / itemsPerPage);

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
                  {RenderIncomeExpenseCell({
                    incomeExpense: item,
                    columnKey: columnKey,
                    setCount: setCount,
                    deleteInvoice: removeIncomeExpense
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
