// FORMS

import { DateValue } from "@heroui/react";

export type LoginFormType = {
  email: string;
  password: string;
};

export type RegisterFormType = {
  first_name:string;
  last_name:string;
  username:string;
  phone:string;
  email:string;
  company_name:string;
  password:string;
};

export type ClientFormType = {
  firstName: string;
  lastName: string;
  companyName: string;
  phoneNumber: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  gstNumber: string;
};

export type LoginResponse = {
  status: string;
  message: string;
  token: string;
  data: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    phone: string;
    email: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    gst: string | null;
    profile: string | null;
    company_name: string;
    company_logo: string | null;
    email_verified_at: string | null;
    is_admin: number;
    status: number;
    password: string;
    remember_token: string | null;
    created_at: string;
    updated_at: string;
  };
}

export type User = {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    phone: string;
    email: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    gst: string | null;
    profile: string | null;
    company_name: string;
    company_logo: string | null;
    email_verified_at: string | null;
    is_admin: number;
    status: number;
    password: string;
    remember_token: string | null;
    created_at: string;
    updated_at: string;
}

export type UserSettings = {
  acc_type: string;
  bank_acc_name: string;
  bank_acc_num: string;
  bank_branch: string;
  bank_ifsc_code: string;
  bank_name: string;
  company_id: number;
  g_pay: string;
  gst_per_item: string;
  id: number;
  inv_pdf_style: number;
  inv_prefix: string;
  inv_primary_color: string;
  inv_secondary_color: string;
  invoice_notes_1: string;
  invoice_notes_2: string;
  logo: string;
  qr_code: string;
  signature_designation: string;
  signature_image: string;
  signature_name: string;
  tagline: string;
  upi_pin: string;
  created_at: string;
  updated_at: string;
}

export type Client = {
  id: number;
  company_id: number;
  first_name: string;
  last_name: string;
  username: string;
  company_name: string;
  phone: string;
  email: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
  gstin: string;
  created_at: string;
  updated_at: string;
};

export type AddClient = {
  company_id: number;
  first_name: string;
  last_name: string;
  username: string;
  company_name: string;
  phone: string;
  email: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
  gstin: string;
};

export type Invoice = {
  id: number;
  customer_id: number;
  company_id: number;
  inv_prefix: string;
  inv_number: string;
  inv_subtotal: string;
  inv_gst_pr: string;
  inv_gst_amount: string;
  inv_total: string;
  inv_date: string;
  created_at: string;
  updated_at: string;
  items: InvoiceItem[];
  customer: Client;
};

export type InvoiceItem = {
  id: number;
  inv_id: number;
  item: string;
  quantity: number;
  price: string;
  gst_pr: string | null;
  gst_amount: string | null;
  item_total: string;
  created_at: string;
  updated_at: string;
};

export type InvoiceFormType = {
  company_id: number;
  customer_id: number;
  items:InvoiceFormItem[]
};

export type InvoiceFormItem = {
  name: string; 
  qty: number | null; 
  price: number | null
};

export type AddInvoice = {
  company_id: number;
  client_id: string;
  inv_number: string;
  gst:number;
  discount:number;
  // inv_date: DateValue;
  items:InvoiceFormItem[]
};


export type AddSettings = {
  acc_type:string;
  bank_acc_name:string;
  bank_acc_num:string;
  bank_branch:string;
  bank_ifsc_code:string;
  bank_name:string;
  g_pay:string;
  gst_per_item:number;
  inv_prefix:string;
  inv_primary_color:string;
  inv_secondary_color:string;
  invoice_notes_1:string;
  invoice_notes_2:string;
  logo:string;
  qr_code:string;
  signature_designation:string;
  signature_image:string;
  signature_name:string;
  tagline:string;
  upi_pin:string;
};

export type IncomeExpense = {
  id: number;
  customer_id: number;
  company_id: number;
  inv_id: number | null;
  inv_item_id: number | null;
  pay_to: string;
  pay_for: string;
  email: string;
  phone: string;
  company_name: string;
  address_line1: string;
  address_line2: string;
  additional_note: string;
  payment_type: string;
  debit_amount: string;
  credit_amount: number | null;
  payment_date: string;
  customer: Client;
  created_at: string;
  updated_at: string;
};

export type AddIncomeExpense = {
  company_id: number;
  customer_id: string;
  items:InvoiceFormItem[]
};

export type ReceiptFormType = {
  company_id: number;
  customer_id: string;
  pay_for:string;
  credit_amount:string | null;
  debit_amount:string | null;
  payment_type:string;
  payment_date:string;
  additional_note:string;
};