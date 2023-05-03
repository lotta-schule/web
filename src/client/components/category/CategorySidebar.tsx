'use client';

import * as React from 'react';
import { useQuery } from '@apollo/client';
import { ErrorMessage } from '@lotta-schule/hubert';
import { CategoryModel, WidgetModel } from 'model';
import { User } from 'util/model';
import { useCurrentUser } from 'util/user/useCurrentUser';
import { Sidebar } from '../navigation/Sidebar';

import GetCategoryWidgetsQuery from 'api/query/GetCategoryWidgetsQuery.graphql';
import { WidgetsList } from 'category/widgetsList/WidgetsList';

export type CategorySidebarProps = {
    category: CategoryModel;
};

const CategorySidebar = React.memo(({ category }: CategorySidebarProps) => {
    const user = useCurrentUser();
    const {
        data: widgetsData,
        error: widgetsError,
        loading: isWidgetsLoading,
    } = useQuery(GetCategoryWidgetsQuery, {
        variables: { categoryId: category?.id },
        skip: !category,
    });
    const widgets = (widgetsData?.widgets ?? []).filter(
        (widget: WidgetModel) => {
            if (User.isAdmin(user)) {
                return !!user!.groups.find(
                    (g) =>
                        widget.groups.length < 1 ||
                        !!widget.groups.find((cg) => cg.id === g.id)
                );
            }
            return true;
        }
    );

    return (
        <Sidebar
            isEmpty={!widgetsError && !isWidgetsLoading && widgets.length < 1}
        >
            {widgetsError && <ErrorMessage error={widgetsError} />}
            <WidgetsList widgets={widgets} />
        </Sidebar>
    );
});

export default CategorySidebar;
