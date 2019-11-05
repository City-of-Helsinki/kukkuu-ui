/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: submitChild
// ====================================================

export interface submitChild_submitChild_child {
  __typename: "ChildType";
  birthdate: any;
  firstName: string;
  lastName: string;
}

export interface submitChild_submitChild_guardian {
  __typename: "GuardianType";
  firstName: string;
  lastName: string;
  email: string;
}

export interface submitChild_submitChild {
  __typename: "SubmitChildMutationPayload";
  child: submitChild_submitChild_child | null;
  guardian: submitChild_submitChild_guardian | null;
}

export interface submitChild {
  submitChild: submitChild_submitChild | null;
}

export interface submitChildVariables {
  birthdate: any;
  firstName?: string | null;
  lastName?: string | null;
  guardianFirstName: string;
  guardianLastName: string;
  email: string;
}
