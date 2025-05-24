import React, { useState } from "react";
import { Config, McpConnection } from "../../types";
import { ConfigInput } from "../ConfigInput";
import { Button } from "../ui/button";

export type EditConnectionProps = {
  mcp: McpConnection;
  onConfigsChanged: (c: Config[]) => void;
};

export function EditConnection(props: EditConnectionProps) {
  const [configs, setConfigs] = useState(props.mcp.config);

  return (
    <>
      <h1 className="text-2xl py-2">{props.mcp.name}</h1>
      <p className="text-gray-500 pb-4">{props.mcp.userDescription}</p>
      {configs.map((config, i) => (
        <div key={i} className="w-full py-1">
          <ConfigInput
            config={config}
            onConfigChange={(c) =>
              setConfigs((prev) => [
                ...prev.slice(0, i),
                {
                  ...prev[i],
                  value: c,
                },
                ...prev.slice(i),
              ])
            }
          />
        </div>
      ))}

      <div className="flex flex-row gap-2 py-2">
        <Button>Save</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </>
  );
}
