import React, { memo, useEffect, useState } from 'react';
import { CircularProgress, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useLazyQuery } from '@apollo/react-hooks';
import { GetTopicsQuery } from 'api/query/GetTopicsQuery';

export interface SelectTopicAutocompleteProps {
    value: string;
    onChange(value: string): void;
}

export const SelectTopicAutocomplete = memo<SelectTopicAutocompleteProps>(({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<string[]>([]);

    const [loadTopics, { called: isCalled, loading: isLoading, data }] = useLazyQuery<{ topics: string[] }>(GetTopicsQuery);

    useEffect(() => {
        if (isOpen && !isCalled) {
            loadTopics();
        }
    }, [isCalled, isOpen, loadTopics]);

    useEffect(() => {
        if (isOpen && data?.topics) {
            setOptions(data.topics);
        } else {
            setOptions([]);
        }
    }, [isOpen, data]);

    return (
        <Autocomplete
            id={'select-topic-input'}
            open={isOpen}
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            onChange={(_e, value) => onChange(value)}
            value={value}
            freeSolo
            options={options}
            loading={isLoading}
            renderInput={params => (
                <TextField
                    {...params}
                    fullWidth
                    label={'Thema'}
                    variant={'outlined'}
                    onBlur={e => onChange(e.target.value)}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {isLoading ? <CircularProgress color={'inherit'} size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
});