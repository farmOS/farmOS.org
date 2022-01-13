/**
 * TEMPLATES
 * These are constants which can be supplied as the `template` property when
 * registering a source repository. The corresponding template will be used to
 * generate the pages for each markdown file in the source repositories'
 * designated `directory`. The default is `DOCS_TEMPLATE`.
 */
const DOCS_TEMPLATE = './src/templates/docs.js';

module.exports = [
  {
    name: 'farmOS',
    title: 'farmOS Docs',
    baseURI: '/',
    mkdocs: 'mkdocs.yml',
    remote: 'https://github.com/farmOS/farmOS.git',
    branch: '2.x',
    directory: 'docs/',
    template: DOCS_TEMPLATE,
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
