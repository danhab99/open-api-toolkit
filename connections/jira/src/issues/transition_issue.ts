import { Tool } from "open-api-connection-types";
import { getJiraConfig, jiraRequest } from "../lib";

export const transitionJiraIssue: Tool = {
  id: "transitionJiraIssue",
  displayName: "Transition Jira Issue",
  userDescription: "Changes the status of a Jira issue (e.g., from Open to In Progress)",
  aiDescription:
    "Transitions a Jira issue to a different status by applying a workflow transition",
  arguments: [
    {
      id: "issueKey",
      displayName: "Issue Key",
      type: "string",
      userDescription: "The issue key (e.g., 'PROJ-123') to transition",
      aiDescription: "Jira issue key or ID",
    },
    {
      id: "transitionName",
      displayName: "Transition Name",
      type: "string",
      userDescription:
        "Name of the transition to apply (e.g., 'Start Progress', 'Done', 'Close Issue'). Use 'list' to get available transitions.",
      aiDescription:
        "Transition name or 'list' to retrieve available transitions",
    },
  ],
  async handler(config, args) {
    const jiraConfig = getJiraConfig(config);
    const { issueKey, transitionName } = args;

    try {
      const transitionsResult = await jiraRequest(
        jiraConfig,
        `issue/${issueKey}/transitions`,
      );

      if (transitionName.toLowerCase() === "list") {
        const availableTransitions = transitionsResult.transitions.map(
          (t: any) => ({
            id: t.id,
            name: t.name,
            to: t.to.name,
          }),
        );

        return {
          results: {
            availableTransitions,
          },
          log: {
            message: `Retrieved available transitions for ${issueKey}`,
            data: availableTransitions,
          },
        };
      }

      const transition = transitionsResult.transitions.find(
        (t: any) =>
          t.name.toLowerCase() === transitionName.toLowerCase() ||
          t.to.name.toLowerCase() === transitionName.toLowerCase(),
      );

      if (!transition) {
        return {
          results: {
            success: false,
            error: `Transition '${transitionName}' not found`,
            availableTransitions: transitionsResult.transitions.map(
              (t: any) => t.name,
            ),
          },
          log: {
            message: `Transition '${transitionName}' not found for ${issueKey}`,
            data: transitionsResult.transitions,
          },
        };
      }

      await jiraRequest(jiraConfig, `issue/${issueKey}/transitions`, {
        method: "POST",
        body: JSON.stringify({
          transition: {
            id: transition.id,
          },
        }),
      });

      return {
        results: {
          success: true,
          issueKey,
          transitionApplied: transition.name,
          newStatus: transition.to.name,
        },
        log: {
          message: `Jira issue ${issueKey} transitioned to ${transition.to.name}`,
          data: { transition: transition.name, status: transition.to.name },
        },
      };
    } catch (error) {
      return {
        results: {
          success: false,
        },
        log: {
          message: `Failed to transition Jira issue ${issueKey}`,
          data: error,
        },
      };
    }
  },
};
