import * as React from 'react';
import clsx from 'clsx';

import styles from './SvgIcon.module.scss';

export const Home = React.memo(
  React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
    ({ className, ...props }, ref) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={clsx(styles.root, className)}
        data-testid="home-icon"
        ref={ref}
        {...props}
      >
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    )
  )
);
Home.displayName = 'HomeIcon';
