import * as React from 'react';
import { PlusOne } from '@material-ui/icons';
import { Button, Checkbox, Input, Label, Select } from '@lotta-schule/hubert';
import { FormElement, FormElementOption } from './Form';

import styles from './FormElementConfiguration.module.scss';

export interface FormElementConfigurationProps {
    element: FormElement;
    updateElement(elm: Partial<FormElement>): void;
}

export const FormElementConfiguration =
    React.memo<FormElementConfigurationProps>(({ element, updateElement }) => {
        const updateOption = (
            index: number,
            option: Partial<FormElementOption>
        ) =>
            updateElement({
                options: element.options?.map((o, i) => {
                    if (i === index) {
                        return { ...o, ...option };
                    }
                    return o;
                }),
            });
        return (
            <div>
                <Label
                    label={'Art der Eingabe'}
                    className={styles.configurationProperty}
                >
                    <Select
                        value={element.element}
                        onChange={(e) =>
                            updateElement({
                                element: e.currentTarget.value as
                                    | 'input'
                                    | 'selection'
                                    | 'file',
                                type:
                                    e.currentTarget.value === 'input'
                                        ? 'text'
                                        : e.currentTarget.value === 'file'
                                        ? ''
                                        : 'checkbox',
                                options:
                                    e.currentTarget.value === 'selection'
                                        ? [
                                              {
                                                  selected: false,
                                                  label: 'Auswahl Nummer 1',
                                                  value: 'a1',
                                              },
                                          ]
                                        : [],
                            })
                        }
                    >
                        <option value={'input'}>Texteingabefeld</option>
                        <option value={'selection'}>Auswahlbereich</option>
                        <option value={'file'}>Datei-Anhang</option>
                    </Select>
                </Label>
                {element.element === 'input' && !element.multiline && (
                    <Label
                        label={'Texteingabevariation'}
                        className={styles.configurationProperty}
                    >
                        <Select
                            value={element.type}
                            onChange={(e) =>
                                updateElement({
                                    type: e.currentTarget.value as string,
                                })
                            }
                        >
                            <option value={'text'}>Text</option>
                            <option value={'email'}>Email</option>
                            <option value={'url'}>Web-Adresse</option>
                            <option value={'tel'}>Telefonnummer</option>
                            <option value={'time'}>Zeit</option>
                            <option value={'color'}>Farbe</option>
                            <option value={'number'}>Zahl</option>
                            <option value={'password'}>Passwort</option>
                        </Select>
                    </Label>
                )}
                {element.element === 'selection' && (
                    <Label
                        label={'Auswahlfeldvariation'}
                        className={styles.configurationProperty}
                    >
                        <Select
                            value={element.type}
                            onChange={(e) =>
                                updateElement({
                                    type: e.currentTarget.value as string,
                                })
                            }
                        >
                            <option value={'checkbox'}>Checkbox</option>
                            <option value={'radio'}>Radio-Buttons</option>
                            <option value={'select'}>Select-Feld</option>
                        </Select>
                    </Label>
                )}
                <Label label={'Name'} className={styles.configurationProperty}>
                    <Input
                        id={'form-input-name'}
                        value={element.name ?? ''}
                        onChange={(e) =>
                            updateElement({
                                name: e.currentTarget.value as string,
                            })
                        }
                    />
                </Label>
                <Label
                    label={'Aufschrift'}
                    className={styles.configurationProperty}
                >
                    <Input
                        id={'form-input-label'}
                        value={element.label ?? ''}
                        onChange={(e) =>
                            updateElement({
                                label: e.currentTarget.value as string,
                            })
                        }
                    />
                </Label>
                <Label
                    label={'Beschriftung'}
                    className={styles.configurationProperty}
                >
                    <Input
                        multiline
                        id={'form-input-description-text'}
                        value={element.descriptionText ?? ''}
                        onChange={(e) =>
                            updateElement({
                                descriptionText: e.currentTarget.value,
                            })
                        }
                    />
                </Label>
                <Checkbox
                    isSelected={element.required ?? false}
                    className={styles.configurationProperty}
                    value={'required'}
                    onChange={(isSelected) =>
                        updateElement({ required: isSelected })
                    }
                >
                    Pflichtfeld
                </Checkbox>
                {element.element === 'input' && (
                    <Checkbox
                        className={styles.configurationProperty}
                        isSelected={element.multiline ?? false}
                        value={'multiline'}
                        onChange={(isSelected) =>
                            updateElement({
                                multiline: isSelected,
                            })
                        }
                    >
                        mehrzeilig
                    </Checkbox>
                )}
                {element.element === 'selection' && (
                    <div>
                        {element.options?.map((option, i) => (
                            <section key={i} className={styles.option}>
                                <Label
                                    label={'Aufschrift'}
                                    className={styles.configurationProperty}
                                >
                                    <Input
                                        id={`form-input-option-${i}-label`}
                                        value={option.label ?? ''}
                                        onChange={(e) =>
                                            updateOption(i, {
                                                label: e.currentTarget.value,
                                            })
                                        }
                                    />
                                </Label>
                                <Label
                                    label={'Wert'}
                                    className={styles.configurationProperty}
                                >
                                    <Input
                                        id={`form-input-option-${i}-value`}
                                        value={option.value ?? ''}
                                        onChange={(e) =>
                                            updateOption(i, {
                                                value: e.currentTarget.value,
                                            })
                                        }
                                    />
                                </Label>
                                <Checkbox
                                    className={styles.configurationProperty}
                                    isSelected={option.selected ?? false}
                                    value={'checked'}
                                    onChange={(isSelected) => {
                                        if (element.type === 'radio') {
                                            updateElement({
                                                options: element.options?.map(
                                                    (_option, _index) => ({
                                                        ..._option,
                                                        selected:
                                                            isSelected &&
                                                            i === _index,
                                                    })
                                                ),
                                            });
                                        } else {
                                            updateOption(i, {
                                                selected: isSelected,
                                            });
                                        }
                                    }}
                                >
                                    vorausgew??hlt
                                </Checkbox>
                            </section>
                        ))}
                        <Button
                            icon={<PlusOne />}
                            onClick={() =>
                                updateElement({
                                    options: [
                                        ...(element.options ?? []),
                                        {
                                            label: `Auswahl Nummer ${
                                                (element.options?.length ?? 0) +
                                                1
                                            }`,
                                            value: `a${
                                                (element.options?.length ?? 0) +
                                                1
                                            }`,
                                        },
                                    ],
                                })
                            }
                        >
                            Antwort hinzuf??gen
                        </Button>
                    </div>
                )}
            </div>
        );
    });
FormElementConfiguration.displayName = 'FormElementConfiguration';
