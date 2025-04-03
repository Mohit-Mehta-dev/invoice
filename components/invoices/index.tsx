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
import { AddInvoice } from "./add-invoice";
import { InvoiceTableWrapper } from "../invoiceTable/invoiceTable";
import { useRouter } from "next/navigation";
import { AddIncomeExpense } from "../incomeExpense/add-income-expense";
import { CashReceipt } from "../incomeExpense/cash-receipt";

export const Invoices = () => {
  const [count, setCount] = useState(0)
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleCreateInvoiceClick = () => {
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
          <span>Invoices</span>
          {/* <span> / </span>{" "} */}
        </li>
        {/* <li className="flex gap-2">
          <span>List</span>
        </li> */}
      </ul>

      <h3 className="text-xl font-semibold">All Invoices</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            value={searchQuery}
            onChange={(e)=>setSearchQuery(e.target.value)}
            placeholder="Search users"
          />
          {/* <SettingsIcon />
          <TrashIcon />
          <InfoIcon />
          <DotsIcon /> */}
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          {/* <AddInvoice type={'add'} /> */}
          {/* <CashReceipt type={'add'} /> */}
          {/* <Button color="primary" startContent={<ExportIcon />}>
            Export to CSV
          </Button> */}
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <InvoiceTableWrapper searchQuery={searchQuery} setSearchQuery={setSearchQuery} setCount={setCount} count={count} />
      </div>
    </div>
  );
};
