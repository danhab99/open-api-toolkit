import type { Meta, StoryObj } from "@storybook/react";
import { ConnectionCard } from "./component";
import { exampleMcpConnection } from "../../examples";

// More on how to set up stories at:
// https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof ConnectionCard> = {
  title: "ConnectionCard",
  component: ConnectionCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Test: Story = {
  args: {
    mcp: exampleMcpConnection,
  },
};
