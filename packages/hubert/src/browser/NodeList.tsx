import * as React from 'react';
import {
  useBrowserState,
  BrowserNode,
  BrowserPath,
} from './BrowserStateContext';
import { NodeListItem } from './NodeListItem';
import { isDirectoryNode } from './utils';
import { useIsMobile } from '../util';
import clsx from 'clsx';

import styles from './NodeList.module.scss';

export type NodeListProps = {
  path: BrowserPath<'directory'>;
  nodes: null | BrowserNode[];
};

export const NodeList = React.memo(({ path, nodes }: NodeListProps) => {
  const isMobile = useIsMobile();
  const listRef = React.useRef<HTMLElement>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  const {
    currentPath,
    selected,
    isNodeDisabled,
    mode,
    onNavigate,
    onSelect,
    setIsFilePreviewVisible,
  } = useBrowserState();

  const sortedSelected = React.useMemo(
    () =>
      [...selected].sort((n1, n2) =>
        n1.at(-1)?.type !== n2.at(-1)?.type
          ? Number(n1.at(-1)?.type === 'directory')
          : n1.at(-1)?.name.localeCompare(n2.at(-1)?.name ?? '') ?? 0
      ),
    [selected]
  );

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (isMounted && !isMobile && path.length === currentPath.length) {
      listRef.current?.scrollIntoView({
        inline: 'start',
        behavior: 'smooth',
      });
    }
  }, [path.length, currentPath.length, isMobile, isMounted]);

  const onKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      const currentListSelected = sortedSelected.filter(
        (s) => s.at(-1)?.parent === (path.at(-1)?.id ?? null)
      );
      if (e.key === 'ArrowDown') {
        const reversedNodeIndex = Array.from(nodes ?? [])
          .reverse()
          .findIndex((n) =>
            currentListSelected.find((s) => s.at(-1)?.id === n.id)
          );

        const lastSelectedNodeIndex =
          reversedNodeIndex > -1 ? nodes!.length - 1 - reversedNodeIndex : -1;

        if (lastSelectedNodeIndex < 0) {
          return;
        }

        const nextNode = nodes?.at(lastSelectedNodeIndex + 1);
        const nextNodePath = [...path, nextNode!];

        if (!nextNode) {
          return;
        }

        if (e.shiftKey) {
          if (mode === 'select') {
            return;
          }
          onSelect?.([...sortedSelected, nextNodePath]);
          if (currentPath.at(-1)?.id !== nextNode.parent) {
            onNavigate?.(path);
          }
          return;
        }

        onSelect?.([nextNodePath]);
        if (isDirectoryNode(nextNode)) {
          onNavigate?.([...path, nextNode]);
        }
      }

      if (e.key === 'ArrowUp') {
        const firstSelectedNodeIndex =
          nodes?.findIndex((n) =>
            currentListSelected.find((s) => s.at(-1)?.id === n.id)
          ) ?? -1;

        if (firstSelectedNodeIndex < 1) {
          return;
        }

        const previousNode = nodes?.at(firstSelectedNodeIndex - 1);
        const previousNodePath = [...path, previousNode!];

        if (!previousNode) {
          return;
        }

        if (e.shiftKey) {
          if (mode === 'select') {
            return;
          }
          onSelect?.([...sortedSelected, previousNodePath]);
          if (currentPath.at(-1)?.id !== previousNode.parent) {
            onNavigate?.(path);
          }
          return;
        }

        onSelect?.([previousNodePath]);
        if (isDirectoryNode(previousNode)) {
          onNavigate?.([...path, previousNode]);
        }
      }

      if (e.key === 'ArrowLeft') {
        const selectedNode = selected.at(-1);

        if (
          !selectedNode ||
          selectedNode.at(-1)?.parent !== (path.at(-1)?.id ?? null)
        ) {
          return;
        }

        const targetNodePath = path;

        if (targetNodePath.length > 0) {
          onSelect?.([targetNodePath]);
          if (path.length < currentPath.length + 1) {
            onNavigate?.(currentPath.slice(0, path.length));
          }
        }
      }

      if (e.key === 'ArrowRight') {
        const selectedDirectory = selected.at(-1)?.at(-1);
        const firstNode = nodes?.at(0);

        if (!firstNode || !selectedDirectory) {
          return;
        }

        if (
          !isDirectoryNode(selectedDirectory) ||
          selectedDirectory.id !== firstNode.parent
        ) {
          return;
        }

        onSelect?.([[...path, firstNode]]);
        onNavigate?.(path);
      }

      if (e.key === 'a' && (e.metaKey || e.ctrlKey)) {
        if (mode === 'select') {
          return;
        }
        const selectedNode = selected.at(-1)?.at(-1);

        if (selectedNode && selectedNode.parent !== (path.at(-1)?.id ?? null)) {
          // If the selected node is not in the current directory, do nothing
          return;
        }
        e.preventDefault();
        onSelect?.(
          nodes
            ?.filter((n) => !(isNodeDisabled?.(n) ?? false))
            .map((n) => [...path, n]) ?? []
        );
      }
    },
    [nodes, sortedSelected, onSelect]
  );

  React.useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  React.useEffect(() => {
    if (nodes !== null) {
      const selectedToUnselectIds = selected
        .filter(
          (s) =>
            (s.at(-2)?.id ?? null) === (path.at(-1)?.id ?? null) &&
            !nodes.some((n) => n.id === s.at(-1)?.id)
        )
        .map((sp) => sp.at(-1)?.id)
        .filter(Boolean);

      if (selectedToUnselectIds.length > 0) {
        onSelect?.(
          selected.filter((s) => !selectedToUnselectIds.includes(s.at(-1)?.id))
        );
      }
    }
  }, [nodes]);

  if (!nodes?.length) {
    return (
      <div ref={listRef as any} className={clsx(styles.root, styles.isEmpty)}>
        {nodes !== null && 'Keine Dateien'}
      </div>
    );
  }

  return (
    <ul className={styles.root} role="listbox" ref={listRef as any}>
      {nodes.map((node, currentNodeIndex) => {
        const isSelected = selected.some(
          (npath) => npath.at(-1)?.id === node.id
        );
        return (
          <NodeListItem
            key={node.id}
            parentPath={path}
            node={node}
            isDisabled={isNodeDisabled?.(node) ?? false}
            isSelected={isSelected}
            onClick={(e) => {
              if (e.shiftKey) {
                if (selected.length > 0) {
                  if (selected.at(-1)!.at(-1)?.parent === node.parent) {
                    if (mode !== 'select') {
                      e.preventDefault();
                      e.stopPropagation();
                      const firstSelectedIndex = nodes.findIndex((n) =>
                        selected.some((s) => s.at(-1)?.id === n.id)
                      );
                      const lastSelectedIndex = [...nodes]
                        .reverse()
                        .findIndex((n) =>
                          selected.some((s) => s.at(-1)?.id === n.id)
                        );

                      const start = Math.min(
                        firstSelectedIndex,
                        currentNodeIndex
                      );
                      const end = Math.max(
                        nodes.length - 1 - lastSelectedIndex - 1,
                        currentNodeIndex
                      );

                      onSelect([
                        ...selected,
                        ...nodes
                          .slice(start, end + 1)
                          .filter(
                            (n) => !selected.some((s) => s.at(-1)?.id === n.id)
                          )
                          .filter((n) => !(isNodeDisabled?.(n) ?? false))
                          .map((n) => [...path, n]),
                      ]);
                      return;
                    }
                  }
                }
              }

              if (e.ctrlKey || e.metaKey) {
                if (selected.length > 0) {
                  if (selected.at(-1)!.at(-1)?.parent === node.parent) {
                    if (mode !== 'select') {
                      e.preventDefault();
                      e.stopPropagation();

                      if (isSelected) {
                        onSelect(
                          selected.filter((n) => n.at(-1)?.id !== node.id)
                        );
                      } else {
                        onSelect([...selected, [...path, node]]);
                      }

                      return;
                    }
                  }
                }
              }

              if (isDirectoryNode(node) && node.id !== currentPath.at(-1)?.id) {
                onNavigate([...path, node]);
                onSelect([[...path, node]]);
                return;
              }
              if (mode === 'view-and-edit') {
                setIsFilePreviewVisible?.(true);
                if (node.parent !== currentPath.at(-1)?.id) {
                  onNavigate(path);
                }
                onSelect([[...path, node]]);
              } else if (mode === 'select') {
                if (node.parent !== currentPath.at(-1)?.id) {
                  onNavigate(path);
                }
                onSelect([[...path, node]]);
                setIsFilePreviewVisible?.(true);
              } else {
                // mode is 'select-multiple'
                if (
                  (e.target as HTMLElement).parentElement?.classList.contains(
                    'HubertCheckbox'
                  ) ||
                  (e.target instanceof HTMLInputElement &&
                    e.target.type === 'checkbox')
                ) {
                  // If the checkbox was clicked, its onSelect has already
                  // been called, so we don't need to call it again
                  return;
                } else {
                  // On the other hand, if only the checkbox was clicked,
                  // don't navigate but if this was a click on the label,
                  // do navigate
                  if (node.parent !== currentPath.at(-1)?.id) {
                    onNavigate(path);
                  }
                }
                if (isSelected) {
                  onSelect(selected.filter((n) => n.at(-1)?.id !== node.id));
                } else {
                  onSelect(
                    [...selected, [...path, node]].filter(
                      (p) => p.at(-1)!.parent === (node?.parent ?? null)
                    )
                  );
                }
              }
            }}
          />
        );
      })}
    </ul>
  );
});
NodeList.displayName = 'NodeList';
