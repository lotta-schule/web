import * as React from 'react';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import {
    addBusinessDays,
    isSameDay,
    parse,
    subBusinessDays,
    format,
} from 'date-fns';
import { de } from 'date-fns/locale';
import {
    Table,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
} from '@material-ui/core';
import { Button } from 'shared/general/button/Button';
import { useApolloClient, useLazyQuery, useQuery } from '@apollo/client';
import { WidgetModel, ScheduleResult, WidgetModelType } from 'model';
import { useCurrentUser } from 'util/user/useCurrentUser';
import { ErrorMessage } from 'shared/general/ErrorMessage';
import { LinearProgress } from 'shared/general/progress/LinearProgress';
import { SelectCoursesDialog } from './SelectCoursesDialog';
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';
import Link from 'next/link';
import clsx from 'clsx';

import GetScheduleQuery from 'api/query/GetScheduleQuery.graphql';

import styles from './Schedule.module.scss';

export const LOCALSTORAGE_KEY = 'lotta-schedule-courses';

type DateString = string;

export interface ScheduleProps {
    widget: WidgetModel<WidgetModelType.Schedule>;
}

const dateToDateString = (date: Date | string) =>
    format(new Date(date), 'yyyy-MM-dd');

export const Schedule = React.memo<ScheduleProps>(({ widget }) => {
    const currentUser = useCurrentUser();
    const [isSelectCoursesDialogOpen, setIsSelectCoursesDialogOpen] =
        React.useState(false);
    const [selectedCourses, setSelectedCourses] = React.useState<
        string[] | null
    >(null);
    const [currentDate, setCurrentDate] = React.useState<
        DateString | undefined
    >();

    const client = useApolloClient();
    const {
        data: currentScheduleData,
        loading: isLoading,
        error: currentScheduleError,
    } = useQuery<{ schedule: ScheduleResult | null }>(GetScheduleQuery, {
        variables: { widgetId: widget.id, date: currentDate },
        skip: !currentUser?.class,
        ssr: false,
        onCompleted: (data) => {
            if (data.schedule) {
                const newDateString = dateToDateString(
                    parse(data.schedule.head.date, 'PPPP', new Date(), {
                        locale: de,
                    })
                );
                if (!currentDate) {
                    client.writeQuery({
                        query: GetScheduleQuery,
                        variables: { widgetId: widget.id, date: newDateString },
                        data,
                        broadcast: false,
                    });
                }
                setCurrentDate(newDateString);
            }
        },
    });
    const [getLastSchedule, { data: lastScheduleData }] = useLazyQuery<{
        schedule: ScheduleResult | null;
    }>(GetScheduleQuery, { ssr: false, errorPolicy: 'all' });
    const [getNextSchedule, { data: nextScheduleData }] = useLazyQuery<{
        schedule: ScheduleResult | null;
    }>(GetScheduleQuery, { ssr: false, errorPolicy: 'all', onError: () => {} });

    const getAvailableDate = React.useCallback(
        (direction: 'previous' | 'next', startDateString: DateString): Date => {
            const startDate = parse(startDateString, 'yyyy-MM-dd', new Date(), {
                locale: de,
            });
            const newDate =
                direction === 'previous'
                    ? subBusinessDays(startDate, 1)
                    : addBusinessDays(startDate, 1);

            if (
                !currentScheduleData?.schedule?.head.skipDates.find(
                    (skipDate) => isSameDay(new Date(skipDate), newDate)
                )
            ) {
                return newDate;
            }
            return getAvailableDate(direction, dateToDateString(newDate));
        },
        [currentScheduleData]
    );

    React.useEffect(() => {
        if (currentDate) {
            getLastSchedule({
                variables: {
                    widgetId: widget.id,
                    date: dateToDateString(
                        getAvailableDate('previous', currentDate)
                    ),
                },
            });
            getNextSchedule({
                variables: {
                    widgetId: widget.id,
                    date: dateToDateString(
                        getAvailableDate('next', currentDate)
                    ),
                },
            });
        }
    }, [
        widget.id,
        currentDate,
        getAvailableDate,
        getLastSchedule,
        getNextSchedule,
    ]);

    const tableRows = React.useMemo(() => {
        if (!currentUser) {
            return [];
        }
        const rows = flatten(
            Array.from(currentScheduleData?.schedule?.body?.schedule ?? [])
                .sort((l1, l2) => l1.lessonIndex - l2.lessonIndex)
                .filter((line) => {
                    if (
                        selectedCourses !== null &&
                        ['11', '12'].indexOf(currentUser.class!) > -1
                    ) {
                        return selectedCourses.indexOf(line.lessonName) > -1;
                    }
                    return true;
                })
                .map((line, index) =>
                    [
                        <TableRow key={index * 2}>
                            <TableCell>{line.lessonIndex}</TableCell>
                            <TableCell
                                className={clsx({
                                    [styles.updated]: line.lessonNameHasChanged,
                                })}
                            >
                                {line.lessonName}
                            </TableCell>
                            <TableCell
                                className={clsx({
                                    [styles.updated]: line.teacherHasChanged,
                                })}
                            >
                                {line.teacher === '&nbsp;'
                                    ? '---'
                                    : line.teacher}
                            </TableCell>
                            <TableCell
                                className={clsx({
                                    [styles.updated]: line.roomHasChanged,
                                })}
                            >
                                {line.room === '&nbsp;' ? '---' : line.room}
                            </TableCell>
                        </TableRow>,
                    ].concat(
                        line.comment
                            ? [
                                  <TableRow key={index * 2 + 1}>
                                      <TableCell colSpan={4} align={'right'}>
                                          {line.comment}
                                      </TableCell>
                                  </TableRow>,
                              ]
                            : []
                    )
                )
        );
        if (rows.length < 1) {
            return [
                <TableRow key={-1}>
                    <TableCell colSpan={4} align={'center'}>
                        Kein Vertretungsplan
                    </TableCell>
                </TableRow>,
            ];
        }
        return rows;
    }, [currentScheduleData, selectedCourses, currentUser]);

    if (!currentUser) {
        return (
            <ErrorMessage
                error={
                    new Error(
                        'Du musst angemeldet sein um den Vertretungsplan zu sehen.'
                    )
                }
            />
        );
    } else if (!currentUser.class) {
        const errorMessage =
            widget.configuration?.type === 'IndiwareTeacher'
                ? 'Sie haben kein Kürzel im Profil eingestellt.'
                : 'Du hast keine Klasse im Profil eingestellt.';
        return (
            <>
                <ErrorMessage error={new Error(errorMessage)} />
                <Link href={'/profile'}>Mein Profil öffnen</Link>
            </>
        );
    }

    if (isLoading) {
        return (
            <LinearProgress
                isIndeterminate
                aria-label={'Stundenplan wird geladen'}
            />
        );
    } else if (currentScheduleError) {
        return <ErrorMessage error={currentScheduleError} />;
    } else if (currentScheduleData && currentScheduleData.schedule) {
        return (
            <div className={styles.root}>
                {['11', '12'].indexOf(currentUser.class) > -1 && (
                    <div className={styles.selectCoursesLinkWrapper}>
                        <a
                            href={'#'}
                            onClick={() => setIsSelectCoursesDialogOpen(true)}
                        >
                            Kurse wählen
                        </a>
                    </div>
                )}
                <div className={styles.date}>
                    {lastScheduleData?.schedule ? (
                        <Tooltip title={lastScheduleData.schedule.head.date}>
                            <Button
                                icon={<ArrowBackIos />}
                                onClick={() =>
                                    setCurrentDate(
                                        dateToDateString(
                                            parse(
                                                lastScheduleData.schedule!.head
                                                    .date,
                                                'PPPP',
                                                new Date(),
                                                { locale: de }
                                            )
                                        )
                                    )
                                }
                            />
                        </Tooltip>
                    ) : (
                        <div style={{ width: 48 }} />
                    )}
                    <span>{currentScheduleData.schedule.head.date}</span>
                    {nextScheduleData?.schedule ? (
                        <Tooltip title={nextScheduleData.schedule.head.date}>
                            <Button
                                icon={<ArrowForwardIos />}
                                onClick={() =>
                                    setCurrentDate(
                                        dateToDateString(
                                            parse(
                                                nextScheduleData.schedule!.head
                                                    .date,
                                                'PPPP',
                                                new Date(),
                                                { locale: de }
                                            )
                                        )
                                    )
                                }
                            />
                        </Tooltip>
                    ) : (
                        <div style={{ width: 48 }} />
                    )}
                </div>
                {currentScheduleData.schedule.body && (
                    <>
                        <Table size={'small'}>
                            <TableBody>{tableRows}</TableBody>
                        </Table>
                        <SelectCoursesDialog
                            isOpen={isSelectCoursesDialogOpen}
                            possibleCourses={uniq([
                                ...(lastScheduleData?.schedule?.body?.schedule.map(
                                    (schedule) => schedule.lessonName
                                ) ?? []),
                                ...(nextScheduleData?.schedule?.body?.schedule.map(
                                    (schedule) => schedule.lessonName
                                ) ?? []),
                                ...(currentScheduleData.schedule?.body?.schedule.map(
                                    (schedule) => schedule.lessonName
                                ) ?? []),
                            ])}
                            onRequestClose={() => {
                                try {
                                    const persistedCourseList =
                                        localStorage.getItem(LOCALSTORAGE_KEY);
                                    if (persistedCourseList) {
                                        setSelectedCourses(
                                            JSON.parse(persistedCourseList)
                                        );
                                    }
                                } catch {}
                                setIsSelectCoursesDialogOpen(false);
                            }}
                        />
                    </>
                )}
                {currentScheduleData.schedule.footer.supervisions && (
                    <ul>
                        {currentScheduleData.schedule.footer.supervisions
                            .filter(Boolean)
                            .map((supervision, i) => (
                                <li key={i}>
                                    {supervision.time} {supervision.location}
                                </li>
                            ))}
                    </ul>
                )}
                {currentScheduleData.schedule.footer.comments && (
                    <ul style={{ margin: '0.5em 0.5em 0 0.5em' }}>
                        {currentScheduleData.schedule.footer.comments.map(
                            (comment, i) => (
                                <li key={i} className={styles.notes}>
                                    {comment}
                                </li>
                            )
                        )}
                    </ul>
                )}
            </div>
        );
    }
    return null;
});
Schedule.displayName = 'Schedule';
