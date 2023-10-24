const postcssNormalize = require('postcss-normalize');

module.exports = (config) => {
  const cssLoaderIndex = config.module.rules.findIndex((r) =>
    r.test.toString().includes('css')
  );
  const cssLoader = config.module.rules[cssLoaderIndex];

  cssLoader.oneOf.forEach((rule) => {
    // https://github.com/nrwl/nx/issues/4882
    if (rule.test.toString().includes('module')) {
      rule.use.splice(rule.use.length - 1, 0, {
        // Options for PostCSS as we reference these options twice
        // Adds vendor prefixing based on your specified browser support in
        // package.json
        loader: require.resolve('postcss-loader'),
        options: {
          // Necessary for external CSS imports to work
          // https://github.com/facebook/create-react-app/issues/2677

          postcssOptions: {
            ident: 'postcss',
            plugins: () => [
              require('postcss-flexbugs-fixes'),
              require('postcss-preset-env')({
                autoprefixer: {
                  flexbox: 'no-2009',
                },
                stage: 3,
              }),
              // Adds PostCSS Normalize as the reset css with default options,
              // so that it honors browserslist config in package.json
              // which in turn let's users customize the target behavior as per their needs.
              postcssNormalize(),
            ],
          },
        },
      });
    }
  });
};
