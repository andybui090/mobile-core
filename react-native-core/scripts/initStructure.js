const fs = require('fs');
const path = require('path');

// 👉 đảm bảo chạy ở root project
const root = path.join(process.cwd(), 'src');

// =========================
// HELPER
// =========================
const createDir = (dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true });

  const gitkeep = path.join(dirPath, '.gitkeep');
  if (!fs.existsSync(gitkeep)) {
    fs.writeFileSync(gitkeep, '');
  }
};

const createFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '');
  }
};

// =========================
// CORE (INFRA ONLY)
// =========================
const coreDirs = [
  'core/network',
  'core/storage',
  'core/config',
  'core/utils',
];

// =========================
// SHARED (REUSABLE)
// =========================
const sharedDirs = [
  'shared/ui',
  'shared/hooks',
  'shared/utils',
  'shared/constants',
  'shared/theme',
];

// =========================
// APP (ENTRY + NAVIGATION)
// =========================
const appDirs = [
  'app',
  'app/navigation',
  'app/providers',
];

// =========================
// DEV (PLAYGROUND)
// =========================
const devDirs = [
  'dev/playground/components',
  'dev/playground/screens',
];

// =========================
// FEATURES
// =========================
const features = [
  'auth',
  'feed',
  'post',
  'comment',
  'profile',
  'chat',
  'notification',
];

// clean architecture (bạn đã chốt)
const featureStructure = [
  'domain/models',
  'domain/repositories',
  'data/api',
  'data/repositories',
  'application/usecases',
  'presentation/hooks',
  'presentation/screens',
  'presentation/components',
  'store',
];

// =========================
// CREATE ROOT
// =========================
createDir(root);

// =========================
// BASE DIRS
// =========================
[...coreDirs, ...sharedDirs, ...appDirs, ...devDirs].forEach((dir) => {
  createDir(path.join(root, dir));
});

// =========================
// FEATURES ROOT
// =========================
createDir(path.join(root, 'features'));

// =========================
// FEATURES STRUCTURE
// =========================
features.forEach((feature) => {
  const featureRoot = path.join(root, 'features', feature);
  createDir(featureRoot);

  featureStructure.forEach((sub) => {
    createDir(path.join(featureRoot, sub));
  });

  // base files
  createFile(path.join(featureRoot, 'types.ts'));
  createFile(path.join(featureRoot, 'index.ts'));
});

// =========================
// EXTRA FILES
// =========================
const files = [
  'core/network/apiClient.ts',
  'core/config/env.ts',

  'app/App.tsx',
  'app/navigation/index.tsx',
  'app/providers/index.tsx',

  'shared/ui/Button.tsx',
  'shared/theme/index.ts',

  // playground sample
  'dev/playground/screens/PlaygroundScreen.tsx',
];

files.forEach((file) => {
  const fullPath = path.join(root, file);
  createDir(path.dirname(fullPath));
  createFile(fullPath);
});

console.log('🚀 DONE - Structure ready to scale!');