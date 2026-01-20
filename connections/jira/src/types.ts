// Jira API Response Types

export interface JiraUser {
  accountId: string;
  displayName: string;
  emailAddress?: string;
}

export interface JiraStatus {
  id: string;
  name: string;
  statusCategory: {
    id: number;
    key: string;
    name: string;
  };
}

export interface JiraIssueType {
  id: string;
  name: string;
  subtask: boolean;
}

export interface JiraPriority {
  id: string;
  name: string;
}

export interface JiraProject {
  id: string;
  key: string;
  name: string;
}

// Atlassian Document Format (ADF) - simplified
export interface JiraADF {
  type: string;
  version: number;
  content: Array<{
    type: string;
    content: Array<{
      type: string;
      text: string;
    }>;
  }>;
}

export interface JiraIssueFields {
  summary: string;
  description?: string | JiraADF;
  status?: JiraStatus;
  assignee?: JiraUser;
  reporter?: JiraUser;
  priority?: JiraPriority;
  issuetype?: JiraIssueType;
  project?: JiraProject;
  created?: string;
  updated?: string;
  [key: string]: unknown;
}

export interface JiraIssue {
  id: string;
  key: string;
  self: string;
  fields: JiraIssueFields;
}

export interface JiraComment {
  id: string;
  self: string;
  author?: JiraUser;
  body: string | JiraADF;
  created: string;
  updated?: string;
}

export interface JiraTransition {
  id: string;
  name: string;
  to: JiraStatus;
}

export interface JiraTransitionsResponse {
  transitions: JiraTransition[];
}

export interface JiraSearchResponse {
  total: number;
  maxResults: number;
  startAt: number;
  issues: JiraIssue[];
}

export interface JiraCreateIssueResponse {
  id: string;
  key: string;
  self: string;
}

export interface JiraCreateIssueFields {
  project: {
    key: string;
  };
  summary: string;
  description?: JiraADF;
  issuetype: {
    name: string;
  };
  priority?: {
    name: string;
  };
  [key: string]: unknown;
}

export interface JiraIssueUpdateFields {
  summary?: string;
  description?: JiraADF;
  priority?: {
    name: string;
  };
  [key: string]: unknown;
}
