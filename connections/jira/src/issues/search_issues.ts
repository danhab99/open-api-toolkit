import { Tool } from "open-api-connection-types";
import { getJiraConfig, jiraRequest } from "../lib";

export const searchJiraIssues: Tool = {
  id: "searchJiraIssues",
  displayName: "Search Jira Issues",
  userDescription:
    "Searches for Jira issues using JQL (Jira Query Language) or simple filters",
  aiDescription:
    "Searches Jira issues using JQL query or filters by project, status, assignee, etc.",
  arguments: [
    {
      id: "jql",
      displayName: "JQL Query",
      type: "string",
      userDescription:
        "JQL query string (e.g., 'project = PROJ AND status = Open'). If not provided, will search by other parameters.",
      aiDescription:
        "JQL query for advanced search. If not provided, builds query from other parameters.",
    },
    {
      id: "projectKey",
      displayName: "Project Key",
      type: "string",
      userDescription: "Filter by project key (optional)",
      aiDescription: "Project key to filter issues",
    },
    {
      id: "status",
      displayName: "Status",
      type: "string",
      userDescription: "Filter by status (e.g., 'Open', 'In Progress', 'Done')",
      aiDescription: "Issue status to filter",
    },
    {
      id: "maxResults",
      displayName: "Max Results",
      type: "string",
      userDescription: "Maximum number of results to return (default: 50)",
      aiDescription: "Maximum number of issues to return",
    },
  ],
  async handler(config, args) {
    const jiraConfig = getJiraConfig(config);
    const {
      jql: customJql,
      projectKey,
      status,
      maxResults = "50",
    } = args;

    try {
      let jql = customJql;

      if (!jql) {
        const conditions: string[] = [];

        if (projectKey) {
          conditions.push(`project = "${projectKey}"`);
        }

        if (status) {
          conditions.push(`status = "${status}"`);
        }

        jql = conditions.length > 0 ? conditions.join(" AND ") : "";
      }

      const result = await jiraRequest(jiraConfig, "search", {
        method: "POST",
        body: JSON.stringify({
          jql: jql || undefined,
          maxResults: parseInt(maxResults, 10),
          fields: [
            "summary",
            "status",
            "assignee",
            "priority",
            "issuetype",
            "created",
            "updated",
          ],
        }),
      });

      const issues = result.issues.map((issue: any) => ({
        key: issue.key,
        id: issue.id,
        summary: issue.fields.summary,
        status: issue.fields.status?.name,
        assignee: issue.fields.assignee?.displayName,
        priority: issue.fields.priority?.name,
        issueType: issue.fields.issuetype?.name,
        created: issue.fields.created,
        updated: issue.fields.updated,
      }));

      return {
        results: {
          total: result.total,
          maxResults: result.maxResults,
          startAt: result.startAt,
          issues,
        },
        log: {
          message: `Found ${result.total} Jira issues`,
          data: { jql, total: result.total },
        },
      };
    } catch (error) {
      return {
        results: {
          success: false,
        },
        log: {
          message: "Failed to search Jira issues",
          data: error,
        },
      };
    }
  },
};
