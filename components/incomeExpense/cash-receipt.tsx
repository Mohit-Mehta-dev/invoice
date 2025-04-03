import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { EditIcon } from "../icons/table/edit-icon";
import { Formik } from "formik";
import { Client, ClientFormType, ReceiptFormType, User } from "@/helpers/types";
import { ClientSchema, ReceiptSchema } from "@/helpers/schemas";
import { EyeIcon } from "../icons/table/eye-icon";
import { getClientById, getClients, postClients, putClients } from "@/services/clientService";
import { getAuthFromLocalStorage } from "@/utils/localStorageUtils";
import { postIncomeExpense, putInvoice } from "@/services/incomeExpenseService";

interface AddClientProps {
  setCount: React.Dispatch<React.SetStateAction<number>>;
  type: "add" | "view" | "update";
  id?:string,
  company_id?: number,
  customer_id?:string,
  pay_for?:string,
  credit_amount?:string,
  debit_amount?:string,
  payment_type?:string,
  payment_date?:string,
  additional_note?:string
}

export const CashReceipt: React.FC<AddClientProps> = ({
  setCount,
  id,
  type,
  company_id,
  customer_id,
  pay_for,
  credit_amount,
  debit_amount,
  payment_type,
  payment_date,
  additional_note,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();  // Destructure onOpen and onClose

  const [user, setUser] = useState<User | null>(null);
  const [clientList, setClientList] = useState([]);
  const [selectedClient, setSelectedClient] = useState<number>();
  const [receiptType, setReceiptType] = useState<string>('expense');
  const [paymentMode, setPaymentMode] = useState<string>('cash');
  // Initial values for the form
  const [initialValues, setInitialValues] = useState<ReceiptFormType>({
    company_id: 0,
    customer_id:'',
    pay_for:'',
    credit_amount:'',
    debit_amount:'',
    payment_type:'',
    payment_date:'',
    additional_note:''
  });

  useEffect(() => {
    const storedUser = getAuthFromLocalStorage();
    setUser(storedUser ? (storedUser as User) : null); // Safely set user
  }, []);

  useEffect(() => {
      if (user?.id) {
  
        if(type==="add" ){
          fetchClients(user.id);
        }else{
          setInitialValues({
            company_id: 0,
            customer_id:'',
            pay_for:pay_for,
            credit_amount:credit_amount,
            debit_amount:debit_amount,
            payment_type:payment_type,
            payment_date:payment_date,
            additional_note:additional_note  
          })
          
        }
      }
    }, [user]);


  // Handle client submission (add/update)
  const handleReceiptSubmit = useCallback(
    async (values: ReceiptFormType) => {
      console.log("Form data submitted:", values);
      if (!user?.id) {
        console.log("User ID is missing");
        return; // Or show an error message
      }

      const payment_items = [{
        pay_for:values.pay_for,
        credit_amount:Number(values.credit_amount),
        debit_amount:Number(values.debit_amount),
        payment_type:paymentMode,
        payment_date:values.payment_date,
        additional_note:values.additional_note
      }]

      const formData = {
        company_id:user.id,
        customer_id:selectedClient,
        items:payment_items
      };
      if (type === "add") {
        try {
        let response = await postIncomeExpense(formData);
        console.log("response", response);
        onOpenChange();
        setCount(prev => prev+1)
      } catch (err: unknown) {
        console.log("Adding Client error:", err);
      }
    }else if (type === "update") {
      console.log("id",id)
      try {
        let response = await putInvoice(formData, Number(id));
        console.log("put Client response", response);
        onOpenChange(); 
        setCount(prev => prev+1)
      } catch (err: unknown) {
        console.log("Adding Invoice error:", err);
      }
    }
    },
    [onOpenChange, setCount, selectedClient, id, type, user]
  );

  // const fetchClients = useCallback(async (id: number) => {
  //   try {
  //     let response = await postClients(id);
  //     console.log("response", response);
  //   } catch (err: unknown) {
  //     console.log("Adding Client error:", err);
  //   }, [addToast, setError]);

  const fetchClients = useCallback(async (id: number) => {
      try {
        let response = await getClients(id);
        setClientList(response);
      } catch (err) {
        console.error("Error fetching clients:", err);
      }
    }, []);

  return (
    <div>
      <>
      {
        type === "add" ? (
          <Button onPress={onOpen} color="primary">
            Add Receipt
          </Button>
        ) : type === "view" ? (
          <Button onPress={onOpen} variant="light" isIconOnly>
            <EyeIcon size={20} fill="#979797" />
          </Button>
        ) : (
          <Button onPress={onOpen} variant="light" isIconOnly>
            <EditIcon size={20} fill="#979797" />
          </Button>
        )
      }


        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                {type === "add" ? "Add Receipt" : type === "view" ? "Client Details" : "Update Receipt"}
                </ModalHeader>
                <ModalBody className="overflow-y-auto max-h-96">
                  <Formik
                    initialValues={initialValues}
                    // validationSchema={ReceiptSchema}
                    onSubmit={handleReceiptSubmit}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleSubmit,
                    }) => (
                      <form onSubmit={handleSubmit}>
                        <Select className="max-w-full" label="Select client" onChange={(e)=>setSelectedClient(Number(e.target.value))}>
                          {clientList.map((client) => (
                            <SelectItem key={client.id}>{client?.company_name?client?.company_name:client?.first_name}</SelectItem>
                          ))}
                        </Select>
                        <Input
                          variant="bordered"
                          label="Payment For"
                          value={values.pay_for}
                          isInvalid={!!errors.pay_for && !!touched.pay_for}
                          errorMessage={errors.pay_for}
                          onChange={handleChange("pay_for")}
                          className="mb-4"
                          readOnly={type==="view"}
                          max={40}
                        />
                        <Input
                          variant="bordered"
                          label="Amount"
                          value={String(receiptType) === 'expense'?  values.debit_amount:values.credit_amount}
                          isInvalid={String(receiptType) === 'expense'?  !!errors.debit_amount && !!touched.debit_amount:!!errors.credit_amount && !!touched.credit_amount}
                          errorMessage={String(receiptType) === 'expense'?  errors.debit_amount:errors.credit_amount}
                          onChange={String(receiptType) === 'expense'?  handleChange("debit_amount"):handleChange("credit_amount")}
                          className="mb-4"
                          readOnly={type==="view"}
                          max={50}
                        />
                        <Select className="max-w-full" label="Receipt type" value={receiptType} onChange={(e)=>{console.log(e.target.value);setReceiptType(e.target.value)}}>
                            <SelectItem key={'expense'}>Expense</SelectItem>
                            <SelectItem key={'income'}>Income</SelectItem>
                        </Select>
                        <Select className="max-w-full" label="Payment Mode" value={paymentMode}  onChange={(e)=>setPaymentMode(e.target.value)}>
                            <SelectItem key={'gpay'}>Gpay</SelectItem>
                            <SelectItem key={'cash'}>Cash</SelectItem>
                        </Select>
                        <Input
                          variant="bordered"
                          type="date"
                          label="Date "
                          value={values.payment_date}
                          isInvalid={!!errors.payment_date && !!touched.payment_date}
                          errorMessage={errors.payment_date}
                          onChange={handleChange("payment_date")}
                          className="mb-4"
                          readOnly={type==="view"}
                          max={60}
                        />
                        <Input
                          variant="bordered"
                          label="Note "
                          value={values.additional_note}
                          isInvalid={!!errors.additional_note && !!touched.additional_note}
                          errorMessage={errors.additional_note}
                          onChange={handleChange("additional_note")}
                          className="mb-4"
                          readOnly={type==="view"}
                          max={60}
                        />
                        {type != "view" &&<ModalFooter>
                          <Button color="danger" variant="flat" onClick={onClose}>
                            Close
                          </Button>
                          <Button color="primary" type="submit">
                            {type === "add" ? "Add Receipt" : "Update Receipt"}
                          </Button>
                        </ModalFooter>}
                      </form>
                    )}
                  </Formik>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </div>
  );
};
