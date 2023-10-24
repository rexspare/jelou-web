// const nrwlConfig = require("@nx/react/plugins/webpack.js");
// const fixCssLoaders = require("./webpack-css-loader-fix.js");
// // const babelWebpackConfig = require('@nx/react/plugins/babel');

// module.exports = (config) => {
//     fixCssLoaders(config);
//     config.module.rules.push({
//         test: /\.svg$/,
//         use: ["@svgr/webpack", "url-loader"],
//     });
//     nrwlConfig(config);
//     return {
//         ...config,
//         module: {
//             rules: [
//                 ...config.module.rules,
//                 {
//                     test: /\.css$|\.scss$|\.sass$|\.less$|\.styl$/,
//                     use: [
//                         {
//                             loader: "postcss-loader",
//                         },
//                     ],
//                 },
//             ],
//         },
//     };
// };
