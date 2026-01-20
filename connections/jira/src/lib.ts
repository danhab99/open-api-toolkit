import { KVP } from "open-api-connection-types";

export interface JiraConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
}

export function getJiraConfig(config: KVP): JiraConfig {
  return {
    baseUrl: config.baseUrl,
    email: config.email,
    apiToken: config.apiToken,
  };
}

export function getAuthHeader(config: JiraConfig): string {
  const auth = Buffer.from(`${config.email}:${config.apiToken}`).toString(
    "base64",
  );
  return `Basic ${auth}`;
}

export async function jiraRequest(
  config: JiraConfig,
  endpoint: string,
  options: RequestInit = {},
): Promise<any> {
  const url = `${config.baseUrl}/rest/api/3/${endpoint}`;
  const headers = {
    Authorization: getAuthHeader(config),
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Jira API error: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
