import React from 'react';
import Layout from './src/components/layout';
import { makeMuiCache, makeTssCache } from './src/theme-cache';
import { CacheProvider } from '@emotion/react';
import { TssCacheProvider } from 'tss-react';

export const wrapRootElement = ({ element, props }) => (
  <CacheProvider value={makeMuiCache()}>
    <TssCacheProvider value={makeTssCache()}>
    <Layout {...props}>{element}</Layout>
    </TssCacheProvider>
  </CacheProvider>
);
