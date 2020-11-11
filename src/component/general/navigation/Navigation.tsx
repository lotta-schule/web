import { Menu } from '@material-ui/icons';
import React from 'react';
import { NavigationButton, } from '../button/NavigationButton';
import './navigation.css';

export interface NavigationProps {
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const Navigation: React.FC<NavigationProps> = ({
  ...props
}) => {
  return (
    <ul>
      <li>
        <NavigationButton label={'test'} />
      </li>
      <li>
        <NavigationButton label={'test'} />
      </li>
      <li>
        <NavigationButton label={'test'} />
      </li>
      <li>
        <NavigationButton label={'test'} />
      </li>
      <li>
        <NavigationButton label={'test'} />
      </li>
      <div className={'mobile-menu'}>
        <Menu />
      </div>
    </ul>
  );
};
