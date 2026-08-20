module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      ['module-resolver', {
        root: ['./src'],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        alias: {
          '@': './src',
          '@domain': './src/domain',
          '@providers': './src/providers',
          '@state': './src/state',
          '@hooks': './src/hooks',
          '@services': './src/services',
          '@storage': './src/storage',
          '@components': './src/components',
          '@pages': './src/pages',
          '@lib': './src/lib',
          '@styles': './src/styles',
        },
      }],
    ],
  };
};