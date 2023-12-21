import { LanguageQuery } from '../../api/generatedTypes/graphql';

export type LanguageNode = NonNullable<
  NonNullable<LanguageQuery['languages']>['edges'][number]
>['node'];
