const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const path = require("path");

module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        // Add the following lines to handle 'crypto' and 'fs' dependencies
        webpackConfig.resolve.fallback = {
          fs: false, // or 'empty' if you prefer an empty module
          path: false,
          os: false,
          crypto: require.resolve('crypto-browserify'),
          stream: require.resolve('stream-browserify'),
        };
  
        // Add the 'module' configuration for handling .wasm files
        webpackConfig.module.rules.push({
          test: /\.wasm$/,
          type: 'javascript/auto',
        });
  
        // Add the test for 'node:buffer'
        webpackConfig.module.rules.push({
          test: /node_modules[\\/]node:buffer/,
          loader: 'raw-loader',
        });

        // Add the rule for TypeScript files
        webpackConfig.module.rules.push({
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        });

        webpackConfig.plugins.push(new NodePolyfillPlugin());
        webpackConfig.output.filename = 'getMixtapeNFTs.js';
        webpackConfig.output.chunkFilename = 'getMixtapeNFTs.[id].js';
  
        return webpackConfig;
      },
    },
  };
  