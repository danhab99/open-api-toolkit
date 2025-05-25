export type Identifier = {
  name: string;
  userDescription: string;
  aiDescription: string;
};

export type ConfigArg = Identifier & {
  type: "string" | "number";
};

export type Callable = Identifier & {
  arguments: ConfigArg[];
  handler: (args: Record<string, any>) => void;
};

export type Resource = Callable;
export type Tool = Callable;

export type OpenAPIConnectionDefinition = Identifier & {
  configurationArguments: ConfigArg[];
  resources: Resource[];
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
