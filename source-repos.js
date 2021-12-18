module.exports = [
  {
    name: 'farmOS',
    title: 'farmOS Docs',
    baseURI: '/',
    mkdocs: 'mkdocs.yml',
    remote: 'https://github.com/farmOS/farmOS.git',
    branch: '2.x',
    directory: 'docs/',
    children: [
      {
        name: 'farmOS.js',
        title: 'farmOS.js',
        parentPath: '/development',
        baseURI: '/farmos-js',
        mkdocs: 'docs/config.yml',
        remote: 'https://github.com/farmOS/farmOS.js.git',
        branch: 'main',
        directory: 'docs/',
      },
      {
        name: 'farmOS.py',
        title: 'farmOS.py',
        parentPath: '/development',
        baseURI: '/farmos-py',
        mkdocs: 'docs/config.yml',
        remote: 'https://github.com/farmOS/farmOS.py.git',
        branch: '1.x',
        directory: 'docs/',
      },
    ],
  },
];
