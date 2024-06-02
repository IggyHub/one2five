module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      "absoluteRuntime": false,
      "corejs": false,
      "helpers": true,
      "regenerator": true,
      "version": "@babel/runtime"
    }]
  ],
};
