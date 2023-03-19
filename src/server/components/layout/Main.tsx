import * as React from 'react';
import { Navbar } from '../navigation/Navbar';
import { Box } from '@lotta-schule/hubert/src/layout/Box';
import { ResponsiveImage } from 'util/image/ResponsiveImage';
import { useImageUrl } from 'util/image/useImageUrl';
import { File } from 'util/model';
import { getTenant, getAllCategories } from 'server/loader';
import { GlobalStyles } from '../../../../hubertX/theme/GlobalStyles';
import Link from 'next/link';
import clsx from 'clsx';

import styles from './Main.module.scss';
import { getBaseUrl } from 'server/util';

export interface MainProps {
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
}

export const Main = async ({ className, children, style }: MainProps) => {
    const tenant = await getTenant();

    if (!tenant) {
        throw new Error('Tenant not found');
    }

    const categories = await getAllCategories();
    const baseUrl = getBaseUrl();

    const backgroundImageUrl =
        tenant.configuration.backgroundImageFile &&
        File.getFileRemoteLocation(
            baseUrl,
            tenant.configuration.backgroundImageFile
        );
    const logoImageUrl =
        tenant.configuration.logoImageFile &&
        File.getFileRemoteLocation(baseUrl, tenant.configuration.logoImageFile);
    const { url: imageUrlSimple } = useImageUrl(backgroundImageUrl, {
        width: 3000,
    });
    const { url: imageUrlRetina } = useImageUrl(backgroundImageUrl, {
        width: 1500,
    });

    return (
        <Box className={clsx(styles.root, className)} style={style}>
            <GlobalStyles />
            {tenant.configuration.backgroundImageFile && (
                <style
                    dangerouslySetInnerHTML={{
                        __html: `
                    @media screen and (min-width: 600px) {
                        body::after {
                            background-image: url(${imageUrlSimple});
                            background-image: image-set(url(${imageUrlSimple}) 1x, url(${imageUrlRetina}) 2x);
                        }
                    }
                `,
                    }}
                />
            )}
            <header className={styles.header}>
                <div className={styles.logoGridItem}>
                    {logoImageUrl && (
                        <Link href={'/'} title={'Startseite'}>
                            <ResponsiveImage
                                resize={'inside'}
                                height={80}
                                src={logoImageUrl}
                                alt={`Logo ${tenant.title}`}
                            />
                        </Link>
                    )}
                </div>
                <div className={styles.titleGridItem}>
                    <h1>{tenant.title}</h1>
                </div>
            </header>
            <Navbar categories={categories} />
            <main className={styles.main}>
                {children}
                {'<NoSsr> <ScrollToTopButton /> </NoSsr>'}
            </main>
        </Box>
    );
};
