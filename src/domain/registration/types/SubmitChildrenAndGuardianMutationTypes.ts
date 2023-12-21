import { SubmitChildrenAndGuardianMutation } from '../../api/generatedTypes/graphql';

export type Guardian = NonNullable<
  SubmitChildrenAndGuardianMutation['submitChildrenAndGuardian']
>['guardian'];
