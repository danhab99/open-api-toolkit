import type { Meta, StoryObj } from "@storybook/react";
import { NewConnectionCard } from "./component";
import { exampleOpenAPIConnectionDefinition } from "../../examples";

// More on how to set up stories at:
// https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof NewConnectionCard> = {
  title: "NewConnectionCard",
  component: NewConnectionCard,
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
    mcpDef: {
      defaultValue: exampleOpenAPIConnectionDefinition,
    },
  },
};
