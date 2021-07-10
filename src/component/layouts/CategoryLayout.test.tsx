import * as React from 'react';
import { render, waitFor } from 'test/util';
import {
    Klausurenplan,
    VivaLaRevolucion,
    MusikCategory,
    KeinErSieEsUser,
    SomeUser,
    imageFile,
} from 'test/fixtures';
import { ArticleModel } from 'model';
import { MockedResponse } from '@apollo/client/testing';
import { GetCategoryWidgetsQuery } from 'api/query/GetCategoryWidgetsQuery';
import { CategoryLayout } from './CategoryLayout';

describe('component/article/CategoryLayout', () => {
    const categoryWidgetsMock = (_categoryId: string): MockedResponse => ({
        request: {
            query: GetCategoryWidgetsQuery,
            variables: { categoryId: MusikCategory.id },
        },
        result: { data: [] },
    });

    describe('Standard Category', () => {
        const articles = [Klausurenplan, VivaLaRevolucion].map(
            (partialArticle) =>
                ({
                    ...partialArticle,
                    users: [KeinErSieEsUser, SomeUser],
                    category: MusikCategory,
                } as ArticleModel)
        );

        it('should render the category title', async () => {
            const screen = render(
                <CategoryLayout category={MusikCategory} articles={articles} />,
                {},
                { additionalMocks: [categoryWidgetsMock(MusikCategory.id)] }
            );
            await waitFor(() => {
                expect(screen.queryByText('Musik')).toBeVisible();
            });
        });

        it('should render the category banner image', async () => {
            const category = { ...MusikCategory, bannerImageFile: imageFile };
            const screen = render(
                <CategoryLayout
                    category={category as any}
                    articles={articles}
                />,
                {},
                { additionalMocks: [categoryWidgetsMock(category.id)] }
            );
            const headerContent = await screen.findByTestId('HeaderContent');
            expect(getComputedStyle(headerContent).backgroundImage).toContain(
                '/storage/f/123'
            );
        });

        it('should render the widgets list', async () => {
            const screen = render(
                <CategoryLayout category={MusikCategory} articles={articles} />,
                {},
                { additionalMocks: [categoryWidgetsMock(MusikCategory.id)] }
            );
            await waitFor(() => {
                expect(screen.queryByTestId('WidgetsList')).toBeVisible();
            });
        });

        it('should render an ArticlePreview', async () => {
            const screen = render(
                <CategoryLayout category={MusikCategory} articles={articles} />,
                {},
                { additionalMocks: [categoryWidgetsMock(MusikCategory.id)] }
            );
            await waitFor(() => {
                expect([
                    ...screen.queryAllByTestId('ArticlePreviewDensedLayout'),
                    ...screen.queryAllByTestId('ArticlePreviewStandardLayout'),
                ]).toHaveLength(2);
            });
        });
    });
});
