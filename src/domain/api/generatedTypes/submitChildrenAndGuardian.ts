/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ChildInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: submitChildrenAndGuardian
// ====================================================

export interface submitChildrenAndGuardian_submitChildrenAndGuardian_children {
  __typename: "ChildMutationOutputNode";
  birthdate: any;
  firstName: string;
  lastName: string;
}

export interface submitChildrenAndGuardian_submitChildrenAndGuardian_guardian {
  __typename: "GuardianNode";
  firstName: string;
  lastName: string;
  email: string;
}

export interface submitChildrenAndGuardian_submitChildrenAndGuardian {
  __typename: "SubmitChildrenAndGuardianMutationPayload";
  children: (submitChildrenAndGuardian_submitChildrenAndGuardian_children | null)[] | null;
  guardian: submitChildrenAndGuardian_submitChildrenAndGuardian_guardian | null;
}

export interface submitChildrenAndGuardian {
  submitChildrenAndGuardian: submitChildrenAndGuardian_submitChildrenAndGuardian | null;
}

export interface submitChildrenAndGuardianVariables {
  children?: (ChildInput | null)[] | null;
  guardianFirstName: string;
  guardianLastName: string;
  email: string;
}
