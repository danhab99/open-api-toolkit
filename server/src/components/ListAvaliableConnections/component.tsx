"use server";
import React from "react";
import { NewConnectionCard } from "../NewConnectionCard";
import { Grid } from "../Grid";
import { getAllConnections } from "../../lib/connection";

export type ListAvaliableConnectionsProps = {};

export async function ListAvaliableConnections(
  props: ListAvaliableConnectionsProps,
) {
  const connections = await getAllConnections();
  return (
    <Grid>
      {connections.map((def, i) => (
        <NewConnectionCard connection={def} key={i} />
      ))}
    </Grid>
  );
}
