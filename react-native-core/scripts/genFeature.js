const fs = require('fs');
const path = require('path');
const readline = require('readline');

let featureName = process.argv[2];

// 👉 nếu không có param → hỏi
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

  const folders = [
    'api',
    'domain/entities',
    'domain/usecases',
    'hooks',
    'screens',
    'components',
    'store',
  ];

  folders.forEach(folder => {
    fs.mkdirSync(path.join(basePath, folder), { recursive: true });
  });

  // API
  createFile(
    path.join(basePath, 'api', `${featureName}Api.ts`),
    `import { http } from '@/services/http/httpClient'

export const ${featureName}Api = {
  getList: () => http.get('/${featureName}')
}
`,
  );

  // ENTITY
  createFile(
    path.join(basePath, 'domain/entities', `${Feature}.ts`),
    `export interface ${Feature} {
  id: string
}
`,
  );

  // USECASE
  createFile(
    path.join(basePath, 'domain/usecases', `get${Feature}.ts`),
    `import { ${featureName}Api } from '../../api/${featureName}Api'

export const get${Feature} = async () => {
  return ${featureName}Api.getList()
}
`,
  );

  // HOOK
  createFile(
    path.join(basePath, 'hooks', `use${Feature}.ts`),
    `import { useQuery } from '@tanstack/react-query'
import { get${Feature} } from '../domain/usecases/get${Feature}'

export const use${Feature} = () => {
  return useQuery({
    queryKey: ['${featureName}'],
    queryFn: get${Feature},
  })
}
`,
  );

  // SCREEN
  createFile(
    path.join(basePath, 'screens', `${Feature}Screen.tsx`),
    `import { View, Text } from 'react-native'

export const ${Feature}Screen = () => {
  return (
    <View>
      <Text>${Feature} Screen</Text>
    </View>
  )
}
`,
  );

  // STORE
  createFile(
    path.join(basePath, 'store', `${featureName}Store.ts`),
    `import { create } from 'zustand'

const use${Feature}Store = create(() => ({}))

export default use${Feature}Store
`,
  );

  // INDEX
  createFile(
    path.join(basePath, 'index.ts'),
    `export * from './screens/${Feature}Screen'
`,
  );

  console.log(`✅ Feature "${featureName}" created successfully!`);
}

main();
