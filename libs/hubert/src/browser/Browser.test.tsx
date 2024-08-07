import * as React from 'react';
import { render } from '../test-utils';
import { Browser } from './Browser';
import { NodeList } from './NodeList';
import { BrowserNode } from './BrowserStateContext';

describe('Browser', () => {
  it('should render the Browser', async () => {
    const screen = render(
      <Browser
        className="test"
        renderNodeList={({ path }) => {
          const nodes: BrowserNode[] =
            path.length === 0
              ? [{ id: '1', name: 'test', type: 'directory', parent: null }]
              : [];

          return <NodeList path={path} nodes={nodes} />;
        }}
        onRequestChildNodes={async () => []}
      />
    );
    expect(screen.container.querySelector('.test')).toBeInTheDocument();

    expect(screen.getByRole('toolbar')).toBeVisible();
    expect(screen.getByRole('navigation')).toBeVisible();
    expect(screen.getByRole('navigation')).toBeVisible();
  });
});
