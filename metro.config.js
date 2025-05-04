const { getDefaultConfig: getDefaultExpoConfig } = require("@expo/metro-config")

metroConfig = (() => {
  const config = getDefaultExpoConfig(__dirname)

  const { transformer, resolver } = config

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  }
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
  }

  config.resolver.sourceExts.push("cjs");
  config.resolver.unstable_enablePackageExports = false;
  config.resolver.assetExts.push("png");
  config.resolver.assetExts.push("ttf")


  return config
})()
module.exports = metroConfig;