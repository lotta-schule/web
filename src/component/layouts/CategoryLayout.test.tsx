import React from 'react';
import { render, cleanup, waitFor } from 'test/util';
import { Klausurenplan, VivaLaRevolucion, MusikCategory, KeinErSieEsUser, SomeUser, imageFile } from 'test/fixtures';
import { ArticleModel } from 'model';
import { MockedResponse } from '@apollo/client/testing';
import { GetCategoryWidgetsQuery } from 'api/query/GetCategoryWidgetsQuery';
import { CategoryLayout } from './CategoryLayout';

afterEach(cleanup);

describe('component/article/CategoryLayout', () => {

    const categoryWidgetsMock = (categoryId: string): MockedResponse => (
        { request: { query: GetCategoryWidgetsQuery, variables: { categoryId: MusikCategory.id } }, result: { data: [] } }
    );

    describe('Standard Category', () => {
        const articles = [Klausurenplan, VivaLaRevolucion]
            .map(partialArticle => ({ ...partialArticle, users: [KeinErSieEsUser, SomeUser], category: MusikCategory}) as ArticleModel);

        it('should render the category title', async () => {
            const { queryByText } = render(
                <CategoryLayout category={MusikCategory} articles={articles} />,
                {}, { additionalMocks: [categoryWidgetsMock(MusikCategory.id)]}
            );
            await waitFor(() => {
                expect(queryByText('Musik')).toBeVisible();
            });
        });

        it('should render the category banner image', async () => {
            const category = { ...MusikCategory, bannerImageFile: imageFile };
            const { findByTestId } = render(
                <CategoryLayout category={category as any} articles={articles} />,
                {}, { additionalMocks: [categoryWidgetsMock(category.id)]}
            );
            const headerContent = await findByTestId('HeaderContent');
            expect(getComputedStyle(headerContent).backgroundImage).toContain('meinbild.jpg');
        });

        it('should render the widgets list', async () => {
            const { queryByTestId } = render(
                <CategoryLayout category={MusikCategory} articles={articles} />,
                {}, { additionalMocks: [categoryWidgetsMock(MusikCategory.id)]}
            );
            await waitFor(() => {
                expect(queryByTestId('WidgetsList')).toBeVisible();
            });
        });

        it('should render an ArticlePreview', async () => {
            const screen = render(
                <CategoryLayout category={MusikCategory} articles={articles} />,
                {}, { additionalMocks: [categoryWidgetsMock(MusikCategory.id)]}
            );
            await waitFor(() => {
                expect([
                    ...screen.queryAllByTestId('ArticlePreviewDensedLayout'),
                    ...screen.queryAllByTestId('ArticlePreviewStandardLayout')
                ]).toHaveLength(2);
            });
        });
    });

});
