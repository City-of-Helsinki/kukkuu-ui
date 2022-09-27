/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AssignTicketSystemPasswordMutationInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: assignTicketSystemPasswordMutation
// ====================================================

export interface assignTicketSystemPasswordMutation_assignTicketSystemPassword {
  /**
   * The assigned ticket system password
   */
  password: string | null;
}

export interface assignTicketSystemPasswordMutation {
  assignTicketSystemPassword: assignTicketSystemPasswordMutation_assignTicketSystemPassword | null;
}

export interface assignTicketSystemPasswordMutationVariables {
  input: AssignTicketSystemPasswordMutationInput;
}
