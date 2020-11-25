import { ArrowRight, Menu } from '@material-ui/icons';
import clsx from 'clsx';
import React from 'react';
import { NavigationButton, } from '../button/NavigationButton';
import './navigation.scss';

export interface NavigationProps {
  /**
   * Navigation contents
   */
  secondary: boolean;

  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const Navigation: React.FC<NavigationProps> = ({
  secondary,
  ...props
}) => {
  return (
    <nav className="lotta-navbar">
      <ul>
        <li>
          <NavigationButton label={'test'} />
        </li>
        <li>
          <NavigationButton label={'test'} />
        </li>
        <li>
          <NavigationButton label={'test'} selected />
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
      <ul className="secondary">
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
          <NavigationButton label={'test'} selected />
        </li>
      </ul>
    </nav>
  );
};
