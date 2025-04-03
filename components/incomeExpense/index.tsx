"use client";
import { Button, Input } from "@heroui/react";
import Link from "next/link";
import React, { useState } from "react";
import { DotsIcon } from "@/components/icons/accounts/dots-icon";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { InfoIcon } from "@/components/icons/accounts/info-icon";
import { TrashIcon } from "@/components/icons/accounts/trash-icon";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import { SettingsIcon } from "@/components/icons/sidebar/settings-icon";
import { useRouter } from "next/navigation";
import { IncomeExpenseTableWrapper } from "../incomeExpenseTable/incomeExpenseTable";
import { CashReceipt } from "./cash-receipt";

export const IncomeExpense = () => {
  const router = useRouter();
  const [count,setCount] = useState();

  const handleCreateCashReceiptClick = () => {
    router.push("/invoice");
  };


  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex">
        <li className="flex gap-2">
          <HouseIcon />
          <Link href={"/"}>
            <span>Home</span>
          </Link>
          <span> / </span>{" "}
        </li>

        <li className="flex gap-2">
          <UsersIcon />
          <span>Income-Expense</span>
          {/* <span> / </span>{" "} */}
        </li>
        {/* <li className="flex gap-2">
          <span>List</span>
        </li> */}
      </ul>

      <h3 className="text-xl font-semibold">All Income / Expenses</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Search users"
          />
          <SettingsIcon />
          <TrashIcon />
          <InfoIcon />
          <DotsIcon />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          {/* <AddInvoice type={'add'} /> */}
          <CashReceipt type="add" setCount={setCount} />
          {/* <Button color="primary" startContent={<ExportIcon />} onPress={handleCreateCashReceiptClick}>
            Cash Receipt
          </Button> */}
          {/* <Button color="primary" startContent={<ExportIcon />}>
            Export to CSV
          </Button> */}
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <IncomeExpenseTableWrapper />
      </div>
    </div>
  );
};
