import type { Meta, StoryObj } from '@storybook/react';
import { CreateConnection } from './component';

// More on how to set up stories at:
// https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof CreateConnection> = {
  title: 'CreateConnection',
  component: CreateConnection,
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
    // Add story args here
  }
};
