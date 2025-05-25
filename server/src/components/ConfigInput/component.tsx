import React from "react";
import { Label } from "../ui/label";
import { Config } from "open-api-connector-types";
import { Input } from "../ui/input";

export type ConfigInputProps = {
  config: Config;
  onConfigChange: (c: Config["type"]) => void;
};

export function ConfigInput(props: ConfigInputProps) {
  return (
    <div>
      <Label>{props.config.name}</Label>
      <Input
        type={props.config.type}
        onChange={(e) => props.onConfigChange(e.target.value)}
      />
    </div>
  );
}
