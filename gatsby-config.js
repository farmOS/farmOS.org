module.exports = {
  siteMetadata: {
    title: "farmOS.org 2.x",
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
        icon: "src/images/icon.png",
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-prefix-relative-links",
            options: {
              sourceName: "farmOS",
              prefix: "/farmos/docs",
            },
          },
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
    {
      resolve: "gatsby-source-git",
      options: {
        name: "farmOS",
        remote: "https://github.com/farmOS/farmOS.git",
        branch: "2.x",
        patterns: "docs/**",
      },
    },
  ],
};
