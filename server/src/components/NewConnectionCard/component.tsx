import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { McpConnectionDefinition } from "../../../types";

export type NewConnectionCardProps = {
  mcpDef: McpConnectionDefinition;
};

export function NewConnectionCard(props: NewConnectionCardProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{props.mcpDef.name}</CardTitle>
          <CardDescription>{props.mcpDef.userDescription}</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-end gap-4">
          <Button>Create</Button>
        </CardFooter>
      </Card>
    </>
  );
}
