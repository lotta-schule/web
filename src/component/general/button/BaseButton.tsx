import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import clsx from 'clsx';
import './base-button.scss';

export interface BaseButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  /**
   * Wether the button is currently 'active' or 'selected'
   */
  selected?: boolean;

  /**
   * Chose from different styles
   */
  variant?: 'default' | 'fill';

  /**
   * Content to show on the button
   */
  children?: any;
}

/**
 * Primary UI component for user interaction
 */
export const BaseButton: React.FC<BaseButtonProps> = ({ children, variant = 'default', selected, ...props }) => {
  return (
    <button
      {...props}
      type={props.type ?? 'button'}
      className={clsx('lotta-base-button', `lotta-base-button__variant__${variant}`, { selected }, props.className)}
    >
      {children}
    </button>
  );
};
