import { Card, CardBody } from "@heroui/react";
import React from "react";
import { Community } from "../icons/community";

interface Props {
    text: string;
    value: number;
}

export const CardCounter : React.FC<Props> = ({text , value}) => {
    return (
      <Card className="xl:max-w-sm bg-primary rounded-xl shadow-md px-3 w-full">
        <CardBody className="py-5 overflow-hidden flex flex-col justify-between">
          <div className="flex gap-2.5">
            <Community />
            <div className="flex flex-col">
              <span className="text-white">{text}</span>
            </div>
          </div>
          <div className="flex gap-2.5 py-2 items-center justify-center flex-grow">
            <span className="text-white text-xl font-semibold">{value}</span>
          </div>
        </CardBody>
      </Card>
    );
  };
  
