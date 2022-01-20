const path = require('path');
const { assoc, compose, evolve, has, ifElse } = require('ramda');

const validateSource = (source = {}) => {
  const { name, config, baseURI, remote, local } = source;
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
  if (typeof remote !== 'string' && !local) {
    isValid = false; msg = `${msg} Invalid remote git url: ${remote}.`;
  }
  // eslint-disable-next-line no-console
  if (!isValid && process.env.NODE_ENV === 'development') console.warn(msg);
  return isValid;
};

const prepareSource = git => (s) => ifElse(
  has('remote'),
  compose(
    evolve({
      config: c => path.resolve(git, s.name, c),
    }),
    assoc('basePath', path.resolve(git, s.name, s.directory || '')),
  ),
  assoc('basePath', s.local),
)(s);

const prepareSources = (sources, git) => {
  return sources.filter(validateSource).map(prepareSource(git));
};

module.exports = {
  prepareSources,
};
