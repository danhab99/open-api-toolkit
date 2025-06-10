"use client";
import { Config, OpenAPIConnectionDefinition } from "open-api-connector-types";
import React, { useState } from "react";
import { ConfigInput } from "../ConfigInput";
import { Button } from "../ui/button";
import { createConnection } from "@/lib/connection";
import { useRouter } from "next/navigation";

export type CreateConnectionProps = {
  connectionDef: OpenAPIConnectionDefinition;
};

export function CreateConnection(props: CreateConnectionProps) {
  const [config, setConfigs] = useState<Config[]>(
    props.connectionDef.configurationArguments as Config[],
  );

  const router = useRouter();

  const add = async () => {
    debugger
    await createConnection({
      config: config,
      def: props.connectionDef,
      enabled: true,
      aiDescription: "",
      name: "",
      userDescription: "",
    });
    router.push("/");
  };

  return (
    <>
      {props.connectionDef.configurationArguments.map((c, i) => (
        <div key={i} className="w-full py-1">
          <ConfigInput
            config={c}
            value={config[i].value}
            onConfigChange={(x) =>
              setConfigs((prev) => [
                ...prev.slice(0, i),
                {
                  ...prev[i],
                  value: x,
                },
                ...prev.slice(i),
              ])
            }
          />
        </div>
      ))}

      <div className="flex flex-row gap-2 py-2">
        <Button onClick={add}>Add</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </>
  );
}
