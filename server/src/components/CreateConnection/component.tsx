"use client";
import {
  Config,
  OpenAPIConnection,
  OpenAPIConnectionDefinition,
} from "open-api-connector-types";
import React from "react";
import { ConfigInput } from "../ConfigInput";
import { Button } from "../ui/button";
import { createConnection, editConnection } from "@/lib/connection";
import { useRouter } from "next/navigation";
import Form from "next/form";

export type CreateConnectionProps =
  | {
      connectionDef: OpenAPIConnectionDefinition;
    }
  | {
      connection: OpenAPIConnection;
    };

export function CreateConnection(props: CreateConnectionProps) {
  const router = useRouter();

  const conn =
    ("connectionDef" in props ? props.connectionDef : undefined) ??
    ("connection" in props ? props.connection.def : undefined);

  if (!conn) {
    throw "no connection prop";
  }

  const handleSubmit = async (data: FormData) => {
    const config: Config[] = conn.configurationArguments.map((x) => {
      return {
        ...x,
        value: data.get(x.name)?.toString(),
      } as Config;
    });

    const name = data.get("Name")?.toString() ?? `${conn.name}`;
    const userDescription = data.get("Description")?.toString() ?? conn.userDescription;
    const aiDescription = data.get("Prompt")?.toString() ?? conn.aiDescription;

    if ("connectionDef" in props) {
      await createConnection({
        config: config,
        def: props.connectionDef,
        enabled: true,
        aiDescription,
        name,
        userDescription,
      });
    } else if ("connection" in props) {
      await editConnection(props.connection.slug, {
        aiDescription,
        name,
        userDescription,
        config,
      });
    }

    router.push("/");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <Form action={handleSubmit}>
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

        {conn.configurationArguments.map((c, i) => (
          <div key={i} className="w-full py-1">
            <ConfigInput config={c} />
          </div>
        ))}

        <div className="flex flex-row gap-2 py-2">
          <Button type="submit">
            {"connection" in props ? "Save" : "Add"}
          </Button>
          <Button onClick={handleBack} variant="outline" type="reset">
            Cancel
          </Button>
        </div>
      </Form>
    </>
  );
}
