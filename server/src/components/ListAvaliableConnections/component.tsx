import React from "react";
import { McpConnectionDefinition } from "../../../types";
import { NewConnectionCard } from "../NewConnectionCard";
import { Grid } from "../Grid";

export type ListAvaliableConnectionsProps = {
  mcpDefs: McpConnectionDefinition[];
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
