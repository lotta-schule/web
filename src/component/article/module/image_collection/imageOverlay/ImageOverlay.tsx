import * as React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme, Typography } from '@material-ui/core';
import { Button } from 'component/general/button/Button';
import { FileModel } from 'model';
import { useWindowSize } from 'util/useWindowSize';
import { useIsRetina } from 'util/useIsRetina';
import { useLockBodyScroll } from 'util/useLockBodyScroll';
import { Close, ChevronLeft, ChevronRight } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100000,
        backgroundColor: theme.palette.background.paper,
        '& img': {
            border: '1px solid #bdbdbd',
            maxWidth: '80vw',
            maxHeight: '80vh',
        },
    },
    closeButton: {
        position: 'absolute',
        top: theme.spacing(1),
        right: theme.spacing(1),
    },
    leftButton: {
        position: 'absolute',
        left: theme.spacing(1),
    },
    rightButton: {
        position: 'absolute',
        right: theme.spacing(1),
    },
    subtitles: {
        position: 'absolute',
        bottom: '5%',
        textAlign: 'center',
    },
}));

export interface ImageOverlayProps {
    selectedUrl?: string | null;
    selectedFile?: FileModel | null;
    caption?: string;
    onPrevious?(
        e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<Window>
    ): void;
    onNext?(
        e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<Window>
    ): void;
    onClose(
        e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<Window>
    ): void;
}

export const ImageOverlay: React.FunctionComponent<ImageOverlayProps> = React.memo(
    ({ selectedFile, selectedUrl, caption, onPrevious, onNext, onClose }) => {
        useLockBodyScroll();
        const styles = useStyles();
        const { innerHeight, innerWidth } = useWindowSize();
        const retinaMultiplier = useIsRetina() ? 2 : 1;
        const [width, height] = [innerWidth, innerHeight].map((px) =>
            Math.floor(px * 0.8 * retinaMultiplier)
        );

        const onKeyDown: React.KeyboardEventHandler<Window> = React.useCallback(
            (event) => {
                if (event.keyCode === 27) {
                    // ESC
                    onClose(event);
                } else if (event.keyCode === 37 && onPrevious) {
                    // <-
                    onPrevious(event);
                } else if (event.keyCode === 39 && onNext) {
                    // ->
                    onNext(event);
                }
            },
            [onClose, onNext, onPrevious]
        );

        React.useEffect(() => {
            window.addEventListener('keydown', onKeyDown as any);
            return () => {
                window.removeEventListener('keydown', onKeyDown as any);
            };
        }, [onKeyDown]);

        if (!selectedFile && !selectedUrl) {
            return null;
        }
        const imgUrl = `https://afdptjdxen.cloudimg.io/bound/${width}x${height}/foil1/${
            selectedFile?.remoteLocation ?? selectedUrl
        }`;
        return (
            <div className={styles.root}>
                <Button
                    small
                    icon={<Close />}
                    className={styles.closeButton}
                    onClick={onClose}
                />
                {onPrevious && (
                    <Button
                        small
                        icon={<ChevronLeft />}
                        className={styles.leftButton}
                        onClick={onPrevious}
                    />
                )}
                {onNext && (
                    <Button
                        small
                        icon={<ChevronRight />}
                        className={styles.rightButton}
                        onClick={onNext}
                    />
                )}
                <img src={imgUrl} alt={''} />
                {caption && (
                    <Typography className={styles.subtitles}>
                        {caption}
                    </Typography>
                )}
            </div>
        );
    }
);
