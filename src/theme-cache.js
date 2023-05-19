import createCache from '@emotion/cache';

export let muiCache;
export const makeMuiCache = () => {
  if (!muiCache) {
    muiCache = createCache({
      key: 'mui',
      prepend: true,
    });
  }
  return muiCache;
};

export let tssCache;
export const makeTssCache = () => {
  if (!tssCache) {
    tssCache = createCache({
      "key": "tss"
    });
  }
  return tssCache;
};
