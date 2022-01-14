const {
  createTransformerRemarkPlugins, createSourceGitPlugins,
} = require('./lib/plugins');
const siteData = require('./site-data');

const { gitSources, googleAnalytics, siteMetadata } = siteData;

const transformerRemarkPlugins = createTransformerRemarkPlugins(gitSources);
const sourceGitPlugins = createSourceGitPlugins(gitSources);

module.exports = {
  siteMetadata,
  plugins: [
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: googleAnalytics,
        // Puts tracking script in the head instead of the body.
        head: false,
        // Some countries (such as Germany) require you to use the _anonymizeIP
        // function for Google Analytics.
        anonymize: true,
        // Google Analytics will not be loaded at all for visitors that have
        // “Do Not Track” enabled.
        respectDNT: true,
      },
    },
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
          ...transformerRemarkPlugins,
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
    ...sourceGitPlugins,
    "gatsby-plugin-catch-links",
  ],
};
