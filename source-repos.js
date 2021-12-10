module.exports = [
  {
    name: 'farmOS',
    title: 'farmOS 2.x Docs',
    baseURI: '/docs',
    mkdocs: 'mkdocs.yml',
    remote: 'https://github.com/farmOS/farmOS.git',
    branch: '2.x',
    directory: 'docs/',
  },
  {
    name: 'farmOS.js',
    title: 'farmOS.js Docs',
    baseURI: '/docs/js',
    mkdocs: 'docs/config.yml',
    remote: 'https://github.com/farmOS/farmOS.js.git',
    branch: 'main',
    directory: 'docs/',
  },
  {
    name: 'farmOS.py',
    title: 'farmOS.py Docs',
    baseURI: '/docs/python',
    mkdocs: 'docs/config.yml',
    remote: 'https://github.com/farmOS/farmOS.py.git',
    branch: '1.x',
    directory: 'docs/',
  },
];
