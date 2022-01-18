const { multiSlashRE } = require('./fmt');

const trimPrefix = str => `/${str}`.replace(multiSlashRE, '/');

const createTransformerRemarkPlugins = sources => sources.reduce((plugins, source) => {
  const { name, baseURI, remote } = source;
  if (!remote) return plugins;
  const sourcePlugin = {
    resolve: "gatsby-remark-prefix-relative-links",
    options: {
      prefix: trimPrefix(baseURI),
      test: {
        field: 'sourceInstanceName',
        value: name,
      },
    },
  };
  return [...plugins, sourcePlugin];
}, []);

const alreadyCloned = (plugins, options) =>
  plugins.some(({ options: { name, remote, branch, patterns } }) => (
    name === options.name
      && remote === options.remote
      && branch === options.branch
      && patterns === options.patterns));
const createSourceGitPlugins = sources => sources.reduce((plugins, source) => {
  const { name, remote, branch, directory = '' } = source;
  const patterns = `${directory}/**`.replace(multiSlashRE, '/');
  const options = { name, remote, branch, patterns };
  if (!remote || alreadyCloned(plugins, options)) return plugins;
  const sourcePlugin = {
    resolve: "gatsby-source-git",
    options: { name, remote, branch, patterns },
  };
  return [...plugins, sourcePlugin];
}, []);

module.exports = {
  createTransformerRemarkPlugins,
  createSourceGitPlugins,
};
