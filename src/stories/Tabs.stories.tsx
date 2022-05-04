import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { Tabbar } from '../shared/general/tabs/Tabbar';
import { Tab } from 'shared/general/tabs/Tab';

export default {
    title: 'Layout/Tabbar',
    component: Tabbar,
    argTypes: {},
} as Meta;

const Template: Story = (args) => {
    const [value, setValue] = React.useState('0');
    return (
        <Tabbar value={value} onChange={(value) => setValue(value as string)}>
            <Tab value={'0'}>Tab1 bla bla bla</Tab>
            <Tab value={'1'}>Tab2</Tab>
            <Tab value={'2'}>Tab3</Tab>
            <Tab value={'3'}>Tab4 dingsi bumso</Tab>
            <Tab value={'4'}>Tab5</Tab>
        </Tabbar>
    );
};

export const Default = Template.bind({});
Default.args = {
    value: 2,
};
