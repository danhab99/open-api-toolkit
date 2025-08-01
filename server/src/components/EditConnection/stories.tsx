import type { Meta, StoryObj } from "@storybook/react";
import { EditConnection } from "./component";
import { exampleOpenAPIConnection } from "../../examples";

// More on how to set up stories at:
// https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof EditConnection> = {
  title: "EditConnection",
  component: EditConnection,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Test: Story = {
  argTypes: {
    mcp: { defaultValue: exampleOpenAPIConnection },
  },
};
