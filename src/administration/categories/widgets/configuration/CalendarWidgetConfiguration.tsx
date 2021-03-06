import * as React from 'react';
import { CalendarWidgetConfig } from 'model';
import { Button, Divider, Input, Label, Select } from '@lotta-schule/hubert';

import styles from './WidgetConfiguration.module.scss';

export interface CalendarWidgetConfigurationProps {
    configuration: CalendarWidgetConfig;
    setConfiguration(configuration: CalendarWidgetConfig): void;
}

export const CalendarWidgetConfiguration =
    React.memo<CalendarWidgetConfigurationProps>(
        ({ configuration, setConfiguration }) => {
            return (
                <div data-testid={'CalendarWidgetConfiguration'}>
                    {(configuration.calendars || []).map((calendar, index) => (
                        <div key={index}>
                            <Label label="URL des Kalenders">
                                <Input
                                    className={styles.input}
                                    value={calendar.url}
                                    onChange={(e) =>
                                        setConfiguration({
                                            ...configuration,
                                            calendars:
                                                configuration.calendars?.map(
                                                    (cal, i) => {
                                                        return i === index
                                                            ? {
                                                                  ...calendar,
                                                                  url: e
                                                                      .currentTarget
                                                                      .value,
                                                              }
                                                            : cal;
                                                    }
                                                ) ?? [],
                                        })
                                    }
                                />
                                <small>Link zu einer *.ics-Datei</small>
                            </Label>
                            <Label
                                label={'Zeit, f??r die Termine abgerufen werden'}
                            >
                                <Select
                                    value={calendar.days ?? 90}
                                    onChange={(e) =>
                                        setConfiguration({
                                            ...configuration,
                                            calendars:
                                                configuration.calendars?.map(
                                                    (cal, i) => {
                                                        return i === index
                                                            ? {
                                                                  ...calendar,
                                                                  days: Number(
                                                                      e
                                                                          .currentTarget
                                                                          .value
                                                                  ),
                                                              }
                                                            : cal;
                                                    }
                                                ) ?? [],
                                        })
                                    }
                                >
                                    <option value={7}>
                                        Termine der n??chsten 7 Tage anzeigen
                                    </option>
                                    <option value={30}>
                                        Termine der n??chsten 30 Tage anzeigen
                                    </option>
                                    <option value={90}>
                                        Termine der n??chsten 3 Monate anzeigen
                                    </option>
                                    <option value={180}>
                                        Termine der n??chsten 6 Monate anzeigen
                                    </option>
                                    <option value={365}>
                                        Termine des n??chsten Jahres anzeigen
                                    </option>
                                </Select>
                            </Label>
                            {configuration.calendars &&
                                configuration.calendars.length > 1 && (
                                    <>
                                        <Label label="Name des Kalenders">
                                            <Input
                                                className={styles.input}
                                                value={calendar.name || ''}
                                                onChange={(e) =>
                                                    setConfiguration({
                                                        ...configuration,
                                                        calendars:
                                                            configuration.calendars?.map(
                                                                (cal, i) => {
                                                                    return i ===
                                                                        index
                                                                        ? {
                                                                              ...calendar,
                                                                              name: e
                                                                                  .currentTarget
                                                                                  .value,
                                                                          }
                                                                        : cal;
                                                                }
                                                            ),
                                                    })
                                                }
                                            />
                                            <small>
                                                Kalender einen beschreibenden
                                                Namen f??r die Legende zuordnen
                                            </small>
                                        </Label>
                                        <Label label="Farbe des Kalenders">
                                            <Input
                                                type={'color'}
                                                className={styles.input}
                                                value={calendar.color || ''}
                                                onChange={(e) =>
                                                    setConfiguration({
                                                        ...configuration,
                                                        calendars:
                                                            configuration.calendars?.map(
                                                                (cal, i) => {
                                                                    return i ===
                                                                        index
                                                                        ? {
                                                                              ...calendar,
                                                                              color: e
                                                                                  .currentTarget
                                                                                  .value,
                                                                          }
                                                                        : cal;
                                                                }
                                                            ),
                                                    })
                                                }
                                            />
                                            <small>
                                                Farbe, die dem Kalender
                                                zugeordnet wird
                                            </small>
                                        </Label>
                                        <Button
                                            onClick={() =>
                                                setConfiguration({
                                                    ...configuration,
                                                    calendars:
                                                        configuration.calendars?.filter(
                                                            (_c, i) =>
                                                                i !== index
                                                        ),
                                                })
                                            }
                                        >
                                            Kalender-URL entfernen
                                        </Button>
                                    </>
                                )}
                            {index <
                                (configuration.calendars || []).length - 1 && (
                                <Divider className={styles.divider} />
                            )}
                        </div>
                    ))}

                    <Button
                        onClick={() =>
                            setConfiguration({
                                ...configuration,
                                calendars: [
                                    ...(configuration.calendars || []),
                                    { url: '' },
                                ],
                            })
                        }
                    >
                        Kalender-URL hinzuf??gen
                    </Button>
                </div>
            );
        }
    );
CalendarWidgetConfiguration.displayName = 'CalendarWidgetConfiguration';
