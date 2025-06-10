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
import { OpenAPIConnectionDefinition } from "open-api-connector-types";

export type NewConnectionCardProps = {
  connection: OpenAPIConnectionDefinition;
};

export function NewConnectionCard(props: NewConnectionCardProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{props.connection.name}</CardTitle>
          <CardDescription>{props.connection.userDescription}</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-end gap-4">
          <Link href={`/new/${props.connection.id}`}>
            <Button>Create</Button>
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}
