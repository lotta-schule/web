import * as React from 'react';
import { pick } from 'lodash';
import { HubertProvider } from '@lotta-schule/hubert';
import {
  render,
  RenderOptions,
  renderHook,
  Queries,
  queries,
  RenderHookOptions,
} from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import { ApolloMocksOptions, getDefaultApolloMocks } from 'test/mocks';
import { i18n } from '../i18n';

export type TestSetupOptions = {
  additionalMocks?: MockedResponse[];
} & ApolloMocksOptions;

const ProviderFactory = (options: TestSetupOptions): React.FC => {
  const ComponentClass = ({ children }: { children?: React.ReactNode }) => {
    const { cache, mocks: defaultMocks } = getDefaultApolloMocks(
      pick(options, [
        'currentUser',
        'tenant',
        'categories',
        'userGroups',
        'tags',
      ])
    );

    return (
      <I18nextProvider i18n={i18n}>
        <HubertProvider>
          <MockedProvider
            mocks={[...defaultMocks, ...(options.additionalMocks || [])]}
            addTypename={false}
            cache={cache}
          >
            {children}
          </MockedProvider>
        </HubertProvider>
      </I18nextProvider>
    );
  };

  return ComponentClass;
};

const customRender = (
  ui: React.ReactElement,
  renderOptions: Omit<RenderOptions, 'wrapper'> = {},
  testSetupOptions: TestSetupOptions = {}
) =>
  render(ui, {
    wrapper: ProviderFactory(testSetupOptions),
    ...renderOptions,
  });

const customRenderHook = <
  Result,
  Props,
  Q extends Queries = typeof queries,
  Container extends Element | DocumentFragment = HTMLElement,
  BaseElement extends Element | DocumentFragment = Container,
>(
  render: (initialProps: Props) => Result,
  options?: Omit<
    RenderHookOptions<Props, Q, Container, BaseElement>,
    'wrapper'
  >,
  testSetupOptions: TestSetupOptions = {}
) =>
  renderHook(render, {
    wrapper: ProviderFactory(testSetupOptions),
    ...options,
  });

// re-export everything
export * from '@testing-library/react';

export const getMetaTagValue = (metaName: string) => {
  const metas = document.getElementsByTagName('meta');
  for (let i = 0; i < metas.length; i += 1) {
    if (
      [
        metas[i].getAttribute('name'),
        metas[i].getAttribute('property'),
      ].includes(metaName)
    ) {
      return metas[i].getAttribute('content');
    }
  }
};

// override render method
export { customRender as render };
export { customRenderHook as renderHook };
