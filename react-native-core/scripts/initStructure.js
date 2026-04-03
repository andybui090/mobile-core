const fs = require('fs');
const path = require('path');

const root = 'src';

// ✅ core structure
const coreDirs = [
  'core/api',
  'core/auth',
  'core/storage',
  'core/config',
  'core/navigation',
  'core/utils',
];

// ✅ shared
const sharedDirs = [
  'shared/components',
  'shared/hooks',
  'shared/utils',
  'shared/constants',
  'shared/theme',
];

// ✅ app
const appDirs = [
  'app',
];

// ✅ features (auto generate)
const features = [
  'auth',
  'feed',
  'post',
  'comment',
  'profile',
  'chat',
  'notification',
];

const featureStructure = [
  'api',
  'components',
  'hooks',
  'screens',
  'store',
];

// 👉 merge all dirs
const dirs = [
  ...coreDirs,
  ...sharedDirs,
  ...appDirs,
];

// 👉 create base dirs
dirs.forEach((dir) => {
  const fullPath = path.join(root, dir);
  fs.mkdirSync(fullPath, { recursive: true });
});

// 👉 create feature dirs
features.forEach((feature) => {
  featureStructure.forEach((sub) => {
    const fullPath = path.join(root, 'features', feature, sub);
    fs.mkdirSync(fullPath, { recursive: true });
  });

  // create types file
  const typesFile = path.join(root, 'features', feature, 'types.ts');
  if (!fs.existsSync(typesFile)) {
    fs.writeFileSync(typesFile, '');
  }
});

// ✅ global extra
const extraFiles = [
  'core/api/client.ts',
  'core/config/env.ts',
  'app/App.tsx',
  'app/providers.tsx',
  'app/routes.tsx',
];

extraFiles.forEach((file) => {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, '');
  }
});

console.log('🚀 Structure created successfully!');