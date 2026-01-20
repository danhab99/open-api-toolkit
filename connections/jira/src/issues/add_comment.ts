import { Tool } from "open-api-connection-types";
import { getJiraConfig, jiraRequest } from "../lib";

export const addJiraComment: Tool = {
  id: "addJiraComment",
  displayName: "Add Jira Comment",
  userDescription: "Adds a comment to a Jira issue",
  aiDescription: "Adds a comment to a specified Jira issue",
  arguments: [
    {
      id: "issueKey",
      displayName: "Issue Key",
      type: "string",
      userDescription: "The issue key (e.g., 'PROJ-123') to comment on",
      aiDescription: "Jira issue key or ID",
    },
    {
      id: "comment",
      displayName: "Comment",
      type: "string",
      userDescription: "The comment text to add",
      aiDescription: "Comment text",
    },
  ],
  async handler(config, args) {
    const jiraConfig = getJiraConfig(config);
    const { issueKey, comment } = args;

    try {
      const result = await jiraRequest(
        jiraConfig,
        `issue/${issueKey}/comment`,
        {
          method: "POST",
          body: JSON.stringify({
            body: {
              type: "doc",
              version: 1,
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: comment,
                    },
                  ],
                },
              ],
            },
          }),
        },
      );

      return {
        results: {
          id: result.id,
          self: result.self,
          created: result.created,
        },
        log: {
          message: `Comment added to Jira issue ${issueKey}`,
          data: result,
        },
      };
    } catch (error) {
      return {
        results: {
          success: false,
        },
        log: {
          message: `Failed to add comment to Jira issue ${issueKey}`,
          data: error,
        },
      };
    }
  },
};
