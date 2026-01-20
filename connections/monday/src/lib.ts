import { KVP } from "open-api-connection-types";

export interface MondayClient {
  apiKey: string;
  apiUrl: string;
}

export function getClient(config: KVP): MondayClient {
  const { apiKey, apiUrl = "https://api.monday.com/v2" } = config;

  if (!apiKey) {
    throw new Error("Monday.com API key is required");
  }

  return {
    apiKey,
    apiUrl,
  };
}

export async function mondayApiCall(
  client: MondayClient,
  query: string,
  variables?: Record<string, any>
): Promise<any> {
  const response = await fetch(client.apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: client.apiKey,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`Monday API error: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(`Monday API error: ${JSON.stringify(data.errors)}`);
  }

  return data.data;
}
