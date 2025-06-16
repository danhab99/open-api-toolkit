export type Identifier = {
  name: string;
  userDescription: string;
  aiDescription: string;
};

export type ConfigDef = Identifier & {
  type: "string" | "number";
};

export type KVP = Record<string, any>;

export type ToolResult = {
  results: KVP;
  log?: {
    message?: string;
    data?: any;
  };
};

export type Tool = Identifier & {
  arguments: ConfigDef[];
  handler: (config: KVP, args: KVP) => Promise<ToolResult>;
};

export type OpenAPIConnectionDefinition = Identifier & {
  id: string;
  configurationArguments: ConfigDef[];
};

export type Config = ConfigDef & {
  configId: string;
  value: string | number;
};

export type OpenAPIConnection = Identifier & {
  id: number;
  slug: string;
  def: OpenAPIConnectionDefinition;
  config: Config[];
  enabled: boolean;
};

export type ConfigurationSet<T extends Array<ConfigDef>> = Record<
  T[number]["name"],
  string | number
>;
