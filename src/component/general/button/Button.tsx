import React from 'react';
import './button.css';

export interface ButtonProps {
  /**
   * Button contents
   */
  label: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const Button: React.FC<ButtonProps> = ({

  label,
  ...props
}) => {
  return (
    <button
      type="button"
      className={'lotta-button'}
      {...props}
    >
      {label}
    </button>
  );
};
