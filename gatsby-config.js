const sourceRepos = require('./source-repos');

const multiSlashRE = /\/{2,}/g;
const trimPrefix = str => `/${str}`.replace(multiSlashRE, '/');

const createTransformerRemarkPlugins = sources => sources.reduce((plugins, source) => {
  const { name, parentPath = '', baseURI, children } = source;
  const sourcePlugin = {
    resolve: "gatsby-remark-prefix-relative-links",
    options: {
      prefix: trimPrefix(`${parentPath}/${baseURI}`),
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
  const { name, remote, branch, directory, children } = source;
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
  siteMetadata: {
    title: "farmOS.org 2.x",
    titleTemplate: "%s | farmOS 2.x Docs",
    description: "This is documentation for the upcoming release of farmOS 2.0, now under active development.",
    keywords: "agriculture, technology, software, data, open source, farming, Drupal",
    siteUrl: "https://farmos.org",
    image: "/images/farmOS-logo.png",
    twitterUsername: "@farmOSorg",
  },
  plugins: [
    'gatsby-plugin-sitemap',
    {
      resolve: "gatsby-theme-material-ui",
      options: {
        webFontsConfig: {
          fonts: {
            google: [
              {
                family: "Roboto",
                variants: ["300", "400", "400i", "700"],
              },
              {
                family: "Roboto Mono",
                variants: ["300", "400", "400i", "700"],
              },
            ],
          },
        },
      },
    },
    "gatsby-plugin-image",
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "UA-56974603-1",
      },
    },
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon-512x512.png",
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          ...createTransformerRemarkPlugins(sourceRepos),
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 960,
            },
          },
          'gatsby-remark-autolink-headers', // must precede prismjs!
          'gatsby-remark-prismjs',
        ],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "content",
        path: "./src/content/",
      },
      __key: "content",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
    ...createSourceGitPlugins(sourceRepos),
    "gatsby-plugin-catch-links",
  ],
};
