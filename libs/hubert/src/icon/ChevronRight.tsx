import * as React from 'react';
import clsx from 'clsx';

import styles from './SvgIcon.module.scss';

export const ChevronRight = React.memo(
  ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      focusable="false"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={clsx(styles.root, className)}
      data-testid="chevron-right-icon"
      {...props}
    >
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </svg>
  )
);
ChevronRight.displayName = 'ChevronRightIcon';
