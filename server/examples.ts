import { McpConnection, McpConnectionDefinition } from "./types";

export const exampleMcpConnection: McpConnection = {
  name: "Example Connection",
  userDescription: "A sample connection for testing",
  aiDescription:
    "Used to simulate a user-defined MCP connection with sample data",
  mcp: {
    id: "def-001",
    name: "Sample MCP Definition",
    userDescription: "Defines the sample connection structure",
    aiDescription: "Contains configuration, tools, and resources for testing",
    configurationArguments: [
      {
        id: "cfg-001",
        name: "API Key",
        userDescription: "Your API key for authentication",
        aiDescription: "API key used to authenticate with the backend service",
        type: "string",
      },
      {
        id: "cfg-002",
        name: "Timeout",
        userDescription: "Timeout in seconds",
        aiDescription: "Number of seconds before the request times out",
        type: "number",
      },
    ],
    resources: [
      {
        name: "Resource A",
        userDescription: "A mock resource for demonstration",
        aiDescription: "Used in tests and demos",
      },
    ],
    tools: [
      {
        name: "Data Fetcher",
        userDescription: "Fetches data from a remote endpoint",
        aiDescription: "Tool to retrieve data based on given arguments",
        arguments: [
          {
            id: "arg-001",
            name: "Endpoint URL",
            userDescription: "The URL to fetch data from",
            aiDescription: "Used as the target endpoint for HTTP requests",
            type: "string",
          },
          {
            id: "arg-002",
            name: "Max Results",
            userDescription: "Limit number of results",
            aiDescription:
              "Caps the number of results returned from the fetch operation",
            type: "number",
          },
        ],
      },
    ],
  },
  config: [
    {
      id: "cfg-001",
      name: "API Key",
      userDescription: "Your API key for authentication",
      aiDescription: "API key used to authenticate with the backend service",
      type: "string",
      configId: "cfg-001",
      value: "my-secret-api-key",
    },
    {
      id: "cfg-002",
      name: "Timeout",
      userDescription: "Timeout in seconds",
      aiDescription: "Number of seconds before the request times out",
      type: "number",
      configId: "cfg-002",
      value: 30,
    },
  ],
};

export const exampleMcpConnectionDefinition: McpConnectionDefinition = {
  id: "mcp-def-001",
  name: "Weather Data Integration",
  userDescription: "Connects to a third-party weather API to fetch weather data",
  aiDescription: "Defines the necessary configuration, tools, and resources for integrating weather data",

  configurationArguments: [
    {
      id: "cfg-api-key",
      name: "API Key",
      userDescription: "API key provided by the weather service",
      aiDescription: "Used to authenticate requests to the weather API",
      type: "string"
    },
    {
      id: "cfg-base-url",
      name: "Base URL",
      userDescription: "The base URL of the weather API",
      aiDescription: "Defines the root endpoint for API calls",
      type: "string"
    },
    {
      id: "cfg-timeout",
      name: "Timeout (s)",
      userDescription: "Request timeout in seconds",
      aiDescription: "Maximum time to wait for a response before aborting",
      type: "number"
    }
  ],

  resources: [
    {
      name: "Weather Station",
      userDescription: "Represents a physical or virtual weather station",
      aiDescription: "Provides location-based weather data endpoints"
    },
    {
      name: "Forecast Archive",
      userDescription: "Historical forecast data",
      aiDescription: "Serves stored forecast information for analysis"
    }
  ],

  tools: [
    {
      name: "Get Current Weather",
      userDescription: "Fetches current weather conditions for a given location",
      aiDescription: "Calls the API to retrieve up-to-date weather information",
      arguments: [
        {
          id: "arg-location",
          name: "Location",
          userDescription: "City or coordinates for the weather query",
          aiDescription: "Determines the geographic location to query",
          type: "string"
        }
      ]
    },
    {
      name: "Get Forecast",
      userDescription: "Fetches a multi-day weather forecast",
      aiDescription: "Calls the API to retrieve weather forecasts for a location",
      arguments: [
        {
          id: "arg-location",
          name: "Location",
          userDescription: "Location to get the forecast for",
          aiDescription: "Geographic target for forecast retrieval",
          type: "string"
        },
        {
          id: "arg-days",
          name: "Days",
          userDescription: "Number of days to include in the forecast",
          aiDescription: "Determines the range of forecast data",
          type: "number"
        }
      ]
    }
  ]
};
