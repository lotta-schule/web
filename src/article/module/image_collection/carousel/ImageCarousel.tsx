import * as React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Stepper } from '@lotta-schule/hubert';
import { File } from 'util/model';
import { FileSorter } from '../Config';
import { ContentModuleModel, FileModel } from 'model';
import { useServerData } from 'shared/ServerDataContext';
import { ResponsiveImage } from 'util/image/ResponsiveImage';
import SwiperCore, { Controller, Virtual } from 'swiper';

import styles from './ImageCarousel.module.scss';
import 'swiper/css';
import 'swiper/css/a11y';
import 'swiper/css/virtual';

export interface ImageCarouselProps {
    contentModule: ContentModuleModel;
}

export const ImageCarousel = React.memo<ImageCarouselProps>(
    ({ contentModule }) => {
        const [swiper, setSwiper] = React.useState<SwiperCore | null>(null);
        const { baseUrl } = useServerData();
        const [activeStep, setActiveStep] = React.useState(0);
        const filesConfiguration: {
            [id: string]: { caption: string; sortKey: number };
        } = contentModule.configuration?.files ?? {};
        const maxSteps = contentModule.files.length;

        React.useEffect(() => {
            if (swiper) {
                swiper.on('slideChange', () => {
                    setActiveStep(swiper.activeIndex);
                });
                return () => {
                    swiper.off('slideChange');
                };
            }
        }, [swiper]);

        const getConfiguration = (file: FileModel) => {
            if (filesConfiguration[file.id]) {
                return {
                    // @ts-ignore
                    caption: '',
                    // @ts-ignore
                    sortKey: 0,
                    ...filesConfiguration[file.id],
                };
            } else {
                return {
                    caption: '',
                    sortKey: 0,
                };
            }
        };
        const sortedFiles = [...(contentModule.files || [])].sort(
            FileSorter(contentModule, getConfiguration)
        );

        return (
            <div className={styles.root}>
                <Stepper
                    currentStep={activeStep}
                    onStep={(newStep) => {
                        if (swiper) {
                            swiper.slideTo(newStep, 0);
                        }
                    }}
                    maxSteps={maxSteps}
                    className={styles.header}
                />
                <Swiper
                    onSwiper={setSwiper}
                    modules={[Controller, Virtual]}
                    spaceBetween={50}
                    virtual
                >
                    {sortedFiles.map((file, index) => (
                        <SwiperSlide
                            key={file.id}
                            className={styles.imgContainer}
                        >
                            {getConfiguration(file).caption && (
                                <span className={styles.subtitle}>
                                    {getConfiguration(file).caption}
                                </span>
                            )}
                            {Math.abs(activeStep - index) <= 2 ? (
                                <ResponsiveImage
                                    width={1600}
                                    sizes={'(max-width: 600px) 100vw, 80vw'}
                                    aspectRatio={'16:9'}
                                    resize={'contain'}
                                    src={File.getFileRemoteLocation(
                                        baseUrl,
                                        file
                                    )}
                                    alt={
                                        getConfiguration(file).caption ||
                                        File.getFileRemoteLocation(
                                            baseUrl,
                                            file
                                        )
                                    }
                                />
                            ) : null}
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        );
    }
);
ImageCarousel.displayName = 'ImageCarousel';
