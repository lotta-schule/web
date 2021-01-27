import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import { GroupedButton, GroupedButtonProps } from '../component/general/button/GroupedButton';
import { FormatBold, FormatItalic, FormatUnderlined } from '@material-ui/icons';


export default {
    title: 'Buttons/GroupedButtons',
    component: GroupedButton,
    argTypes: {
    },
} as Meta;

const Template: Story<{buttons: GroupedButtonProps[]}> = ({ buttons }) => (
    <div>
        {buttons.map(buttonProps => <GroupedButton {...buttonProps} />)}
    </div>
);
    
export const Default = Template.bind({});
Default.args = {
    buttons: [
        { icon: <FormatBold /> , selected: true },
        { icon: <FormatItalic /> },
        { icon: <FormatUnderlined /> }
    ]
};

export const Many = Template.bind({});
Many.args = {
    buttons: [
        { label: 'F' },
        { label: 'I' },
        { label: 'U' },
        { label: 'U' },
        { label: 'U' },
        { label: 'U' },
        { label: 'U' },
        { label: 'U' },
        { label: 'U' },
        { label: 'U' },
    ]
};