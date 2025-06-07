import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { OpenAPIConnectionDefinitionWithSlug } from "@/lib/connection";

export type NewConnectionCardProps = {
  mcpDef: OpenAPIConnectionDefinitionWithSlug;
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
          <Link href={`/new/${props.mcpDef.slug}`}>
            <Button>Create</Button>
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}
