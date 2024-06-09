import * as React from 'react';
import { File } from 'util/model';
import { Box, NoSsr, ScrollToTopButton } from '@lotta-schule/hubert';
import { ResponsiveImage } from 'util/image/ResponsiveImage';
import { loadTenant } from '../loader';
import { getBaseUrl } from '../helper';
import Link from 'next/link';
import clsx from 'clsx';

import styles from './BaseLayout.module.scss';

export type TenantLayoutProps = React.PropsWithChildren<{
  /**
   * If true, the main content will take the
   * full height of the viewport, and will rely on
   * its content having a scrollable overflow.
   */
  fullSizeScrollable?: boolean;
}>;

export const TenantLayout = async ({
  children,
  fullSizeScrollable,
}: TenantLayoutProps) => {
  const tenant = await loadTenant();
  const baseUrl = await getBaseUrl();

  return (
    <Box
      className={clsx(styles.root, {
        [styles.fullSizeScrollable]: fullSizeScrollable,
      })}
    >
      <header className={styles.header}>
        <div className={styles.logoGridItem}>
          {tenant.configuration.logoImageFile && (
            <Link href={'/'} title={'Startseite'}>
              <ResponsiveImage
                resize={'inside'}
                height={80}
                src={File.getFileRemoteLocation(
                  baseUrl,
                  tenant.configuration.logoImageFile
                )}
                alt={`Logo ${tenant.title}`}
              />
            </Link>
          )}
        </div>
        <div className={styles.titleGridItem}>
          <h1>{tenant.title}</h1>
        </div>
      </header>
      {/*<Navbar />*/}
      <main className={styles.main}>
        {children}
        {!fullSizeScrollable && (
          <NoSsr>
            <ScrollToTopButton />
          </NoSsr>
        )}
      </main>
    </Box>
  );
};
TenantLayout.displayName = 'TenantLayout';
