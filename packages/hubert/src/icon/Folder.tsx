import * as React from 'react';
import clsx from 'clsx';

import styles from './SvgIcon.module.scss';

export const Folder = React.memo(
  React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
    ({ className, ...props }, ref) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={clsx(styles.root, className)}
        data-testid="folder-icon"
        ref={ref}
        {...props}
      >
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M9.17 6l2 2H20v10H4V6h5.17M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
      </svg>
    )
  )
);
Folder.displayName = 'FolderIcon';
