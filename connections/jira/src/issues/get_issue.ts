import { Tool } from "open-api-connection-types";
import { getJiraConfig, jiraRequest } from "../lib";
import { JiraIssue } from "../types";

export const getJiraIssue: Tool = {
  id: "getJiraIssue",
  displayName: "Get Jira Issue",
  userDescription: "Gets details of a specific Jira issue by its key or ID",
  aiDescription:
    "Retrieves full details of a Jira issue including summary, description, status, assignee, and other fields",
  arguments: [
    {
      id: "issueKey",
      displayName: "Issue Key",
      type: "string",
      userDescription: "The issue key (e.g., 'PROJ-123') or issue ID",
      aiDescription: "Jira issue key or ID",
    },
  ],
  async handler(config, args) {
    const jiraConfig = getJiraConfig(config);
    const { issueKey } = args;

    try {
      const result: JiraIssue = await jiraRequest(jiraConfig, `issue/${issueKey}`);

      return {
        results: {
          id: result.id,
          key: result.key,
          self: result.self,
          fields: {
            summary: result.fields.summary,
            description: result.fields.description,
            status: result.fields.status?.name,
            assignee: result.fields.assignee?.displayName,
            reporter: result.fields.reporter?.displayName,
            priority: result.fields.priority?.name,
            issueType: result.fields.issuetype?.name,
            created: result.fields.created,
            updated: result.fields.updated,
          },
        },
        log: {
          message: `Retrieved Jira issue ${issueKey}`,
          data: result,
        },
      };
    } catch (error) {
      return {
        results: {
          success: false,
        },
        log: {
          message: `Failed to get Jira issue ${issueKey}`,
          data: error,
        },
      };
    }
  },
};
