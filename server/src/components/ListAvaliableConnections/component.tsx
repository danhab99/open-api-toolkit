import React from "react";
import { OpenAPIConnectionDefinition } from "open-api-connector-types";
import { NewConnectionCard } from "../NewConnectionCard";
import { Grid } from "../Grid";
import { Connections } from "../../lib/connection";

export type ListAvaliableConnectionsProps = {};

export function ListAvaliableConnections(props: ListAvaliableConnectionsProps) {
  return (
    <Grid>
      {Connections.map((def, i) => (
        <NewConnectionCard mcpDef={def} key={i} />
      ))}
    </Grid>
  );
}
