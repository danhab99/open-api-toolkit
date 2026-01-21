"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OpenAPIConnection } from "open-api-connector-types";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { enableConnection, deleteConnection } from "@/lib/connection";
import { useRouter } from "next/navigation";
import Link from "next/link";

export type ConnectionCardProps = {
  enable: boolean;
  connection: OpenAPIConnection;
};

export function ConnectionCard(props: ConnectionCardProps) {
  const [enable, setEnable] = useState(props.enable);
  const router = useRouter();

  return (
    <Card className="flex flex-col justify-between overflow-hidden">
      <CardHeader>
        <div className="flex flex-row align-center gap-4">
          <Switch
            onCheckedChange={async (c) => {
              await enableConnection(props.connection.def.id, c);
              setEnable((x) => !x);
            }}
            checked={enable}
          />
          <CardTitle>{props.connection.displayName}</CardTitle>
        </div>
        <CardDescription>{props.connection.userDescription}</CardDescription>
      </CardHeader>
      <CardContent className="overflow-hidden">
        <Table>
          <TableBody>
            {props.connection.config.map((config, i) => (
              <TableRow key={i}>
                <TableCell className="truncate">{`${config.displayName}`}</TableCell>
                <TableCell className="truncate">{config.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-end gap-4 mt-auto">
        <Button
          variant="outline"
          onClick={async () => {
            await deleteConnection(props.connection.slug);
            router.refresh();
          }}
        >
          Delete
        </Button>
        <Link href={`/edit/${props.connection.id}`}>
          <Button>Edit</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
