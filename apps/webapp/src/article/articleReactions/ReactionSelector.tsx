import { Button, Popover } from '@lotta-schule/hubert';
import * as React from 'react';
import { Icon } from 'shared/Icon';

import styles from './ReactionSelector.module.scss';
import {
  supportedReactionIconNames,
  supportedReactionIcons,
} from './supportedReactionIcons';

export type ReactionSelectorProps = {
  trigger: HTMLElement;
  isOpen: boolean;
  onSelect: (iconName?: string) => void;
};

export const ReactionSelector = React.memo(
  ({ isOpen, trigger, onSelect }: ReactionSelectorProps) => {
    return (
      <Popover
        isOpen={isOpen}
        trigger={trigger}
        placement="top"
        onClose={() => onSelect()}
      >
        <div className={styles.root} data-testid="ReactionSelector">
          {supportedReactionIconNames.map((iconName) => (
            <Button
              key={iconName}
              data-testid={`reaction-${iconName}`}
              icon={<Icon icon={supportedReactionIcons[iconName].icon} />}
              onClick={() => onSelect(iconName)}
            />
          ))}
        </div>
      </Popover>
    );
  }
);
ReactionSelector.displayName = 'ReactionSelector';
