import * as React from 'react';
import { TabProps } from './Tab';
import clsx from 'clsx';

import styles from './Tab.module.scss';

export type TabbarProps = {
  className?: string;
  value?: string | number;
  onChange?: (_value: string | number) => void;
  children?: any;
};

export const Tabbar = ({
  className,
  onChange,
  value,
  children,
}: TabbarProps) => {
  return (
    <div className={clsx(styles.tabbar, className)} role={'tablist'}>
      {React.Children.map(
        children as any,
        (child: React.ReactElement<TabProps>, i) =>
          child &&
          React.cloneElement(child as any, {
            role: child.props.role ?? 'tab',
            key: i,
            onClick: () => {
              onChange?.(child.props.value as string);
            },
            selected: value === child.props.value,
          })
      )}
    </div>
  );
};
Tabbar.displayName = 'Tabbar';
