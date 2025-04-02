import { addToast, Button, Image, Input, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import React, { useState, useEffect, useCallback } from "react";
import { EditIcon } from "../icons/table/edit-icon";
import { Client, Invoice, InvoiceFormType, User, UserSettings } from "@/helpers/types";
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
import { color } from "framer-motion";
pdfMake.vfs = pdfFonts;

interface AddInvoiceProps {
  type: "add" | "view" | "update";
}

export const AddInvoice: React.FC<AddInvoiceProps> = ({ type }) => {
  const {id} = useParams();
  const router = useRouter();
  const [ClientsList, setClientsList] = useState<Client[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);

  const [selectedClient, setSelectedClient] = useState<Client>();
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState<string>(moment().format('YYYY-MM-DD'));

  const [gst, setGst] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [gstType, setGstType] = useState<"number" | "percentage">("number");

  const [invoiceData, setInvoiceData] = useState<Invoice | null>(null);
  const [discountType, setDiscountType] = useState<"number" | "percentage">("number");


  // Modify the initial state to have 6 rows (3 additional ones)
  const [invoiceItems, setInvoiceItems] = useState<{ name: string; qty: number|null; price: number|null }[]>([
    { name: "", qty: null, price: null },
    { name: "", qty: null, price: null },
    { name: "", qty: null, price: null },
    { name: "", qty: null, price: null },
  ]);

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

      if(type==="add" ){
        fetchClient(Number(id));
        fetchInvoiceNumber(user.id);
      }else {
        fetchInvoice(Number(id));
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
  
  const fetchInvoice = useCallback(async (id: number) => {
    try {
      let response = await getInvoiceById(id);
      console.log('invoice data',response)
      setInvoiceData(response);
      // setSelectedClient(response);
      const inv_items = response.items.map(item => {
        return {
            ...item,
            name: item.item,
            qty: item.quantity,
        };
    });     
      setInvoiceNumber(response.inv_number);
      setInvoiceDate(moment(response.inv_date).format('YYYY-MM-DD'));
      setGst(Number(response.inv_gst_amount));
      console.log('gst type',response.inv_gst_type);
      setGstType(response.inv_gst_type);
      setDiscount(Number(response.inv_discount_amount));
      setDiscountType(response.inv_discount_type);
      setInvoiceItems(inv_items);
      setSelectedClient(response.customer)
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  }, []);

  const fetchInvoiceNumber = useCallback(async (id: number) => {
    try {
      let response = await getInvoices(id);
      console.log('response',response)
      const invNumbers = response.map(invoice => {const invNumber = +invoice.inv_number; // Convert to number
        return invNumber.toString().padStart(6, '0');});
      console.log('invNumbers', invNumbers);
      const lastInvoiceNumber = invNumbers.reverse()[0];
      console.log('invoice number', lastInvoiceNumber);
      // const newInvoiceNumber = (parseInt(lastInvoiceNumber) + 1).toString();
      const newInvoiceNumber = (parseInt(lastInvoiceNumber) + 1).toString().padStart(6, '0');
      console.log('new invoice number', newInvoiceNumber);
      setInvoiceNumber(String(newInvoiceNumber));
    } catch (err) {
      console.log('response erer',err)
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
                    setInvoiceNumber('000001');
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
    if (!invoiceDate) newErrors.push("Invoice date is required.");
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

  const handleAddItem = () => {
    setInvoiceItems((prevItems) => [
      ...prevItems,
      { name: "", qty: null, price: null },
    ]);
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = invoiceItems.filter((_, idx) => idx !== index);
    setInvoiceItems(updatedItems);
  };

  // Calculate Subtotal
  const calculateSubtotal = () => {
    return invoiceItems.reduce((total, item) => total + (item.qty ?? 0) * (item.price ?? 0), 0).toFixed(2);
  };

  // Calculate GST amount
  const calculateGstAmount = (subtotal: number) => {
    return gstType === "percentage" ? (subtotal * (gst / 100)).toFixed(2) : gst;
  };

  // Calculate Discount amount
  const calculateDiscountAmount = (subtotal: number) => {
    return discountType === "percentage" ? (subtotal * (discount / 100)).toFixed(2) : discount;
  };

  // Calculate Grand Total
  const calculateGrandTotal = () => {
    const subtotal = calculateSubtotal();
    const gstAmount = calculateGstAmount(+subtotal);
    const discountAmount = calculateDiscountAmount(+subtotal);
    console.log('cal',(+subtotal + +gstAmount - +discountAmount).toFixed(2))
    return (+subtotal + +gstAmount - +discountAmount).toFixed(2);
  };

  const handleInvoiceSubmit = useCallback(async() => {
    const newErrors = validateFormOnSubmit();
    invoiceItems.forEach((item, index) => {
      // if (!item.name.trim()) {
      //   newErrors.push(`Item ${index + 1} name cannot be empty.`);
      // }
    });
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

    const filteredInvoiceItems = invoiceItems.filter(item => item.name !== "");
    const inv_items_to_submit = filteredInvoiceItems.map(item => {
      const newItem = {
          ...item,
          item: item.name,
          quantity: item.qty,
          gst_pr: gst,
          gst_amount: gst,
          item_total:Number(item.price*item.qty)
      };
      delete newItem.name;
      delete newItem.qty;
  
  return newItem;
  });  
    const formData = {
      company_id: user?.id,
      customer_id: String(selectedClient?.id),
      inv_number: invoiceNumber,
      inv_prefix: userSettings?.inv_prefix || 'RTG',
      inv_subtotal: calculateSubtotal(),
      inv_gst_pr: 0,
      inv_gst_amount: gst,
      inv_gst_type:gstType,
      inv_discount_amount: discount,
      inv_discount_type:discountType,
      inv_total: calculateGrandTotal(),
      inv_date: moment(invoiceDate).format('YYYY-MM-DD'),
      // gst:calculateGstAmount(calculateSubtotal()),
      // discount:calculateDiscountAmount(calculateSubtotal()),
      items: inv_items_to_submit,
      
    };

    console.log('formData',formData)

    if (type === "add") {
      console.log('gst',gst)
      console.log('gstType',gstType)
      console.log('discount',discount)
      console.log('discontType',discountType)
      try {
        let response = await postInvoice(formData);
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
  }, [user, selectedClient, invoiceNumber, invoiceItems, gstType, discountType,gst,discount,invoiceDate]);

  // const generatePDF = (formData: InvoiceFormType) => {
  //   const docDefinition = {
  //     content: [
  //       { text: 'Invoice', style: 'header' },
  //       { text: `Invoice Number: ${formData.inv_number}`, style: 'subHeader' },
  //       { text: `Date: ${moment().format('YYYY-MM-DD')}`, style: 'subHeader' },
  //       { text: `Client: ${ClientsList.find(client => client.id === Number(selectedClient?.id))?.company_name || "N/A"}`, style: 'subHeader' },

  //       // Table for items
  //       {
  //         table: {
  //           headerRows: 1,
  //           widths: ['auto', 'auto', 'auto', 'auto'],
  //           body: [
  //             ['Item', 'Quantity', 'Price', 'Total'],
  //             ...invoiceItems.map(item => [item.name, item.qty, item.price, (item.qty ?? 0) * (item.price ?? 0)])
  //           ]
  //         },
  //         layout: 'lightHorizontalLines'
  //       },

  //       // Total
  //       { text: `Total: ${invoiceItems.reduce((total, item) => total + (item.price ?? 0) * (item.qty ?? 0), 0)}`, style: 'total' }
  //     ],
  //     styles: {
  //       header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
  //       subHeader: { fontSize: 12, margin: [0, 0, 0, 5] },
  //       total: { fontSize: 14, bold: true, margin: [0, 20, 0, 0] }
  //     },

  //     // Add header and footer to the PDF
  //     header: (currentPage: number, pageCount: number, pageSize: { width: number; height: number }) => {
  //       return [
  //         {
  //           table: {
  //             widths: ['*'],
  //             body: [
  //               [
  //                 {
  //                   text: 'My Company',
  //                   alignment: 'center',
  //                   fontSize: 12,
  //                   margin: [10, 10], // Padding for left, top, right, bottom
  //                   background: bgColor, // Background color for header
  //                   colSpan: 1,  // Ensure the background spans the entire width
  //                 }
  //               ]
  //             ]
  //           },
  //           layout: 'noBorders',
  //         },
  //         {
  //           table: {
  //             widths: ['*'],
  //             body: [
  //               [
  //                 {
  //                   text: 'Invoice',
  //                   alignment: 'center',
  //                   fontSize: 18,
  //                   bold: true,
  //                   background: bgColor, // Background color for header
  //                   margin: [0, 10],
  //                   colSpan: 1,
  //                 }
  //               ]
  //             ]
  //           },
  //           layout: 'noBorders',
  //         },
  //         {
  //           table: {
  //             widths: ['*'],
  //             body: [
  //               [
  //                 {
  //                   text: `Page ${currentPage} of ${pageCount}`,
  //                   alignment: 'right',
  //                   fontSize: 12,
  //                   margin: [0, 10],
  //                   background: bgColor, // Background color for footer
  //                   colSpan: 1,
  //                 }
  //               ]
  //             ]
  //           },
  //           layout: 'noBorders',
  //         },
  //       ];
  //     },

  //     footer: (currentPage: number, pageCount: number) => {
  //       return [
  //         {
  //           text: `Thank you for your business!`,
  //           alignment: 'center',
  //           fontSize: 10,
  //           margin: [0, 10],
  //           background: bgColor, // Background color for footer
  //         }
  //       ];
  //     },
  //   };

  //   const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  //   pdfDocGenerator.download('invoice.pdf');
  // };

//   const generatePDF = (formData:InvoiceFormType) => {

//     const bgColor = userSettings?.inv_primary_color || "#ffffff";  // Primary background color
//     const headerBgColor = userSettings?.inv_primary_color || "#f1f1f1";  // Background color for header section
//     const textColor = userSettings?.inv_secondary_color || "#000000";  // Text color
//     const accentColor = userSettings?.inv_secondary_color || "#FFD700";  // Accent color (e.g., for highlights)
    

//     // Define the PDF document structure
//     const docDefinition = {
//         content: [
//             // Header Section with background color
//             {
//                 columns: [
//                     // {
//                     //     image: base64EncodeImage(`${process.env.NEXT_PUBLIC_BASE_URL}${userSettings?.logo}`),
//                     //     width: 150,
//                     //     height: 150,
//                     // },
//                     {
//                         text: user?.company_name || "Company Name",
//                         style: 'header',
//                         alignment: 'center',
//                     },
//                     {
//                         text: `INVOICE: #${userSettings?.inv_prefix || '0001'}`,
//                         style: 'subHeader',
//                         alignment: 'right',
//                     }
//                 ],
//                 columnGap: 10,
//                 margin: [0, 20], // Adjusted margin to match UI spacing
//                 background: headerBgColor, // Background color for the header
//             },
//             {
//                 text: `Date: ${moment().format('YYYY-MM-DD')}`,
//                 style: 'subHeader',
//                 alignment: 'right',
//             },

//             // Bill From and Bill To Sections
//             {
//                 columns: [
//                     {
//                         width: '50%',
//                         text: [
//                             { text: 'Bill From\n', style: 'bold' },
//                             { text: `${user?.company_name}\n${user?.address_line1}\n${user?.address_line2}\n${user?.city} ${user?.pincode}, ${user?.state}\n${user?.email}\n${user?.phone}` },
//                         ],
//                     },
//                     {
//                         width: '50%',
//                         text: [
//                             { text: 'Bill To\n', style: 'bold' },
//                             { text: `${selectedClient?.company_name || 'Client Name'}\n${selectedClient?.address_line1}\n${selectedClient?.address_line2}\n${selectedClient?.city} ${selectedClient?.pincode}, ${selectedClient?.state}\n${selectedClient?.email}\n${selectedClient?.phone}` },
//                         ],
//                     },
//                 ],
//                 columnGap: 20,
//                 margin: [0, 20],
//             },

//             // Invoice Items Table
//             {
//                 table: {
//                     headerRows: 1,
//                     widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
//                     body: [
//                         ['No', 'Item', 'Quantity', 'Price', 'Total'],
//                         ...formData.items.map((item, index) => [
//                             index + 1,
//                             item.name,
//                             item.qty,
//                             item.price,
//                             (item.qty ??0) * (item.price ?? 0),
//                         ]),
//                     ]
//                 },
//                 layout: {
//                     hLineWidth: function(i, node) {
//                         return i === 0 ? 1 : 0.5; // Highlight first line for the header
//                     },
//                     vLineWidth: function(i) {
//                         return 0.5;
//                     },
//                     hLineColor: function(i) {
//                         return (i === 0) ? accentColor : textColor; // Accent color for the header
//                     },
//                     paddingTop: function(i) {
//                         return 10; // Consistent padding for all rows
//                     },
//                     paddingBottom: function(i) {
//                         return 10;
//                     }
//                 },
//                 margin: [0, 20],
//             },

//             // Total Section
//             {
//                 columns: [
//                     {
//                         width: '50%',
//                         text: 'Payment Info:\n' + `Account Name: ${userSettings?.bank_acc_name}\nAccount Number: ${userSettings?.bank_acc_num}\nBank Name: ${userSettings?.bank_name}\nIFSC: ${userSettings?.bank_ifsc_code}`,
//                     },
//                     {
//                         width: '50%',
//                         text: [
//                             { text: 'Sub Total: ', style: 'bold' },
//                             { text: `₹${formData.items.reduce((total, item) => total + (item.qty ??0) * (item.price ??0), 0)}` },
//                             '\n\n',
//                             { text: 'Grand Total: ', style: 'bold' },
//                             { text: `₹${formData.items.reduce((total, item) => total + (item.qty ??0) * (item.price ??0), 0) + Number(calculateGstAmount(invoiceItems.reduce((total, item) => total + (item.qty ?? 0) * (item.price ?? 0), 0))) - Number(calculateDiscountAmount(invoiceItems.reduce((total, item) => total + ((item.qty ?? 0) * (item.price ?? 0)), 0)))}` },
//                         ],
//                         alignment: 'right',
//                     },
//                 ],
//                 margin: [0, 20],
//             },
//         ],

//         // Define styles to match UI
//         styles: {
//             header: {
//                 fontSize: 18,
//                 bold: true,
//                 color: textColor,
//                 // font: 'CustomFont',  // Using the custom font here if needed
//                 margin: [0, 10],
//             },
//             subHeader: {
//                 fontSize: 14,
//                 color: textColor,
//                 margin: [0, 5],
//             },
//             bold: {
//                 fontSize: 12,
//                 bold: true,
//                 color: textColor,
//             },
//             footer: {
//                 fontSize: 12,
//                 color: textColor,
//                 background:bgColor,
//                 margin: [0, 10],
//             },
//         },

//         // Page margins to match the UI layout
//         pageMargins: [40, 40, 40, 40],

//         // Add page number to the footer
//         footer: (currentPage, pageCount) => {
//             return [
//                 {
//                   text: `Thank you for choosing ${user?.company_name}`,
//                     alignment: 'center',
//                     fontSize: 20,
//                     margin: [0, 10],
//                     color: textColor,
//                     background:bgColor
//                 }
//             ];
//         },
//     };

//     // Create PDF
//     const pdfDocGenerator = pdfMake.createPdf(docDefinition);
//     pdfDocGenerator.download('invoice.pdf');
// };

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
  const signature = await fetchImageAsBase64(`${process.env.NEXT_PUBLIC_BASE_URL}${userSettings?.signature_image}`)
  const qr = await fetchImageAsBase64(`${process.env.NEXT_PUBLIC_BASE_URL}${userSettings?.qr_code}`)
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
                margin:[0, 0, 0, 40]
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
                  {
                    text: `INVOICE:#${userSettings?.inv_prefix}${invoiceNumber}`,
                    alignment: 'right',
                    margin:[0, 40, 0, 0]
                  },
                  {
                    text: `Date: ${moment(invoiceDate).format('DD-MM-YYYY')}`,
                    alignment: 'right',
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
                    text: type === 'add' ? selectedClient?.company_name : invoiceData?.customer.company_name,
                    style: 'subheader',
                  },
                  {
                    text: type === 'add'
                      ? `${selectedClient?.address_line1}`
                      : `${invoiceData?.customer.address_line1}`,
                    style: 'normal',
                  },
                  {
                    text: type === 'add'
                      ? `${selectedClient?.address_line2},`
                      : `${invoiceData?.customer.address_line2},`,
                    style: 'normal',
                  },
                  {
                    text: type === 'add'
                      ? `${selectedClient?.city} ${selectedClient?.pincode}, ${selectedClient?.state}`
                      : `${invoiceData?.customer.city} ${invoiceData?.customer.pincode}, ${invoiceData?.customer.state}`,
                    style: 'normal',
                  },
                  {
                    text: type === 'add' ? selectedClient?.email : invoiceData?.customer.email,
                    style: 'normal',
                  },
                  {
                    text: type === 'add' ? selectedClient?.phone : invoiceData?.customer.phone,
                    style: 'normal',
                  },
                  ...(type !== 'view' && invoiceData?.customer?.gstin ? [{ text: `GST: ${invoiceData?.customer.gstin}`, style: 'normal' }] : []),
                ],
              },
            ],
          },
        ],
        margin: [0, 0, 0, 20],
      },      

      // Table for Invoice Items
      {
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto', 'auto', 'auto'],
          body: [
            [
              { text: 'No', style: 'tableHeader' },
              { text: 'Name', style: 'tableHeader' },
              { text: 'Quantity', style: 'tableHeader' },
              { text: 'Price', style: 'tableHeader' },
              { text: 'Total', style: 'tableHeader' },
            ],
            ...invoiceItems.map((item, index) => [
              { text: index + 1, style: 'tableData' },
              { text: type === 'view' ? item.name : { text: item.name, editable: true }, style: 'tableData' },
              { text: type === 'view' ? item.qty : { text: item.qty, editable: true }, style: 'tableData' },
              { text: type === 'view' ? item.price : { text: item.price, editable: true }, style: 'tableData' },
              { text: (item.qty ?? 0) * (item.price ?? 0), style: 'tableData' },
            ]),
          ],
        },
        margin: [0, 0, 0, 20],
      },

      // Payment Info
      {
        stack: [
          { columns: [{ text: 'Payment Info:', style: 'header' }] },
          { 
            columns: [
              { text: `Account Name: ${userSettings?.bank_acc_name}`, style: 'normal', width: '75%' },
              { text: `Sub Total: ₹${invoiceItems.reduce((total, item) => total + (item.qty ?? 0) * (item.price ?? 0), 0)}`, style: 'bold', alignment: 'left', width: '25%' }
            ]
          },
          { 
            columns: [
              { text: `Account Number: ${userSettings?.bank_acc_name}`, style: 'normal', width: '75%' },
              calculateGstAmount(invoiceItems.reduce((total, item) => total + (item.qty ?? 0) * (item.price ?? 0), 0))!=0?{ text: `GST: ₹${calculateGstAmount(invoiceItems.reduce((total, item) => total + (item.qty ?? 0) * (item.price ?? 0), 0))}`, style: 'bold', alignment: 'left', width: '25%' }:{ text: ``, style: 'bold', alignment: 'right', width: '25%' }
            ]
          },
          { 
            columns: [
              { text: `Bank Name: ${userSettings?.bank_name}`, style: 'normal', width: '75%' },
              calculateDiscountAmount(invoiceItems.reduce((total, item) => total + (item.qty ?? 0) * (item.price ?? 0), 0)) !=0 ?{ text: `Discount: ₹${calculateDiscountAmount(invoiceItems.reduce((total, item) => total + (item.qty ?? 0) * (item.price ?? 0), 0))}`, style: 'bold', alignment: 'left', width: '25%' }:{ text: ``, style: 'bold', alignment: 'left', width: '25%' }
            ]
          },
          { 
            columns: [
              { text: `IFSC: ${userSettings?.bank_ifsc_code}`, style: 'normal', width: '75%' },
              { text: `Grand Total: ₹${calculateGrandTotal()}`, style: 'bold', alignment: 'left', width: '25%' }
            ]
          },
        ],
        margin: [0, 0, 0, 20],
      },

      // Footer Note
      {
        text: `   ${userSettings?.invoice_notes_1}    `,
        style: 'footerNote',
        alignment: 'right',
        margin: [0, 0, 0, 10],
      },
      {
        text: `   ${userSettings?.invoice_notes_2}    `,
        style: 'footerNote',
        alignment: 'right',
        margin: [0, 0, 0, 20],
      },

      {
        stack: [
          { columns:[{text: 'Digital Payment Info:', style: 'header' }]},
          { columns:[{image: qr,width: 100,height: 100, style: 'normal' },{text: '', style: 'header',width:'*' },{ image: signature, width: 100, height: 50, style: 'bold', alignment: 'right' }]},
          { columns:[{ text: `UPI ID: ${userSettings?.upi_pin}`, style: 'normal',margin: [0, 10, 0, 0] },{ text: {text: 'Authorized Signature', style: 'signatureText', alignment: 'right', width: 'auto' }, style: 'bold', alignment: 'right',margin: [0, -40, 0, 0] }]},
          { columns:[{ text: `Google Pay Number: ${userSettings?.g_pay}`, style: 'normal',margin: [0, 10, 0, 0] },{ text: `${userSettings?.signature_name}`, style: 'bold', alignment: 'right', margin: [0, -40, 25, 2] }]},
          { columns:[{ text: `[${userSettings?.signature_designation}]`, style: 'bold', alignment: 'right', margin: [0, -40, 25, 2] }]},
          
        ],
        margin: [0, 0, 0, 20],
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
            <div className="mb-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold" style={{ color: userSettings?.inv_secondary_color }}>
                  INVOICE:#{userSettings?.inv_prefix}{type==="view"&&invoiceNumber}
                </h1>
                {(type === "add" || type==="update")&&<Input
                  label="Invoice Number"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  max={5}
                />}
              </div>
            </div>
            <h1 className="text-xl font-bold" style={{ color: userSettings?.inv_secondary_color }}>
              Date: {type==="view"&&moment(invoiceDate).format('DD-MM-YYYY')}
              </h1>
              {(type === "add" || type==="update")&&<Input
                  type="date"
                  label="Invoice Date"
                  value={invoiceDate}
                  onChange={(e) => {console.log(e.target.value);setInvoiceDate(e.target.value)}}
                  max={5}
                />}
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
              {user?.gst &&<h6 className="text-sm font-normal">
                GST: {user?.gst}
              </h6>}
            </div>
          </div>

          {/* Right side: Two h1 elements */}
          {type==="add"?
          (<div className="flex items-center gap-4">
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
          </div>):(
            <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-bold">
                Bill To
              </h1>
              <h6 className="text-xl font-bold" style={{ color: '#019eed' }}>
                {invoiceData?.customer.company_name}
              </h6>
              <h6 className="text-sm font-normal">
                {invoiceData?.customer.address_line1}
              </h6>
              <h6 className="text-sm font-normal">
                {invoiceData?.customer.address_line2}
              </h6>
              <h6 className="text-sm font-normal">
                {invoiceData?.customer.city} {invoiceData?.customer.pincode}, {invoiceData?.customer.state}
              </h6>
              <h6 className="text-sm font-normal">
                {invoiceData?.customer.email}
              </h6>
              <h6 className="text-sm font-normal">
                {invoiceData?.customer.phone}
              </h6>
              {invoiceData?.customer?.gstin &&<h6 className="text-sm font-normal">
                GST: {invoiceData?.customer.gstin}
              </h6>}
            </div>
          </div>
          )
          }
        </div>
      </div>

      {/* Invoice Items Table */}
      <Table aria-label="Invoice Items" className="p-10">
        <TableHeader>
          <TableColumn>No</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Quantity</TableColumn>
          <TableColumn>Price</TableColumn>
          <TableColumn>Total</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody>
          {invoiceItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                {index+1}
              </TableCell>
              <TableCell>
                {(type==="add"|| type==="update")&&<Input
                  value={item.name}
                  onChange={(e) => {
                    const updatedItems = [...invoiceItems];
                    updatedItems[index].name = e.target.value;
                    setInvoiceItems(updatedItems);
                  }}
                  max={50}
                />}
                {type==="view"&&item.name}
              </TableCell>
              <TableCell>
                {(type==="add"|| type==="update")&&<Input
                  type="number"
                  value={String(item.qty)}
                  onChange={(e) => {
                    const updatedItems = [...invoiceItems];
                    updatedItems[index].qty = Number(e.target.value);
                    setInvoiceItems(updatedItems);
                  }}
                  // max={8}
                />}
                {type==="view"&&item.qty}
              </TableCell>
              <TableCell>
                {(type==="add"|| type==="update")&&<Input
                  type="number"
                  value={String(item.price)}
                  onChange={(e) => {
                    const updatedItems = [...invoiceItems];
                    updatedItems[index].price = Number(e.target.value);
                    setInvoiceItems(updatedItems);
                  }}
                  // max={10}
                />}
                {type==="view"&&item.price}
              </TableCell>
              <TableCell>{(item.qty ?? 0) * (item.price ?? 0)}</TableCell>
              <TableCell>
              {(type==="add"|| type==="update")&&index === invoiceItems.length - 1 && (
                <>
                <button onClick={() => handleAddItem()}>
                  <ExportIcon  />
                </button>
                <button onClick={() => handleDeleteItem(index)}>
                  <DeleteIcon size={20} fill="#FF0080" />
                </button>
                </>
              )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add Item Row */}
      {/* <TableRow>
        <TableCell>
          <Input
            label="Item Name"
            value=""
            onChange={(e) => handleAddItem(e.target.value, 0, 0)}
          />
        </TableCell>
        <TableCell>
          <Input
            label="Quantity"
            type="number"
            value="0"
            onChange={(e) => handleAddItem("", Number(e.target.value), 0)}
          />
        </TableCell>
        <TableCell>
          <Input
            label="Price"
            type="number"
            value="0"
            onChange={(e) => handleAddItem("", 0, Number(e.target.value))}
          />
        </TableCell>
        <TableCell colSpan={2}>
          <Button onPress={() => handleAddItem("", 0, 0)}>Add Item</Button>
        </TableCell>
      </TableRow> */}

      {/* Total */}
      <div className="p-10 mt-4 flex justify-between">
        <div className="flex flex-col" >
          <div className="font-bold">Payment Info:</div>
          <div className="mt-4 flex justify-between text-start">
            <div className="font-bold">Account Name:</div>
            <div className="font-normal">
              {userSettings?.bank_acc_name}
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <div className="font-bold">Account Number:</div>
            <div className="font-normal">
              {userSettings?.bank_acc_name}
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <div className="font-bold">Bank Name:</div>
            <div className="font-normal">
              {userSettings?.bank_name}
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <div className="font-bold">IFSC:</div>
            <div className="font-normal">
              {userSettings?.bank_ifsc_code}
            </div>
          </div>
        </div>

        {/* Sub Total and Grand Total on the right */}
        <div className="flex flex-col">
          <div className="mt-4 flex justify-end">
            <div className="mx-1 w-2/4">
              <div className="font-bold">Sub Total:</div>
            </div>
            <div className="font-bold">
              ₹{invoiceItems.reduce((total, item) => total + (item.qty ?? 0) * (item.price ?? 0), 0)}
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            {(type==="add"|| type==="update")&&<div  className="mx-1 w-2/4">
              <Input
                label="GST"
                value={String(gst)}
                onChange={(e) => setGst(Number(e.target.value))}
                max={6}
              />
            </div>}
            {(type==="add"|| type==="update")&&<div  className=" mx-1 w-2/4">
              <Select
                isRequired
                className="max-w-xs"
                selectedKeys={[gstType]}
                label="type"
                placeholder="Type"
                onChange={(e)=>{console.log(e.target.value);setGstType(e.target.value as "number" | "percentage")}}
              >
                  <SelectItem key={'number'}>₹</SelectItem>
                  <SelectItem key={'percentage'}>%</SelectItem>
              </Select>
            </div>}
            {type==="view"&&<div  className="mx-1 w-3/4 font-bold">
              GST   {String(gst)} {gstType === "percentage" ? "%" : "₹"}:
            </div>}
            <div className="font-bold w-1/4 text-right">
              {/* {invoiceItems.reduce((total, item) => total + item.qty * item.price, 0)} */}
              ₹{calculateGstAmount(invoiceItems.reduce((total, item) => total + (item.qty ?? 0) * (item.price ?? 0), 0))}
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            {(type==="add"|| type==="update")&&<div  className="mx-1 w-2/4">
              <Input
                label="Discount"
                value={String(discount)}
                onChange={(e) => setDiscount(Number(e.target.value))}
                max={8}
              />
            </div>}
            {(type==="add"|| type==="update")&&<div  className=" mx-1 w-2/4">
              <Select
                isRequired
                className="max-w-xs"
                selectedKeys={[discountType]}
                label="type"
                placeholder="Type"
                onChange={(e)=>setDiscountType(e.target.value as "number" | "percentage")}
              >
                  <SelectItem key={'number'}>₹</SelectItem>
                  <SelectItem key={'percentage'}>%</SelectItem>
              </Select>
            </div>}
            {type==="view"&&<div  className="mx-1 w-3/4 font-bold">
              Discount   {String(discount)} {discountType === "percentage" ? "%" : "₹"}:
            </div>}
          <div className="font-bold w-1/4 text-right">
              {/* {invoiceItems.reduce((total, item) => total + item.qty * item.price, 0)} */}
              ₹{calculateDiscountAmount(invoiceItems.reduce((total, item) => total + (item.qty ?? 0) * (item.price ?? 0), 0))}
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <div className="mx-1 w-2/4">
              <div className="font-bold">Grand Total:</div>
            </div>
            <div className="font-bold">
              ₹{calculateGrandTotal()}
            </div>
          </div>
        </div>
      </div>

      {userSettings?.invoice_notes_1&&<div className="w-full flex justify-end">
        <div className="p-1 my-2 mr-10 w-4/5 text-center" style={{ background: "grey", color:'#ffffff' }}>
          {userSettings?.invoice_notes_1}
        </div>
      </div>}
      {userSettings?.invoice_notes_2&&<div className="w-full flex justify-end">
        <div className="p-1 my-2 mr-10 w-4/5 text-center" style={{ background: "grey", color:'#ffffff' }}>
          {userSettings?.invoice_notes_2}
        </div>
      </div>}

      <div className="p-10 mt-4 flex justify-between">
        <div className="flex flex-col">
          <div className="font-bold">Digital Payment Info:</div>
        <div className="mt-4 flex justify-center">
          <img src={`${process.env.NEXT_PUBLIC_BASE_URL}${userSettings?.qr_code}`} alt="Qr code" width="150" height="50" />
          </div>
          <div className="mt-4 flex justify-start">
            <div className="font-bold">UPI ID:</div>
            <div className="font-normal">
              {userSettings?.upi_pin}
            </div>
          </div>
          <div className="mt-4 flex justify-start">
            <div className="font-bold">Google Pay Number:</div>
            <div className="font-normal">
              {userSettings?.g_pay}
            </div>
          </div>
        </div>

        {/* Sub Total and Grand Total on the right */}
        <div className="flex flex-col">
          <div className="mt-4 flex justify-center">
          <img src={`${process.env.NEXT_PUBLIC_BASE_URL}${userSettings?.signature_image}`} alt="Company Signature" width="150" height="50" />
          </div>
          <div className="mt-4 flex justify-center">
            <div className="font-bold">Authorized Signature</div>
          </div>
          <div className="mt-4 flex justify-center">
            <div className="font-bold">{userSettings?.signature_name}</div>
          </div>
          <div className="mt-4 flex justify-center">
            <div className="font-bold">[{userSettings?.signature_designation}]</div>
          </div>
        </div>
      </div>

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
