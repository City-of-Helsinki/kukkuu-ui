export const GQLErrors = Object.freeze({
  CHILD_ALREADY_JOINED_EVENT_ERROR: 'CHILD_ALREADY_JOINED_EVENT_ERROR',
  OCCURRENCE_IS_FULL_ERROR: 'OCCURRENCE_IS_FULL_ERROR',
} as const);

export type GQLErrorsType = typeof GQLErrors[keyof typeof GQLErrors];
