import { User, Tooltip, Chip } from "@heroui/react";
import React from "react";
import { DeleteIcon } from "../icons/table/delete-icon";
import { EditIcon } from "../icons/table/edit-icon";
import { EyeIcon } from "../icons/table/eye-icon";
import { IncomeExpense, Invoice } from "@/helpers/types";
import { useRouter } from "next/navigation";
import moment from "moment";
import { CashReceipt } from "../incomeExpense/cash-receipt";

interface Props {
  setCount: React.Dispatch<React.SetStateAction<number>>;
  deleteInvoice: (id: number) => void;
  incomeExpense: (IncomeExpense);
  columnKey: string | React.Key;
}

export const RenderIncomeExpenseCell = ({ incomeExpense, columnKey, setCount, deleteInvoice }: Props) => {
  const router = useRouter();
  console.log('invoice data',incomeExpense)
  // @ts-ignore
  const cellValue = incomeExpense[columnKey];
  switch (columnKey) {
    case "company_name":
      return (
        <div>
          <div>
            <span>{incomeExpense?.customer?.company_name ? incomeExpense?.customer?.company_name:incomeExpense?.customer?.first_name}</span>
          </div>
        </div>
      );
    case "pay_for":
      return (
        <div>
          <div>
            <span>{incomeExpense.pay_for}</span>
          </div>
        </div>
      );
    case "credit_amount":
      return (
        <div>
          <div>
          <span>{incomeExpense.credit_amount===null?"0":incomeExpense.credit_amount}</span>
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
      case "debit_amount":
      return (
        <div>
          <div>
            <span>{incomeExpense.debit_amount === null ? '0':incomeExpense.debit_amount}</span>
          </div>
        </div>
      );
      case "payment_type":
      return (
        <div>
          <div>
            <span>{incomeExpense.payment_type }</span>
          </div>
        </div>
      );
      case "payment_date":
      return (
        <div>
          <div>
          <span>{moment(incomeExpense.payment_date).format('DD-MM-YYYY')}</span>
          </div>
        </div>
      );

    case "actions":
      return (
        <div className="flex items-center gap-4 ">
          <div>
            <Tooltip content="Details">
              <button
               onClick={() => router.replace(`/cash-receipt/view/${incomeExpense?.id}`)}
               >
                {/* <CashReceipt type="view" setCount={setCount}  /> */}
                <EyeIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
          </div>
          {/* <div>
            <Tooltip content="Edit invoice" color="secondary">
                <button onClick={() => router.replace(`/invoices/edit/${incomeExpense?.id}`)}> */}
                    {/* <AddInvoice type="update"/> */}
                    {/* <EditIcon size={20} fill="#979797" />
                </button>
            </Tooltip>
          </div> */}
          <div>
            <Tooltip
              content="Delete user"
              color="danger"
              onClick={() => console.log("Delete invoice", incomeExpense.id)}
            >
              <button onClick={()=>{ deleteInvoice(incomeExpense?.id)}}>
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
