import React from 'react';
import { render, waitFor } from 'test/util';
import { Klausurenplan } from 'test/fixtures';
import { Edit } from './Edit';
import userEvent from '@testing-library/user-event';

const titleContentModule = Klausurenplan.contentModules[0];

describe('shared/article/module/table/Edit', () => {
    it('should render without an error', () => {
        render(
            <Edit
                contentModule={titleContentModule}
                onUpdateModule={() => {}}
            />
        );
    });

    it('should display the correct title', () => {
        const screen = render(
            <Edit
                contentModule={titleContentModule}
                onUpdateModule={() => {}}
            />
        );
        expect(screen.getByRole('textbox')).toHaveValue(
            'Na, wie war dein erster Tag?'
        );
    });

    it('should correctly call the onUpateModule prop', async () => {
        const callback = jest.fn((cm) => {
            expect(cm.content.title).toEqual('Eine neue Überschrift');
        });
        const screen = render(
            <Edit
                contentModule={titleContentModule}
                onUpdateModule={callback}
            />
        );
        const input = screen.getByRole('textbox');
        userEvent.click(input);
        userEvent.clear(input);
        userEvent.type(input, 'Eine neue Überschrift');
        userEvent.click(document.body);
        await waitFor(() => {
            expect(callback).toHaveBeenCalled();
        });
        expect(input).toHaveValue('Eine neue Überschrift');
    });

    it('should reset title when clicking ESC', async () => {
        const callback = jest.fn((cm) => {
            expect(cm.content.title).toEqual('Na, wie war dein erster Tag?');
        });
        const screen = render(
            <Edit
                contentModule={titleContentModule}
                onUpdateModule={callback}
            />
        );
        const input = screen.getByRole('textbox');
        userEvent.clear(input);
        userEvent.type(input, 'Eine neue Überschr{esc}');
        await waitFor(() => {
            expect(input).not.toHaveFocus();
        });
        expect(callback).toHaveBeenCalled();
        expect(input).toHaveValue('Na, wie war dein erster Tag?');
    });
});
