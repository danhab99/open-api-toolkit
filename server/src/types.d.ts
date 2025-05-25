export type ID = number;

export type Identifier = {
  name: string;
  userDescription: string;
  aiDescription: string;
};

export type ConfigArg = Identifier & {
  id: ID;
  type: "string" | "number";
};

export type Resource = Identifier & {};

export type Tool = Identifier & {
  arguments: ConfigArg[];
};

export type McpConnectionDefinition = Identifier & {
  id: ID;
  configurationArguments: ConfigArg[];
  resources: Resource[];
  tools: Tool[];
};

export type Config = ConfigArg & {
  configId: ConfigArg["id"];
  value: "string" | "number";
};

export type McpConnection = Identifier & {
  id: ID;
  mcp: McpConnectionDefinition;
  config: Config[];
  enabled: boolean;
};
