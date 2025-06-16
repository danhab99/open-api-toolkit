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
      id: 0,
      slug: "",
      config: config,
      def: props.connectionDef,
      enabled: true,
      aiDescription: data.get("Prompt")?.toString() ?? "",
      name: data.get("Name")?.toString() ?? `${props.connectionDef.name}`,
      userDescription: data.get("Description")?.toString() ?? "",
    });
    router.push("/");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <Form action={add}>
        <ConfigInput
          config={{
            name: "Name",
            type: "string",
            aiDescription: "",
            userDescription: "",
          }}
        />

        <ConfigInput
          config={{
            name: "Description",
            type: "string",
            aiDescription: "",
            userDescription: "",
          }}
        />

        <ConfigInput
          config={{
            name: "Prompt",
            type: "string",
            aiDescription: "",
            userDescription: "Instructions for the LLM",
          }}
        />

        <hr className="pb-4 mt-4 border-solid border-grey-900" />

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
