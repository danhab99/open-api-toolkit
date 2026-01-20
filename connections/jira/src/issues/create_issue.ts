import { Tool } from "open-api-connection-types";
import { getJiraConfig, jiraRequest } from "../lib";
import { JiraCreateIssueResponse, JiraCreateIssueFields, JiraADF } from "../types";

export const createJiraIssue: Tool = {
  id: "createJiraIssue",
  displayName: "Create Jira Issue",
  userDescription: "Creates a new issue in Jira",
  aiDescription:
    "Creates a new Jira issue with specified project, summary, description, and issue type",
  arguments: [
    {
      id: "projectKey",
      displayName: "Project Key",
      type: "string",
      userDescription: "The key of the project where the issue will be created",
      aiDescription: "Jira project key (e.g., 'PROJ', 'DEV')",
    },
    {
      id: "summary",
      displayName: "Summary",
      type: "string",
      userDescription: "Brief summary of the issue",
      aiDescription: "Issue title/summary",
    },
    {
      id: "description",
      displayName: "Description",
      type: "string",
      userDescription: "Detailed description of the issue",
      aiDescription: "Issue description (can be empty)",
    },
    {
      id: "issueType",
      displayName: "Issue Type",
      type: "string",
      userDescription:
        "Type of issue (e.g., 'Task', 'Bug', 'Story', 'Epic'). Defaults to 'Task'",
      aiDescription: "Issue type name, defaults to 'Task' if not specified",
    },
    {
      id: "priority",
      displayName: "Priority",
      type: "string",
      userDescription:
        "Priority of the issue (e.g., 'Highest', 'High', 'Medium', 'Low', 'Lowest')",
      aiDescription: "Issue priority (optional)",
    },
  ],
  async handler(config, args) {
    const jiraConfig = getJiraConfig(config);
    const {
      projectKey,
      summary,
      description,
      issueType = "Task",
      priority,
    } = args;

    try {
      const fields: JiraCreateIssueFields = {
        project: {
          key: projectKey,
        },
        summary,
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: description || "",
                },
              ],
            },
          ],
        } as JiraADF,
        issuetype: {
          name: issueType,
        },
      };

      if (priority) {
        fields.priority = { name: priority };
      }

      const result: JiraCreateIssueResponse = await jiraRequest(jiraConfig, "issue", {
        method: "POST",
        body: JSON.stringify({ fields }),
      });

      return {
        results: {
          id: result.id,
          key: result.key,
          self: result.self,
        },
        log: {
          message: `Jira issue ${result.key} created successfully`,
          data: result,
        },
      };
    } catch (error) {
      return {
        results: {
          success: false,
        },
        log: {
          message: "Failed to create Jira issue",
          data: error,
        },
      };
    }
  },
};
