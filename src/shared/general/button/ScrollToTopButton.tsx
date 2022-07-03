import * as React from 'react';
import { Button } from './Button';
import { ArrowUpwardRounded } from '@material-ui/icons';
import { motion } from 'framer-motion';
import { useScrollEvent } from 'util/useScrollEvent';
import { useWindowSize } from 'util/useWindowSize';

import styles from './scroll-to-top-button.module.scss';

const AnimatedButton = motion(Button);

export const ScrollToTopButton = React.memo(() => {
    const [isShown, setIsShown] = React.useState(false);

    const { innerHeight } = useWindowSize();
    const onScroll = React.useCallback(() => {
        setIsShown(window.scrollY > 2 * innerHeight);
    }, [innerHeight]);
    useScrollEvent(onScroll, 1000, [onScroll]);

    return (
        <AnimatedButton
            className={styles.root}
            title={'Zum Anfang der Seite scrollen'}
            icon={<ArrowUpwardRounded />}
            initial={'hidden'}
            animate={isShown ? 'visible' : 'hidden'}
            variants={{
                visible: {
                    opacity: 1,
                    scale: 1,
                },
                hidden: {
                    opacity: 0,
                    scale: 0,
                },
            }}
            onClick={() => {
                window.scroll({
                    top: 0,
                    behavior: 'smooth',
                });
            }}
        />
    );
});
ScrollToTopButton.displayName = 'ScrollToTopButton';
