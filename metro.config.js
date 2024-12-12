const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { assetExts } = config.resolver;
  config.resolver.assetExts = assetExts.filter((ext) => ext !== 'svg');
  config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];
  config.resolver.blacklistRE = /.*\.spec\.tsx$/;

  config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

  return config;
})();
