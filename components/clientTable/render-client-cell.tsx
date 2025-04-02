import { User, Tooltip, Chip, addToast } from "@heroui/react";
import React, { useCallback } from "react";
import { DeleteIcon } from "../icons/table/delete-icon";
import { EditIcon } from "../icons/table/edit-icon";
import { EyeIcon } from "../icons/table/eye-icon";
import { clients } from "./clientData";
import { AddClient } from "../clients/add-client";
import { Client } from "@/helpers/types";
import { AxiosError } from "axios";
import { deleteClients } from "@/services/clientService";
import { ReportsIcon } from "../icons/sidebar/reports-icon";
import { useRouter } from "next/navigation";

interface Props {
  setCount: React.Dispatch<React.SetStateAction<number>>;
  deleteClient: (id: number) => void;
  client: (Client);
  columnKey: string | React.Key;
}

export const RenderClientCell = ({ client, columnKey, setCount, deleteClient }: Props) => {

  const router = useRouter();
  // @ts-ignore
  const cellValue = client[columnKey];
  switch (columnKey) {
    // case "first_name":
    //   return (
    //     <User
    //       avatarProps={{
    //         src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    //       }}
    //       name={cellValue}
    //     >
    //       {client.first_name}
    //     </User>
    //   );
    case "first_name":
      return (
        <div>
          {/* <div>
            <span>{cellValue}</span>
          </div> */}
          <div>
            <span>{client.first_name}</span>
          </div>
        </div>
      );
    case "company_name":
      return (
        <div>
          {/* <div>
            <span>{cellValue}</span>
          </div> */}
          <div>
            <span>{client.company_name}</span>
          </div>
        </div>
      );
    case "role":
      return (
        <div>
          <div>
            <span>{cellValue}</span>
          </div>
          <div>
            <span>{client.email}</span>
          </div>
        </div>
      );
    case "address_line_1":
      return (
        <div>
          <div>
            <span>{cellValue}</span>
          </div>
          <div>
            <span>{client.address_line1}</span>
          </div>
        </div>
      );

    case "actions":
      return (
        <div className="flex items-center gap-4 ">
          <div>
            <Tooltip content="Invoice">
              <button onClick={() => router.replace(`/invoices/${client?.id}`)}>
                <ReportsIcon />
              </button>
            </Tooltip>
          </div>
          <div>
            <Tooltip content="Details">
              <span>
                <button>
                  <AddClient
                      setCount={setCount}
                      type="view" 
                      first_name={client.first_name}
                      last_name = {client.last_name}
                      company_name = {client.company_name}
                      phone = {client.phone}
                      email = {client.email}
                      address_line_1 = {client.address_line1}
                      address_line_2 = {client.address_line2}
                      city = {client.city}
                      state = {client.state}
                      pincode = {client.pincode}
                      gstin = {client.gstin}
                    />
                </button>
              </span>
            </Tooltip>
          </div>
          <div>
            <Tooltip content="Edit user" color="secondary">
              <span>
                <button>
                    <AddClient 
                      id={client.id}
                      setCount={setCount}
                      type="update" 
                      first_name={client.first_name}
                      last_name = {client.last_name}
                      company_name = {client.company_name}
                      phone = {client.phone}
                      email = {client.email}
                      address_line_1 = {client.address_line1}
                      address_line_2 = {client.address_line2}
                      city = {client.city}
                      state = {client.state}
                      pincode = {client.pincode}
                      gstin = {client.gstin}
                    />
                </button>
              </span>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              content="Delete user"
              color="danger"
            >
              <span>
                <button onClick={()=>{ deleteClient(client?.id)}} >
                  <DeleteIcon size={20} fill="#FF0080" />
                </button>
              </span>
            </Tooltip>
          </div>
        </div>
      );
    default:
      return cellValue;
  }
};
