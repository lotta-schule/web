import * as React from 'react';
import { Tune } from '@material-ui/icons';
import { AdminPage } from 'layouts/administration/AdminPage';
import { GeneralSettings } from 'layouts/administration/system/GeneralSettings';
import { GetServerSidePropsContext } from 'next';

const GeneralRoute = () => {
    return (
        <AdminPage
            title={
                <>
                    <Tune /> Grundeinstellungen
                </>
            }
            component={GeneralSettings}
            hasHomeLink
        />
    );
};

export const getServerSideProps = async ({}: GetServerSidePropsContext) => {
    return {
        props: {},
    };
};

export default GeneralRoute;
