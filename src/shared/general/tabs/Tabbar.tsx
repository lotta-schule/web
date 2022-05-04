import * as React from 'react';
import clsx from 'clsx';

import styles from './Tab.module.scss';
import { Tab, TabProps } from './Tab';

export type TabbarProps = {
    className?: string;
    value?: string | number;
    onChange?: (value: string | number) => void;
    children?: any;
};

export const Tabbar: React.FC<TabbarProps> = ({
    className,
    onChange,
    value,
    children,
}) => {
    return (
        <div className={clsx(styles.tabbar, className)}>
            {React.Children.map(
                children as any,
                (child: React.ReactElement<TabProps>, i) =>
                    React.cloneElement(child as any, {
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
