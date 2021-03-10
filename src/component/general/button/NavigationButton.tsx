import React, { memo } from 'react';
import clsx from 'clsx';
import './navigation-button.css';
import { Button, ButtonProps } from './Button';

export type NavigationButtonProps = ButtonProps;

export const NavigationButton = memo<NavigationButtonProps>(props => {
  return (
    <Button {...props} className={clsx('lotta-navigation-button', props.className)} />
  );
});
