/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AddChildMutationInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: addNewChild
// ====================================================

export interface addNewChild_addChild_child {
  /**
   * The ID of the object.
   */
  id: string;
  firstName: string;
  lastName: string;
  birthdate: any;
  postalCode: string;
}

export interface addNewChild_addChild {
  child: addNewChild_addChild_child | null;
}

export interface addNewChild {
  /**
   * This mutation cannot be used before one has started using the service with "SubmitChildrenAndGuardianMutation".
   */
  addChild: addNewChild_addChild | null;
}

export interface addNewChildVariables {
  input: AddChildMutationInput;
}
