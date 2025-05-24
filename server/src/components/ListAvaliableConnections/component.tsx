import React from "react";
import { McpConnectionDefinition } from "../../../types";
import { NewConnectionCard } from "../NewConnectionCard";

export type ListAvaliableConnectionsProps = {
  mcpDefs: McpConnectionDefinition[];
};

export function ListAvaliableConnections(props: ListAvaliableConnectionsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {props.mcpDefs.map((def, i) => (
        <NewConnectionCard mcpDef={def} key={i} />
      ))}
    </div>
  );
}
