import type { Meta, StoryObj } from "@storybook/react";
import { ListAvaliableConnections } from "./component";
import { exampleMcpConnection } from "../../../examples";

// More on how to set up stories at:
// https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof ListAvaliableConnections> = {
  title: "ListAvaliableConnections",
  component: ListAvaliableConnections,
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
    mcpDefs: [
      exampleMcpConnection,
      exampleMcpConnection,
      exampleMcpConnection,
      exampleMcpConnection,
      exampleMcpConnection,
      exampleMcpConnection,
      exampleMcpConnection,
      exampleMcpConnection,
      exampleMcpConnection,
      exampleMcpConnection,
    ],
  },
};
