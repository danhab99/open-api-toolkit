"use client";
import { Config, OpenAPIConnectionDefinition } from "open-api-connector-types";
import React from "react";
import { ConfigInput } from "../ConfigInput";
import { Button } from "../ui/button";
import { createConnection } from "@/lib/connection";
import { useRouter } from "next/navigation";
import Form from "next/form";

export type CreateConnectionProps = {
  connectionDef: OpenAPIConnectionDefinition;
};

export function CreateConnection(props: CreateConnectionProps) {
  const router = useRouter();

  const add = async (data: FormData) => {
    const config: Config[] = props.connectionDef.configurationArguments.map(
      (x) => {
        return {
          ...x,
          value: data.get(x.name)?.toString(),
        } as Config;
      },
    );

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

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <Form action={add}>
        {props.connectionDef.configurationArguments.map((c, i) => (
          <div key={i} className="w-full py-1">
            <ConfigInput config={c} />
          </div>
        ))}

        <div className="flex flex-row gap-2 py-2">
          <Button type="submit">Add</Button>
          <Button onClick={handleBack} variant="outline">
            Cancel
          </Button>
        </div>
      </Form>
    </>
  );
}
