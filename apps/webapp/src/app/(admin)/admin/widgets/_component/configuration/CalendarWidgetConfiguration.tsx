import * as React from 'react';
import { CalendarWidgetConfig } from 'model';
import {
  Button,
  Divider,
  Input,
  Label,
  Option,
  Select,
} from '@lotta-schule/hubert';
import { faCircleMinus, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { Icon } from 'shared/Icon';

export interface CalendarWidgetConfigurationProps {
  configuration: CalendarWidgetConfig;
  setConfiguration(configuration: CalendarWidgetConfig): void;
}

export const CalendarWidgetConfiguration = React.memo(
  ({ configuration, setConfiguration }: CalendarWidgetConfigurationProps) => {
    return (
      <div data-testid={'CalendarWidgetConfiguration'}>
        {(configuration.calendars || []).map((calendar, index) => (
          <div key={index}>
            <Label label="URL des Kalenders">
              <Input
                value={calendar.url}
                onChange={(e) =>
                  setConfiguration({
                    ...configuration,
                    calendars:
                      configuration.calendars?.map((cal, i) => {
                        return i === index
                          ? {
                              ...calendar,
                              url: e.currentTarget.value,
                            }
                          : cal;
                      }) ?? [],
                  })
                }
              />
            </Label>
            <small>Link zu einer *.ics-Datei</small>

            <Select
              style={{ width: '100%' }}
              title={'Zeit, für die Termine abgerufen werden'}
              value={String(calendar.days ?? 90)}
              onChange={(daysString) => {
                const days = Number(daysString);
                setConfiguration({
                  ...configuration,
                  calendars:
                    configuration.calendars?.map((cal, i) => {
                      return i === index
                        ? {
                            ...calendar,
                            days,
                          }
                        : cal;
                    }) ?? [],
                });
              }}
            >
              <Option value={String(7)}>
                Termine der nächsten 7 Tage anzeigen
              </Option>
              <Option value={String(30)}>
                Termine der nächsten 30 Tage anzeigen
              </Option>
              <Option value={String(90)}>
                Termine der nächsten 3 Monate anzeigen
              </Option>
              <Option value={String(180)}>
                Termine der nächsten 6 Monate anzeigen
              </Option>
              <Option value={String(365)}>
                Termine des nächsten Jahres anzeigen
              </Option>
            </Select>
            {configuration.calendars && configuration.calendars.length > 1 && (
              <>
                <Label label="Name des Kalenders">
                  <Input
                    value={calendar.name || ''}
                    onChange={(e) =>
                      setConfiguration({
                        ...configuration,
                        calendars: configuration.calendars?.map((cal, i) => {
                          return i === index
                            ? {
                                ...calendar,
                                name: e.currentTarget.value,
                              }
                            : cal;
                        }),
                      })
                    }
                  />
                </Label>
                <small>
                  Kalender einen beschreibenden Namen für die Legende zuordnen
                </small>

                <Label label="Farbe des Kalenders">
                  <Input
                    type={'color'}
                    value={calendar.color || ''}
                    onChange={(e) =>
                      setConfiguration({
                        ...configuration,
                        calendars: configuration.calendars?.map((cal, i) => {
                          return i === index
                            ? {
                                ...calendar,
                                color: e.currentTarget.value,
                              }
                            : cal;
                        }),
                      })
                    }
                  />
                </Label>
                <small>Farbe, die dem Kalender zugeordnet wird</small>

                <Button
                  icon={<Icon icon={faCircleMinus} />}
                  onClick={() =>
                    setConfiguration({
                      ...configuration,
                      calendars: configuration.calendars?.filter(
                        (_c, i) => i !== index
                      ),
                    })
                  }
                >
                  Kalender-URL entfernen
                </Button>
              </>
            )}
            {index < (configuration.calendars || []).length - 1 && <Divider />}
          </div>
        ))}

        <Button
          icon={<Icon icon={faCirclePlus} />}
          onClick={() =>
            setConfiguration({
              ...configuration,
              calendars: [...(configuration.calendars || []), { url: '' }],
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
