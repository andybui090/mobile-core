const fs = require('fs');
const path = require('path');

const dirs = [
  'src/app/navigation',
  'src/app/providers',
  'src/features/auth/api',
  'src/features/auth/domain/entities',
  'src/features/auth/domain/usecases',
  'src/features/auth/hooks',
  'src/features/auth/screens',
  'src/features/auth/components',
  'src/features/auth/store',
  'src/shared/components',
  'src/shared/hooks',
  'src/shared/utils',
  'src/shared/constants',
  'src/services/http',
  'src/services/storage',
  'src/services/logger',
  'src/config',
  'src/theme',
  'src/assets',
  'src/types',
];

dirs.forEach(dir => {
  fs.mkdirSync(path.resolve(dir), { recursive: true });
});

console.log('✅ Structure created');
