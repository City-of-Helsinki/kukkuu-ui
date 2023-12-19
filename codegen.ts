import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: process.env.REACT_APP_API_URI,
  documents: ['src/**/*.ts'],
  generates: {
    'src/domain/api/generatedTypes/graphql.tsx': {
      plugins: ['typescript', 'typescript-operations'],
      config: {
        avoidOptionals: {
          field: true,
          object: true,
        },
        dedupeOperationSuffix: true,
      },
      hooks: { afterOneFileWrite: ['prettier --write'] },
    },
  },
};

export default config;
