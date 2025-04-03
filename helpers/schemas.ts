import { array, date, number, object, ref, string } from "yup";

export const LoginSchema = object().shape({
  email: string()
    // .email("This field must be an email")
    .required("Email is required"),
  password: string().required("Password is required"),
});

export const RegisterSchema = object().shape({
  first_name: string().required("First Name is required"),
  last_name: string().required("Last Name is required"),
  username: string().required("Username is required"),
  phone: string().required("Phone is required").matches(/^[0-9]{10}$/, "Phone Number must be 10 digits"),
  email: string()
    .email("This field must be an email")
    .required("Email is required"),
  company_name: string().required("Company Name is required"),
  password: string().required("Password is required"),
});

export const ClientSchema = object().shape({
  firstName: string().required("First Name is required"),
  lastName: string().required("Last Name is required"),
  companyName: string().optional(),
  phoneNumber: string().required("Phone Number is required").matches(/^[0-9]{10}$/, "Phone Number must be 10 digits"),
  email: string().email("This field must be an email").required("Email is required"),
  addressLine1: string().required("Address Line 1 is required"),
  addressLine2: string().optional(),
  city: string().required("City is required"),
  state: string().optional(),
  pincode: string().optional().matches(/^[0-9]{6}$/, "Pincode must be 6 digits"),
  gstNumber: string().optional(),
});

export const AddInvoiceSchema = object().shape({
  client_id: string().required("Client is required"),
  inv_number: number().required("Invoice number is required"),
  inv_date: date().required("Invoice date is required"),
  items: array()
    .of(
      object().shape({
        name: string().required("Item name is required"),
        qty: number().required("Quantity is required").positive("Quantity must be greater than 0"),
        price: number().required("Price is required").positive("Price must be greater than 0"),
      })
    )
    .min(1, "At least one item is required")
})

export const ReceiptSchema = object().shape({
  customer_id: number().required("select customer"),
  pay_for:string().required("Payment for is required"),
  credit_amount:string().required("amount is required"),
  debit_amount:string().required("amount is required"),
  payment_type:string().required("payment Type is required"),
  payment_date:string().required("payment date is required"),
  additional_note:string().optional(),
});