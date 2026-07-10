const alias = {
  '^@/(.+)': './src/\\1',
};

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  // Remove console logs in production, except for console.error and console.warn
  env: {
    production: {
      plugins: [
        ['transform-remove-console', {
          exclude: ['error', 'warn'],
        }],
      ],
    },
  },
  plugins: [
    ['react-native-worklets/plugin'],
    [
      'module-resolver',
      {
        root: ['./'],
        alias,
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
  ],
};