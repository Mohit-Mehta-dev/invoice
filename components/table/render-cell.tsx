import { User, Tooltip, Chip } from "@heroui/react";
import React from "react";
import { DeleteIcon } from "../icons/table/delete-icon";
import { EditIcon } from "../icons/table/edit-icon";
import { EyeIcon } from "../icons/table/eye-icon";
import { users } from "./data";
import { Client } from "@/helpers/types";

interface Props {
  // user: (typeof users)[number];
  client: (Client);
  columnKey: string | React.Key;
}

export const RenderCell = ({ client, columnKey }:Props) => {
  console.log('client',client)
  // @ts-ignore
  const cellValue = client[columnKey];
  switch (columnKey) {
    case "company_name":
      return (
        <User
          avatarProps={{
            src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
          }}
          name={cellValue}
        >
          {client.company_name != null ?client.company_name:client.first_name}
        </User>
      );
    // case "role":
    //   return (
    //     <div>
    //       <div>
    //         <span>{cellValue}</span>
    //       </div>
    //       <div>
    //         <span>{client.id}</span>
    //       </div>
    //     </div>
    //   );
    // case "status":
      // return (
        // <Chip
        //   size="sm"
        //   variant="flat"
        //   color={
        //     cellValue === "active"
        //       ? "success"
        //       : cellValue === "paused"
        //       ? "danger"
        //       : "warning"
        //   }
        // >
        //   <span className="capitalize text-xs">{cellValue}</span>
        // </Chip>
      // );
    default:
      return cellValue;
  }
};
