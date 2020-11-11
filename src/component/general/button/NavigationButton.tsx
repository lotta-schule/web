import React from 'react';
import clsx from 'clsx';
import './navigation-button.css';

export interface NavigationButtonProps {
  navigationNavigationButton: boolean;
  /**
   * NavigationButton contents
   */
  label: string
  selected?: boolean;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const NavigationButton: React.FC<NavigationButtonProps> = ({
  label,
  navigationNavigationButton,
  selected,
  ...props
}) => {
  return (
    <button
      type="button"
      className={clsx('lotta-navigation-button', { ['selected']: selected })}
      {...props}
    >
      <span className={'lotta-navigation-button_icon-text'}>{label}</span>
    </button>
  );
};
