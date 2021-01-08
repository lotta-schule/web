import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { Box } from '../component/general/box/Box';

export default {
    title: 'Box',
    component: Box,
    argTypes: {
    },
  } as Meta;
  
  const Template: Story = (args) => (
    <div style={{ width: '100vw', height: '100vh', background: 'black' }}>
      <Box {...args} />
    </div>
  );
  
  export const Default = Template.bind({});
  Default.args = {
    children: (
      <p>
        Ich bin eine Box mit Inhalt
      </p>
    )
  };
