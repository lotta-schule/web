import * as React from 'react';
import clsx from 'clsx';

import styles from './SvgIcon.module.scss';

export const FileAudio = React.memo(
  React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
    ({ className, ...props }, ref) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
        viewBox="0 0 384 512"
        aria-hidden="true"
        className={clsx(styles.root, className)}
        data-testid="file-audio-icon"
        ref={ref}
        {...props}
      >
        <path
          fill="#007E84"
          d="M64,0C28.7,0,0,28.7,0,64v384c0,35.3,28.7,64,64,64h256c35.3,0,64-28.7,64-64V160H256c-17.7,0-32-14.3-32-32V0
	H64z M256,0v128h128L256,0z M258,226.3c37.1,22.4,62,63.1,62,109.7s-24.9,87.3-62,109.7c-7.6,4.6-17.4,2.1-22-5.4s-2.1-17.4,5.4-22
	c28-16.8,46.6-47.4,46.6-82.3s-18.6-65.5-46.5-82.3c-7.6-4.6-10-14.4-5.4-22s14.4-10,22-5.4H258z M166.1,257.2
	c6,2.5,9.9,8.3,9.9,14.8v128c0,6.5-3.9,12.3-9.9,14.8s-12.9,1.1-17.4-3.5L113.4,376H80c-8.8,0-16-7.2-16-16v-48c0-8.8,7.2-16,16-16
	h33.4l35.3-35.3C153.3,256.1,160.2,254.8,166.1,257.2L166.1,257.2z M217.1,292.1c6.6-5.9,16.7-5.3,22.6,1.3
	c10.1,11.2,16.3,26.2,16.3,42.6s-6.2,31.4-16.3,42.7c-5.9,6.6-16,7.1-22.6,1.3s-7.1-16-1.3-22.6c5.1-5.7,8.1-13.1,8.1-21.3
	s-3.1-15.7-8.1-21.3c-5.9-6.6-5.3-16.7,1.3-22.6L217.1,292.1z"
        />
      </svg>
    )
  )
);
FileAudio.displayName = 'FileAudioIcon';
