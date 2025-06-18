import React, { useId } from "react";
import { Label } from "../ui/label";
import { ConfigDef } from "open-api-connector-types";
import { Input } from "../ui/input";

export type ConfigInputProps = {
  config: ConfigDef;
};

export function ConfigInput(props: ConfigInputProps) {
  const id = useId();

  return (
    <div>
      <p>
        <Label htmlFor={id}>{props.config.name}</Label>
      </p>
      <p>
        <Label className="text-grey-500 text-xs" htmlFor={id}>{props.config.userDescription}</Label>
      </p>
      <Input id={id} type={props.config.type} name={props.config.name} />
    </div>
  );
}
