import { OpenAPIConnectionDefinition } from "open-api-connector-types";

export const exampleOpenAPIConnection: OpenAPIConnectionDefinition = {
  name: "example-connection",
  userDescription: "This is an example OpenAPI connection.",
  aiDescription: "A connection used for demonstration purposes.",
  configurationArguments: [
    {
      name: "apiKey",
      userDescription: "Your API key for authentication.",
      aiDescription: "API key used to authenticate requests.",
      type: "string",
    },
  ],
  tools: [
    {
      name: "getData",
      userDescription: "Fetch data from an external API.",
      aiDescription: "A tool that fetches data using provided arguments.",
      arguments: [
        {
          name: "query",
          userDescription: "The search query.",
          aiDescription: "The query string to send to the API.",
          type: "string",
        },
      ],
      handler: async (config, args) => {
        return { message: "Default response from getData" };
      },
    },
  ],
};
