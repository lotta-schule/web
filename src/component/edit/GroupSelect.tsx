import React, { memo, useState } from 'react';
import { Checkbox, FormControlLabel, IconButton, NoSsr, TextField, Theme, Typography, makeStyles } from '@material-ui/core';
import { useAutocomplete } from '@material-ui/lab';
import { Check, Close } from '@material-ui/icons';
import { useUserGroups } from 'util/client/useUserGroups';
import { UserGroupModel } from 'model/UserGroupModel';
import clsx from 'clsx';

export interface GroupSelectProps {
    className?: string;
    variant?: 'filled' | 'outlined' | 'standard';
    hidePublicGroupSelection?: boolean;
    publicGroupSelectionLabel?: string;
    disableAdminGroupsExclusivity?: boolean;
    selectedGroups: UserGroupModel[];
    label?: string | null;
    row?: boolean;
    disabled?: boolean;
    onSelectGroups(groups: UserGroupModel[]): void;
}

const useStyles = makeStyles<Theme, { row?: boolean }>(theme => ({
    root: {
        margin: theme.spacing(1, 0)
    },
    publicGroupSelectionLabel: {
        margin: 0
    },
    inputWrapper: {
        color: 'inherit',
    },
    tag: {
        display: ({ row }) => row ? 'inline-flex' : 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 24,
        margin: 2,
        lineHeight: 22,
        backgroundColor: '#fafafa',
        border: `1px solid #e8e8e8`,
        borderRadius: 2,
        boxSizing: 'content-box',
        padding: theme.spacing(0, 1, 0, 2),
        outline: 0,
        overflow: 'hidden',

        '&.is-admin-group': {
            fontStyle: 'italic'
        },

        '&:focus': {
            borderColor: '#40a9ff',
            backgroundColor: '#e6f7ff',
        },

        '& span': {
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
        },

        '& svg': {
            fontSize: 12,
            cursor: 'pointer',
        }
    },
    listBox: {
        margin: theme.spacing(1, 0, 0),
        width: `calc(100% - ${theme.spacing(6)}px)`,
        padding: 0,
        position: 'absolute',
        listStyle: 'none',
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
        maxHeight: 250,
        zIndex: 1,

        '& li': {
            padding: theme.spacing(1, 2),
            display: 'flex',

            '& span': {
                flexGrow: 1,
            },

            '& svg': {
                color: 'transparent',
                transition: 'color ease-in 250ms'
            }
        },

        '& li[aria-selected="true"]': {
            '& svg': {
                color: theme.palette.secondary.main,
            }
        },

        '& li[data-focus="true"]': {
            backgroundColor: theme.palette.grey.A100,
            cursor: 'pointer',

            '& svg': {
                color: theme.palette.text.disabled,
            }
        }
    }
}));

export const GroupSelect = memo<GroupSelectProps>(({ variant, className, label, disabled, row, hidePublicGroupSelection, publicGroupSelectionLabel, disableAdminGroupsExclusivity, selectedGroups, onSelectGroups }) => {
    const styles = useStyles({ row });
    const groups = useUserGroups();

    const [searchtext, setSearchtext] = useState('');

    const {
        getRootProps,
        getInputLabelProps,
        getInputProps,
        getTagProps,
        getListboxProps,
        getOptionProps,
        groupedOptions,
        value,
        focused,
        setAnchorEl,
    } = useAutocomplete({
        id: 'group-select',
        value: [...selectedGroups],
        inputValue: searchtext,
        options: groups,
        multiple: true,
        disableCloseOnSelect: true,
        getOptionLabel: option => option.name,
        getOptionSelected: (option, value) => option.id === value.id,
        onInputChange: (event, value, reason) => {
            if (reason !== 'reset') {
                setSearchtext(value);
            }
        },
        onChange: (event, value, reason, details) => {
            if (disableAdminGroupsExclusivity || !isAdminGroup(details?.option)) {
                onSelectGroups(value);
            } else {
                if (reason === 'select-option') {
                    onSelectGroups(groups.filter(isAdminGroup));
                } else if (reason === 'remove-option') {
                    onSelectGroups([]);
                } else {
                    onSelectGroups(value);
                }
            }
        },
        onClose: (event, reason) => {
            if (reason === 'blur') {
                setSearchtext('');
            }
        }
    });

    const groupSorter = (group1: UserGroupModel, group2: UserGroupModel) => {
        return (group1.sortKey ?? 0) - (group2.sortKey ?? 0);
    };

    const isAdminGroup = (group: UserGroupModel | null | undefined) => Boolean(group && groups.find(g => g.id === group.id)?.isAdminGroup);

    return (
        <NoSsr>
            <div className={styles.root} data-testid="GroupSelect">
                <div {...getRootProps()} data-testid="GroupSelectSelection">
                    <Typography {...getInputLabelProps()}>{label ?? 'Sichtbarkeit:'}</Typography>
                    <div ref={setAnchorEl} className={clsx(styles.inputWrapper, { focused })}>
                        {hidePublicGroupSelection !== true && (
                            <FormControlLabel
                                label={<i>{publicGroupSelectionLabel ?? 'für alle sichtbar'}</i>}
                                className={styles.publicGroupSelectionLabel}
                                disabled={disabled}
                                control={(
                                    <Checkbox disabled={disabled} checked={selectedGroups.length === 0} size={'small'} onChange={event => {
                                        if (event.target.checked) {
                                            onSelectGroups([]);
                                        } else {
                                            onSelectGroups([...groups]);
                                        }
                                    }} />
                                )}
                            />
                        )}
                        {value.sort(groupSorter).map((option: UserGroupModel, i: number) => {
                            const { className, onDelete, ...props } = getTagProps({ index: i }) as any;
                            return (
                                <div  className={clsx(styles.tag, className, {'is-admin-group': isAdminGroup(option)})} {...props}>
                                    <Typography variant={'body1'} component={'span'}>{option.name}</Typography>
                                    <IconButton
                                        aria-label={`Gruppe "${option.name}" entfernen`}
                                        size={'small'}
                                        onClick={onDelete}
                                        disabled={disabled}
                                    >
                                        <Close />
                                    </IconButton>
                                </div>
                            );
                        })}

                        <TextField
                            fullWidth
                            disabled={disabled}
                            variant={'outlined'}
                            size={'small'}
                            placeholder={'Gruppe suchen'}
                            {...getInputProps()}
                        />
                    </div>
                </div>
                {groupedOptions.length > 0 ? (
                    <ul className={styles.listBox} data-testid="GroupSelectSelection" {...getListboxProps()}>
                        {groupedOptions.map((option, index) => (
                            <li {...getOptionProps({ option, index })}>
                                <Typography variant={'body1'} component={'span'}>{option.name}</Typography>
                                <Check fontSize={'small'} />
                            </li>
                        ))}
                    </ul>
                ) : null}
            </div>
        </NoSsr>
    );
});
