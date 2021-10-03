import * as React from 'react';
import { Divider } from '@material-ui/core';
import { CalendarWidgetConfig } from 'model';
import { Label } from 'component/general/label/Label';
import { Input } from 'component/general/form/input/Input';
import { Select } from 'component/general/form/select/Select';
import { Button } from 'component/general/button/Button';

import styles from './WidgetConfiguration.module.scss';

export interface CalendarWidgetConfigurationProps {
    configuration: CalendarWidgetConfig;
    setConfiguration(configuration: CalendarWidgetConfig): void;
}

export const CalendarWidgetConfiguration =
    React.memo<CalendarWidgetConfigurationProps>(
        ({ configuration, setConfiguration }) => {
            return (
                <div>
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
                                                configuration.calendars.map(
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
                                                ),
                                        })
                                    }
                                />
                                <small>Link zu einer *.ics-Datei</small>
                            </Label>
                            <Label
                                label={'Zeit, für die Termine abgerufen werden'}
                            >
                                <Select
                                    value={calendar.days ?? 90}
                                    onChange={(e) =>
                                        setConfiguration({
                                            ...configuration,
                                            calendars:
                                                configuration.calendars.map(
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
                                                ),
                                        })
                                    }
                                >
                                    <option value={7}>
                                        Termine der nächsten 7 Tage anzeigen
                                    </option>
                                    <option value={30}>
                                        Termine der nächsten 30 Tage anzeigen
                                    </option>
                                    <option value={90}>
                                        Termine der nächsten 3 Monate anzeigen
                                    </option>
                                    <option value={180}>
                                        Termine der nächsten 6 Monate anzeigen
                                    </option>
                                    <option value={365}>
                                        Termine des nächsten Jahres anzeigen
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
                                                            configuration.calendars.map(
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
                                                Namen für die Legende zuordnen
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
                                                            configuration.calendars.map(
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
                                                        configuration.calendars.filter(
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
                        Kalender-URL hinzufügen
                    </Button>
                </div>
            );
        }
    );
CalendarWidgetConfiguration.displayName = 'CalendarWidgetConfiguration';
