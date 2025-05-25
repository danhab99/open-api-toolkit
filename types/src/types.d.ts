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

export type OpenAPIConnectionDefinition = Identifier & {
  id: ID;
  configurationArguments: ConfigArg[];
  resources: Resource[];
  tools: Tool[];
};

export type Config = ConfigArg & {
  configId: ConfigArg["id"];
  value: "string" | "number";
};

export type OpenAPIConnection = Identifier & {
  id: ID;
  mcp: OpenAPIConnectionDefinition;
  config: Config[];
  enabled: boolean;
};
