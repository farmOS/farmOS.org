module.exports = [
  {
    name: 'farmOS',
    title: 'farmOS 2.x Docs',
    baseURI: '/',
    mkdocs: 'mkdocs.yml',
    remote: 'https://github.com/farmOS/farmOS.git',
    branch: '2.x',
    directory: 'docs/',
  },
  {
    name: 'farmOS.js',
    title: 'farmOS.js Docs',
    baseURI: '/js',
    mkdocs: 'docs/config.yml',
    remote: 'https://github.com/jgaehring/farmOS.js.git',
    branch: 'main',
    directory: 'docs/',
  },
];
