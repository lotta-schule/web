import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createLink } from 'apollo-absinthe-upload-link';
import { ApolloLink, concat, NextLink } from 'apollo-link';
import { get } from 'js-cookie';
import axios, { AxiosRequestConfig } from 'axios';

const customFetch = (url: string, options: any) => {
    const slug = window.location.host.split('.')[0];
    const jwtToken = get(process.env.REACT_APP_AUTHENTICATION_TOKEN_NAME);

    const { headers, body, method, ...miscOptions } = options;

    const config: AxiosRequestConfig = {
        ...miscOptions,
        headers: {
            ...headers,
            tenant: `slug:${slug}`,
            ...(jwtToken ? {
                Authorization: `Bearer ${jwtToken}`
            } : {})
        },
        url,
        method,
        data: body,
    };

    return axios(config).then(axiosResponse => {
        return new Response(JSON.stringify(axiosResponse.data), {
            headers: new Headers(axiosResponse.headers),
            status: axiosResponse.status,
            statusText: axiosResponse.statusText,
        });
    });
};

const stripTypenames = (obj: any, propToDelete: string): any => {
    for (const property in obj) {
        if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
            delete obj.property;
            const newData = stripTypenames(obj[property], propToDelete);
            obj[property] = newData;
        } else {
            if (property === propToDelete) {
                delete obj[property];
            }
        }
    }
    return obj;
};

export const client = new ApolloClient({
    link: concat(
        new ApolloLink((operation, forward) => {
            if (operation.variables) {
                operation.variables = stripTypenames(operation.variables, '__typename');
                return forward ? forward(operation) : null;
            }
            return forward ? forward(operation) : null;
        },
        ),
        createLink({
            uri: process.env.REACT_APP_API_URL,
            fetch: customFetch,
        })
    ),
    cache: new InMemoryCache()
});