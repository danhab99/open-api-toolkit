mkdir -p ./$1/

cat <<EOT > ./$1/index.tsx 
export { $1 } from "./component";
EOT

cat <<EOT > ./$1/component.tsx
import React from "react";

export type $1Props = {
  // ...
};

export function $1(props: $1Props) {

  return (<>

  </>);
};
EOT

cat <<EOF > "$1/stories.tsx"
import type { Meta, StoryObj } from '@storybook/react';
import { ${1} } from './component';

// More on how to set up stories at:
// https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof ${1}> = {
  title: '${1}',
  component: ${1},
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
EOF


cat <<EOF > "$1/styles.module.css"
EOF
