module.exports = function (api) {
  api.cache(true)
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      "react-native-reanimated/plugin",
      "@babel/plugin-transform-export-namespace-from",
      "@babel/plugin-transform-class-static-block",
    ],
  }
}