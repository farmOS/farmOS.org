/**
 * TEMPLATES
 * These are constants which can be supplied as the `template` property when
 * registering a source repository. The corresponding template will be used to
 * generate the pages for each markdown file in the source repositories'
 * designated `directory`. The default is `DOCS_TEMPLATE`.
 */
const DOCS_TEMPLATE = './src/templates/docs.js';
const BLOG_TEMPLATE = './src/templates/blog.js';

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
  cache: '.cache/__farmOS__.json',
  git: '.cache/gatsby-source-git/',
  sources: [
    {
      name: 'content',
      title: 'farmOS.org',
      baseURI: '/',
      config: 'src/content/config.yml',
      local: 'src/content/',
    },
    {
      name: 'farmOS',
      title: 'farmOS Docs',
      baseURI: '/',
      config: 'mkdocs.yml',
      remote: process.env.FARMOS_REPO || 'https://github.com/farmOS/farmOS.git',
      branch: process.env.FARMOS_REPO_BRANCH || '4.x',
      directory: 'docs/',
      template: DOCS_TEMPLATE,
    },
    {
      name: 'farmOS.js',
      title: 'farmOS.js',
      baseURI: '/development/farmos-js',
      config: 'docs/config.yml',
      remote: process.env.FARMOS_JS_REPO || 'https://github.com/farmOS/farmOS.js.git',
      branch: process.env.FARMOS_JS_REPO_BRANCH || 'main',
      directory: 'docs/',
    },
    {
      name: 'farmOS.py',
      title: 'farmOS.py',
      baseURI: '/development/farmos-py',
      config: 'docs/config.yml',
      remote: process.env.FARMOS_PY_REPO || 'https://github.com/farmOS/farmOS.py.git',
      branch: process.env.FARMOS_PY_REPO_BRANCH || '1.x',
      directory: 'docs/',
    },
    {
      name: 'blog',
      title: 'Blog',
      baseURI: '/blog',
      page: {
        title: 'Blog',
        pathname: '/blog',
      },
      remote: process.env.BLOG_REPO || 'https://github.com/farmOS/farmOS-community-blog.git',
      branch: process.env.BLOG_REPO_BRANCH || 'main',
      directory: 'posts/',
      template: BLOG_TEMPLATE,
    },
  ],
};
