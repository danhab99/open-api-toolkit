import type { Meta, StoryObj } from "@storybook/react";
import { ConfigInput } from "./component";
import { fn } from "@storybook/test";
import { exampleOpenAPIConnection } from "../../examples";

// More on how to set up stories at:
// https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof ConfigInput> = {
  title: "ConfigInput",
  component: ConfigInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

// export type ConfigInputProps = {
//   config: Config;
//   onConfigChange: (c: Config) => void;
// };

export const Test: Story = {
  argTypes: {
    config: {
      defaultValue: exampleOpenAPIConnection.config[0],
    },
    onConfigChange: fn(),
  },
};
