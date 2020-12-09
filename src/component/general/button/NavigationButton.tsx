import React, { memo } from 'react';
import clsx from 'clsx';
import './navigation-button.css';
import { Button, ButtonProps } from './Button';

/**
 * Primary UI component for user interaction
 */
export const NavigationButton = memo<ButtonProps>(props => {
  return (
    <Button {...props} className={clsx('lotta-navigation-button', props.className)} />
  );
});
