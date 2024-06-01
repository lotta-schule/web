'use client';

import { ApolloLink, split } from '@apollo/client';
import {
  NextSSRInMemoryCache,
  NextSSRApolloClient,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr';
import { createWebsocketLink } from './links/websocketLink';
import { TenantModel } from 'model';
import { createErrorLink } from './links/errorLink';
import { createAuthLink } from './links/authLink';
import { createHttpLink } from './links/httpLink';
import { createVariableInputMutationsLink } from './links/variableInputMutationsLink';
import { getMainDefinition } from '@apollo/client/utilities';
import { sendRefreshRequest } from 'api/auth';

export const createSSRClient = (
  tenant: TenantModel,
  socketUrl?: string | null,
  accessToken?: string
) => {
  const websocketLink = createWebsocketLink(tenant, socketUrl, accessToken);
  const networkLink = websocketLink
    ? split(
        (operation) => {
          const definition = getMainDefinition(operation.query);
          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          );
        },

        websocketLink as any as ApolloLink,
        createHttpLink()
      )
    : createHttpLink();

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: ApolloLink.from(
      [
        createErrorLink(),
        createAuthLink({
          initialToken: accessToken,
          sendRefreshTokenRequest: async () => {
            const res = await sendRefreshRequest({});

            if (!res) {
              throw new Error('Failed to refresh token');
            }
            return res.accessToken;
          },
        }),
        // in a SSR environment, if you use multipart features like
        // @defer, you need to decide how to handle these.
        // This strips all interfaces with a `@defer` directive from your queries.
        new SSRMultipartLink({
          stripDefer: true,
        }),
        createVariableInputMutationsLink(),
        networkLink,
      ].filter(Boolean)
    ),
  });
};
