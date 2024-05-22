import * as React from 'react';
import { Box } from '@lotta-schule/hubert';
import { UserBrowser } from 'shared/browser';
import { Header, Main } from 'layout';

import styles from './MediaPage.module.scss';

export const MediaPage = () => {
  return (
    <Main className={styles.root}>
      <Header bannerImageUrl={'/bannerProfil.png'}>
        <h2>Dateien und Medien</h2>
      </Header>

      <Box className={styles.container}>
        <UserBrowser />
      </Box>
    </Main>
  );
};
