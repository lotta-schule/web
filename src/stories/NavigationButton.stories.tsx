import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { NavigationButton, NavigationButtonProps } from '../component/general/button/NavigationButton';
import { Close } from '@material-ui/icons';

export default {
  title: 'Buttons/NavigationButton',
  component: NavigationButton,
  argTypes: {
  },
} as Meta;

const Template: Story<NavigationButtonProps> = (args) => <NavigationButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Button',
};

export const Selected = Template.bind({});
Selected.args = {
  label: 'Button',
  selected: true,
};


