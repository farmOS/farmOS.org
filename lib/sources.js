const fs = require('fs');
const path = require('path');
const { assoc, compose, evolve, filter, map, mergeRight } = require('ramda');
const nav = require('./navigation');

const validateSourceRepo = (source = {}) => {
  const { name, config, baseURI, remote } = source;
  let isValid = true, msg = 'Skipping source.';
  if (typeof name !== 'string') {
    isValid = false; msg = `${msg} Invalid name: ${name}.`;
  }
  if (config && typeof config !== 'string') {
    isValid = false; msg = `${msg} Invalid Config path: ${config}.`;
  }
  if (typeof baseURI !== 'string') {
    isValid = false; msg = `${msg} Invalid base URI: ${baseURI}.`;
  }
  if (typeof remote !== 'string') {
    isValid = false; msg = `${msg} Invalid remote git url: ${remote}.`;
  }
  if (!isValid && process.env.NODE_ENV === 'development') console.warn(msg);
  return isValid;
};
const withDefaults = mergeRight({ parentURI: '/', children: [] });
const normalizeSourceRepo = config => evolve({
  config: dir => path.resolve('.cache/gatsby-source-git/', config.name, dir),
  children: compose(map(normalizeSourceRepo), filter(validateSourceRepo)),
}, withDefaults(config));

const findSourceConfig = (name, sources = []) => {
  const [head, ...tail] = sources;
  if (!head || head.name === name) {
    return head;
  }
  if (Array.isArray(head.children)) {
    const config = findSourceConfig(name, head.children);
    if (config) return config;
  }
  if (tail.length > 0) {
    const config = findSourceConfig(name, tail);
    if (config) return config;
  }
  return undefined;
};

const cacheSourceData = (localSources, remoteSources) => {
  const sources = assoc(
    'children',
    map(normalizeSourceRepo, remoteSources),
    localSources,
  );
  const navigation = nav.fromSources(sources);
  const json = JSON.stringify({ sources, navigation });
  const jsonPath = '.cache/__farmOS__source_data.json';
  fs.writeFileSync(jsonPath, json);
};

module.exports = {
  findSourceConfig,
  cacheSourceData,
};
