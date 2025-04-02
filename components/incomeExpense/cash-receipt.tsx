import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { EditIcon } from "../icons/table/edit-icon";
import { Formik } from "formik";
import { ClientFormType, User } from "@/helpers/types";
import { ClientSchema } from "@/helpers/schemas";
import { EyeIcon } from "../icons/table/eye-icon";
import { postClients, putClients } from "@/services/clientService";
import { getAuthFromLocalStorage } from "@/utils/localStorageUtils";

interface AddClientProps {
  setCount: React.Dispatch<React.SetStateAction<number>>;
  type: "add" | "view" | "update";
  id?:number,
  first_name?: string;
  last_name?: string;
  company_name?: string;
  phone?: string;
  email?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstin?: string;
}

export const CashReceipt: React.FC<AddClientProps> = ({
  setCount,
  id,
  type,
  first_name = "",
  last_name = "",
  company_name = "",
  phone = "",
  email = "",
  address_line_1 = "",
  address_line_2 = "",
  city = "",
  state = "",
  pincode = "",
  gstin = "",
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();  // Destructure onOpen and onClose

  const [user, setUser] = useState<User | null>(null);
  // Initial values for the form
  const [initialValues, setInitialValues] = useState<ClientFormType>({
    firstName: "",
    lastName: "",
    companyName: "",
    phoneNumber: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    gstNumber: "",
  });

  useEffect(() => {
    const storedUser = getAuthFromLocalStorage();
    setUser(storedUser ? (storedUser as User) : null); // Safely set user
  }, []);


  useEffect(() => {
    // Update initial values if props change (for the 'update' type)
    setInitialValues({
      firstName: first_name,
      lastName: last_name,
      companyName: company_name,
      phoneNumber: phone,
      email: email,
      addressLine1: address_line_1,
      addressLine2: address_line_2,
      city: city,
      state: state,
      pincode: pincode,
      gstNumber: gstin,
    });
  }, [
    first_name,
    last_name,
    company_name,
    phone,
    email,
    address_line_1,
    address_line_2,
    city,
    state,
    pincode,
    gstin,
  ]);

  // Handle client submission (add/update)
  const handleClientSubmit = useCallback(
    async (values: ClientFormType) => {
      console.log("Form data submitted:", values);
      if (!user?.id) {
        console.log("User ID is missing");
        return; // Or show an error message
      }
      const formData = {
        company_id:user.id,
        first_name: values.firstName,
        last_name: values.lastName,
        username: values.firstName,
        company_name: values.companyName,
        phone: values.phoneNumber,
        email: values.email,
        address_line1: values.addressLine1,
        address_line2: values.addressLine2,
        city: values.city,
        state: values.state,
        pincode: values.pincode,
        gstin: values.gstNumber,
      };
      if (type === "add") {
        try {
        let response = await postClients(formData);
        console.log("response", response);
        onOpenChange();
        setCount(prev => prev+1)
      } catch (err: unknown) {
        console.log("Adding Client error:", err);
      }
    }else if (type === "update") {
      console.log("id",id)
      try {
        let response = await putClients(formData, Number(id));
        console.log("put Client response", response);
        onOpenChange(); 
        setCount(prev => prev+1)
      } catch (err: unknown) {
        console.log("Adding Invoice error:", err);
      }
    }
    },
    [onOpenChange]
  );

  // const fetchClients = useCallback(async (id: number) => {
  //   try {
  //     let response = await postClients(id);
  //     console.log("response", response);
  //   } catch (err: unknown) {
  //     console.log("Adding Client error:", err);
  //   }, [addToast, setError]);

  return (
    <div>
      <>
      {
        type === "add" ? (
          <Button onPress={onOpen} color="primary">
            Add Client
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
                {type === "add" ? "Add Client" : type === "view" ? "Client Details" : "Update Client"}
                </ModalHeader>
                <ModalBody className="overflow-y-auto max-h-96">
                  <Formik
                    initialValues={initialValues}
                    validationSchema={ClientSchema}
                    onSubmit={handleClientSubmit}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleSubmit,
                    }) => (
                      <form onSubmit={handleSubmit}>
                        <Input
                          variant="bordered"
                          label="First Name"
                          value={values.firstName}
                          isInvalid={!!errors.firstName && !!touched.firstName}
                          errorMessage={errors.firstName}
                          onChange={handleChange("firstName")}
                          className="mb-4"
                          readOnly={type==="view"}
                          max={40}
                        />
                        <Input
                          variant="bordered"
                          label="Last Name"
                          value={values.lastName}
                          isInvalid={!!errors.lastName && !!touched.lastName}
                          errorMessage={errors.lastName}
                          onChange={handleChange("lastName")}
                          className="mb-4"
                          readOnly={type==="view"}
                          max={40}
                        />
                        <Input
                          variant="bordered"
                          label="Company Name"
                          value={values.companyName}
                          isInvalid={!!errors.companyName && !!touched.companyName}
                          errorMessage={errors.companyName}
                          onChange={handleChange("companyName")}
                          className="mb-4"
                          readOnly={type==="view"}
                          max={50}
                        />
                        <Input
                          variant="bordered"
                          label="Phone Number"
                          value={values.phoneNumber}
                          isInvalid={!!errors.phoneNumber && !!touched.phoneNumber}
                          errorMessage={errors.phoneNumber}
                          onChange={handleChange("phoneNumber")}
                          className="mb-4"
                          readOnly={type==="view"}
                          max={10}
                        />
                        <Input
                          variant="bordered"
                          label="Email"
                          value={values.email}
                          isInvalid={!!errors.email && !!touched.email}
                          errorMessage={errors.email}
                          onChange={handleChange("email")}
                          className="mb-4"
                          readOnly={type==="view"}
                          max={30}
                        />
                        <Input
                          variant="bordered"
                          label="Address Line 1"
                          value={values.addressLine1}
                          isInvalid={!!errors.addressLine1 && !!touched.addressLine1}
                          errorMessage={errors.addressLine1}
                          onChange={handleChange("addressLine1")}
                          className="mb-4"
                          readOnly={type==="view"}
                          max={60}
                        />
                        <Input
                          variant="bordered"
                          label="Address Line 2"
                          value={values.addressLine2}
                          isInvalid={!!errors.addressLine2 && !!touched.addressLine2}
                          errorMessage={errors.addressLine2}
                          onChange={handleChange("addressLine2")}
                          className="mb-4"
                          readOnly={type==="view"}
                          max={60}
                        />
                        <Input
                          variant="bordered"
                          label="City"
                          value={values.city}
                          isInvalid={!!errors.city && !!touched.city}
                          errorMessage={errors.city}
                          onChange={handleChange("city")}
                          className="mb-4"
                          readOnly={type==="view"}
                          max={30}
                        />
                        <Input
                          variant="bordered"
                          label="State"
                          value={values.state}
                          isInvalid={!!errors.state && !!touched.state}
                          errorMessage={errors.state}
                          onChange={handleChange("state")}
                          className="mb-4"
                          readOnly={type==="view"}
                          max={30}
                        />
                        <Input
                          variant="bordered"
                          label="Pincode"
                          value={values.pincode}
                          isInvalid={!!errors.pincode && !!touched.pincode}
                          errorMessage={errors.pincode}
                          onChange={handleChange("pincode")}
                          className="mb-4"
                          readOnly={type==="view"}
                          max={6}
                        />
                        <Input
                          variant="bordered"
                          label="GST Number"
                          value={values.gstNumber}
                          isInvalid={!!errors.gstNumber && !!touched.gstNumber}
                          errorMessage={errors.gstNumber}
                          onChange={handleChange("gstNumber")}
                          className="mb-4"
                          readOnly={type==="view"}
                          max={18}
                        />
                        {type != "view" &&<ModalFooter>
                          <Button color="danger" variant="flat" onClick={onClose}>
                            Close
                          </Button>
                          <Button color="primary" type="submit">
                            {type === "add" ? "Add Client" : "Update Client"}
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
