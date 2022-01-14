const { multiSlashRE } = require('./fmt');

const trimPrefix = str => `/${str}`.replace(multiSlashRE, '/');

const createTransformerRemarkPlugins = sources => sources.reduce((plugins, source) => {
  const { name, parentURI = '', baseURI, children } = source;
  const sourcePlugin = {
    resolve: "gatsby-remark-prefix-relative-links",
    options: {
      prefix: trimPrefix(`${parentURI}/${baseURI}`),
      test: {
        field: 'sourceInstanceName',
        value: name,
      },
    },
  };
  if (!Array.isArray(children)) return [...plugins, sourcePlugin];
  return [
    ...plugins,
    sourcePlugin,
    ...createTransformerRemarkPlugins(children),
  ];
}, []);

const alreadyCloned = (plugins, options) =>
  plugins.some(({ options: { name, remote, branch, patterns } }) => (
    name === options.name
      && remote === options.remote
      && branch === options.branch
      && patterns === options.patterns));
const createSourceGitPlugins = sources => sources.reduce((plugins, source) => {
  const { name, remote, branch, directory = '', children } = source;
  const patterns = `${directory}/**`.replace(multiSlashRE, '/');
  const options = { name, remote, branch, patterns };
  if (alreadyCloned(plugins, options)) return plugins;
  const sourcePlugin = {
    resolve: "gatsby-source-git",
    options: { name, remote, branch, patterns },
  };
  if (!Array.isArray(children)) return [...plugins, sourcePlugin];
  return [
    ...plugins,
    sourcePlugin,
    ...createSourceGitPlugins(children),
  ];
}, []);

module.exports = {
  createTransformerRemarkPlugins,
  createSourceGitPlugins,
};
