import * as React from 'react';
import { Tabbar, Tab } from '@lotta-schule/hubert';
import { Swiper, SwiperSlide } from 'swiper/react';
import { WidgetModel, WidgetModelType } from 'model';
import { Widget } from 'category/widgets/Widget';
import { Widget as WidgetUtil } from 'util/model';
import { useCategoriesAncestorsForItem } from 'util/categories/useCategoriesAncestorsForItem';
import { useCurrentCategoryId } from 'util/path/useCurrentCategoryId';
import { useScrollEvent } from 'util/useScrollEvent';
import { WidgetIcon } from 'category/widgets/WidgetIcon';
import { CurrentUserAvatar } from 'shared/userAvatar/UserAvatar';
import { useCurrentUser } from 'util/user/useCurrentUser';
import SwiperCore, { Controller, Virtual } from 'swiper';
import clsx from 'clsx';

import styles from './WidgetsList.module.scss';
import 'swiper/css';
import 'swiper/css/a11y';
import 'swiper/css/virtual';

export interface WidgetsListProps {
    widgets: WidgetModel[];
    children?: JSX.Element;
}

export const WidgetsList = React.memo<WidgetsListProps>(
    ({ widgets, children }) => {
        const [swiper, setSwiper] = React.useState<SwiperCore | null>(null);
        const [swiperIndex, setSwiperIndex] = React.useState(0);
        const isMobile =
            typeof window !== 'undefined' &&
            window.matchMedia('(max-width: 959px)').matches;

        const wrapperRef = React.useRef<HTMLDivElement | null>(null);

        const currentUser = useCurrentUser();
        const currentCategoryId = useCurrentCategoryId();
        const isSecondNavigationOpen =
            useCategoriesAncestorsForItem(currentCategoryId || '0').length > 0;

        const shownWidgets = isMobile
            ? [WidgetUtil.getProfileWidget(), ...widgets]
            : widgets;

        React.useEffect(() => {
            if (swiper) {
                const storedIndex = localStorage.getItem(
                    'widgetlist-last-selected-item-index'
                );
                if (storedIndex) {
                    swiper.slideTo(Number(storedIndex), 0);
                    setSwiperIndex(Number(storedIndex));
                }

                swiper.on('slideChange', () => {
                    console.log(swiper.realIndex);
                    setSwiperIndex(swiper.activeIndex);
                    localStorage.setItem(
                        'widgetlist-last-selected-item-index',
                        String(swiper.activeIndex)
                    );
                });

                return () => {
                    swiper.off('slideChange');
                };
            }
        }, [swiper]);

        React.useLayoutEffect(() => {
            if (
                wrapperRef.current &&
                window.matchMedia('(min-width: 960px)').matches
            ) {
                wrapperRef.current.style.height = `calc(100vh - ${
                    wrapperRef.current.getBoundingClientRect().top
                }px - var(--lotta-spacing))`;
            }
        }, []);

        useScrollEvent(
            () => {
                if (wrapperRef.current && isMobile && widgets.length > 0) {
                    wrapperRef.current.style.height = `calc(100vh - ${
                        wrapperRef.current.getBoundingClientRect().top
                    }px - var(--lotta-spacing))`;
                }
            },
            200,
            [wrapperRef.current, widgets.length]
        );

        return (
            <div
                className={clsx(styles.root, {
                    [styles.hasSecondNavigation]: isSecondNavigationOpen,
                })}
                style={
                    isMobile
                        ? undefined
                        : {
                              height: `calc(100vh - ${
                                  isSecondNavigationOpen ? '112px' : '72px'
                              } - var(--lotta-spacing))`,
                          }
                }
                data-testid={'WidgetsList'}
                ref={wrapperRef}
            >
                {shownWidgets && shownWidgets.length > 1 && (
                    <Tabbar
                        className={styles.WidgetTabbar}
                        value={swiperIndex}
                        aria-label={'Marginales Modul wählen'}
                        onChange={(newTabIndex) =>
                            swiper?.slideTo(newTabIndex as number)
                        }
                    >
                        {shownWidgets.map((widget, i) => (
                            <Tab
                                className={styles.WidgetTab}
                                key={widget.id}
                                title={widget.title}
                                value={i}
                                icon={
                                    widget.type ===
                                        WidgetModelType.UserNavigationMobile &&
                                    currentUser ? (
                                        <CurrentUserAvatar
                                            style={{
                                                width: 36,
                                                height: 36,
                                            }}
                                        />
                                    ) : (
                                        <WidgetIcon
                                            icon={widget.configuration?.icon}
                                            size={36}
                                        />
                                    )
                                }
                            />
                        ))}
                    </Tabbar>
                )}
                {shownWidgets && shownWidgets.length >= 1 && (
                    <Swiper
                        className={styles.swipeableViewsContainer}
                        modules={[Controller, Virtual]}
                        spaceBetween={0}
                        onSwiper={setSwiper}
                        virtual
                    >
                        {shownWidgets.map((widget, i) => (
                            <SwiperSlide key={widget.id} virtualIndex={i}>
                                <Widget key={widget.id} widget={widget} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
                {children}
            </div>
        );
    }
);
WidgetsList.displayName = 'WidgetsList';
