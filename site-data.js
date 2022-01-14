/**
 * TEMPLATES
 * These are constants which can be supplied as the `template` property when
 * registering a source repository. The corresponding template will be used to
 * generate the pages for each markdown file in the source repositories'
 * designated `directory`. The default is `DOCS_TEMPLATE`.
 */
const DOCS_TEMPLATE = './src/templates/docs.js';

module.exports = {
  siteMetadata: {
    title: "farmOS",
    titleTemplate: "%s | farmOS",
    description: "farmOS is a free and open source web-based application for farm management, planning, and record keeping.",
    keywords: "agriculture, technology, software, data, open source, farming, Drupal",
    siteUrl: "https://farmos.org",
    image: "/images/farmOS-logo.png",
    twitterUsername: "@farmOSorg",
  },
  googleAnalytics: 'UA-56974603-1',
  defaultTemplate: DOCS_TEMPLATE,
  localContent: {
    name: 'content',
    title: 'farmOS.org',
    baseURI: '/',
    mkdocs: 'src/content/config.yml',
  },
  gitSources: [
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
  ],
};
