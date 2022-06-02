import * as React from 'react';
import clsx from 'clsx';

import styles from './List.module.scss';
import { Divider } from '../divider/Divider';

export type ListProps = React.HTMLProps<HTMLUListElement>;

export const List: React.FC<ListProps> = ({
    children,
    className,
    ...props
}) => {
    return (
        <ul className={clsx(styles.root, className)} {...props}>
            {children}
        </ul>
    );
};
List.displayName = 'List';

export type ListItemProps = (
    | (React.HTMLProps<HTMLLIElement> & { isDivider?: boolean })
    | React.HTMLProps<HTMLLinkElement>
) & {
    leftSection?: React.ReactNode;
    rightSection?: React.ReactNode;
};

export const ListItem = React.forwardRef<
    HTMLLinkElement | HTMLLIElement,
    ListItemProps
>(({ children, className, leftSection, rightSection, href, ...props }, ref) => {
    if ('isDivider' in props) {
        const { isDivider, ...rest } = props;
        return (
            <li
                className={clsx(styles.li, styles.isDivider, className)}
                disabled
                {...rest}
            >
                <Divider />
            </li>
        );
    }
    const elementName = href ? 'a' : 'li';
    return React.createElement(
        elementName,
        { className: clsx(styles.li, className), href, ref, ...props },
        <>
            {leftSection && <div>{leftSection}</div>}
            <div className={styles.mainSection}>{children}</div>
            {rightSection && <div>{rightSection}</div>}
        </>
    );
});
ListItem.displayName = 'ListItem';

export type ListItemSecondaryTextProps = React.HTMLProps<HTMLSpanElement>;

export const ListItemSecondaryText: React.FC<ListItemSecondaryTextProps> = ({
    children,
}) => <span className={styles.listItemSecondaryText}>{children}</span>;
ListItemSecondaryText.displayName = 'ListItemSecondaryText';
