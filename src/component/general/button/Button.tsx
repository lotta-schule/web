import React from 'react';
import { BaseButton, BaseButtonProps } from './BaseButton';
import clsx from 'clsx';
import './button.css';

export interface ButtonProps extends BaseButtonProps {
  /**
   * Button contents
   */
  label?: string
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
  ...props
}) => {
  return (
    <BaseButton {...props} className={clsx('lotta-button', props.className)}>
      {icon && (
        <span className={'lotta-button_icon'}>{icon}</span>
      )}
      {label && (
        <span className={'lotta-button_text'}>{label}</span>
      )}
    </BaseButton>
  );
};
