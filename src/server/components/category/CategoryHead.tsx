import * as React from 'react';
import { CategoryModel } from 'model';
import { Category, File } from 'util/model';
import { Tenant } from 'util/model/Tenant';
import { useImageUrl } from 'util/image/useImageUrl';
import { getTenant } from 'server/loader';
import { getBaseUrl } from 'server/util';
import Head from 'next/head';

export interface CategoryHeadProps {
    category: CategoryModel;
}


export const CategoryHead = async ({ category }: CategoryHeadProps) => {
    const baseUrl = getBaseUrl();
    const tenant = await getTenant();

    if (!tenant) {
        throw new Error('Tenant not found.');
    }

    const title = category.isHomepage
        ? tenant.title
        : `${category.title} - ${tenant.title}`;

    const description = category.isHomepage
        ? tenant.title
        : `${category.title} bei ${tenant.title}`;

    const { url: logoImageUrl } = useImageUrl(
        tenant.configuration.logoImageFile &&
            File.getFileRemoteLocation(
                baseUrl,
                tenant.configuration.logoImageFile
            ),
        { width: 320 }
    );
    const { url: bannerImageUrl } = useImageUrl(
        category.bannerImageFile &&
            File.getFileRemoteLocation(baseUrl, category.bannerImageFile),
        { width: 900, height: 150, resize: 'cover' }
    );


    const mediaImage = ((category: CategoryModel) => {
        if (category.isHomepage && logoImageUrl) {
            return { image: logoImageUrl, width: 320, height: null };
        } else if (category.bannerImageFile && bannerImageUrl) {
            return { image: bannerImageUrl, width: 900, height: 150 };
        }
        return null;
    })(category);

    return (
        <Head>
            <title>{title}</title>
            <meta name={'description'} content={description} />
            <meta property={'og:site_name'} content={tenant.title} />
            <meta property={'og:type'} content={'website'} />
            <meta
                property={'og:url'}
                content={Tenant.getAbsoluteUrl(
                    tenant,
                    category.isHomepage ? '/' : Category.getPath(category)
                )}
            />
            <meta property={'og:title'} content={title} />
            <meta property={'og:description'} content={description} />
            <meta property={'twitter:card'} content={description} />
            {mediaImage && (
                <>
                    <meta property={'og:image'} content={mediaImage.image} />
                    <meta
                        property={'og:image:width'}
                        content={String(mediaImage.width)}
                    />
                    {mediaImage.height && (
                        <meta
                            property={'og:image:height'}
                            content={String(mediaImage.height)}
                        />
                    )}
                </>
            )}
        </Head>
    );
};
CategoryHead.displayName = 'CategoryHead';
