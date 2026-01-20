import { OpenAPIConnectionDefinition, Tool } from "open-api-connection-types";
import { createJiraIssue } from "./issues/create_issue";
import { getJiraIssue } from "./issues/get_issue";
import { updateJiraIssue } from "./issues/update_issue";
import { searchJiraIssues } from "./issues/search_issues";
import { addJiraComment } from "./issues/add_comment";
import { transitionJiraIssue } from "./issues/transition_issue";

export const Connection: OpenAPIConnectionDefinition = {
  id: "jira",
  displayName: "Atlassian Jira",
  userDescription: "Connects to Atlassian Jira for issue tracking and project management",
  aiDescription:
    "Allows tools to create, read, update, search Jira issues, add comments, and manage issue workflows",
  configurationArguments: [
    {
      id: "baseUrl",
      displayName: "Jira Base URL",
      userDescription:
        "Your Jira instance URL (e.g., 'https://your-domain.atlassian.net')",
      aiDescription: "Base URL of the Jira instance",
      type: "string",
    },
    {
      id: "email",
      displayName: "Email",
      userDescription: "Your Atlassian account email address",
      aiDescription: "Email address for authentication",
      type: "string",
    },
    {
      id: "apiToken",
      displayName: "API Token",
      userDescription:
        "API token from https://id.atlassian.com/manage-profile/security/api-tokens",
      aiDescription: "Jira API token for authentication",
      type: "string",
    },
  ],
};

export const Tools: Tool[] = [
  createJiraIssue,
  getJiraIssue,
  updateJiraIssue,
  searchJiraIssues,
  addJiraComment,
  transitionJiraIssue,
];
