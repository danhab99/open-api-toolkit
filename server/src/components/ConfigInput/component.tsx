import React from "react";
import { Label } from "../ui/label";
import { Config, ConfigDef } from "open-api-connector-types";
import { Input } from "../ui/input";

export type ConfigInputProps = {
  config: ConfigDef;
  onConfigChange: (c: Config["type"]) => void;
  value: Config["type"];
};

export function ConfigInput(props: ConfigInputProps) {
  return (
    <div>
      <p>
        <Label>{props.config.name}</Label>
      </p>
      <p>
        <Label>{props.config.userDescription}</Label>
      </p>
      <Input
        type={props.config.type}
        onChange={(e) => props.onConfigChange(e.target.value as any)}
      />
    </div>
  );
}
