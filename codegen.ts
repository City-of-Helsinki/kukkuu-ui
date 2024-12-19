import { CodegenConfig } from '@graphql-codegen/cli';

const generatedTargetFiles = {
  headlessCms: 'src/domain/headlessCms/graphql/__generated__.ts',
  kukkuuBackend: 'src/domain/api/generatedTypes/graphql.tsx',
} as const;

const headlessCmsDocuments = ['src/**/cms*.ts'];

const excludeDocuments = (documents: string[]) =>
  documents.map((document) => `!${document}`);

type Props = {
  schema: string;
  documents: string[];
  targetFile: string;
};

const makeGeneratesConfig = ({ schema, documents, targetFile }: Props) => ({
  [targetFile]: {
    schema,
    documents,
    plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
    config: {
      withHooks: false,
      withComponent: false,
      flattenSelectionSet: true,
      avoidOptionals: {
        field: true,
        object: true,
      },
      dedupeOperationSuffix: true,
    },
    hooks: { afterOneFileWrite: ['prettier --write'] },
  },
});

const config: CodegenConfig = {
  generates: {
    ...makeGeneratesConfig({
      schema:
        process.env.VITE_API_URI ?? 'https://kukkuu.api.test.hel.ninja/graphql',
      documents: [
        'src/**/*.ts',
        // Exclude documents from headless CMS:
        ...excludeDocuments(headlessCmsDocuments),
        // Exclude the generated type files as sources
        ...excludeDocuments(Object.values(generatedTargetFiles)),
      ],
      targetFile: generatedTargetFiles.kukkuuBackend,
    }),
    ...makeGeneratesConfig({
      schema:
        process.env.VITE_CMS_URI ??
        'https://kukkuu.app-staging.hkih.hion.dev/graphql',
      documents: [...headlessCmsDocuments],
      targetFile: generatedTargetFiles.headlessCms,
    }),
  },
};

export default config;
