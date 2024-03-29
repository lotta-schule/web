import * as React from 'react';
import { RequestResetPage } from 'password/RequestResetPage';
import { GetServerSidePropsContext } from 'next';

const RequestResetRoute = () => {
  return <RequestResetPage />;
};

export const getServerSideProps = async ({}: GetServerSidePropsContext) => {
  return {
    props: {},
  };
};

export default RequestResetRoute;
