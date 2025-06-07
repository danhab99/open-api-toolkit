export type Identifier = {
  name: string;
  userDescription: string;
  aiDescription: string;
};

export type ConfigArg = Identifier & {
  type: "string" | "number";
};

export type KVP = Record<string, any>;

export type Tool = Identifier & {
  arguments: ConfigArg[];
  handler: (config: KVP, args: KVP) => Promise<KVP>;
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
