'use client';

import * as React from 'react';
import { Drawer } from '@lotta-schule/hubert';
import { useIsMobile } from 'util/useIsMobile';
import { useReactiveVar } from '@apollo/client';
import { Footer } from 'client/components/navigation';
// import { WidgetsList } from 'category/widgetsList/WidgetsList';
import { isMobileDrawerOpenVar } from 'api/cache';

import styles from './Sidebar.module.scss';

export interface SidebarProps {
    isEmpty?: boolean;
    children?: any;
}

export const Sidebar = React.memo(({ children, isEmpty }: SidebarProps) => {
    const isMobile = useIsMobile();

    const isMobileDrawerOpen = useReactiveVar(isMobileDrawerOpenVar);
    const closeMobileDrawer = () => isMobileDrawerOpenVar(false);

    // TODO: On navigate
    closeMobileDrawer();

    if (isMobile) {
        return (
            <Drawer
                data-testid={'BaseLayoutSidebar'}
                isOpen={isMobileDrawerOpen}
                onClose={closeMobileDrawer}
            >
                {isEmpty ? '<WidgetsList widgets={[]} />' : children}
                <Footer />
            </Drawer>
        );
    } else if (isEmpty) {
        // there must be a relative container for footer positioning
        return (
            <div
                data-testid="BaseLayoutSidebar"
                style={{ position: 'relative', width: 0 }}
            >
                <Footer />
            </div>
        );
    } else {
        return (
            <aside data-testid="BaseLayoutSidebar" className={styles.root}>
                {children}
                <Footer />
            </aside>
        );
    }
});
Sidebar.displayName = 'BaseLayoutSidebar';
