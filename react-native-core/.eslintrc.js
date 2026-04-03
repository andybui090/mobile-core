module.exports = {
  root: true,
  extends: '@react-native',

  plugins: ['boundaries', 'import', 'simple-import-sort'],

  settings: {
    'import/resolver': {
      typescript: {},
    },

    'boundaries/elements': [
      { type: 'app', pattern: 'src/app/**' },
      { type: 'core', pattern: 'src/core/**' },
      { type: 'shared', pattern: 'src/shared/**' },
      { type: 'feature-domain', pattern: 'src/features/*/domain/**' },
      { type: 'feature-data', pattern: 'src/features/*/data/**' },
      { type: 'feature-application', pattern: 'src/features/*/application/**' },
      { type: 'feature-presentation', pattern: 'src/features/*/presentation/**' },
      { type: 'feature-store', pattern: 'src/features/*/store/**' },
    ],
  },

  rules: {
    // =========================
    // IMPORT RULES
    // =========================

    // ❌ block relative path dài
    'no-restricted-imports': [
      'error',
      {
        patterns: ['../../*', '../../../*'],
      },
    ],

    // auto sort import
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    // remove unused import
    'import/no-unused-modules': 'warn',

    // =========================
    // BOUNDARIES (giữ nguyên)
    // =========================
    'boundaries/element-types': [
      'error',
      {
        default: 'disallow',
        rules: [
          {
            from: 'feature-presentation',
            allow: ['feature-application', 'shared', 'core'],
          },
          {
            from: 'feature-application',
            allow: ['feature-domain', 'shared', 'core'],
          },
          {
            from: 'feature-data',
            allow: ['feature-domain', 'core'],
          },
          {
            from: 'feature-domain',
            allow: ['shared'],
          },
          {
            from: 'feature-store',
            allow: ['feature-application', 'shared', 'core'],
          },
        ],
      },
    ],
  },
};