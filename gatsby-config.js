const sourceRepos = require('./source-repos');

const multiSlashRE = /\/{2,}/g;
const trimPrefix = str => `/${str}`.replace(multiSlashRE, '/');

const relativeLinksPlugins = sourceRepos.reduce((plugins, { name, baseURI }) => {
  if (typeof name !== 'string' || typeof baseURI !== 'string') return plugins;
  return [
    ...plugins,
    {
      resolve: "gatsby-remark-prefix-relative-links",
      options: {
        prefix: trimPrefix(baseURI),
        test: {
          field: 'sourceInstanceName',
          value: name,
        },
      },
    },
  ];
}, []);

const sourceGitPlugins = sourceRepos.reduce((plugins, docs) => {
  const { name, remote, branch, directory } = docs;
  const patterns = `${directory}/**`.replace(multiSlashRE, '/');
  return [
    ...plugins,
    {
      resolve: "gatsby-source-git",
      options: { name, remote, branch, patterns },
    },
  ];
}, []);

module.exports = {
  siteMetadata: {
    title: "farmOS.org 2.x",
    titleTemplate: "%s | farmOS 2.x Docs",
    description: "This is documentation for the upcoming release of farmOS 2.0, now under active development.",
    keywords: "agriculture, technology, software, data, open source, farming, Drupal",
    url: "",
    image: "/images/farmOS-logo.png",
    twitterUsername: "@farmOSorg",
  },
  plugins: [
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
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          ...relativeLinksPlugins,
          'gatsby-remark-autolink-headers', // must precede prismjs!
          'gatsby-remark-prismjs',
        ],
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
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
    ...sourceGitPlugins,
    "gatsby-plugin-catch-links",
  ],
};
