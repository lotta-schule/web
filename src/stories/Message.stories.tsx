import * as React from 'react';
import { Story, Meta } from '@storybook/react';
import { Message } from 'shared/general/Message';
import { ErrorMessage } from 'shared/general/ErrorMessage';
import { SuccessMessage } from 'shared/general/SuccessMessage';

export default {
    title: 'util/Message',
    component: Message,
} as Meta;

const DefaultTemplate: Story = (args: any) => <Message {...args} />;
const ErrorTemplate: Story = (args: any) => <ErrorMessage {...args} />;
const SuccessTemplate: Story = (args: any) => <SuccessMessage {...args} />;

export const Default = DefaultTemplate.bind({});
Default.args = {
    message: 'Hallo',
    color: '#ccc',
};
export const Empty = DefaultTemplate.bind({});
Empty.args = {
    message: '',
    color: '#ccc',
};

export const ErrorMsg = ErrorTemplate.bind({});
ErrorMsg.args = {
    error: new Error('Upsi'),
};

export const SuccessMsg = SuccessTemplate.bind({});
SuccessMsg.args = {
    message: 'Glückwunsch',
};
