import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { Avatar, AvatarProps } from '../component/general/avatar/Avatar';
import { Close } from '@material-ui/icons';

export default {
  title: 'Example/Avatar',
  component: Avatar,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<AvatarProps> = (args) => <Avatar {...args} />;

export const Murray = Template.bind({});
Murray.args = {
  src: 'http://www.fillmurray.com/50/50'
};

export const Cage = Template.bind({});
Cage.args = {
  src: 'http://placecage.com/100/100'
};
