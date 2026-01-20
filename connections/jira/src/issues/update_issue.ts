import { Tool } from "open-api-connection-types";
import { getJiraConfig, jiraRequest } from "../lib";
import { JiraIssueUpdateFields, JiraADF } from "../types";

export const updateJiraIssue: Tool = {
  id: "updateJiraIssue",
  displayName: "Update Jira Issue",
  userDescription: "Updates fields of an existing Jira issue",
  aiDescription:
    "Updates one or more fields of a Jira issue such as summary, description, priority, or assignee",
  arguments: [
    {
      id: "issueKey",
      displayName: "Issue Key",
      type: "string",
      userDescription: "The issue key (e.g., 'PROJ-123') to update",
      aiDescription: "Jira issue key or ID",
    },
    {
      id: "summary",
      displayName: "Summary",
      type: "string",
      userDescription: "New summary for the issue (optional)",
      aiDescription: "Updated issue summary",
    },
    {
      id: "description",
      displayName: "Description",
      type: "string",
      userDescription: "New description for the issue (optional)",
      aiDescription: "Updated issue description",
    },
    {
      id: "priority",
      displayName: "Priority",
      type: "string",
      userDescription:
        "New priority (e.g., 'Highest', 'High', 'Medium', 'Low', 'Lowest') (optional)",
      aiDescription: "Updated issue priority",
    },
  ],
  async handler(config, args) {
    const jiraConfig = getJiraConfig(config);
    const { issueKey, summary, description, priority } = args;

    try {
      const fields: JiraIssueUpdateFields = {};

      if (summary) {
        fields.summary = summary;
      }

      if (description) {
        fields.description = {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: description,
                },
              ],
            },
          ],
        } as JiraADF;
      }

      if (priority) {
        fields.priority = { name: priority };
      }

      await jiraRequest(jiraConfig, `issue/${issueKey}`, {
        method: "PUT",
        body: JSON.stringify({ fields }),
      });

      return {
        results: {
          success: true,
          issueKey,
        },
        log: {
          message: `Jira issue ${issueKey} updated successfully`,
          data: { issueKey, updatedFields: Object.keys(fields) },
        },
      };
    } catch (error) {
      return {
        results: {
          success: false,
        },
        log: {
          message: `Failed to update Jira issue ${issueKey}`,
          data: error,
        },
      };
    }
  },
};
