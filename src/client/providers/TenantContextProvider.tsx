import * as React from 'react';
import { HubertProvider } from '@lotta-schule/hubert';
import { DefaultThemes } from '@lotta-schule/theme';
import { fonts } from 'administration/system/presentation/fonts';
import { useTenant } from 'util/tenant/useTenant';
import { Authentication } from 'shared/Authentication';
import { UploadQueueProvider } from 'shared/fileExplorer/context/UploadQueueContext';

const defaultTheme = DefaultThemes.standard;

export type TenantContextProviderProps = {
    children: React.ReactNode;
}

export const TenantContextProvider = React.memo(({ children }: TenantContextProviderProps) => {
    const tenant = useTenant();

    return (
        <HubertProvider
            theme={{
                ...defaultTheme,
                ...tenant.configuration.customTheme,
            }}
            supportedFonts={fonts}
        >
            <Authentication />
            <UploadQueueProvider>
                {children}
            </UploadQueueProvider>
        </HubertProvider>
    );
});
TenantContextProvider.displayName = 'TenantContextProviders';
