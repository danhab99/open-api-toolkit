export type Identifier = {
  name: string;
  userDescription: string;
  aiDescription: string;
};

export type ConfigArg = Identifier & {
  type: "string" | "number";
};

export type Tool = Identifier & {
  arguments: ConfigArg[];
  handler: (args: Record<string, any>) => Promise<Record<string, any>>;
};

export type OpenAPIConnectionDefinition = Identifier & {
  configurationArguments: ConfigArg[];
  tools: Tool[];
};

export type Config = ConfigArg & {
  configId: ConfigArg["id"];
  value: "string" | "number";
};

export type OpenAPIConnection = Identifier & {
  mcp: OpenAPIConnectionDefinition;
  config: Config[];
  enabled: boolean;
};
