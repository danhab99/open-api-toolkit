"use client";
import React, { useState } from "react";

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
import { enableConnection } from "@/lib/connection";

export type ConnectionCardProps = {
  enable: boolean;
  mcp: OpenAPIConnection;
};

export function ConnectionCard(props: ConnectionCardProps) {
  const [enable, setEnable] = React.useState(props.enable);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row align-center gap-4">
          <Switch
            onCheckedChange={async (c) => {
              await enableConnection(props.mcp.def.id, c);
              setEnable((x) => !x);
            }}
            checked={enable}
          />
          <CardTitle>{props.mcp.name}</CardTitle>
        </div>
        <CardDescription>{props.mcp.userDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {props.mcp.config.map((config, i) => (
              <TableRow key={i}>
                <TableCell>{`${config.name}`}</TableCell>
                <TableCell>{config.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        <Button variant="outline">Delete</Button>
        <Button>Edit</Button>
      </CardFooter>
    </Card>
  );
}
