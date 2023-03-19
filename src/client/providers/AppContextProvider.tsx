import * as React from 'react';
import { CategoryModel, TenantModel, UserModel } from 'model';
import { ApolloProvider } from '@apollo/client';
import { I18nextProvider } from 'react-i18next';
import { ServerDataContextProvider } from 'shared/ServerDataContext';
import { getApolloClient } from 'api/client';
import { i18n } from 'shared';
import { TenantContextProvider } from './TenantContextProvider';

import GetCategoriesQuery from 'api/query/GetCategoriesQuery.graphql';
import GetCurrentUserQuery from 'api/query/GetCurrentUser.graphql';
import GetTenantQuery from 'api/query/GetTenantQuery.graphql';

export interface AppContextProviderProps {
    categories: CategoryModel[] | null;
    currentUser: UserModel | null;
    requestBaseUrl: string;
    tenant: TenantModel;
    children: React.ReactNode;
}

export const AppContextProvider = ({
    tenant,
    categories,
    currentUser,
    requestBaseUrl,
    children,
}: AppContextProviderProps) => {
    const firstBrowserInit = React.useRef(false);

    const client = getApolloClient({ tenant });
    if (!firstBrowserInit.current) {
        client.cache.writeQuery({
            query: GetTenantQuery,
            data: { tenant },
        });
        if (categories) {
            client.cache.writeQuery({
                query: GetCategoriesQuery,
                data: { categories },
            });
        }
        if (currentUser) {
            client.cache.writeQuery({
                query: GetCurrentUserQuery,
                data: { currentUser },
            });
        }
        if (typeof window !== 'undefined') {
            const authToken = document.cookie.match(/AuthToken=(.+);?/i)?.[1];
            if (authToken) {
                localStorage.setItem('id', authToken);
            }
        }
        firstBrowserInit.current = true;
    }

    const baseUrl =
        typeof window === 'undefined'
            ? requestBaseUrl
            : requestBaseUrl ?? window.location.origin;

    return (
        <ServerDataContextProvider value={{ baseUrl }}>
            <ApolloProvider client={client}>
                <I18nextProvider i18n={i18n}>
                    <TenantContextProvider>{children}</TenantContextProvider>
                </I18nextProvider>
            </ApolloProvider>
        </ServerDataContextProvider>
    );
};
