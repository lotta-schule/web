import * as React from 'react';
import { Button, ButtonProps } from './Button';
import clsx from 'clsx';
import './grouped-buttons.scss';

export interface GroupedButtonProps extends ButtonProps {}

/**
 * Primary UI component for user interaction
 */
export const GroupedButton = React.forwardRef<
    HTMLButtonElement,
    GroupedButtonProps
>((props, ref) => {
    return (
        <Button
            {...props}
            ref={ref}
            className={clsx('lotta-grouped-button', props.className)}
        />
    );
});
