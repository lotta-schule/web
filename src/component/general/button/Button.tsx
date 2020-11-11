import React from 'react';
import clsx from 'clsx';
import './button.css';

export interface ButtonProps {
  /**
   * Button contents
   */
  label: string
  /**
   * Icon to show on the button side
   */
  icon?: React.ReactElement;
  /**
   * Optional click handler
   */
  onClick?: () => void;
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
    <button
      type="button"
      className={'lotta-button'}
      {...props}
    >
      {icon && (
        <span className={'lotta-button_icon'}>{icon}</span>
      )}
      <span className={'lotta-button_icon-text'}>{label}</span>
    </button>
  );
};
