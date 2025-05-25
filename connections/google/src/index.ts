import { OpenAPIConnectionDefinition } from "open-api-connection-types";

export default {
  name: "Google",
  userDescription: "This connects you to google",
  aiDescription: "TODO come up with an ai description",

  configurationArguments: [
    {
      aiDescription: "",
      userDescription: "The credentials.json file content",
      name: "credentials.jsn",
      type: "string",
    },
  ],

  resources: [{
    arguments:[
      {

      }
    ]
  }],
} as OpenAPIConnectionDefinition;
