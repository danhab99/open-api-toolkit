import type { Meta, StoryObj } from '@storybook/react';
import { ConnectionCard } from './component';
import { McpConnection } from '../../../types';

// More on how to set up stories at:
// https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof ConnectionCard> = {
  title: 'ConnectionCard',
  component: ConnectionCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Test: Story = {
  args: {
    mcp: {
      name: "Example MCP Connection",
      userDescription: "Connects to the Example AI system",
      aiDescription: "A connection to the Example AI MCP system for resource coordination",

      mcp: {
        id: "mcp-001",
        name: "Example MCP",
        userDescription: "An example MCP system used for demo purposes",
        aiDescription: "Provides tools and resources for handling demo workflows",

        configurationArguments: [
          {
            id: "config-username",
            name: "Username",
            userDescription: "Your login username",
            aiDescription: "Used to authenticate the user",
            type: "string"
          },
          {
            id: "config-retries",
            name: "Retry Count",
            userDescription: "Number of retries for failed requests",
            aiDescription: "Defines the number of retry attempts",
            type: "number"
          }
        ],

        resources: [
          {
            name: "Example Resource",
            userDescription: "Demo data resource",
            aiDescription: "Used to fetch example data for workflows"
          }
        ],

        tools: [
          {
            name: "Example Tool",
            userDescription: "A tool to run example actions",
            aiDescription: "Executes mock tasks for demonstration purposes",
            arguments: [
              {
                id: "arg-mode",
                name: "Mode",
                userDescription: "Mode of operation",
                aiDescription: "Controls tool behavior mode",
                type: "string"
              }
            ]
          }
        ]
      },

      config: [
        {
          id: "config-username",
          configId: "config-username",
          name: "Username",
          userDescription: "Your login username",
          aiDescription: "Used to authenticate the user",
          type: "string",
          value: "demo_user" as string
        },
        {
          id: "config-retries",
          configId: "config-retries",
          name: "Retry Count",
          userDescription: "Number of retries for failed requests",
          aiDescription: "Defines the number of retry attempts",
          type: "number",
          value: 3 as number
        }
      ]
    } as McpConnection,
  }
};
