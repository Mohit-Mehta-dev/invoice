"use client";
import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { TableWrapper } from "../table/table";
import { CardBalance1 } from "./card-balance1";
import { CardBalance2 } from "./card-balance2";
import { CardBalance3 } from "./card-balance3";
import { CardAgents } from "./card-agents";
import { CardTransactions } from "./card-transactions";
import { addToast, Link } from "@heroui/react";
import NextLink from "next/link";
import { CardCounter } from "./card-counter";
import { AxiosError } from "axios";
import { getDashboardById } from "@/services/dashboardService";
import { getAuthFromLocalStorage } from "@/utils/localStorageUtils";
import { User } from "@/helpers/types";

const Chart = dynamic(
  () => import("../charts/steam").then((mod) => mod.Steam),
  {
    ssr: false,
  }
);

export const Content = () => {

  interface DashboardData {
    totalCustomers: number;
    totalInvoiceValue:number;
    totalCashValue:number;
    totalInvoices:number;
    totalGstValue:number;
    totalExpenseValue:number;
  }
  
const [user, setUser] = useState<User | null>(null);
const [dashboardData, setDashboardData] = useState<DashboardData| null>(null);


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
    let response = await getDashboardById(id);
    console.log("response", response);
    setDashboardData(response.data)
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
  <div className="h-full lg:px-6">
    <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0  flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
      <div className="mt-6 gap-6 flex flex-col w-full">
        {/* Card Section Top */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold">Dashboard</h3>
          <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-5  justify-center w-full">
            <CardCounter text={'customer'} value={dashboardData?.totalCustomers??0} />
            <CardCounter text={'Total Amount'} value={dashboardData?.totalInvoiceValue??0} />
            <CardCounter text={'Total Cash'} value={dashboardData?.totalCashValue??0} />
            <CardCounter text={'Total Invoice'} value={dashboardData?.totalInvoices??0} />
            <CardCounter text={'Total GST'} value={dashboardData?.totalGstValue??0} />
            <CardCounter text={'Total Discount'} value={dashboardData?.totalCashValue??0} />
            <CardCounter text={'Total Dues'} value={0} />
            <CardCounter text={'Total Expences'} value={dashboardData?.totalExpenseValue??0} />
          </div>
        </div>

        {/* Chart */}
        {/* <div className="h-full flex flex-col gap-2">
          <h3 className="text-xl font-semibold">Statistics</h3>
          <div className="w-full bg-default-50 shadow-lg rounded-2xl p-6 ">
            <Chart />
          </div>
        </div> */}
      </div>

      {/* Left Section */}
      <div className="mt-4 gap-2 flex flex-col xl:max-w-md w-full">
        <h3 className="text-xl font-semibold">Section</h3>
        <div className="flex flex-col justify-center gap-4 flex-wrap md:flex-nowrap md:flex-col">
          {/* <CardAgents /> */}
          <CardTransactions />
        </div>
      </div>
    </div>

    {/* Table Latest Users */}
    <div className="flex flex-col justify-center w-full py-5 px-4 lg:px-0  max-w-[90rem] mx-auto gap-3">
      <div className="flex  flex-wrap justify-between">
        <h3 className="text-center text-xl font-semibold">Recent Users</h3>
        {/* <Link
          href="/accounts"
          as={NextLink}
          color="primary"
          className="cursor-pointer"
        >
          View All
        </Link> */}
      </div>
      <TableWrapper />
    </div>

    <div className="flex flex-col justify-center w-full py-5 px-4 lg:px-0  max-w-[90rem] mx-auto gap-3">
      <div className="flex  flex-wrap justify-between">
        <h3 className="text-center text-xl font-semibold">Top Customers</h3>
        {/* <Link
          href="/accounts"
          as={NextLink}
          color="primary"
          className="cursor-pointer"
        >
          View All
        </Link> */}
      </div>
      <TableWrapper />
    </div>
  </div>
)
}
