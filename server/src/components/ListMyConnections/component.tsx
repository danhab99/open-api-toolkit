import React from "react";
import { OpenAPIConnection } from "open-api-connector-types";
import { Grid } from "../Grid";
import { ConnectionCard } from "../ConnectionCard";

export type ListMyConnectionsProps = {
  mcps: OpenAPIConnection[];
};

export function ListMyConnections(props: ListMyConnectionsProps) {
  return (
    <Grid key={null}>
      {props.mcps.map((mcp, i) => (
        <ConnectionCard enable mcp={mcp} key={i} />
      ))}
    </Grid>
  );
}
