import React from 'react';
import clsx from 'clsx';
import './box.scss';

interface BoxProps {
  noMargin?: boolean;
}

export const Box: React.FC<BoxProps> = ({ children, noMargin }) => {
  return (
    <div className={clsx('box', { 'no-margin': noMargin })}>
      {children}
    </div>
  );
};
