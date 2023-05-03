import * as React from 'react';
import { UserNavigation } from 'layout/navigation/UserNavigation';
import { ResponsiveImage } from 'util/image/ResponsiveImage';
import clsx from 'clsx';

import styles from './Header.module.scss';
import { ClientComponentOperator } from '../ClientComponentOperator';

export interface HeaderProps {
    bannerImageUrl?: string | null;
    children?: any;
}

export const Header = React.memo<HeaderProps>(
    ({ children, bannerImageUrl }) => {
        const baseUrl = process.env.BASE_URL; // TODO: useServerData();

        const normalizedBannerImageUrl = bannerImageUrl?.startsWith('/')
            ? new URL(bannerImageUrl, baseUrl).toString()
            : bannerImageUrl;

        return (
            <section
                data-testid="Header"
                className={clsx(styles.root, {
                    [styles.hasBannerImage]: !!normalizedBannerImageUrl,
                })}
            >
                <div data-testid="HeaderContent" className={styles.subheader}>
                    {normalizedBannerImageUrl && (
                        <ResponsiveImage
                            src={normalizedBannerImageUrl}
                            alt=""
                            width={900}
                            aspectRatio={'6:1'}
                            resize={'cover'}
                            sizes="(min-width: 600px) 70vw, 100vw"
                        />
                    )}
                    <div className={styles.headerContent}>{children}</div>
                </div>
                <div className={styles.userNavigationGridItem}>
                    <ClientComponentOperator>
                        <UserNavigation />
                    </ClientComponentOperator>
                </div>
            </section>
        );
    }
);
Header.displayName = 'Header';
