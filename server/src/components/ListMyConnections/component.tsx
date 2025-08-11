import React from "react";
import { OpenAPIConnection } from "open-api-connector-types";
import { Grid } from "../Grid";
import { ConnectionCard } from "../ConnectionCard";

export type ListMyConnectionsProps = {
  connections: OpenAPIConnection[];
};

export function ListMyConnections(props: ListMyConnectionsProps) {
  return (
    <Grid key={null}>
      {props.connections.map((connecion, i) => (
        <ConnectionCard enable connection={connecion} key={i} />
      ))}
    </Grid>
  );
}
