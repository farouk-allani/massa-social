const webpack = require("webpack");

module.exports = function override(config, env) {
  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
    },
  });

  config.resolve.fallback = {
    ...(config.resolve.fallback || {}),
    util: require.resolve("util/"),
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    assert: require.resolve("assert/"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify/browser"),
    url: require.resolve("url/"),
    buffer: require.resolve("buffer/"),
    process: require.resolve("process/browser"),
    vm: require.resolve("vm-browserify"),
  };

  config.plugins = [
    ...(config.plugins || []),
    new webpack.ProvidePlugin({
      process: "process",
      Buffer: ["buffer", "Buffer"],
    }),
  ];

  return config;
};
