import * as React from 'react';
import { WidgetModel, WidgetModelType } from 'model';
import { Widget } from 'category/widgets/Widget';
import { Widget as WidgetUtil } from 'util/model';
import { useCategoriesAncestorsForItem } from 'util/categories/useCategoriesAncestorsForItem';
import { useCurrentCategoryId } from 'util/path/useCurrentCategoryId';
import { useScrollEvent } from 'util/useScrollEvent';
import { WidgetIcon } from 'category/widgets/WidgetIcon';
import { CurrentUserAvatar } from 'shared/userAvatar/UserAvatar';
import { useCurrentUser } from 'util/user/useCurrentUser';
import { Tabbar, Tab } from '@lotta-schule/hubert';
import SwipeableViews from 'react-swipeable-views';
import clsx from 'clsx';

import styles from './WidgetsList.module.scss';

export interface WidgetsListProps {
    widgets: WidgetModel[];
    children?: JSX.Element;
}

export const WidgetsList = React.memo<WidgetsListProps>(
    ({ widgets, children }) => {
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

        const [currentTabIndex, setCurrentTabIndex] = React.useState<
            number | null
        >(null);
        React.useEffect(() => {
            const storedIndex = localStorage.getItem(
                'widgetlist-last-selected-item-index'
            );
            setCurrentTabIndex(storedIndex ? parseInt(storedIndex) : 0);
        }, []);
        React.useEffect(() => {
            if (currentTabIndex !== null) {
                localStorage.setItem(
                    'widgetlist-last-selected-item-index',
                    String(currentTabIndex)
                );
            }
        }, [currentTabIndex]);

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

        if (currentTabIndex === null) {
            return null;
        }

        const activeTabIndex =
            currentTabIndex < shownWidgets.length ? currentTabIndex : 0;

        const swipeableViews = (
            <SwipeableViews
                axis={'x'}
                slideStyle={{ overflow: 'hidden' }}
                index={activeTabIndex}
                onChangeIndex={(newIndex) => setCurrentTabIndex(newIndex)}
                className={styles.swipeableViewsContainer}
            >
                {shownWidgets.map((widget) => (
                    <Widget key={widget.id} widget={widget} />
                ))}
            </SwipeableViews>
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
                    <>
                        <Tabbar
                            className={styles.WidgetTabbar}
                            value={activeTabIndex}
                            aria-label={'Marginales Modul w??hlen'}
                            onChange={(newTabIndex) =>
                                setCurrentTabIndex(newTabIndex as number)
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
                                                icon={
                                                    widget.configuration?.icon
                                                }
                                                size={36}
                                            />
                                        )
                                    }
                                />
                            ))}
                        </Tabbar>
                        {swipeableViews}
                    </>
                )}
                {shownWidgets && shownWidgets.length === 1 && swipeableViews}
                {children}
            </div>
        );
    }
);
WidgetsList.displayName = 'WidgetsList';
