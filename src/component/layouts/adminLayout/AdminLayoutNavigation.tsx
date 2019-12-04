import React, { memo } from 'react';
import { Paper, Tabs, Tab } from '@material-ui/core';
import { useCurrentUser } from 'util/user/useCurrentUser';
import { User } from 'util/model';
import { UserModel } from 'model';
import useRouter from 'use-react-router';

export const AdminLayoutNavigation = memo(() => {
    const { history, location } = useRouter();
    const currentUser = useCurrentUser()[0] as UserModel;
    return (
        <Paper>
            <Tabs
                value={location.pathname.split('/').slice(0, 3).join('/')}
                onChange={(_, value) => { history.push(value); }}
                orientation="vertical"
                variant="scrollable"
                aria-label="Admin Einstellungen"
            >
                <Tab label="Mein Lotta" value={'/admin/tenant'} />
                <Tab label="Nutzer &amp; Gruppen" value={'/admin/users'} />
                <Tab label="Kategorien" value={'/admin/categories'} />
                <Tab label="Marginalen" value={'/admin/widgets'} />
                {User.isAdmin(currentUser) && (
                    <Tab label="Freizugebende Beiträge" value={'/admin/unpublished'} />
                )}
            </Tabs>
        </Paper>
    );
});