import React, { memo } from 'react';
import clsx from 'clsx';
import './grouped-buttons.scss';
import { Button, ButtonProps } from './Button';

export interface GroupedButtonProps extends ButtonProps {}

/**
 * Primary UI component for user interaction
 */
export const GroupedButton = memo<GroupedButtonProps>(props => {
    return (
      <Button {...props} className={clsx('lotta-grouped-button', props.className)} />
    );
  });
  