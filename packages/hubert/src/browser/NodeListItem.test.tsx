import * as React from 'react';
import { vi } from 'vitest';
import {
  TestBrowserWrapper,
  TestBrowserWrapperProps,
  fixtures,
  render,
  waitFor,
} from '../test-utils';
import { NodeListItem, NodeListItemProps } from './NodeListItem';
import userEvent from '@testing-library/user-event';

const filePath = fixtures.getPathForNode('19');
const someOtherFile = {
  id: '44',
  name: 'other-file.jpg',
  type: 'file',
  parent: '3',
  meta: {},
} as const;

const WrappedNodeListItem = ({
  node,
  parentPath = fixtures.getPathForNode(node).slice(0, -1),
  currentPath = parentPath,
  ...props
}: TestBrowserWrapperProps &
  Partial<NodeListItemProps> &
  Pick<NodeListItemProps, 'node'>) => (
  <TestBrowserWrapper currentPath={currentPath} {...props}>
    <NodeListItem node={node} parentPath={parentPath} />
  </TestBrowserWrapper>
);

describe('Browser/NodeListItem', () => {
  describe('render directory', () => {
    it('should render the name of a directory', () => {
      const node = filePath.at(-1);
      const screen = render(<WrappedNodeListItem node={node} />);

      expect(screen.getByRole('option')).toHaveAccessibleName(node.name);
    });

    it('should render as expanded when on the path', () => {
      const node = filePath.at(1);
      const currentPath = filePath.slice(0, -1);
      const screen = render(
        <WrappedNodeListItem node={node} currentPath={currentPath} />
      );

      expect(screen.getByRole('option').ariaExpanded).toEqual('true');
    });

    describe('Default Mode (view-and-edit)', () => {
      it('should navigate to the directory on click, resetting its selection', async () => {
        const user = userEvent.setup();
        const onNavigate = vi.fn();
        const onSelect = vi.fn();
        const screen = render(
          <WrappedNodeListItem
            node={filePath[2]}
            selected={[someOtherFile]}
            onNavigate={onNavigate}
            onSelect={onSelect}
          />
        );

        await user.click(screen.getByRole('option'));

        expect(onNavigate).toHaveBeenCalledWith(filePath.slice(0, 3));
        expect(onSelect).toHaveBeenCalledWith([]);
      });

      it('should show the editing menu button', async () => {
        const screen = render(
          <WrappedNodeListItem node={filePath[2]} onNavigate={vi.fn()} />
        );

        expect(
          screen.getByRole('button', { name: /ordnermenü/i })
        ).toBeVisible();
      });

      it('should show rename-input when rename-action is active for the current node', async () => {
        const screen = render(
          <WrappedNodeListItem
            node={filePath[2]}
            currentAction={{ type: 'rename-node', path: filePath.slice(0, 3) }}
          />
        );

        expect(
          screen.getByRole('textbox', { name: /math umbenennen/i })
        ).toBeVisible();
      });

      it('should not show rename-input when rename-action is active for another node', async () => {
        const screen = render(
          <WrappedNodeListItem
            node={filePath[2]}
            currentAction={{ type: 'rename-node', path: filePath.slice(0, 2) }}
          />
        );

        expect(screen.queryByRole('textbox')).toBeNull();
      });
    });

    describe('Single selection mode (select)', () => {
      it('should navigate to the directory on click, resetting its selection', async () => {
        const user = userEvent.setup();
        const onNavigate = vi.fn();
        const onSelect = vi.fn();
        const screen = render(
          <WrappedNodeListItem
            mode="select"
            node={filePath[2]}
            selected={[someOtherFile]}
            onNavigate={onNavigate}
            onSelect={onSelect}
          />
        );

        await user.click(screen.getByRole('option'));

        expect(onNavigate).toHaveBeenCalledWith(filePath.slice(0, 3));
        expect(onSelect).toHaveBeenCalledWith([]);
      });

      it('should navigate to the parent folder of a selected file', async () => {
        const user = userEvent.setup();

        const node = { ...someOtherFile, parent: '77' };

        const onNavigate = vi.fn();
        const onSelect = vi.fn();

        const screen = render(
          <WrappedNodeListItem
            mode="select"
            parentPath={[
              {
                id: '77',
                name: 'other-tree',
                type: 'directory',
                parent: null,
                meta: {},
              },
            ]}
            currentPath={[]}
            node={node}
            onNavigate={onNavigate}
            selected={[]}
            onSelect={onSelect}
          />
        );

        await user.click(screen.getByRole('option'));

        await waitFor(() => {
          expect(onSelect).toHaveBeenCalledWith([node]);

          expect(onNavigate).toHaveBeenCalledWith([
            {
              id: '77',
              name: 'other-tree',
              type: 'directory',
              parent: null,
              meta: {},
            },
          ]);
        });
      });

      it('should not show the editing menu button', async () => {
        const screen = render(
          <WrappedNodeListItem
            mode="select"
            node={filePath[2]}
            onNavigate={vi.fn()}
          />
        );

        expect(
          screen.queryByRole('button', { name: /ordnermenü/i })
        ).toBeNull();
      });
    });

    describe('Multi selection mode (select-multiple)', () => {
      it('should navigate to the directory on click, keeping its selection', async () => {
        const user = userEvent.setup();
        const onNavigate = vi.fn();
        const screen = render(
          <WrappedNodeListItem
            mode="select-multiple"
            selected={[filePath[2]]}
            node={filePath[1]}
            onNavigate={onNavigate}
          />
        );

        await user.click(screen.getByRole('option'));

        expect(onNavigate).toHaveBeenCalledWith(filePath.slice(0, 2));
      });

      it('should not show the editing menu button', async () => {
        const screen = render(
          <WrappedNodeListItem
            mode="select-multiple"
            node={filePath[2]}
            onNavigate={vi.fn()}
          />
        );

        expect(
          screen.queryByRole('button', { name: /ordnermenü/i })
        ).toBeNull();
      });
    });
  });

  describe('render file', () => {
    it('should render the name of a directory', () => {
      const screen = render(<WrappedNodeListItem node={filePath[3]} />);

      expect(screen.getByRole('option')).toHaveAccessibleName(
        'presentation.ppt'
      );
    });

    it('should render as selected when it is', () => {
      const screen = render(
        <WrappedNodeListItem node={filePath[3]} selected={[filePath[3]]} />
      );

      expect(screen.getByRole('option').ariaExpanded).toEqual('false');
      expect(screen.getByRole('option').ariaSelected).toEqual('true');
    });

    describe('Default Mode (view-and-edit)', () => {
      it('should select the file when clicked', async () => {
        const user = userEvent.setup();

        const onNavigate = vi.fn();
        const onSelect = vi.fn();

        const screen = render(
          <WrappedNodeListItem
            node={filePath[3]}
            onNavigate={onNavigate}
            selected={[
              { id: '44', name: 'other-file.jpg', type: 'file', parent: '3' },
            ]}
            onSelect={onSelect}
          />
        );

        user.click(screen.getByRole('option'));

        await waitFor(() => {
          expect(onSelect).toHaveBeenCalledWith([filePath[3]]);

          expect(onNavigate).not.toHaveBeenCalled();
        });
      });

      it('should show the editing menu button', async () => {
        const screen = render(
          <WrappedNodeListItem node={filePath[3]} onNavigate={vi.fn()} />
        );

        expect(
          screen.getByRole('button', { name: /ordnermenü/i })
        ).toBeVisible();
      });

      it('should show rename-input when rename-action is active for the current node', async () => {
        const screen = render(
          <WrappedNodeListItem
            node={filePath[3]}
            currentAction={{
              type: 'rename-node',
              path: filePath,
            }}
          />
        );

        expect(
          screen.getByRole('textbox', { name: /presentation.ppt umbenennen/i })
        ).toBeVisible();
      });
    });
    describe('Single selection mode (select)', () => {
      it('should select the file when clicked', async () => {
        const user = userEvent.setup();

        const onNavigate = vi.fn();
        const onSelect = vi.fn();

        const screen = render(
          <WrappedNodeListItem
            mode="select"
            node={filePath[3]}
            onNavigate={onNavigate}
            selected={[someOtherFile]}
            onSelect={onSelect}
          />
        );

        await user.click(screen.getByRole('option'));

        await waitFor(() => {
          expect(onSelect).toHaveBeenCalledWith([filePath[3]]);

          expect(onNavigate).not.toHaveBeenCalled();
        });
      });

      it('should navigate to the parent folder of a selected file', async () => {
        const user = userEvent.setup();

        const node = { ...someOtherFile, parent: '77' } as const;

        const onNavigate = vi.fn();
        const onSelect = vi.fn();

        const screen = render(
          <WrappedNodeListItem
            mode="select"
            parentPath={[
              {
                id: '77',
                name: 'other-tree',
                type: 'directory',
                parent: null,
                meta: {},
              },
            ]}
            currentPath={[]}
            node={node}
            onNavigate={onNavigate}
            selected={[]}
            onSelect={onSelect}
          />
        );

        await user.click(screen.getByRole('option'));

        await waitFor(() => {
          expect(onSelect).toHaveBeenCalledWith([node]);

          expect(onNavigate).toHaveBeenCalledWith([
            {
              id: '77',
              name: 'other-tree',
              type: 'directory',
              parent: null,
              meta: {},
            },
          ]);
        });
      });

      it('should not show the editing menu button', async () => {
        const screen = render(
          <WrappedNodeListItem
            mode="select"
            node={filePath[3]}
            onNavigate={vi.fn()}
          />
        );

        expect(screen.queryByRole('button', { name: /dateimenü/i })).toBeNull();
      });
    });

    describe('Multi selection mode (select-multiple)', () => {
      it('should not show the editing menu button', async () => {
        const screen = render(
          <WrappedNodeListItem
            mode="select-multiple"
            node={filePath[3]}
            onNavigate={vi.fn()}
          />
        );

        expect(screen.queryByRole('button', { name: /dateimenü/i })).toBeNull();
      });

      it('should show a checkbox that toggles wether the file is selected', async () => {
        const user = userEvent.setup();

        const onSelect = vi.fn();

        const screen = render(
          <WrappedNodeListItem
            mode="select-multiple"
            node={filePath[3]}
            selected={[someOtherFile]}
            onSelect={onSelect}
          />
        );

        expect(screen.getByRole('checkbox')).not.toBeChecked();

        await user.click(screen.getByRole('checkbox'));

        await waitFor(() => {
          expect(onSelect).toHaveBeenCalledWith([someOtherFile, filePath[3]]);
        });

        screen.rerender(
          <WrappedNodeListItem
            mode="select-multiple"
            node={filePath[3]}
            selected={[someOtherFile, filePath[3]]}
            onSelect={onSelect}
          />
        );

        expect(screen.getByRole('checkbox')).toBeChecked();

        await user.click(screen.getByRole('checkbox'));

        expect(onSelect).toHaveBeenCalledWith([someOtherFile]);
      });
    });
  });
});
