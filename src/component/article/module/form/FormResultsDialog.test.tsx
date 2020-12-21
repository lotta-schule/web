/* eslint-disable import/first */
jest.mock('file-saver');
import React from 'react';
import { GetContentModuleResults } from 'api/query/GetContentModuleResults';
import { ContentModuleType } from 'model';
import { render, waitFor } from 'test/util';
import { MockedResponse } from '@apollo/client/testing';
import { FormResultsDialog } from './FormResultsDialog';
import { saveAs } from 'file-saver';
import userEvent from '@testing-library/user-event';

describe('src/component/article/module/form/FormResultsDialog', () => {
    const contentModule = {
        id: "31415",
        type: ContentModuleType.FORM,
        files: [],
        sortKey: 0
    };

    let didFetchResults = false;
    const mocks: MockedResponse[] = [{
        request: { query: GetContentModuleResults, variables: { contentModuleId: contentModule.id } },
        result: () => {
            didFetchResults = true;
            return {
                data: {
                    contentModuleResults: [
                        {
                            id: 'CMR001',
                            insertedAt: '2020-12-21T07:24:51.241Z',
                            updatedAt: '2020-12-21T07:24:51.241Z',
                            result: { responses: { blub: 'Hallo', bla: ['S', 'XL'], mail: 'ab@c.de' } }
                        },
                        {
                            id: 'CMR002',
                            insertedAt: '2020-12-21T07:24:51.241Z',
                            updatedAt: '2020-12-21T07:24:51.241Z',
                            result: { responses: { blub: 'Test', bla: [], mail: 'de@z.xy' } }
                        },
                        {
                            id: 'CMR003',
                            insertedAt: '2020-12-21T07:24:51.241Z',
                            updatedAt: '2020-12-21T07:24:51.241Z',
                            result: { responses: { blub: 'Tschu tschu', bla: ['XL'], mail: 'de@z.xy' } }
                        },
                    ]
                }
            };
        }
    }];
    beforeEach(() => {
        didFetchResults = false;
    });

    it('should not show dialog when isOpen is not set', () => {
        const screen = render(
            <FormResultsDialog isOpen={false} onRequestClose={() => {}} contentModule={contentModule} />,
            {}, { useCache: true, additionalMocks: [...mocks] }
        );
        expect(screen.queryByRole('presentation')).toBeNull();
    });

    it('should show dialog when isOpen is set', () => {
        const screen = render(
            <FormResultsDialog isOpen onRequestClose={() => {}} contentModule={contentModule} />,
            {}, { useCache: true, additionalMocks: [...mocks] }
        );
        expect(screen.queryByRole('presentation')).toBeVisible();
        expect(screen.queryByRole('heading', { name: /formulardaten/i })).toBeVisible();
    });

    it('should generate and download a csv when the button is clicked', async () => {
        global.URL.createObjectURL = jest.fn(() => 'http://localhost/0');

        const screen = render(
            <FormResultsDialog isOpen onRequestClose={() => {}} contentModule={contentModule} />,
            {}, { useCache: true, additionalMocks: mocks }
        );
        await waitFor(() => { expect(didFetchResults).toEqual(true); });
        expect(screen.getByText('3 gespeicherte Einsendungen')).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /csv herunterladen/i })).toBeInTheDocument();

        let data: Blob, filename: string;
        (saveAs as any).mockImplementation((_data: Blob, _filename: string) => {
            data = _data; filename = _filename;
        });
        userEvent.click(screen.getByRole('button', { name: /csv herunterladen/i }));
        expect(saveAs).toHaveBeenCalled();
        return waitFor(() => {
            expect(data).not.toBeNull();
        }).then(async () => {
            expect(filename).toEqual('formulardaten.csv');
            expect(data.type).toMatch(/text\/csv/);
            expect((await new Response(data).text()).replace(/(\r|\n)/g, '')).toEqual(
                '"Datum","blub","bla","mail"' +
                '"21.12.2020 08:24","Hallo","S,XL","ab@c.de"' +
                '"21.12.2020 08:24","Test","","de@z.xy"' +
                '"21.12.2020 08:24","Tschu tschu","XL","de@z.xy"'
            );

        });
    });
});
