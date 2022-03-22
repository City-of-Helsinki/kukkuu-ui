/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ChildEnrolmentCount
// ====================================================

export interface ChildEnrolmentCount_child_project {
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * How many times a single user can participate events per year. Changing this will not affect any existing enrolments.
   */
  enrolmentLimit: number;
}

export interface ChildEnrolmentCount_child {
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * How many past enrolments child has this year.
   */
  pastEnrolmentCount: number | null;
  project: ChildEnrolmentCount_child_project;
}

export interface ChildEnrolmentCount {
  child: ChildEnrolmentCount_child | null;
}

export interface ChildEnrolmentCountVariables {
  childId: string;
}
