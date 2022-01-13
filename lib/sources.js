const fs = require('fs');
const path = require('path');
const { compose, evolve, filter, map, mergeRight } = require('ramda');
const nav = require('./navigation');
const sourceRepos = require('../source-repos');

const validateSourceRepo = (source = {}) => {
  const { name, mkdocs, baseURI, remote } = source;
  let isValid = true, msg = 'Skipping source.';
  if (typeof name !== 'string') {
    isValid = false; msg = `${msg} Invalid name: ${name}.`;
  }
  if (mkdocs && typeof mkdocs !== 'string') {
    isValid = false; msg = `${msg} Invalid MkDocs path: ${mkdocs}.`;
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
const withDefaults = mergeRight({ parentPath: '/', children: [] });
const normalizeSourceRepo = config => evolve({
  mkdocs: dir => path.resolve('.cache/gatsby-source-git/', config.name, dir),
  children: compose(map(normalizeSourceRepo), filter(validateSourceRepo)),
}, withDefaults(config));

const sources = {
  name: 'content',
  title: 'farmOS.org',
  baseURI: '/',
  mkdocs: 'src/content/config.yml',
  children: map(normalizeSourceRepo, sourceRepos),
};

const findRepoConfig = (name, repos = []) => {
  const [head, ...tail] = repos;
  if (!head || head.name === name) {
    return head;
  }
  if (Array.isArray(head.children)) {
    const config = findRepoConfig(name, head.children);
    if (config) return config;
  }
  if (tail.length > 0) {
    const config = findRepoConfig(name, tail);
    if (config) return config;
  }
  return undefined;
};

function cacheSourceData() {
  const navigation = nav.fromSources(sources);
  const json = JSON.stringify({ sources, navigation });
  const jsonPath = '.cache/__farmOS__source_data.json';
  fs.writeFileSync(jsonPath, json);
};

module.exports = {
  findRepoConfig,
  cacheSourceData,
};
