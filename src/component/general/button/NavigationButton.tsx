import React from 'react';
import clsx from 'clsx';
import './navigation-button.css';

export interface NavigationButtonProps {
  /**
   * NavigationButton contents
   */
  label: string
  /**
  * selected option
  */
  selected?: boolean;
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
export const NavigationButton: React.FC<NavigationButtonProps> = ({
  label,
  selected,
  icon,
  ...props
}) => {
  return (
    <button
      type="button"
      className={clsx('lotta-navigation-button', { ['selected']: selected })}
      {...props}
    >
      {icon && (
        <span className={'lotta-navigation-button_icon'}>{icon}</span>
      )}
      <span className={'lotta-navigation-button_icon-text'}>{label}</span>
    </button>
  );
};
