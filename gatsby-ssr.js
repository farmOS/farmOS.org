import React from 'react';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import { renderToString } from 'react-dom/server';
import { makeMuiCache, makeTssCache } from './src/theme-cache';
import Layout from './src/components/layout';
import { TssCacheProvider } from 'tss-react';

export const replaceRenderer = (args) => {
  const { bodyComponent, replaceBodyHTMLString, setHeadComponents, pathname } = args;

  const muiCache = makeMuiCache();
  const { extractCriticalToChunks } = createEmotionServer(muiCache);

  const emotionStyles = extractCriticalToChunks(
    renderToString(
      <CacheProvider value={muiCache}>
        <TssCacheProvider value={makeTssCache()}>
          <Layout pathname={pathname}>{bodyComponent}</Layout>
        </TssCacheProvider>
      </CacheProvider>
    )
  );

  const muiStyleTags = emotionStyles.styles.map((style) => {
    const { css, key, ids } = style || {};
    return (
      <style
        key={key}
        data-emotion={`${key} ${ids.join(` `)}`}
        dangerouslySetInnerHTML={{ __html: css }}
      />
    );
  });

  setHeadComponents(muiStyleTags);

  // render the result from `extractCritical`
  replaceBodyHTMLString(emotionStyles.html);
};
