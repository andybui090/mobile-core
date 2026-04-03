const fs = require('fs');
const path = require('path');

const root = 'src';

const ensureFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '');
  }
};

// ✅ core
const coreDirs = [
  'core/api',
  'core/storage',
  'core/config',
  'core/navigation',
  'core/utils',
  'core/services', // ✅ thêm
];

// ✅ shared
const sharedDirs = [
  'shared/ui', // ✅ rename
  'shared/hooks',
  'shared/utils',
  'shared/constants',
  'shared/theme',
];

// ✅ app
const appDirs = ['app'];

// ✅ features
const features = [
  'auth',
  'feed',
  'post',
  'comment',
  'profile',
  'chat',
  'notification',
];

// ✅ feature structure
const featureStructure = [
  'api',
  'usecases',
  'components',
  'hooks',
  'screens',
  'store',
];

// 👉 create base dirs
[...coreDirs, ...sharedDirs, ...appDirs].forEach((dir) => {
  const fullPath = path.join(root, dir);
  fs.mkdirSync(fullPath, { recursive: true });

  // ✅ add .gitkeep
  ensureFile(path.join(fullPath, '.gitkeep'));
});

// 👉 create feature dirs
features.forEach((feature) => {
  featureStructure.forEach((sub) => {
    const fullPath = path.join(root, 'features', feature, sub);
    fs.mkdirSync(fullPath, { recursive: true });

    ensureFile(path.join(fullPath, '.gitkeep'));
  });

  // types
  ensureFile(path.join(root, 'features', feature, 'types.ts'));

  // index
  ensureFile(path.join(root, 'features', feature, 'index.ts'));
});

// ✅ extra files
const extraFiles = [
  'core/api/client.ts',
  'core/config/env.ts',
  'app/App.tsx',
  'app/providers.tsx',
  'app/routes.tsx',
];

extraFiles.forEach((file) => {
  ensureFile(path.join(root, file));
});

console.log('🚀 Structure created successfully!');