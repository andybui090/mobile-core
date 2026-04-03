const fs = require('fs');
const path = require('path');
const readline = require('readline');

let featureName = process.argv[2];

// =========================
// ASK FEATURE NAME
// =========================
const askFeatureName = () =>
  new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('👉 Enter feature name: ', answer => {
      rl.close();
      resolve(answer.trim());
    });
  });

// =========================
// MAIN
// =========================
async function main() {
  if (!featureName) {
    featureName = await askFeatureName();
  }

  if (!featureName) {
    console.error('❌ Feature name is required');
    process.exit(1);
  }

  const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
  const Feature = capitalize(featureName);

  const basePath = path.join(process.cwd(), 'src', 'features', featureName);

  const createFile = (filePath, content = '') => {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content);
    }
  };

  // =========================
  // STRUCTURE
  // =========================
  const folders = [
    'domain/models',
    'domain/repositories',
    'data/api',
    'data/repositories',
    'application/usecases',
    'presentation/hooks',
    'presentation/screens',
    'presentation/components',
    'store',
    '__tests__',
    '__mocks__',
  ];

  folders.forEach(folder => {
    fs.mkdirSync(path.join(basePath, folder), { recursive: true });
  });

  // =========================
  // MODEL
  // =========================
  createFile(
    path.join(basePath, 'domain/models', `${Feature}.ts`),
    `export interface ${Feature} {
  id: string;
}
`,
  );

  // =========================
  // QUERY KEYS
  // =========================
  createFile(
    path.join(basePath, `${featureName}.keys.ts`),
    `export const ${featureName}Keys = {
  all: ['${featureName}'],
  lists: () => [...${featureName}Keys.all, 'list'],
  detail: (id: string) => [...${featureName}Keys.all, 'detail', id],
};
`,
  );

  // =========================
  // MOCK DATA
  // =========================
  createFile(
    path.join(basePath, '__mocks__', `${featureName}.mock.ts`),
    `import { ${Feature} } from '../domain/models/${Feature}';

export const ${featureName}Mock: ${Feature}[] = [
  { id: '1' },
  { id: '2' },
];
`,
  );

  // =========================
  // API
  // =========================
  createFile(
    path.join(basePath, 'data/api', `${featureName}.api.ts`),
    `import { apiClient } from '@/core/network/apiClient';

export const ${featureName}Api = {
  getList: () => apiClient.get('/${featureName}'),
};
`,
  );

  // =========================
  // REPOSITORY
  // =========================
  createFile(
    path.join(basePath, 'data/repositories', `${featureName}RepositoryImpl.ts`),
    `import { ${Feature}Repository } from '../../domain/repositories/${featureName}Repository';
import { ${featureName}Api } from '../api/${featureName}.api';

export const ${featureName}RepositoryImpl: ${Feature}Repository = {
  async getList() {
    const res = await ${featureName}Api.getList();
    return res.data;
  },
};
`,
  );

  // =========================
  // DOMAIN REPO
  // =========================
  createFile(
    path.join(basePath, 'domain/repositories', `${featureName}Repository.ts`),
    `import { ${Feature} } from '../models/${Feature}';

export interface ${Feature}Repository {
  getList(): Promise<${Feature}[]>;
}
`,
  );

  // =========================
  // USECASE
  // =========================
  createFile(
    path.join(basePath, 'application/usecases', `get${Feature}.ts`),
    `import { ${Feature}Repository } from '../../domain/repositories/${featureName}Repository';

export const get${Feature} = (repo: ${Feature}Repository) => {
  return () => repo.getList();
};
`,
  );

  // =========================
  // HOOK
  // =========================
  createFile(
    path.join(basePath, 'presentation/hooks', `use${Feature}.ts`),
    `import { useQuery } from '@tanstack/react-query';
import { get${Feature} } from '../../application/usecases/get${Feature}';
import { ${featureName}RepositoryImpl } from '../../data/repositories/${featureName}RepositoryImpl';
import { ${featureName}Keys } from '../${featureName}.keys';

export const use${Feature} = () => {
  const queryFn = get${Feature}(${featureName}RepositoryImpl);

  return useQuery({
    queryKey: ${featureName}Keys.lists(),
    queryFn,
  });
};
`,
  );

  // =========================
  // SCREEN
  // =========================
  createFile(
    path.join(basePath, 'presentation/screens', `${Feature}Screen.tsx`),
    `import { View, Text } from 'react-native';

export const ${Feature}Screen = () => {
  return (
    <View>
      <Text>${Feature} Screen</Text>
    </View>
  );
};
`,
  );

  // =========================
  // TEST
  // =========================
  createFile(
    path.join(basePath, '__tests__', `${featureName}.test.ts`),
    `import { get${Feature} } from '../application/usecases/get${Feature}';

describe('${Feature} usecase', () => {
  it('should return data', async () => {
    const mockRepo = {
      getList: jest.fn().mockResolvedValue([{ id: '1' }]),
    };

    const result = await get${Feature}(mockRepo)();

    expect(result).toEqual([{ id: '1' }]);
  });
});
`,
  );

  // =========================
  // INDEX
  // =========================
  createFile(
    path.join(basePath, 'index.ts'),
    `export * from './presentation/screens/${Feature}Screen';
`,
  );

  console.log(`🚀 Feature "${featureName}" created with PRO setup!`);
}

main();
