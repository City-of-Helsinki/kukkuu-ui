export const SubscribeToFreeSpotNotificationGQLErrors = Object.freeze({
  ALREADY_SUBSCRIBED_ERROR: 'ALREADY_SUBSCRIBED_ERROR',
  OCCURRENCE_IS_NOT_FULL_ERROR: 'OCCURRENCE_IS_NOT_FULL_ERROR',
} as const);

export type SubscribeToFreeSpotNotificationGQLErrorsType =
  (typeof SubscribeToFreeSpotNotificationGQLErrors)[keyof typeof SubscribeToFreeSpotNotificationGQLErrors];
