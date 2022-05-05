import * as React from 'react';
import { Menu as HeadlessMenu } from '@headlessui/react';
import { Button, ButtonProps } from '../button/Button';

export type MenuProps = {
    buttonProps: ButtonProps;
};

export const Menu: React.FC<MenuProps> = ({ buttonProps, children }) => {
    return (
        <div style={{ position: 'relative' }}>
            <HeadlessMenu>
                <HeadlessMenu.Button as={Button as any} {...buttonProps} />
                <HeadlessMenu.Items
                    style={{ position: 'absolute', zIndex: 10000 }}
                >
                    {children}
                </HeadlessMenu.Items>
            </HeadlessMenu>
        </div>
    );
};
Menu.displayName = 'Menu';
