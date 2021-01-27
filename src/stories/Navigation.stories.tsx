import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { Navigation, NavigationProps } from '../component/general/navigation/Navigation';
import { NavigationButton } from 'component/general/button/NavigationButton';

export default {
    title: 'Navigation/Main',
    component: Navigation,
    argTypes: {
    },
  } as Meta;
  
  const Template: Story<NavigationProps> = (args) => <Navigation {...args} />;
  
  export const Main = Template.bind({});
  Main.args = {
     primaryButtons: [
       <NavigationButton label={'Test'} />,
       <NavigationButton label={'Test'} selected />,
       <NavigationButton label={'Test'} />,
       <NavigationButton label={'Test'} />,
       <NavigationButton label={'Test'} />,
      ],
      secondaryButtons: [
        <NavigationButton label={'Test'} />,
        <NavigationButton label={'Test'} selected />,
        <NavigationButton label={'Test'} />
       ]
  };

  export const WithoutSecondary = Template.bind({});
  WithoutSecondary.args = {
     primaryButtons: [
       <NavigationButton label={'Test'} />,
       <NavigationButton label={'Test'} selected />,
       <NavigationButton label={'Test'} />,
       <NavigationButton label={'Test'} />,
       <NavigationButton label={'Test'} />,
      ]
  };

  // export const Secondary = Template.bind({});
  // Secondary.args = {
  //   secondary: true
  // };