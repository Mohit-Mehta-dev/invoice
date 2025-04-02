import { addToast, Button, Image, Input, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import React, { useState, useEffect, useCallback } from "react";
import { EditIcon } from "../icons/table/edit-icon";
import { Client, Invoice, InvoiceFormType, InvoiceItem, User, UserSettings } from "@/helpers/types";
import { getClientById, getClients } from "@/services/clientService";
import { getAuthFromLocalStorage } from "@/utils/localStorageUtils";
import moment, { max } from "moment";
import { DeleteIcon } from "../icons/table/delete-icon";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { AxiosError } from "axios";
import { getSettings } from "@/services/authService";
import { useParams, useRouter } from "next/navigation";
import { BalanceIcon } from "../icons/sidebar/balance-icon";
import { ExportIcon } from "../icons/accounts/export-icon";
import { AccountsIcon } from "../icons/sidebar/accounts-icon";
import { getInvoiceById, getInvoices, postInvoice, putInvoice } from "@/services/invoiceService";
import { getCashReceiptById, getIncomeExpense, getIncomeExpenseById, getIncomeExpenseByInvId, postIncomeExpense } from "@/services/incomeExpenseService";
import { HomeIcon } from "../icons/sidebar/home-icon";
pdfMake.vfs = pdfFonts;

interface AddInvoiceProps {
  type: "add" | "view" | "update";
}

export const PrintCashReceipt: React.FC<AddInvoiceProps> = ({ type }) => {
  const {id} = useParams();
  const router = useRouter();
  const [ClientsList, setClientsList] = useState<Client[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);

  const [selectedClient, setSelectedClient] = useState<Client>();
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");

  const [gst, setGst] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [gstType, setGstType] = useState<"number" | "percentage">("number");

  const [invoiceData, setInvoiceData] = useState<Invoice | null>(null);
  const [discountType, setDiscountType] = useState<"number" | "percentage">("number");

  const [paidAmount, setPaidAmount] = useState<number>(0);

  const [previousPaymentDataList, setPreviousPaymentDataList] = useState([]);
  const [paymentDataList, setPaymentDataList] = useState([]);

  const [selectedItemFromList, setSelectedItemFromList] = useState({});
  const [paymentItem, setPaymentItem] = useState<string>("");
  const [paymentType, setPaymentType] = useState<string>("");
  const [paymentQuantity, setPaymentQuantity] = useState<number>(0);
  const [paymentPrice, setPaymentPrice] = useState<number>(0);
  const [paymentDate, setPaymentDate] = useState<string>("");
  const [selectedPaymentItem, setSelectedPaymentItem] = useState<InvoiceItem>()

  const [ReceiptData, setReceiptData] = useState({})


  // Modify the initial state to have 6 rows (3 additional ones)
  const [invoiceItems, setInvoiceItems] = useState([]);

  const [bgColor, setBgColor] = useState<string>("#000000");

  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const storedUser = getAuthFromLocalStorage();
    setUser(storedUser ? (storedUser as User) : null);
  }, []);

  useEffect(() => {
    if (user?.id) {
      // fetchClient(Number(id));
      fetchSettings(user.id);

      if(type==="add"){
        // fetchClient(Number(id));
        // fetchInvoiceNumber(user.id);
        // fetchReceiptById(Number(id));
        // fetchIncomeExpenseByInv(Number(id))
      }else {
        fetchReceiptById(Number(id));
        // fetchIncomeExpense(Number(id))
      }
    }
  }, [user]);

  const fetchSettings = useCallback(async (id: number) => {
    try {
      let response = await getSettings(id);
      setUserSettings(response);
    } catch (err: unknown) {
      console.log("Login error:", err);
    }
  }, []);

  const fetchClient = useCallback(async (id: number) => {
    try {
      let response = await getClientById(id);
      setSelectedClient(response);
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  }, []);
  
  const fetchReceiptById = useCallback(async (id: number) => {
    try {
      let response = await getCashReceiptById(id);
      console.log('invoice data',response)
      console.log('customer',response.customer)
      setReceiptData(response);
      
      setSelectedClient(response?.customer);
    //   setInvoiceData(response);
    //   const inv_items = response.items.map((item:InvoiceItem) => {
    //     return {
    //         ...item,
    //         name: item.item,
    //         qty: item.quantity,
    //     };
    // });     
    //   setInvoiceNumber(response.inv_number);
    //   setGst(response.inv_gst_amount);
    //   setGstType(response.inv_gst_type)
    //   setDiscount(response.inv_discount_amount)
    //   setDiscountType(response.inv_discount_type)
    //   setInvoiceItems(inv_items);
    //   setSelectedClient(response.customer)
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  }, []);

  // const fetchIncomeExpense = useCallback(async (id: number) => {
  //   try {
  //     let response = await getIncomeExpenseById(id);
  //     console.log('invoice data',response)
  //     setInvoiceData(response);
  //     // setSelectedClient(response);
  //     const inv_items = response.items.map(item => {
  //       return {
  //           ...item,
  //           name: item.item,
  //           qty: item.quantity,
  //       };
  //   });     
  //     setInvoiceNumber(response.inv_number);
  //     setInvoiceItems(inv_items);
  //   } catch (err) {
  //     console.error("Error fetching clients:", err);
  //   }
  // }, []);

  const fetchInvoiceNumber = useCallback(async (id: number) => {
    try {
      let response = await getInvoices(id);
      const invNumbers = response.map((invoice:Invoice) => +invoice.inv_number);
      const lastInvoiceNumber = invNumbers.reverse()[0];
      console.log('invoice number', lastInvoiceNumber);
      const newInvoiceNumber = (parseInt(lastInvoiceNumber) + 1).toString();
      console.log('new invoice number', newInvoiceNumber);
      setInvoiceNumber(String(newInvoiceNumber));
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  }, []);

  const validateItem = (itemName: string, quantity: number, price: number) => {
    const itemErrors: string[] = [];
    if (!itemName) itemErrors.push("Item name is required.");
    if (quantity <= 0) itemErrors.push("Quantity must be greater than 0.");
    if (price <= 0) itemErrors.push("Price must be greater than 0.");
    return itemErrors;
  };

  const validateFormOnSubmit = () => {
    const newErrors: string[] = [];
    if (!selectedClient) newErrors.push("Client selection is required.");
    if (!invoiceNumber) newErrors.push("Invoice number is required.");
    if (invoiceItems.length === 0) newErrors.push("At least one item must be added to the invoice.");
    return newErrors;
  };

  // const handleAddItem = (itemName: string, quantity: number, price: number) => {
  //   const itemErrors = validateItem(itemName, quantity, price);
  //   setErrors((prevErrors) => [...prevErrors, ...itemErrors]);
  //   if (itemErrors.length === 0) {
  //     const newItem = { name: itemName, qty: quantity, price: price };
  //     setInvoiceItems((prevItems) => [...prevItems, newItem]);
  //   }
  // };

  // const handleAddItem = () => {
  //   setInvoiceItems((prevItems) => [
  //     ...prevItems,
  //     { name: "", qty: null, price: null },
  //   ]);
  // };

  const handleDeleteItem = (index: number) => {
    const updatedItems = invoiceItems.filter((_, idx) => idx !== index);
    setInvoiceItems(updatedItems);
  };

  // Calculate Subtotal
  const calculateSubtotal = () => {
    return invoiceItems.reduce((total, item) => total + (item.qty ?? 0) * (item.price ?? 0), 0);
  };

  // Calculate GST amount
  const calculateGstAmount = (subtotal: number) => {
    return gstType === "percentage" ? (subtotal * (gst / 100)) : gst;
  };

  // Calculate Discount amount
  const calculateDiscountAmount = (subtotal: number) => {
    return discountType === "percentage" ? (subtotal * (discount / 100)) : discount;
  };

  // Calculate Grand Total
  const calculateGrandTotal = () => {
    const subtotal = calculateSubtotal();
    const gstAmount = calculateGstAmount(subtotal);
    const discountAmount = calculateDiscountAmount(subtotal);
    return subtotal + gstAmount - discountAmount;
  };

  const handleInvoiceSubmit = useCallback(async() => {
    const newErrors = validateFormOnSubmit();
    // invoiceItems.forEach((item, index) => {
    //   // if (!item.name.trim()) {
    //   //   newErrors.push(`Item ${index + 1} name cannot be empty.`);
    //   // }
    // });
    if (newErrors.length > 0) {
      setErrors(newErrors);
      newErrors.forEach((error) => {
        addToast({
          title: "Error submiting Invoice",
          description:error,
          color:"danger"
        });
      });
      return;
    }

    if (!user?.id) {
      console.log("User ID is missing");
      return;
    }

  //   const filteredInvoiceItems = invoiceItems.filter(item => item.name !== "");
  //   const inv_items_to_submit = filteredInvoiceItems.map(item => {
  //     console.log('inc item',item )
  //     const newItem = {
  //         ...item,
  //         pay_to: selectedClient?.company_name,
  //         pay_for: item.item,
  //         inv_id:item.inv_id,
  //         inv_item_id:item.id,
  //         payment_type: item.paymentType,
  //         credit_amount: item.price,
  //         payment_date: item.date,
  //     };
  //     delete newItem.name;
  //     delete newItem.qty;
  
  // return newItem;
  // });  
    const formData: InvoiceFormType = {

      company_id: user?.id,
      customer_id:Number(invoiceData?.customer_id),
      items:paymentDataList
      
    };

    console.log('formData',formData)
    
    if (type === "add") {
      console.log('formData2',formData)
      try {
        let response = await postIncomeExpense(formData);
        console.log("postInvoice response", response);
        router.push('/invoices');
        // setCount(prev => prev+1)
      } catch (err: unknown) {
        console.log("Adding Invoice error:", err);
      }
    } else if (type === "update") {
      try {
        let response = await putInvoice(formData, Number(id));
        console.log("putInvoice response", response);
        router.push('/invoices');
        // setCount(prev => prev+1)
      } catch (err: unknown) {
        console.log("Adding Invoice error:", err);
      }
    }
    

    // Generate the PDF
    // generatePDF(formData);
  }, [user, selectedClient, invoiceNumber, invoiceItems, paymentDataList]);

const fetchImageAsBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
const generatePDF = async () => {
  const logo = await fetchImageAsBase64(`${process.env.NEXT_PUBLIC_BASE_URL}${userSettings?.logo}`)
  const docDefinition = {
    watermark: { text: user?.company_name, color:userSettings?.inv_secondary_color, opacity: 0.05, bold: true, italics: false },
        background: function(currentPage, pageSize) { 
          return{canvas: [
            {
              type: 'rect', 
              x: 0, 
              y: 0, 
              w: pageSize.width, 
              h: 150, 
              r: 0, 
              color: userSettings?.inv_primary_color
            },
            {
              type: 'rect', 
              x: 0, 
              y: pageSize.height-70, 
              w: pageSize.width, 
              h: 70, 
              r: 0, 
              color: userSettings?.inv_primary_color
            },
          ]}
        },
    content: [
      {
        stack: [
          {
            columns: [
              {
                image: logo,
                width: 100,
                height: 100,
              },
              {
                stack:[
                  {
                    text: `${user?.company_name}`,
                    margin:[0, 40, 0, 0]
                  },
                  {
                    text: `${userSettings?.tagline}`,
                    style:"small"
                  },
                  
                ]
              },                           
              {
                stack:[
                //   {
                //     text: `INVOICE:#${userSettings?.inv_prefix}${invoiceNumber}`,
                //     alignment: 'right',
                //     margin:[0, 40, 0, 0]
                //   },
                  {
                    text: `Date: ${moment(invoiceData?.inv_date).format('DD-MM-YYYY')}`,
                    alignment: 'right',
                    margin:[0, 40, 0, 0]
                  },
                  
                ]
              },
            ],
            style:{color:userSettings?.inv_secondary_color}
            // style:{background: '#f0f0f0',padding:10}
          },
        ],
      },
      {
        stack: [
          {
            columns: [
              {
                width: '50%',
                stack: [
                  { text: 'Bill From', style: 'header' },
                  { text: user?.company_name, style: 'subheader' },
                  { text: user?.address_line1, style: 'normal' },
                  { text: user?.address_line2, style: 'normal' },
                  { text: `${user?.city} ${user?.pincode}, ${user?.state}`, style: 'normal' },
                  { text: user?.email, style: 'normal' },
                  { text: user?.phone, style: 'normal' },
                  ...(user?.gst ? [{ text: `GST: ${user?.gst}`, style: 'normal' }] : []),
                ],
              },
              {
                width: '50%',
                alignment: 'right',
                stack: [
                  { text: 'Bill To', style: 'header' },
                  {
                    text: selectedClient?.company_name ? selectedClient?.company_name : selectedClient?.first_name,
                    style: 'subheader',
                  },
                  {
                    text: selectedClient?.address_line1,
                    style: 'normal',
                  },
                  {
                    text: selectedClient?.address_line2,
                    style: 'normal',
                  },
                  {
                    text: `${selectedClient?.city} ${selectedClient?.pincode}, ${selectedClient?.state}`,
                    style: 'normal',
                  },
                  {
                    text: selectedClient?.email,
                    style: 'normal',
                  },
                  {
                    text: selectedClient?.phone,
                    style: 'normal',
                  },
                  ...(selectedClient.gstin ? [{ text: `GST: ${selectedClient.gstin}`, style: 'normal' }] : []),
                ],
              },
            ],
          },
        ],
        margin: [0, 20, 0, 20],
      },      

      // Table for Invoice Items
      {
        table: {
          headerRows: 1,
          widths: ['*', '*', '*', '*'],
          body: [
            [
              { text: 'Payment For', style: 'tableHeader' },
              { text: 'Payment Mode', style: 'tableHeader' },
              { text: 'Price', style: 'tableHeader' },
              { text: 'Date', style: 'tableHeader' },
            ],
            [
              // Handle dynamic values with safe checks
              { text: type === 'view' ? ReceiptData.pay_for : { text: ReceiptData.pay_for, editable: true }, style: 'tableData' },
              { text: type === 'view' ? ReceiptData.payment_type : { text: ReceiptData.payment_type, editable: true }, style: 'tableData' },
              { 
                text: type === 'view' 
                  ? (ReceiptData.credit_amount !== "0.00" && !isNaN(parseFloat(ReceiptData.credit_amount)) ? String(ReceiptData.credit_amount) : String(ReceiptData.debit_amount)) 
                  : { text: (ReceiptData.credit_amount !== "0.00" && !isNaN(parseFloat(ReceiptData.credit_amount)) ? String(ReceiptData.credit_amount) : String(ReceiptData.debit_amount)), editable: true }, 
                style: 'tableData' 
              },
              { 
                text: type === 'view' ? (ReceiptData.payment_date ? moment(ReceiptData.payment_date).format('DD-MM-YYYY') : "Invalid Date") : { text: moment(ReceiptData.payment_date).format('DD-MM-YYYY'), editable: true }, 
                style: 'tableData' 
              },
            ],
          ],
        },
        margin: [0, 50, 0, 20],
      },

      // Final Thank You Note
      {
        text: `Thank you for choosing ${user?.company_name} for your business.`,
        style: 'thankYouText',
        alignment: 'center',
        margin: [0, 0, 0, 0],
        absolutePosition: { x: 0, y: 780 },
        color:userSettings?.inv_secondary_color
      },
    ],

    styles: {
      header: {
        fontSize: 14,
        bold: true,
        color: '#000000',
      },
      subheader: {
        fontSize: 12,
        bold: true,
        color: '#019eed',
      },
      small: {
        fontSize: 8,
      },
      normal: {
        fontSize: 10,
      },
      bold: {
        fontSize: 10,
        bold: true,
      },
      tableHeader: {
        fontSize: 10,
        bold: true,
        alignment: 'center',
        fillColor: '#eaeaea',
      },
      tableData: {
        fontSize: 10,
      },
      footerNote: {
        fontSize: 9,
        italics: true,
        color: '#ffffff',
        background: '#808080',
      },
      signatureText: {
        fontSize: 10,
        bold: true,
        alignment: 'right',
      },
      thankYouText: {
        fontSize: 12,
        italics: true,
        // background: '#000000',
      },
    },
  };

  // Generate and open the PDF
  pdfMake.createPdf(docDefinition).open();
  const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  pdfDocGenerator.download(`${userSettings?.inv_prefix}${invoiceNumber}`);
};


const clearPaymentFields = () =>{
  setPaymentPrice(0);
  setPaymentDate('');
};

const handleDeletePaymentItem = (index: number) => {
  const updatedItems = paymentDataList.filter((_, idx) => idx !== index);
  setPaymentDataList(updatedItems);
};

const handleEditPaymentItem = (record) => {
  {console.log('edit record',record)}
  setPaymentItem(record.item);
  setPaymentType(record.paymentType);
  setPaymentPrice(record.amount);
  setPaymentDate(record.date);
  setSelectedPaymentItem(record); // Store the record being edited
};


const addOrUpdatePaymentData = () => {
  if (!paymentItem || !paymentType || !paymentPrice || !paymentDate) {
    alert("Please enter all payment details.");
    return;
  }

  if (selectedPaymentItem) {
    // Update Existing Record
    {console.log('selectedPaymentItem',selectedPaymentItem)}
    const updatedList = paymentDataList.map((item) =>
      item.id === selectedPaymentItem?.id
        ? { ...item, paymentType, amount:paymentPrice, paymentDate }
        : item
    );

    setPaymentDataList(updatedList);
    setSelectedPaymentItem(null)
  }else{

    const pickedItem = invoiceItems.find(item => item.id === Number(paymentItem))

    console.log('picked item',pickedItem)

    const { id, item, name, quantity, qty, price, gst_pr, gst_amount, item_total, created_at, updated_at, ...pickedItemWithoutId } = pickedItem;
  
    // Add New Payment
    const newPaymentData = {
      ...pickedItemWithoutId,
      pay_to:user?.company_name != null ? user?.company_name: user?.first_name,
      pay_for:pickedItem?.item,
      inv_item_id:pickedItem?.id,
      payment_type: paymentType,
      credit_amount: paymentPrice,
      payment_date: paymentDate
    };

    setPaymentDataList([...paymentDataList, newPaymentData]);
  }
  clearPaymentFields();
};

const handlePaymentSubmit = () => {
  addOrUpdatePaymentData()
}

useEffect(() => {
  const prevPayment = previousPaymentDataList?.reduce(
    (sum, payment) => sum + Number(payment.credit_amount),
    0
  );
  const totalPaid = paymentDataList.reduce(
    (sum, payment) => sum + Number(payment.credit_amount),
    0
  );
  setPaidAmount(prevPayment+totalPaid);
  // setDueAmount(totalAfterDiscount - totalPaid);
  console.log('paymentDataList',paymentDataList)
}, [paymentDataList, previousPaymentDataList]);


const fetchIncomeExpenseByInv = useCallback(async (id: number) => {
      try {
        let response = await getIncomeExpenseByInvId(id);
        console.log("response", response);
        // setIncomeExpenseList(response.reverse());
        // setIncomeExpenseList(response.reverse());
        if (response?.data) {
          // Add new payments to the current state
          setPreviousPaymentDataList(prevPaymentDataList => [
            ...prevPaymentDataList, 
            ...response.data // Assuming response.data is an array of payment data
          ]);
        }
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
    <div className="mt-4">
      <div className="fixed bottom-20 right-10 z-50 rounded-xl">
        <Button onPress={generatePDF} color="primary" className="mb-4 rounded-xl">
          PDF
        </Button>
      </div>
      {type === "add"&&<div className="fixed bottom-10 right-10 z-50 rounded-xl">
        <Button onPress={handleInvoiceSubmit} color="primary" className="mb-4 rounded-xl">
          <AccountsIcon  />
        </Button>
      </div>}
      {type === "update"&&<div className="fixed bottom-10 right-10 z-50 rounded-xl">
        <Button onPress={handleInvoiceSubmit} color="primary" className="mb-4 rounded-xl">
        Update Invoice
        </Button>
      </div>}

      <div className="p-10 mb-4" style={{ backgroundColor: userSettings?.inv_primary_color }}>
        <div className="flex justify-between items-center gap-4">
          {/* Left side: Image, Company Name (h1), and Tagline (h6) */}
          <div className="flex items-center gap-4">
            <img src={`${process.env.NEXT_PUBLIC_BASE_URL}${userSettings?.logo}`} alt="Company Logo" width="150" height="150" />
            <div>
              <h1 className="text-xl font-bold" style={{ color: userSettings?.inv_secondary_color }}>
                {user?.company_name}
              </h1>
              <h6 className="text-xs font-normal" style={{ color: userSettings?.inv_secondary_color }}>
                {userSettings?.tagline}
              </h6>
            </div>
          </div>

          {/* Right side: Two h1 elements */}
          <div>
            {/* <div className="mb-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold" style={{ color: userSettings?.inv_secondary_color }}>
                  INVOICE:#{userSettings?.inv_prefix}{invoiceNumber}
                </h1>
              </div>
            </div> */}
            <h1 className="text-xl font-bold" style={{ color: userSettings?.inv_secondary_color }}>
              Date: {moment(ReceiptData.ReceiptDate).format('DD-MM-YYYY')}
            </h1>
          </div>
        </div>
      </div>

      <div className="p-10 mb-4">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-bold">
                Bill From
              </h1>
              <h6 className="text-xl font-bold" style={{ color: '#019eed' }}>
                {user?.company_name}
              </h6>
              <h6 className="text-sm font-normal">
                {user?.address_line1}
              </h6>
              <h6 className="text-sm font-normal">
                {user?.address_line2}
              </h6>
              <h6 className="text-sm font-normal">
                {user?.city} {user?.pincode}, {user?.state}
              </h6>
              <h6 className="text-sm font-normal">
                {user?.email}
              </h6>
              <h6 className="text-sm font-normal">
                {user?.phone}
              </h6>
            </div>
          </div>

          {/* Right side: Two h1 elements */}
          {/* {type==="add"? */}
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-bold">
                Bill To
              </h1>
              <h6 className="text-xl font-bold" style={{ color: '#019eed' }}>
                {selectedClient?.company_name}
              </h6>
              <h6 className="text-sm font-normal">
                {selectedClient?.address_line1}
              </h6>
              <h6 className="text-sm font-normal">
                {selectedClient?.address_line2}
              </h6>
              <h6 className="text-sm font-normal">
                {selectedClient?.city} {selectedClient?.pincode}, {selectedClient?.state}
              </h6>
              <h6 className="text-sm font-normal">
                {selectedClient?.email}
              </h6>
              <h6 className="text-sm font-normal">
                {selectedClient?.phone}
              </h6>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Items Table */}
      <Table aria-label="Invoice Items" className="p-10">
        <TableHeader>
          {/* <TableColumn>No</TableColumn> */}
          <TableColumn>Payment For</TableColumn>
          <TableColumn>Payment Mode</TableColumn>
          <TableColumn>Price</TableColumn>
          <TableColumn>date</TableColumn>
        </TableHeader>
        <TableBody>
          {/* {invoiceItems.map((item, index) => ( */}
            <TableRow >
              {/* <TableCell>
                {index+1}
              </TableCell> */}
              <TableCell>
                {ReceiptData.pay_for}
              </TableCell>
              <TableCell>
                {ReceiptData.payment_type}
              </TableCell>
              <TableCell>
                {ReceiptData.credit_amount !="0.00" ?ReceiptData.credit_amount:ReceiptData.debit_amount}
              </TableCell>
              <TableCell>
                {moment(ReceiptData.ReceiptDate).format('DD-MM-YYYY')}
              </TableCell>
            </TableRow>
          {/* ))} */}
        </TableBody>
      </Table>

      

      <div className="p-10 mb-4" style={{ backgroundColor: userSettings?.inv_primary_color }}>
        <div className="flex justify-center items-center gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold" style={{ color: userSettings?.inv_secondary_color }}>
              Thank you for choosing {user?.company_name} for your business.
            </h1>
          </div>
        </div>
      </div>

    </div>
  );
};
