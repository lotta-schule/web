import * as React from 'react';
import { PrivacyPage } from 'layouts/privacy/PrivacyPage';
import { GetServerSidePropsContext } from 'next';

const PrivacyRoute = () => {
    return <PrivacyPage />;
};

export const getServerSideProps = async ({}: GetServerSidePropsContext) => {
    return {
        props: {},
    };
};

export default PrivacyRoute;
