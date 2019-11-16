import React, { memo } from 'react';
import useRouter from 'use-react-router';
import { BaseLayoutMainContent } from './BaseLayoutMainContent';
import { BaseLayoutSidebar } from './BaseLayoutSidebar';
import { Switch, Route } from 'react-router-dom';
import { Navigation } from './adminLayout/Navigation';
import { UserManagement } from './adminLayout/userManagement/UserManagement';
import { CategoriesManagement } from './adminLayout/categoryManagment/CategoryManagement';
import { TenantManagement } from './adminLayout/tenantManagment/TenantManagement';
import { WidgetManagement } from './adminLayout/widgetManagement/WidgetManagement';
import { useCurrentUser } from 'util/user/useCurrentUser';
import { WidgetsList } from './WidgetsList';

export const AdminLayout = memo(() => {
    const [currentUser] = useCurrentUser();
    const { history } = useRouter();
    if (!currentUser) {
        history.replace('/');
        return <div></div>;
    }
    return (
        <>
            <BaseLayoutMainContent>
                <Switch>
                    <Route exact path='/admin' component={TenantManagement} />
                    <Route path='/admin/users' component={UserManagement} />
                    <Route path='/admin/categories' component={CategoriesManagement} />
                    <Route path='/admin/widgets' component={WidgetManagement} />
                </Switch>
            </BaseLayoutMainContent>
            <BaseLayoutSidebar>
                <WidgetsList widgets={[]}>
                    <Navigation />
                </WidgetsList>
            </BaseLayoutSidebar>
        </>
    );
});