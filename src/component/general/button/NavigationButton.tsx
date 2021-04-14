import * as React from 'react';
import { Button, ButtonProps } from './Button';
import clsx from 'clsx';
import './navigation-button.css';

export type NavigationButtonProps = ButtonProps;

export const NavigationButton = React.memo<NavigationButtonProps>((props) => {
    return (
        <Button
            {...props}
            className={clsx('lotta-navigation-button', props.className)}
        />
    );
});
