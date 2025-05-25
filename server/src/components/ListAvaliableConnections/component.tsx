import React from "react";
import { OpenAPIConnectionDefinition } from "open-api-connector-types";
import { NewConnectionCard } from "../NewConnectionCard";
import { Grid } from "../Grid";

export type ListAvaliableConnectionsProps = {
  mcpDefs: OpenAPIConnectionDefinition[];
};

export function ListAvaliableConnections(props: ListAvaliableConnectionsProps) {
  return (
    <Grid>
      {props.mcpDefs.map((def, i) => (
        <NewConnectionCard mcpDef={def} key={i} />
      ))}
    </Grid>
  );
}
