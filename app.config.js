// app.config.js
module.exports = {
  expo: {
    name: "ChatTCP-Web",
    slug: "chattcp-web",
    version: "1.0.0",
    orientation: "default",
    userInterfaceStyle: "automatic",
    assetBundlePatterns: ["**/*"],
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/adaptive-icon.png"
    },
    plugins: [
      "expo-router",
      "expo-sqlite",
      ["expo-build-properties", {}]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {
        origin: false
      }
    }
  }
};
