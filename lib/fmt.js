const multiSlashRE = /\/{2,}/g;

module.exports = {
  multiSlashRE,
  fmtPath: str => `/${str}/`.replace(multiSlashRE, '/'),
};
