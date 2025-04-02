import { User, Tooltip, Chip } from "@heroui/react";
import React from "react";
import { DeleteIcon } from "../icons/table/delete-icon";
import { EditIcon } from "../icons/table/edit-icon";
import { EyeIcon } from "../icons/table/eye-icon";
import { invoices } from "./invoiceData";
import { AddInvoice } from "../invoices/add-invoice";
import { Invoice } from "@/helpers/types";
import { useRouter } from "next/navigation";
import { PaymentsIcon } from "../icons/sidebar/payments-icon";

interface Props {
  setCount: React.Dispatch<React.SetStateAction<number>>;
  deleteInvoice: (id: number) => void;
  invoice: (Invoice);
  columnKey: string | React.Key;
}

export const RenderInvoiceCell = ({ invoice, columnKey, setCount, deleteInvoice }: Props) => {
  const router = useRouter();
  console.log('invoice data',invoice)
  // @ts-ignore
  const cellValue = invoice[columnKey];
  switch (columnKey) {
    case "company_name":
      return (
        <div>
          <div>
            <span>{invoice.customer.company_name ? invoice.customer.company_name:invoice.customer.first_name}</span>
          </div>
        </div>
      );
    case "inv_number":
      return (
        <div>
          <div>
            <span>{invoice.inv_number}</span>
          </div>
        </div>
      );
    case "qty":
      return (
        <div>
          <div>
          <span>{invoice.items.reduce((total, item) => total + item.quantity, 0)}</span>
          </div>
        </div>
      );
    // case "qty":
    //   return (
    //     <Chip
    //       size="sm"
    //       variant="flat"
    //       color={
    //         cellValue === "active"
    //           ? "success"
    //           : cellValue === "paused"
    //           ? "danger"
    //           : "warning"
    //       }
    //     >
    //       <span className="capitalize text-xs">{invoice.inv_number}</span>
    //     </Chip>
    //   );
      case "inv_total":
      return (
        <div>
          <div>
            <span>{invoice.inv_total}</span>
          </div>
        </div>
      );

    case "actions":
      return (
        <div className="flex items-center gap-4 ">
          <div>
            <Tooltip content="Details">
              <button onClick={() => router.replace(`/income-expense/${invoice?.id}`)}>
                <PaymentsIcon  />
              </button>
            </Tooltip>
          </div>
          <div>
            <Tooltip content="Details">
              <button onClick={() => router.replace(`/invoices/view/${invoice?.id}`)}>
                <EyeIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
          </div>
          <div>
            <Tooltip content="Edit invoice" color="secondary">
                <button onClick={() => router.replace(`/invoices/edit/${invoice?.id}`)}>
                    {/* <AddInvoice type="update"/> */}
                    <EditIcon size={20} fill="#979797" />
                </button>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              content="Delete user"
              color="danger"
              onClick={() => console.log("Delete invoice", invoice.id)}
            >
              <button onClick={()=>{ deleteInvoice(invoice?.id)}}>
                <DeleteIcon size={20} fill="#FF0080" />
              </button>
            </Tooltip>
          </div>
        </div>
      );
    default:
      return cellValue;
  }
};
