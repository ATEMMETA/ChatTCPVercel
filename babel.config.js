// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "babel-plugin-inline-import",
      ["module-resolver", {
        root: ["./"],
        alias: {
          "@components": "./app/components",
          "@lib": "./lib"
        }
      }],
      "react-native-web"
    ]
  };
};
