import React from 'react';
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

/**
 * Primary UI component for user interaction
 */
export const Button: React.FC<ButtonProps> = ({
    icon,
    label,
    children,
    ...props
}) => {
    return (
        <BaseButton
            {...props}
            className={clsx('lotta-button', props.className, {
                'only-icon': icon && !(label || children),
            })}
        >
            {icon && <span className={'lotta-button_icon'}>{icon}</span>}
            {(label ?? children) && (
                <span className={'lotta-button_text'}>{label ?? children}</span>
            )}
        </BaseButton>
    );
};
