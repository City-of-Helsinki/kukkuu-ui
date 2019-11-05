/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: sC
// ====================================================

export interface sC_submitChild_child {
  __typename: "ChildType";
  birthdate: any;
  firstName: string;
  lastName: string;
}

export interface sC_submitChild_guardian {
  __typename: "GuardianType";
  firstName: string;
  lastName: string;
  email: string;
}

export interface sC_submitChild {
  __typename: "SubmitChildMutationPayload";
  child: sC_submitChild_child | null;
  guardian: sC_submitChild_guardian | null;
}

export interface sC {
  submitChild: sC_submitChild | null;
}

export interface sCVariables {
  birthdate: any;
  firstName?: string | null;
  lastName?: string | null;
  guardianFirstName: string;
  guardianLastName: string;
  email: string;
}
