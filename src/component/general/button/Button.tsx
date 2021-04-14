import * as React from 'react';
import { BaseButton, BaseButtonProps } from './BaseButton';
import clsx from 'clsx';
import './button.scss';

export interface ButtonProps extends BaseButtonProps {
    /**
     * Button contents
     */
    label?: string;
    /**
     * Icon to show on the button side
     */
    icon?: React.ReactElement;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ icon, label, children, ...props }, ref) => {
        return (
            <BaseButton
                {...props}
                ref={ref}
                className={clsx('lotta-button', props.className, {
                    'only-icon': icon && !(label || children),
                })}
            >
                {icon && <span className={'lotta-button_icon'}>{icon}</span>}
                {(label ?? children) && (
                    <span className={'lotta-button_text'}>
                        {label ?? children}
                    </span>
                )}
            </BaseButton>
        );
    }
);
