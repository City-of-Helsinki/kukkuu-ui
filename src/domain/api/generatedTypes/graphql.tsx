import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Date: { input: any; output: any };
  DateTime: { input: any; output: any };
  Time: { input: any; output: any };
  Upload: { input: any; output: any };
};

export type AddChildMutationInput = {
  birthyear: Scalars['Int']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  languagesSpokenAtHome?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  postalCode: Scalars['String']['input'];
  relationship?: InputMaybe<RelationshipInput>;
};

export type AddChildMutationPayload = {
  __typename?: 'AddChildMutationPayload';
  child: Maybe<ChildNode>;
  clientMutationId: Maybe<Scalars['String']['output']>;
};

export type AddEventGroupMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['Upload']['input']>;
  projectId: Scalars['ID']['input'];
  translations?: InputMaybe<Array<InputMaybe<EventGroupTranslationsInput>>>;
};

export type AddEventGroupMutationPayload = {
  __typename?: 'AddEventGroupMutationPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  eventGroup: Maybe<EventGroupNode>;
};

export type AddEventMutationInput = {
  /** Required for internal ticket system events. */
  capacityPerOccurrence?: InputMaybe<Scalars['Int']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  duration?: InputMaybe<Scalars['Int']['input']>;
  eventGroupId?: InputMaybe<Scalars['ID']['input']>;
  image?: InputMaybe<Scalars['Upload']['input']>;
  participantsPerInvite: EventParticipantsPerInvite;
  projectId: Scalars['ID']['input'];
  readyForEventGroupPublishing?: InputMaybe<Scalars['Boolean']['input']>;
  ticketSystem?: InputMaybe<AddEventTicketSystemInput>;
  translations?: InputMaybe<Array<InputMaybe<EventTranslationsInput>>>;
};

export type AddEventMutationPayload = {
  __typename?: 'AddEventMutationPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  event: Maybe<EventNode>;
};

export type AddEventTicketSystemInput = {
  endTime?: InputMaybe<Scalars['String']['input']>;
  type: TicketSystem;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type AddMessageMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  eventId?: InputMaybe<Scalars['ID']['input']>;
  occurrenceIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  projectId: Scalars['ID']['input'];
  protocol: ProtocolType;
  /** Set the scope for message recipients. The 'ALL' is valid only when a user has a specific permission. */
  recipientSelection: RecipientSelectionEnum;
  /** Sends the message directly after the save */
  sendDirectly?: InputMaybe<Scalars['Boolean']['input']>;
  translations?: InputMaybe<Array<InputMaybe<MessageTranslationsInput>>>;
};

export type AddMessageMutationPayload = {
  __typename?: 'AddMessageMutationPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  message: Maybe<MessageNode>;
};

export type AddOccurrenceMutationInput = {
  capacityOverride?: InputMaybe<Scalars['Int']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  eventId: Scalars['ID']['input'];
  occurrenceLanguage?: InputMaybe<Language>;
  ticketSystem?: InputMaybe<OccurrenceTicketSystemInput>;
  time: Scalars['DateTime']['input'];
  venueId: Scalars['ID']['input'];
};

export type AddOccurrenceMutationPayload = {
  __typename?: 'AddOccurrenceMutationPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  occurrence: Maybe<OccurrenceNode>;
};

export type AddVenueMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  projectId: Scalars['ID']['input'];
  translations?: InputMaybe<Array<InputMaybe<VenueTranslationsInput>>>;
};

export type AddVenueMutationPayload = {
  __typename?: 'AddVenueMutationPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  venue: Maybe<VenueNode>;
};

export type AdminNode = Node & {
  __typename?: 'AdminNode';
  email: Scalars['String']['output'];
  /** The ID of the object */
  id: Scalars['ID']['output'];
  projects: Maybe<ProjectNodeConnection>;
  /** Vaaditaan. Enintään 150 merkkiä. Vain kirjaimet, numerot ja @/./+/-/_ ovat sallittuja. */
  username: Scalars['String']['output'];
};

export type AdminNodeProjectsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
};

export type AssignTicketSystemPasswordMutationInput = {
  childId: Scalars['ID']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  eventId: Scalars['ID']['input'];
};

export type AssignTicketSystemPasswordMutationPayload = {
  __typename?: 'AssignTicketSystemPasswordMutationPayload';
  child: Maybe<ChildNode>;
  clientMutationId: Maybe<Scalars['String']['output']>;
  event: Maybe<EventNode>;
  /** The assigned ticket system password */
  password: Maybe<Scalars['String']['output']>;
};

/** A new Child input */
export type ChildInput = {
  birthyear: Scalars['Int']['input'];
  languagesSpokenAtHome?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  postalCode: Scalars['String']['input'];
  relationship?: InputMaybe<RelationshipInput>;
};

export type ChildNode = Node & {
  __typename?: 'ChildNode';
  /** All upcoming and ongoing (with leeway) internal and ticket system enrolments sorted by time. */
  activeInternalAndTicketSystemEnrolments: Maybe<InternalOrTicketSystemEnrolmentConnection>;
  /** All available events for the child. NOTE: Does NOT take yearly enrolment limits into account. */
  availableEvents: Maybe<EventConnection>;
  /** All available events and event groups for the child. NOTE: Does NOT take yearly enrolment limits into account. */
  availableEventsAndEventGroups: Maybe<EventOrEventGroupConnection>;
  birthyear: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** How many enrolments child has this year. */
  enrolmentCount: Maybe<Scalars['Int']['output']>;
  enrolments: EnrolmentNodeConnection;
  freeSpotNotificationSubscriptions: FreeSpotNotificationSubscriptionNodeConnection;
  guardians: GuardianNodeConnection;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  languagesSpokenAtHome: Maybe<LanguageNodeConnection>;
  name: Scalars['String']['output'];
  occurrences: OccurrenceNodeConnection;
  /** How many past enrolments child has this year. */
  pastEnrolmentCount: Maybe<Scalars['Int']['output']>;
  pastEvents: Maybe<EventConnection>;
  postalCode: Scalars['String']['output'];
  project: ProjectNode;
  relationships: RelationshipNodeConnection;
  /** All upcoming events and event groups for the child's project. NOTE: Does NOT take yearly enrolment limits into account. */
  upcomingEventsAndEventGroups: Maybe<EventOrEventGroupConnection>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ChildNodeActiveInternalAndTicketSystemEnrolmentsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
};

export type ChildNodeAvailableEventsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
};

export type ChildNodeAvailableEventsAndEventGroupsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
};

export type ChildNodeEnrolmentCountArgs = {
  year: InputMaybe<Scalars['Int']['input']>;
};

export type ChildNodeEnrolmentsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
};

export type ChildNodeFreeSpotNotificationSubscriptionsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  childId: InputMaybe<Scalars['ID']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  occurrenceId: InputMaybe<Scalars['ID']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
};

export type ChildNodeGuardiansArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
};

export type ChildNodeLanguagesSpokenAtHomeArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
};

export type ChildNodeOccurrencesArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  date: InputMaybe<Scalars['Date']['input']>;
  eventId: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  occurrenceLanguage: InputMaybe<Scalars['String']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  projectId: InputMaybe<Scalars['String']['input']>;
  time: InputMaybe<Scalars['Time']['input']>;
  upcoming: InputMaybe<Scalars['Boolean']['input']>;
  upcomingWithLeeway: InputMaybe<Scalars['Boolean']['input']>;
  upcomingWithOngoing: InputMaybe<Scalars['Boolean']['input']>;
  venueId: InputMaybe<Scalars['String']['input']>;
};

export type ChildNodePastEventsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
};

export type ChildNodeRelationshipsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
};

export type ChildNodeUpcomingEventsAndEventGroupsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
};

export type ChildNodeConnection = {
  __typename?: 'ChildNodeConnection';
  count: Scalars['Int']['output'];
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ChildNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `ChildNode` and its cursor. */
export type ChildNodeEdge = {
  __typename?: 'ChildNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<ChildNode>;
};

/** Node for handling child's notes separately from their other data. */
export type ChildNotesNode = Node & {
  __typename?: 'ChildNotesNode';
  childId: Maybe<Scalars['ID']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  notes: Scalars['String']['output'];
};

export type DeleteChildMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type DeleteChildMutationPayload = {
  __typename?: 'DeleteChildMutationPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
};

export type DeleteEventGroupMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type DeleteEventGroupMutationPayload = {
  __typename?: 'DeleteEventGroupMutationPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
};

export type DeleteEventMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type DeleteEventMutationPayload = {
  __typename?: 'DeleteEventMutationPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
};

export type DeleteMessageMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type DeleteMessageMutationPayload = {
  __typename?: 'DeleteMessageMutationPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
};

export type DeleteOccurrenceMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type DeleteOccurrenceMutationPayload = {
  __typename?: 'DeleteOccurrenceMutationPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
};

export type DeleteVenueMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type DeleteVenueMutationPayload = {
  __typename?: 'DeleteVenueMutationPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
};

export type EnrolOccurrenceMutationInput = {
  /** Guardian's child id */
  childId: Scalars['ID']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** Occurrence id of event */
  occurrenceId: Scalars['ID']['input'];
};

export type EnrolOccurrenceMutationPayload = {
  __typename?: 'EnrolOccurrenceMutationPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  enrolment: Maybe<EnrolmentNode>;
};

export type EnrolmentNode = Node & {
  __typename?: 'EnrolmentNode';
  attended: Maybe<Scalars['Boolean']['output']>;
  child: Maybe<ChildNode>;
  createdAt: Scalars['DateTime']['output'];
  /** The ID of the object */
  id: Scalars['ID']['output'];
  occurrence: OccurrenceNode;
  /** An unique encoded reference id */
  referenceId: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type EnrolmentNodeConnection = {
  __typename?: 'EnrolmentNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<EnrolmentNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `EnrolmentNode` and its cursor. */
export type EnrolmentNodeEdge = {
  __typename?: 'EnrolmentNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<EnrolmentNode>;
};

/**
 * A generic error type that can be used to add errors inside the data,
 * when using the errors field from the root is not possible.
 *
 * NOTE: Normally the errors should be added in the errors field
 * which is located in the root of the query, next to data, but in some cases,
 * e.g. with mutation input errors (without exception thrown),
 * the error messages meta class field is not available
 */
export type ErrorType = {
  __typename?: 'ErrorType';
  field: Scalars['String']['output'];
  message: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type EventConnection = {
  __typename?: 'EventConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<EventEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `Event` and its cursor. */
export type EventEdge = {
  __typename?: 'EventEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<EventNode>;
};

export type EventGroupNode = Node & {
  __typename?: 'EventGroupNode';
  canChildEnroll: Maybe<Scalars['Boolean']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  events: EventNodeConnection;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  image: Scalars['String']['output'];
  imageAltText: Maybe<Scalars['String']['output']>;
  name: Maybe<Scalars['String']['output']>;
  project: ProjectNode;
  publishedAt: Maybe<Scalars['DateTime']['output']>;
  shortDescription: Maybe<Scalars['String']['output']>;
  translations: Array<EventGroupTranslationType>;
  updatedAt: Scalars['DateTime']['output'];
};

export type EventGroupNodeCanChildEnrollArgs = {
  childId: Scalars['ID']['input'];
};

export type EventGroupNodeEventsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  availableForChild: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  projectId: InputMaybe<Scalars['ID']['input']>;
  upcoming: InputMaybe<Scalars['Boolean']['input']>;
};

export type EventGroupTranslationType = {
  __typename?: 'EventGroupTranslationType';
  description: Scalars['String']['output'];
  imageAltText: Scalars['String']['output'];
  languageCode: Language;
  name: Scalars['String']['output'];
  shortDescription: Scalars['String']['output'];
};

export type EventGroupTranslationsInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  imageAltText?: InputMaybe<Scalars['String']['input']>;
  languageCode: Language;
  name?: InputMaybe<Scalars['String']['input']>;
  shortDescription?: InputMaybe<Scalars['String']['input']>;
};

export type EventNode = Node & {
  __typename?: 'EventNode';
  canChildEnroll: Maybe<Scalars['Boolean']['output']>;
  capacityPerOccurrence: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  /** In minutes */
  duration: Maybe<Scalars['Int']['output']>;
  eventGroup: Maybe<EventGroupNode>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  image: Scalars['String']['output'];
  imageAltText: Maybe<Scalars['String']['output']>;
  messages: MessageNodeConnection;
  name: Maybe<Scalars['String']['output']>;
  occurrences: OccurrenceNodeConnection;
  participantsPerInvite: EventParticipantsPerInvite;
  project: ProjectNode;
  publishedAt: Maybe<Scalars['DateTime']['output']>;
  readyForEventGroupPublishing: Scalars['Boolean']['output'];
  shortDescription: Maybe<Scalars['String']['output']>;
  ticketSystem: Maybe<EventTicketSystem>;
  translations: Array<EventTranslationType>;
  updatedAt: Scalars['DateTime']['output'];
};

export type EventNodeCanChildEnrollArgs = {
  childId: Scalars['ID']['input'];
};

export type EventNodeMessagesArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  occurrences: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Scalars['String']['input']>;
  projectId: InputMaybe<Scalars['ID']['input']>;
  protocol: InputMaybe<MessagingMessageProtocolChoices>;
};

export type EventNodeOccurrencesArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  date: InputMaybe<Scalars['Date']['input']>;
  eventId: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  occurrenceLanguage: InputMaybe<Scalars['String']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  projectId: InputMaybe<Scalars['String']['input']>;
  time: InputMaybe<Scalars['Time']['input']>;
  upcoming: InputMaybe<Scalars['Boolean']['input']>;
  upcomingWithLeeway: InputMaybe<Scalars['Boolean']['input']>;
  upcomingWithOngoing: InputMaybe<Scalars['Boolean']['input']>;
  venueId: InputMaybe<Scalars['String']['input']>;
};

export type EventNodeConnection = {
  __typename?: 'EventNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<EventNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `EventNode` and its cursor. */
export type EventNodeEdge = {
  __typename?: 'EventNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<EventNode>;
};

export type EventOrEventGroupConnection = {
  __typename?: 'EventOrEventGroupConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<EventOrEventGroupEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `EventOrEventGroup` and its cursor. */
export type EventOrEventGroupEdge = {
  __typename?: 'EventOrEventGroupEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<EventOrEventGroupUnion>;
};

export type EventOrEventGroupUnion = EventGroupNode | EventNode;

export enum EventParticipantsPerInvite {
  ChildAnd_1Or_2Guardians = 'CHILD_AND_1_OR_2_GUARDIANS',
  ChildAndGuardian = 'CHILD_AND_GUARDIAN',
  Family = 'FAMILY',
}

export type EventTicketSystem = {
  type: TicketSystem;
};

export type EventTranslationType = {
  __typename?: 'EventTranslationType';
  description: Scalars['String']['output'];
  imageAltText: Scalars['String']['output'];
  languageCode: Language;
  name: Scalars['String']['output'];
  shortDescription: Scalars['String']['output'];
};

export type EventTranslationsInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  imageAltText?: InputMaybe<Scalars['String']['input']>;
  languageCode: Language;
  name?: InputMaybe<Scalars['String']['input']>;
  shortDescription?: InputMaybe<Scalars['String']['input']>;
};

export type FreeSpotNotificationSubscriptionNode = Node & {
  __typename?: 'FreeSpotNotificationSubscriptionNode';
  child: ChildNode;
  createdAt: Scalars['DateTime']['output'];
  /** The ID of the object */
  id: Scalars['ID']['output'];
  occurrence: Maybe<OccurrenceNode>;
};

export type FreeSpotNotificationSubscriptionNodeConnection = {
  __typename?: 'FreeSpotNotificationSubscriptionNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<FreeSpotNotificationSubscriptionNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `FreeSpotNotificationSubscriptionNode` and its cursor. */
export type FreeSpotNotificationSubscriptionNodeEdge = {
  __typename?: 'FreeSpotNotificationSubscriptionNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<FreeSpotNotificationSubscriptionNode>;
};

export type GuardianCommunicationSubscriptionsNode = Node & {
  __typename?: 'GuardianCommunicationSubscriptionsNode';
  firstName: Scalars['String']['output'];
  hasAcceptedCommunication: Scalars['Boolean']['output'];
  /** The ID of the object */
  id: Scalars['ID']['output'];
  language: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
};

export type GuardianInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  hasAcceptedCommunication?: InputMaybe<Scalars['Boolean']['input']>;
  language: Language;
  languagesSpokenAtHome?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastName: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type GuardianNode = Node & {
  __typename?: 'GuardianNode';
  children: ChildNodeConnection;
  createdAt: Scalars['DateTime']['output'];
  /** If left blank, will be populated with the user's email. */
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  hasAcceptedCommunication: Scalars['Boolean']['output'];
  /** The ID of the object */
  id: Scalars['ID']['output'];
  language: Language;
  languagesSpokenAtHome: LanguageNodeConnection;
  lastName: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  relationships: RelationshipNodeConnection;
  updatedAt: Scalars['DateTime']['output'];
  user: AdminNode;
};

export type GuardianNodeChildrenArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  projectId: InputMaybe<Scalars['ID']['input']>;
};

export type GuardianNodeLanguagesSpokenAtHomeArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
};

export type GuardianNodeRelationshipsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
};

export type GuardianNodeConnection = {
  __typename?: 'GuardianNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<GuardianNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `GuardianNode` and its cursor. */
export type GuardianNodeEdge = {
  __typename?: 'GuardianNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<GuardianNode>;
};

export type ImportTicketSystemPasswordsMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  eventId: Scalars['ID']['input'];
  passwords: Array<Scalars['String']['input']>;
};

export type ImportTicketSystemPasswordsMutationPayload = {
  __typename?: 'ImportTicketSystemPasswordsMutationPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  /** A list of passwords which could not be imported */
  errors: Maybe<Array<Maybe<ErrorType>>>;
  event: Maybe<EventNode>;
  /** A list of imported passwords */
  passwords: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type InternalEventTicketSystem = EventTicketSystem & {
  __typename?: 'InternalEventTicketSystem';
  type: TicketSystem;
};

export type InternalOccurrenceTicketSystem = OccurrenceTicketSystem & {
  __typename?: 'InternalOccurrenceTicketSystem';
  type: TicketSystem;
};

export type InternalOrTicketSystemEnrolmentConnection = {
  __typename?: 'InternalOrTicketSystemEnrolmentConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<InternalOrTicketSystemEnrolmentEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `InternalOrTicketSystemEnrolment` and its cursor. */
export type InternalOrTicketSystemEnrolmentEdge = {
  __typename?: 'InternalOrTicketSystemEnrolmentEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<InternalOrTicketSystemEnrolmentUnion>;
};

export type InternalOrTicketSystemEnrolmentUnion =
  | EnrolmentNode
  | LippupisteEnrolmentNode
  | TicketmasterEnrolmentNode
  | TixlyEnrolmentNode;

/** An enumeration. */
export enum Language {
  En = 'EN',
  Fi = 'FI',
  Sv = 'SV',
}

export type LanguageNode = Node & {
  __typename?: 'LanguageNode';
  /** ISO 639-3 (language) or ISO 639-5 (language family) alpha-3 code */
  alpha3Code: Maybe<Scalars['String']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  name: Maybe<Scalars['String']['output']>;
  translations: Array<LanguageTranslationType>;
};

export type LanguageNodeConnection = {
  __typename?: 'LanguageNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<LanguageNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `LanguageNode` and its cursor. */
export type LanguageNodeEdge = {
  __typename?: 'LanguageNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<LanguageNode>;
};

export type LanguageTranslationType = {
  __typename?: 'LanguageTranslationType';
  languageCode: LanguagesLanguageTranslationLanguageCodeChoices;
  name: Scalars['String']['output'];
};

/** An enumeration. */
export enum LanguagesLanguageTranslationLanguageCodeChoices {
  /** englanti */
  En = 'EN',
  /** suomi */
  Fi = 'FI',
  /** ruotsi */
  Sv = 'SV',
}

export type LippupisteEnrolmentNode = Node & {
  __typename?: 'LippupisteEnrolmentNode';
  createdAt: Scalars['DateTime']['output'];
  event: EventNode;
  /** The ID of the object */
  id: Scalars['ID']['output'];
};

export type LippupisteEventTicketSystem = EventTicketSystem & {
  __typename?: 'LippupisteEventTicketSystem';
  childPassword: Maybe<Scalars['String']['output']>;
  endTime: Maybe<Scalars['DateTime']['output']>;
  freePasswordCount: Scalars['Int']['output'];
  hasAnyFreePasswords: Scalars['Boolean']['output'];
  type: TicketSystem;
  url: Scalars['String']['output'];
  usedPasswordCount: Scalars['Int']['output'];
};

export type LippupisteEventTicketSystemChildPasswordArgs = {
  childId: InputMaybe<Scalars['ID']['input']>;
};

export type LippupisteOccurrenceTicketSystem = OccurrenceTicketSystem & {
  __typename?: 'LippupisteOccurrenceTicketSystem';
  type: TicketSystem;
  url: Scalars['String']['output'];
};

export type MessageNode = Node & {
  __typename?: 'MessageNode';
  bodyText: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  event: Maybe<EventNode>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  occurrences: OccurrenceNodeConnection;
  project: ProjectNode;
  protocol: MessagingMessageProtocolChoices;
  recipientCount: Maybe<Scalars['Int']['output']>;
  recipientSelection: Maybe<RecipientSelectionEnum>;
  sentAt: Maybe<Scalars['DateTime']['output']>;
  subject: Maybe<Scalars['String']['output']>;
  translations: Array<MessageTranslationType>;
  updatedAt: Scalars['DateTime']['output'];
};

export type MessageNodeOccurrencesArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  date: InputMaybe<Scalars['Date']['input']>;
  eventId: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  occurrenceLanguage: InputMaybe<Scalars['String']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  projectId: InputMaybe<Scalars['String']['input']>;
  time: InputMaybe<Scalars['Time']['input']>;
  upcoming: InputMaybe<Scalars['Boolean']['input']>;
  upcomingWithLeeway: InputMaybe<Scalars['Boolean']['input']>;
  upcomingWithOngoing: InputMaybe<Scalars['Boolean']['input']>;
  venueId: InputMaybe<Scalars['String']['input']>;
};

export type MessageNodeConnection = {
  __typename?: 'MessageNodeConnection';
  count: Scalars['Int']['output'];
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<MessageNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `MessageNode` and its cursor. */
export type MessageNodeEdge = {
  __typename?: 'MessageNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<MessageNode>;
};

export type MessageTranslationType = {
  __typename?: 'MessageTranslationType';
  bodyText: Scalars['String']['output'];
  languageCode: MessagingMessageTranslationLanguageCodeChoices;
  subject: Scalars['String']['output'];
};

export type MessageTranslationsInput = {
  bodyText?: InputMaybe<Scalars['String']['input']>;
  languageCode: Language;
  subject?: InputMaybe<Scalars['String']['input']>;
};

/** An enumeration. */
export enum MessagingMessageProtocolChoices {
  /** Sähköposti */
  Email = 'EMAIL',
  /** SMS */
  Sms = 'SMS',
}

/** An enumeration. */
export enum MessagingMessageTranslationLanguageCodeChoices {
  /** englanti */
  En = 'EN',
  /** suomi */
  Fi = 'FI',
  /** ruotsi */
  Sv = 'SV',
}

export type Mutation = {
  __typename?: 'Mutation';
  /** This mutation cannot be used before one has started using the service with "SubmitChildrenAndGuardianMutation". */
  addChild: Maybe<AddChildMutationPayload>;
  addEvent: Maybe<AddEventMutationPayload>;
  addEventGroup: Maybe<AddEventGroupMutationPayload>;
  addMessage: Maybe<AddMessageMutationPayload>;
  addOccurrence: Maybe<AddOccurrenceMutationPayload>;
  addVenue: Maybe<AddVenueMutationPayload>;
  assignTicketSystemPassword: Maybe<AssignTicketSystemPasswordMutationPayload>;
  deleteChild: Maybe<DeleteChildMutationPayload>;
  deleteEvent: Maybe<DeleteEventMutationPayload>;
  deleteEventGroup: Maybe<DeleteEventGroupMutationPayload>;
  deleteMessage: Maybe<DeleteMessageMutationPayload>;
  deleteOccurrence: Maybe<DeleteOccurrenceMutationPayload>;
  deleteVenue: Maybe<DeleteVenueMutationPayload>;
  enrolOccurrence: Maybe<EnrolOccurrenceMutationPayload>;
  importTicketSystemPasswords: Maybe<ImportTicketSystemPasswordsMutationPayload>;
  publishEvent: Maybe<PublishEventMutationPayload>;
  publishEventGroup: Maybe<PublishEventGroupMutationPayload>;
  requestEmailUpdateToken: Maybe<RequestEmailUpdateTokenMutationPayload>;
  sendMessage: Maybe<SendMessageMutationPayload>;
  setEnrolmentAttendance: Maybe<SetEnrolmentAttendanceMutationPayload>;
  /** This is the first mutation one needs to execute to start using the service. After that this mutation cannot be used anymore. */
  submitChildrenAndGuardian: Maybe<SubmitChildrenAndGuardianMutationPayload>;
  subscribeToFreeSpotNotification: Maybe<SubscribeToFreeSpotNotificationMutationPayload>;
  unenrolOccurrence: Maybe<UnenrolOccurrenceMutationPayload>;
  /**
   * Unsubscribe user from all the notifications.
   *
   * NOTE: This mutation deletes the user's FreeSpotNotifications,
   * which are linked to a Child and Occurrence instances.
   * **It should be noted that the current model architecture allows
   * that a child can have multiple guardians, so unsubscribe can delete
   * some notifications from other users as well. However, the UI apps
   * has never allowed more than 1 guardian for a child.**
   */
  unsubscribeFromAllNotifications: Maybe<UnsubscribeFromAllNotificationsMutationPayload>;
  unsubscribeFromFreeSpotNotification: Maybe<UnsubscribeFromFreeSpotNotificationMutationPayload>;
  updateChild: Maybe<UpdateChildMutationPayload>;
  updateChildNotes: Maybe<UpdateChildNotesMutationPayload>;
  updateEvent: Maybe<UpdateEventMutationPayload>;
  updateEventGroup: Maybe<UpdateEventGroupMutationPayload>;
  updateMessage: Maybe<UpdateMessageMutationPayload>;
  updateMyCommunicationSubscriptions: Maybe<UpdateMyCommunicationSubscriptionsMutationPayload>;
  updateMyEmail: Maybe<UpdateMyEmailMutationPayload>;
  updateMyProfile: Maybe<UpdateMyProfileMutationPayload>;
  updateOccurrence: Maybe<UpdateOccurrenceMutationPayload>;
  updateTicketAttended: Maybe<UpdateTicketAttendedMutationPayload>;
  updateVenue: Maybe<UpdateVenueMutationPayload>;
};

export type MutationAddChildArgs = {
  input: AddChildMutationInput;
};

export type MutationAddEventArgs = {
  input: AddEventMutationInput;
};

export type MutationAddEventGroupArgs = {
  input: AddEventGroupMutationInput;
};

export type MutationAddMessageArgs = {
  input: AddMessageMutationInput;
};

export type MutationAddOccurrenceArgs = {
  input: AddOccurrenceMutationInput;
};

export type MutationAddVenueArgs = {
  input: AddVenueMutationInput;
};

export type MutationAssignTicketSystemPasswordArgs = {
  input: AssignTicketSystemPasswordMutationInput;
};

export type MutationDeleteChildArgs = {
  input: DeleteChildMutationInput;
};

export type MutationDeleteEventArgs = {
  input: DeleteEventMutationInput;
};

export type MutationDeleteEventGroupArgs = {
  input: DeleteEventGroupMutationInput;
};

export type MutationDeleteMessageArgs = {
  input: DeleteMessageMutationInput;
};

export type MutationDeleteOccurrenceArgs = {
  input: DeleteOccurrenceMutationInput;
};

export type MutationDeleteVenueArgs = {
  input: DeleteVenueMutationInput;
};

export type MutationEnrolOccurrenceArgs = {
  input: EnrolOccurrenceMutationInput;
};

export type MutationImportTicketSystemPasswordsArgs = {
  input: ImportTicketSystemPasswordsMutationInput;
};

export type MutationPublishEventArgs = {
  input: PublishEventMutationInput;
};

export type MutationPublishEventGroupArgs = {
  input: PublishEventGroupMutationInput;
};

export type MutationRequestEmailUpdateTokenArgs = {
  input: RequestEmailUpdateTokenMutationInput;
};

export type MutationSendMessageArgs = {
  input: SendMessageMutationInput;
};

export type MutationSetEnrolmentAttendanceArgs = {
  input: SetEnrolmentAttendanceMutationInput;
};

export type MutationSubmitChildrenAndGuardianArgs = {
  input: SubmitChildrenAndGuardianMutationInput;
};

export type MutationSubscribeToFreeSpotNotificationArgs = {
  input: SubscribeToFreeSpotNotificationMutationInput;
};

export type MutationUnenrolOccurrenceArgs = {
  input: UnenrolOccurrenceMutationInput;
};

export type MutationUnsubscribeFromAllNotificationsArgs = {
  input: UnsubscribeFromAllNotificationsMutationInput;
};

export type MutationUnsubscribeFromFreeSpotNotificationArgs = {
  input: UnsubscribeFromFreeSpotNotificationMutationInput;
};

export type MutationUpdateChildArgs = {
  input: UpdateChildMutationInput;
};

export type MutationUpdateChildNotesArgs = {
  input: UpdateChildNotesMutationInput;
};

export type MutationUpdateEventArgs = {
  input: UpdateEventMutationInput;
};

export type MutationUpdateEventGroupArgs = {
  input: UpdateEventGroupMutationInput;
};

export type MutationUpdateMessageArgs = {
  input: UpdateMessageMutationInput;
};

export type MutationUpdateMyCommunicationSubscriptionsArgs = {
  input: UpdateMyCommunicationSubscriptionsMutationInput;
};

export type MutationUpdateMyEmailArgs = {
  input: UpdateMyEmailMutationInput;
};

export type MutationUpdateMyProfileArgs = {
  input: UpdateMyProfileMutationInput;
};

export type MutationUpdateOccurrenceArgs = {
  input: UpdateOccurrenceMutationInput;
};

export type MutationUpdateTicketAttendedArgs = {
  input: UpdateTicketAttendedMutationInput;
};

export type MutationUpdateVenueArgs = {
  input: UpdateVenueMutationInput;
};

/** An object with an ID */
export type Node = {
  /** The ID of the object */
  id: Scalars['ID']['output'];
};

export type OccurrenceArrivalStatusNode = {
  __typename?: 'OccurrenceArrivalStatusNode';
  /**
   * **DEPRECATED:**  Number of enrolments marked as attended for this occurrence.
   * @deprecated This field exposes potentially sensitive data and will be removed in a future release. Consider using a more secure method to access this information.
   */
  attendedEnrolmentCount: Scalars['Int']['output'];
  /**
   * **DEPRECATED:** Total number of enrolments for this occurrence.
   * @deprecated This field exposes potentially sensitive data and will be removed in a future release. Consider using a more secure method to access this information.
   */
  enrolmentCount: Scalars['Int']['output'];
};

export type OccurrenceNode = Node & {
  __typename?: 'OccurrenceNode';
  attendedEnrolmentCount: Scalars['Int']['output'];
  capacity: Maybe<Scalars['Int']['output']>;
  /** When set will be used as the capacity of this occurrence instead of the value coming from the event. */
  capacityOverride: Maybe<Scalars['Int']['output']>;
  childHasFreeSpotNotificationSubscription: Maybe<Scalars['Boolean']['output']>;
  children: ChildNodeConnection;
  createdAt: Scalars['DateTime']['output'];
  enrolmentCount: Scalars['Int']['output'];
  enrolments: EnrolmentNodeConnection;
  event: EventNode;
  freeSpotNotificationSubscriptionCount: Scalars['Int']['output'];
  freeSpotNotificationSubscriptions: FreeSpotNotificationSubscriptionNodeConnection;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  occurrenceLanguage: Language;
  remainingCapacity: Maybe<Scalars['Int']['output']>;
  /** @deprecated There is no need for this because the only field ticketSystemUrl has been moved to EventNode.ticketSystem. */
  ticketSystem: Maybe<OccurrenceTicketSystem>;
  time: Scalars['DateTime']['output'];
  updatedAt: Scalars['DateTime']['output'];
  venue: VenueNode;
};

export type OccurrenceNodeChildHasFreeSpotNotificationSubscriptionArgs = {
  childId: InputMaybe<Scalars['ID']['input']>;
};

export type OccurrenceNodeChildrenArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  projectId: InputMaybe<Scalars['ID']['input']>;
};

export type OccurrenceNodeEnrolmentsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
};

export type OccurrenceNodeFreeSpotNotificationSubscriptionsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  childId: InputMaybe<Scalars['ID']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  occurrenceId: InputMaybe<Scalars['ID']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
};

export type OccurrenceNodeConnection = {
  __typename?: 'OccurrenceNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<OccurrenceNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `OccurrenceNode` and its cursor. */
export type OccurrenceNodeEdge = {
  __typename?: 'OccurrenceNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<OccurrenceNode>;
};

export type OccurrenceTicketSystem = {
  type: TicketSystem;
};

export type OccurrenceTicketSystemInput = {
  url?: InputMaybe<Scalars['String']['input']>;
};

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor: Maybe<Scalars['String']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor: Maybe<Scalars['String']['output']>;
};

export type ProjectNode = Node & {
  __typename?: 'ProjectNode';
  /** How many times a single user can participate events per year. Changing this will not affect any existing enrolments. */
  enrolmentLimit: Scalars['Int']['output'];
  /** The ID of the object */
  id: Scalars['ID']['output'];
  myPermissions: Maybe<ProjectPermissionsType>;
  name: Maybe<Scalars['String']['output']>;
  /** Whether it is allowed to create events outside event groups. */
  singleEventsAllowed: Scalars['Boolean']['output'];
  translations: Array<ProjectTranslationType>;
  year: Scalars['Int']['output'];
};

export type ProjectNodeConnection = {
  __typename?: 'ProjectNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ProjectNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `ProjectNode` and its cursor. */
export type ProjectNodeEdge = {
  __typename?: 'ProjectNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<ProjectNode>;
};

export type ProjectPermissionsType = {
  __typename?: 'ProjectPermissionsType';
  canSendToAllInProject: Maybe<Scalars['Boolean']['output']>;
  manageEventGroups: Maybe<Scalars['Boolean']['output']>;
  publish: Maybe<Scalars['Boolean']['output']>;
  viewFamilies: Maybe<Scalars['Boolean']['output']>;
};

export type ProjectTranslationType = {
  __typename?: 'ProjectTranslationType';
  languageCode: Language;
  name: Scalars['String']['output'];
};

/** An enumeration. */
export enum ProtocolType {
  Email = 'EMAIL',
  Sms = 'SMS',
}

export type PublishEventGroupMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type PublishEventGroupMutationPayload = {
  __typename?: 'PublishEventGroupMutationPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  eventGroup: Maybe<EventGroupNode>;
};

export type PublishEventMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type PublishEventMutationPayload = {
  __typename?: 'PublishEventMutationPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  event: Maybe<EventNode>;
};

export type Query = {
  __typename?: 'Query';
  child: Maybe<ChildNode>;
  childNotes: Maybe<ChildNotesNode>;
  children: Maybe<ChildNodeConnection>;
  event: Maybe<EventNode>;
  eventGroup: Maybe<EventGroupNode>;
  events: Maybe<EventNodeConnection>;
  eventsAndEventGroups: Maybe<EventOrEventGroupConnection>;
  guardians: Maybe<GuardianNodeConnection>;
  language: Maybe<LanguageNode>;
  languages: Maybe<LanguageNodeConnection>;
  message: Maybe<MessageNode>;
  messages: Maybe<MessageNodeConnection>;
  myAdminProfile: Maybe<AdminNode>;
  myCommunicationSubscriptions: Maybe<GuardianCommunicationSubscriptionsNode>;
  myProfile: Maybe<GuardianNode>;
  occurrence: Maybe<OccurrenceNode>;
  occurrences: Maybe<OccurrenceNodeConnection>;
  project: Maybe<ProjectNode>;
  projects: Maybe<ProjectNodeConnection>;
  venue: Maybe<VenueNode>;
  venues: Maybe<VenueNodeConnection>;
  verifyTicket: Maybe<TicketVerificationNode>;
};

export type QueryChildArgs = {
  id: Scalars['ID']['input'];
};

export type QueryChildNotesArgs = {
  id: Scalars['ID']['input'];
};

export type QueryChildrenArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  projectId: InputMaybe<Scalars['ID']['input']>;
};

export type QueryEventArgs = {
  id: Scalars['ID']['input'];
};

export type QueryEventGroupArgs = {
  id: Scalars['ID']['input'];
};

export type QueryEventsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  availableForChild: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  projectId: InputMaybe<Scalars['ID']['input']>;
  upcoming: InputMaybe<Scalars['Boolean']['input']>;
};

export type QueryEventsAndEventGroupsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  projectId: InputMaybe<Scalars['ID']['input']>;
  upcoming: InputMaybe<Scalars['Boolean']['input']>;
};

export type QueryGuardiansArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
};

export type QueryLanguageArgs = {
  id: Scalars['ID']['input'];
};

export type QueryLanguagesArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
};

export type QueryMessageArgs = {
  id: Scalars['ID']['input'];
};

export type QueryMessagesArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
  occurrences: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Scalars['String']['input']>;
  projectId: InputMaybe<Scalars['ID']['input']>;
  protocol: InputMaybe<MessagingMessageProtocolChoices>;
};

export type QueryMyCommunicationSubscriptionsArgs = {
  authToken: InputMaybe<Scalars['String']['input']>;
};

export type QueryOccurrenceArgs = {
  id: Scalars['ID']['input'];
};

export type QueryOccurrencesArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  date: InputMaybe<Scalars['Date']['input']>;
  eventId: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  occurrenceLanguage: InputMaybe<Scalars['String']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  projectId: InputMaybe<Scalars['String']['input']>;
  time: InputMaybe<Scalars['Time']['input']>;
  upcoming: InputMaybe<Scalars['Boolean']['input']>;
  upcomingWithLeeway: InputMaybe<Scalars['Boolean']['input']>;
  upcomingWithOngoing: InputMaybe<Scalars['Boolean']['input']>;
  venueId: InputMaybe<Scalars['String']['input']>;
};

export type QueryProjectArgs = {
  id: Scalars['ID']['input'];
};

export type QueryProjectsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
};

export type QueryVenueArgs = {
  id: Scalars['ID']['input'];
};

export type QueryVenuesArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  projectId: InputMaybe<Scalars['ID']['input']>;
};

export type QueryVerifyTicketArgs = {
  referenceId: Scalars['String']['input'];
};

export enum RecipientSelectionEnum {
  All = 'ALL',
  Attended = 'ATTENDED',
  Enrolled = 'ENROLLED',
  Invited = 'INVITED',
  SubscribedToFreeSpotNotification = 'SUBSCRIBED_TO_FREE_SPOT_NOTIFICATION',
}

export type RelationshipInput = {
  type?: InputMaybe<RelationshipTypeEnum>;
};

export type RelationshipNode = Node & {
  __typename?: 'RelationshipNode';
  child: ChildNode;
  guardian: GuardianNode;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  type: Maybe<RelationshipTypeEnum>;
};

export type RelationshipNodeConnection = {
  __typename?: 'RelationshipNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<RelationshipNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `RelationshipNode` and its cursor. */
export type RelationshipNodeEdge = {
  __typename?: 'RelationshipNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<RelationshipNode>;
};

export enum RelationshipTypeEnum {
  Advocate = 'ADVOCATE',
  OtherGuardian = 'OTHER_GUARDIAN',
  OtherRelation = 'OTHER_RELATION',
  Parent = 'PARENT',
}

export type RequestEmailUpdateTokenMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
};

export type RequestEmailUpdateTokenMutationPayload = {
  __typename?: 'RequestEmailUpdateTokenMutationPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  email: Maybe<Scalars['String']['output']>;
  emailUpdateTokenRequested: Maybe<Scalars['Boolean']['output']>;
};

export type SendMessageMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type SendMessageMutationPayload = {
  __typename?: 'SendMessageMutationPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  message: Maybe<MessageNode>;
};

export type SetEnrolmentAttendanceMutationInput = {
  /** This field is required (but it can be null). */
  attended?: InputMaybe<Scalars['Boolean']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  enrolmentId: Scalars['ID']['input'];
};

export type SetEnrolmentAttendanceMutationPayload = {
  __typename?: 'SetEnrolmentAttendanceMutationPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  enrolment: Maybe<EnrolmentNode>;
};

export type SubmitChildrenAndGuardianMutationInput = {
  /** At least one child is required. */
  children: Array<ChildInput>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  guardian: GuardianInput;
};

export type SubmitChildrenAndGuardianMutationPayload = {
  __typename?: 'SubmitChildrenAndGuardianMutationPayload';
  children: Maybe<Array<Maybe<ChildNode>>>;
  clientMutationId: Maybe<Scalars['String']['output']>;
  guardian: Maybe<GuardianNode>;
};

export type SubscribeToFreeSpotNotificationMutationInput = {
  childId: Scalars['ID']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  occurrenceId: Scalars['ID']['input'];
};

export type SubscribeToFreeSpotNotificationMutationPayload = {
  __typename?: 'SubscribeToFreeSpotNotificationMutationPayload';
  child: Maybe<ChildNode>;
  clientMutationId: Maybe<Scalars['String']['output']>;
  occurrence: Maybe<OccurrenceNode>;
};

export enum TicketSystem {
  Internal = 'INTERNAL',
  Lippupiste = 'LIPPUPISTE',
  Ticketmaster = 'TICKETMASTER',
  Tixly = 'TIXLY',
}

export type TicketVerificationNode = {
  __typename?: 'TicketVerificationNode';
  /** Indicates whether the ticket holder has arrived. If null, the status is unset. */
  attended: Maybe<Scalars['Boolean']['output']>;
  /** The name of the event */
  eventName: Scalars['String']['output'];
  /**
   * **DEPRECATED:** Use `OccurrenceNode` instead (requires authorization). Provides a summary of arrivals for this occurrence. This field will be removed in a future release to protect sensitive attendance data.
   * @deprecated This field exposes potentially sensitive data and will be removed in a future release. The attendance information should not be publicly available.
   */
  occurrenceArrivalStatus: Maybe<OccurrenceArrivalStatusNode>;
  /** The time of the event occurrence */
  occurrenceTime: Scalars['DateTime']['output'];
  validity: Scalars['Boolean']['output'];
  /** The name of the venue */
  venueName: Maybe<Scalars['String']['output']>;
};

export type TicketmasterEnrolmentNode = Node & {
  __typename?: 'TicketmasterEnrolmentNode';
  createdAt: Scalars['DateTime']['output'];
  event: EventNode;
  /** The ID of the object */
  id: Scalars['ID']['output'];
};

export type TicketmasterEventTicketSystem = EventTicketSystem & {
  __typename?: 'TicketmasterEventTicketSystem';
  childPassword: Maybe<Scalars['String']['output']>;
  endTime: Maybe<Scalars['DateTime']['output']>;
  freePasswordCount: Scalars['Int']['output'];
  hasAnyFreePasswords: Scalars['Boolean']['output'];
  type: TicketSystem;
  url: Scalars['String']['output'];
  usedPasswordCount: Scalars['Int']['output'];
};

export type TicketmasterEventTicketSystemChildPasswordArgs = {
  childId: InputMaybe<Scalars['ID']['input']>;
};

export type TicketmasterOccurrenceTicketSystem = OccurrenceTicketSystem & {
  __typename?: 'TicketmasterOccurrenceTicketSystem';
  type: TicketSystem;
  url: Scalars['String']['output'];
};

export type TixlyEnrolmentNode = Node & {
  __typename?: 'TixlyEnrolmentNode';
  createdAt: Scalars['DateTime']['output'];
  event: EventNode;
  /** The ID of the object */
  id: Scalars['ID']['output'];
};

export type TixlyEventTicketSystem = EventTicketSystem & {
  __typename?: 'TixlyEventTicketSystem';
  childPassword: Maybe<Scalars['String']['output']>;
  endTime: Maybe<Scalars['DateTime']['output']>;
  freePasswordCount: Scalars['Int']['output'];
  hasAnyFreePasswords: Scalars['Boolean']['output'];
  type: TicketSystem;
  url: Scalars['String']['output'];
  usedPasswordCount: Scalars['Int']['output'];
};

export type TixlyEventTicketSystemChildPasswordArgs = {
  childId: InputMaybe<Scalars['ID']['input']>;
};

export type TixlyOccurrenceTicketSystem = OccurrenceTicketSystem & {
  __typename?: 'TixlyOccurrenceTicketSystem';
  type: TicketSystem;
  url: Scalars['String']['output'];
};

export type UnenrolOccurrenceMutationInput = {
  /** Guardian's child id */
  childId: Scalars['ID']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** Occurrence id of event */
  occurrenceId: Scalars['ID']['input'];
};

export type UnenrolOccurrenceMutationPayload = {
  __typename?: 'UnenrolOccurrenceMutationPayload';
  child: Maybe<ChildNode>;
  clientMutationId: Maybe<Scalars['String']['output']>;
  occurrence: Maybe<OccurrenceNode>;
};

export type UnsubscribeFromAllNotificationsMutationInput = {
  /** Auth token can be used to authorize the action without logging in as a user. */
  authToken?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/**
 * Unsubscribe user from all the notifications.
 *
 * NOTE: This mutation deletes the user's FreeSpotNotifications,
 * which are linked to a Child and Occurrence instances.
 * **It should be noted that the current model architecture allows
 * that a child can have multiple guardians, so unsubscribe can delete
 * some notifications from other users as well. However, the UI apps
 * has never allowed more than 1 guardian for a child.**
 */
export type UnsubscribeFromAllNotificationsMutationPayload = {
  __typename?: 'UnsubscribeFromAllNotificationsMutationPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  guardian: Maybe<GuardianNode>;
  unsubscribed: Maybe<Scalars['Boolean']['output']>;
};

export type UnsubscribeFromFreeSpotNotificationMutationInput = {
  childId: Scalars['ID']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  occurrenceId: Scalars['ID']['input'];
};

export type UnsubscribeFromFreeSpotNotificationMutationPayload = {
  __typename?: 'UnsubscribeFromFreeSpotNotificationMutationPayload';
  child: Maybe<ChildNode>;
  clientMutationId: Maybe<Scalars['String']['output']>;
  occurrence: Maybe<OccurrenceNode>;
};

export type UpdateChildMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  languagesSpokenAtHome?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  relationship?: InputMaybe<RelationshipInput>;
};

export type UpdateChildMutationPayload = {
  __typename?: 'UpdateChildMutationPayload';
  child: Maybe<ChildNode>;
  clientMutationId: Maybe<Scalars['String']['output']>;
};

export type UpdateChildNotesMutationInput = {
  childId: Scalars['ID']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  notes: Scalars['String']['input'];
};

export type UpdateChildNotesMutationPayload = {
  __typename?: 'UpdateChildNotesMutationPayload';
  childNotes: Maybe<ChildNotesNode>;
  clientMutationId: Maybe<Scalars['String']['output']>;
};

export type UpdateEventGroupMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  image?: InputMaybe<Scalars['Upload']['input']>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  translations?: InputMaybe<Array<InputMaybe<EventGroupTranslationsInput>>>;
};

export type UpdateEventGroupMutationPayload = {
  __typename?: 'UpdateEventGroupMutationPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  eventGroup: Maybe<EventGroupNode>;
};

export type UpdateEventMutationInput = {
  capacityPerOccurrence?: InputMaybe<Scalars['Int']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  duration?: InputMaybe<Scalars['Int']['input']>;
  eventGroupId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  image?: InputMaybe<Scalars['Upload']['input']>;
  participantsPerInvite?: InputMaybe<EventParticipantsPerInvite>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  readyForEventGroupPublishing?: InputMaybe<Scalars['Boolean']['input']>;
  ticketSystem?: InputMaybe<UpdateEventTicketSystemInput>;
  translations?: InputMaybe<Array<InputMaybe<EventTranslationsInput>>>;
};

export type UpdateEventMutationPayload = {
  __typename?: 'UpdateEventMutationPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  event: Maybe<EventNode>;
};

export type UpdateEventTicketSystemInput = {
  endTime?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMessageMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  eventId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  occurrenceIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  protocol?: InputMaybe<ProtocolType>;
  /** Set the scope for message recipients. The 'ALL' is valid only when a user has a specific permission. */
  recipientSelection?: InputMaybe<RecipientSelectionEnum>;
  translations?: InputMaybe<Array<InputMaybe<MessageTranslationsInput>>>;
};

export type UpdateMessageMutationPayload = {
  __typename?: 'UpdateMessageMutationPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  message: Maybe<MessageNode>;
};

export type UpdateMyCommunicationSubscriptionsMutationInput = {
  /** Auth token can be used to authorize the action without logging in as a user. */
  authToken?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  hasAcceptedCommunication: Scalars['Boolean']['input'];
};

export type UpdateMyCommunicationSubscriptionsMutationPayload = {
  __typename?: 'UpdateMyCommunicationSubscriptionsMutationPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  guardian: Maybe<GuardianCommunicationSubscriptionsNode>;
};

export type UpdateMyEmailMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  verificationToken: Scalars['String']['input'];
};

export type UpdateMyEmailMutationPayload = {
  __typename?: 'UpdateMyEmailMutationPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  myProfile: Maybe<GuardianNode>;
};

export type UpdateMyProfileMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  hasAcceptedCommunication?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<Language>;
  languagesSpokenAtHome?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMyProfileMutationPayload = {
  __typename?: 'UpdateMyProfileMutationPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  myProfile: Maybe<GuardianNode>;
};

export type UpdateOccurrenceMutationInput = {
  capacityOverride?: InputMaybe<Scalars['Int']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  eventId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  occurrenceLanguage?: InputMaybe<Language>;
  ticketSystem?: InputMaybe<OccurrenceTicketSystemInput>;
  time?: InputMaybe<Scalars['DateTime']['input']>;
  venueId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateOccurrenceMutationPayload = {
  __typename?: 'UpdateOccurrenceMutationPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  occurrence: Maybe<OccurrenceNode>;
};

export type UpdateTicketAttendedMutationInput = {
  attended: Scalars['Boolean']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  referenceId: Scalars['String']['input'];
};

export type UpdateTicketAttendedMutationPayload = {
  __typename?: 'UpdateTicketAttendedMutationPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  ticket: Maybe<TicketVerificationNode>;
};

export type UpdateVenueMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  projectId?: InputMaybe<Scalars['ID']['input']>;
  translations?: InputMaybe<Array<InputMaybe<VenueTranslationsInput>>>;
};

export type UpdateVenueMutationPayload = {
  __typename?: 'UpdateVenueMutationPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  venue: Maybe<VenueNode>;
};

export type VenueNode = Node & {
  __typename?: 'VenueNode';
  accessibilityInfo: Maybe<Scalars['String']['output']>;
  additionalInfo: Maybe<Scalars['String']['output']>;
  address: Maybe<Scalars['String']['output']>;
  arrivalInstructions: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  name: Maybe<Scalars['String']['output']>;
  occurrences: OccurrenceNodeConnection;
  project: ProjectNode;
  translations: Array<VenueTranslationType>;
  updatedAt: Scalars['DateTime']['output'];
  wcAndFacilities: Maybe<Scalars['String']['output']>;
  wwwUrl: Maybe<Scalars['String']['output']>;
};

export type VenueNodeOccurrencesArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  date: InputMaybe<Scalars['Date']['input']>;
  eventId: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  occurrenceLanguage: InputMaybe<Scalars['String']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  projectId: InputMaybe<Scalars['String']['input']>;
  time: InputMaybe<Scalars['Time']['input']>;
  upcoming: InputMaybe<Scalars['Boolean']['input']>;
  upcomingWithLeeway: InputMaybe<Scalars['Boolean']['input']>;
  upcomingWithOngoing: InputMaybe<Scalars['Boolean']['input']>;
  venueId: InputMaybe<Scalars['String']['input']>;
};

export type VenueNodeConnection = {
  __typename?: 'VenueNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<VenueNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `VenueNode` and its cursor. */
export type VenueNodeEdge = {
  __typename?: 'VenueNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<VenueNode>;
};

export type VenueTranslationType = {
  __typename?: 'VenueTranslationType';
  accessibilityInfo: Scalars['String']['output'];
  additionalInfo: Scalars['String']['output'];
  address: Scalars['String']['output'];
  arrivalInstructions: Scalars['String']['output'];
  description: Scalars['String']['output'];
  languageCode: Language;
  name: Scalars['String']['output'];
  wcAndFacilities: Scalars['String']['output'];
  wwwUrl: Scalars['String']['output'];
};

export type VenueTranslationsInput = {
  accessibilityInfo?: InputMaybe<Scalars['String']['input']>;
  additionalInfo?: InputMaybe<Scalars['String']['input']>;
  address?: InputMaybe<Scalars['String']['input']>;
  arrivalInstructions?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  languageCode: Language;
  name?: InputMaybe<Scalars['String']['input']>;
  wcAndFacilities?: InputMaybe<Scalars['String']['input']>;
  wwwUrl?: InputMaybe<Scalars['String']['input']>;
};

export type AddNewChildMutationVariables = Exact<{
  input: AddChildMutationInput;
}>;

export type AddNewChildMutation = {
  __typename?: 'Mutation';
  addChild: {
    __typename?: 'AddChildMutationPayload';
    child: {
      __typename?: 'ChildNode';
      id: string;
      name: string;
      birthyear: number;
      postalCode: string;
      project: {
        __typename?: 'ProjectNode';
        id: string;
        name: string | null;
        year: number;
      };
    } | null;
  } | null;
};

export type DeleteChildMutationPayloadFieldsFragment = {
  __typename?: 'DeleteChildMutationPayload';
  clientMutationId: string | null;
};

export type DeleteChildMutationVariables = Exact<{
  input: DeleteChildMutationInput;
}>;

export type DeleteChildMutation = {
  __typename?: 'Mutation';
  deleteChild: {
    __typename?: 'DeleteChildMutationPayload';
    clientMutationId: string | null;
  } | null;
};

export type UpdateChildMutationPayloadFieldsFragment = {
  __typename?: 'UpdateChildMutationPayload';
  child: {
    __typename?: 'ChildNode';
    id: string;
    name: string;
    birthyear: number;
    postalCode: string;
    project: {
      __typename?: 'ProjectNode';
      id: string;
      name: string | null;
      year: number;
    };
    relationships: {
      __typename?: 'RelationshipNodeConnection';
      edges: Array<{
        __typename?: 'RelationshipNodeEdge';
        node: {
          __typename?: 'RelationshipNode';
          id: string;
          type: RelationshipTypeEnum | null;
        } | null;
      } | null>;
    };
  } | null;
};

export type UpdateChildMutationVariables = Exact<{
  input: UpdateChildMutationInput;
}>;

export type UpdateChildMutation = {
  __typename?: 'Mutation';
  updateChild: {
    __typename?: 'UpdateChildMutationPayload';
    child: {
      __typename?: 'ChildNode';
      id: string;
      name: string;
      birthyear: number;
      postalCode: string;
      project: {
        __typename?: 'ProjectNode';
        id: string;
        name: string | null;
        year: number;
      };
      relationships: {
        __typename?: 'RelationshipNodeConnection';
        edges: Array<{
          __typename?: 'RelationshipNodeEdge';
          node: {
            __typename?: 'RelationshipNode';
            id: string;
            type: RelationshipTypeEnum | null;
          } | null;
        } | null>;
      };
    } | null;
  } | null;
};

export type UpdateChildNotesMutationPayloadFieldsFragment = {
  __typename?: 'UpdateChildNotesMutationPayload';
  childNotes: {
    __typename?: 'ChildNotesNode';
    childId: string | null;
    notes: string;
  } | null;
};

export type UpdateChildNotesMutationVariables = Exact<{
  input: UpdateChildNotesMutationInput;
}>;

export type UpdateChildNotesMutation = {
  __typename?: 'Mutation';
  updateChildNotes: {
    __typename?: 'UpdateChildNotesMutationPayload';
    childNotes: {
      __typename?: 'ChildNotesNode';
      childId: string | null;
      notes: string;
    } | null;
  } | null;
};

export type ChildEnrolmentCountQueryVariables = Exact<{
  childId: Scalars['ID']['input'];
}>;

export type ChildEnrolmentCountQuery = {
  __typename?: 'Query';
  child: {
    __typename?: 'ChildNode';
    id: string;
    enrolmentCount: number | null;
    pastEnrolmentCount: number | null;
    project: { __typename?: 'ProjectNode'; id: string; enrolmentLimit: number };
  } | null;
};

export type ChildEventInvitationLabelQueryVariables = Exact<{
  childId: Scalars['ID']['input'];
}>;

export type ChildEventInvitationLabelQuery = {
  __typename?: 'Query';
  child: {
    __typename?: 'ChildNode';
    id: string;
    upcomingEventsAndEventGroups: {
      __typename?: 'EventOrEventGroupConnection';
      edges: Array<{
        __typename?: 'EventOrEventGroupEdge';
        node:
          | {
              __typename?: 'EventGroupNode';
              id: string;
              canChildEnroll: boolean | null;
            }
          | {
              __typename?: 'EventNode';
              id: string;
              canChildEnroll: boolean | null;
            }
          | null;
      } | null>;
    } | null;
  } | null;
};

export type EnrolmentEventFieldsFragment = {
  __typename?: 'EventNode';
  id: string;
  name: string | null;
  shortDescription: string | null;
  duration: number | null;
  image: string;
  imageAltText: string | null;
  participantsPerInvite: EventParticipantsPerInvite;
};

export type PastEventOccurrenceFieldsFragment = {
  __typename?: 'OccurrenceNode';
  id: string;
  time: any;
};

export type PastEventOccurrencesFieldsFragment = {
  __typename?: 'OccurrenceNodeConnection';
  edges: Array<{
    __typename?: 'OccurrenceNodeEdge';
    node: { __typename?: 'OccurrenceNode'; id: string; time: any } | null;
  } | null>;
};

export type PastEventFieldsFragment = {
  __typename?: 'EventNode';
  id: string;
  name: string | null;
  shortDescription: string | null;
  image: string;
  imageAltText: string | null;
  participantsPerInvite: EventParticipantsPerInvite;
  occurrences: {
    __typename?: 'OccurrenceNodeConnection';
    edges: Array<{
      __typename?: 'OccurrenceNodeEdge';
      node: { __typename?: 'OccurrenceNode'; id: string; time: any } | null;
    } | null>;
  };
};

export type PastEventsFieldsFragment = {
  __typename?: 'EventConnection';
  edges: Array<{
    __typename?: 'EventEdge';
    node: {
      __typename?: 'EventNode';
      id: string;
      name: string | null;
      shortDescription: string | null;
      image: string;
      imageAltText: string | null;
      participantsPerInvite: EventParticipantsPerInvite;
      occurrences: {
        __typename?: 'OccurrenceNodeConnection';
        edges: Array<{
          __typename?: 'OccurrenceNodeEdge';
          node: { __typename?: 'OccurrenceNode'; id: string; time: any } | null;
        } | null>;
      };
    } | null;
  } | null>;
};

export type EnrolmentVenueFieldsFragment = {
  __typename?: 'VenueNode';
  id: string;
  name: string | null;
  address: string | null;
};

export type EnrolmentOccurrenceFieldsFragment = {
  __typename?: 'OccurrenceNode';
  id: string;
  time: any;
  venue: {
    __typename?: 'VenueNode';
    id: string;
    name: string | null;
    address: string | null;
  };
  event: {
    __typename?: 'EventNode';
    id: string;
    name: string | null;
    shortDescription: string | null;
    duration: number | null;
    image: string;
    imageAltText: string | null;
    participantsPerInvite: EventParticipantsPerInvite;
  };
};

export type ActiveInternalEnrolmentFieldsFragment = {
  __typename: 'EnrolmentNode';
  id: string;
  referenceId: string | null;
  occurrence: {
    __typename?: 'OccurrenceNode';
    id: string;
    time: any;
    venue: {
      __typename?: 'VenueNode';
      id: string;
      name: string | null;
      address: string | null;
    };
    event: {
      __typename?: 'EventNode';
      id: string;
      name: string | null;
      shortDescription: string | null;
      duration: number | null;
      image: string;
      imageAltText: string | null;
      participantsPerInvite: EventParticipantsPerInvite;
    };
  };
};

export type ActiveTicketmasterEnrolmentFieldsFragment = {
  __typename: 'TicketmasterEnrolmentNode';
  id: string;
  event: {
    __typename?: 'EventNode';
    id: string;
    name: string | null;
    shortDescription: string | null;
    duration: number | null;
    image: string;
    imageAltText: string | null;
    participantsPerInvite: EventParticipantsPerInvite;
  };
};

export type ActiveLippupisteEnrolmentFieldsFragment = {
  __typename: 'LippupisteEnrolmentNode';
  id: string;
  event: {
    __typename?: 'EventNode';
    id: string;
    name: string | null;
    shortDescription: string | null;
    duration: number | null;
    image: string;
    imageAltText: string | null;
    participantsPerInvite: EventParticipantsPerInvite;
  };
};

export type ActiveTixlyEnrolmentFieldsFragment = {
  __typename: 'TixlyEnrolmentNode';
  id: string;
  event: {
    __typename?: 'EventNode';
    id: string;
    name: string | null;
    shortDescription: string | null;
    duration: number | null;
    image: string;
    imageAltText: string | null;
    participantsPerInvite: EventParticipantsPerInvite;
  };
};

export type ActiveInternalAndTicketSystemEnrolmentsFieldsFragment = {
  __typename?: 'InternalOrTicketSystemEnrolmentConnection';
  edges: Array<{
    __typename?: 'InternalOrTicketSystemEnrolmentEdge';
    node:
      | {
          __typename: 'EnrolmentNode';
          id: string;
          referenceId: string | null;
          occurrence: {
            __typename?: 'OccurrenceNode';
            id: string;
            time: any;
            venue: {
              __typename?: 'VenueNode';
              id: string;
              name: string | null;
              address: string | null;
            };
            event: {
              __typename?: 'EventNode';
              id: string;
              name: string | null;
              shortDescription: string | null;
              duration: number | null;
              image: string;
              imageAltText: string | null;
              participantsPerInvite: EventParticipantsPerInvite;
            };
          };
        }
      | {
          __typename: 'LippupisteEnrolmentNode';
          id: string;
          event: {
            __typename?: 'EventNode';
            id: string;
            name: string | null;
            shortDescription: string | null;
            duration: number | null;
            image: string;
            imageAltText: string | null;
            participantsPerInvite: EventParticipantsPerInvite;
          };
        }
      | {
          __typename: 'TicketmasterEnrolmentNode';
          id: string;
          event: {
            __typename?: 'EventNode';
            id: string;
            name: string | null;
            shortDescription: string | null;
            duration: number | null;
            image: string;
            imageAltText: string | null;
            participantsPerInvite: EventParticipantsPerInvite;
          };
        }
      | {
          __typename: 'TixlyEnrolmentNode';
          id: string;
          event: {
            __typename?: 'EventNode';
            id: string;
            name: string | null;
            shortDescription: string | null;
            duration: number | null;
            image: string;
            imageAltText: string | null;
            participantsPerInvite: EventParticipantsPerInvite;
          };
        }
      | null;
  } | null>;
};

export type UpcomingEventFieldsFragment = {
  __typename: 'EventNode';
  id: string;
  name: string | null;
  shortDescription: string | null;
  image: string;
  imageAltText: string | null;
  participantsPerInvite: EventParticipantsPerInvite;
  canChildEnroll: boolean | null;
};

export type UpcomingEventGroupFieldsFragment = {
  __typename: 'EventGroupNode';
  id: string;
  name: string | null;
  shortDescription: string | null;
  image: string;
  imageAltText: string | null;
  canChildEnroll: boolean | null;
};

export type UpcomingEventsAndEventGroupsFieldsFragment = {
  __typename?: 'EventOrEventGroupConnection';
  edges: Array<{
    __typename?: 'EventOrEventGroupEdge';
    node:
      | {
          __typename: 'EventGroupNode';
          id: string;
          name: string | null;
          shortDescription: string | null;
          image: string;
          imageAltText: string | null;
          canChildEnroll: boolean | null;
        }
      | {
          __typename: 'EventNode';
          id: string;
          name: string | null;
          shortDescription: string | null;
          image: string;
          imageAltText: string | null;
          participantsPerInvite: EventParticipantsPerInvite;
          canChildEnroll: boolean | null;
        }
      | null;
  } | null>;
};

export type RelationshipFieldsFragment = {
  __typename?: 'RelationshipNode';
  id: string;
  type: RelationshipTypeEnum | null;
};

export type RelationshipsFieldsFragment = {
  __typename?: 'RelationshipNodeConnection';
  edges: Array<{
    __typename?: 'RelationshipNodeEdge';
    node: {
      __typename?: 'RelationshipNode';
      id: string;
      type: RelationshipTypeEnum | null;
    } | null;
  } | null>;
};

export type ChildByIdQueryProjectFieldsFragment = {
  __typename?: 'ProjectNode';
  id: string;
  name: string | null;
  year: number;
};

export type ChildByIdQueryFieldsFragment = {
  __typename?: 'ChildNode';
  id: string;
  name: string;
  birthyear: number;
  postalCode: string;
  project: {
    __typename?: 'ProjectNode';
    id: string;
    name: string | null;
    year: number;
  };
  activeInternalAndTicketSystemEnrolments: {
    __typename?: 'InternalOrTicketSystemEnrolmentConnection';
    edges: Array<{
      __typename?: 'InternalOrTicketSystemEnrolmentEdge';
      node:
        | {
            __typename: 'EnrolmentNode';
            id: string;
            referenceId: string | null;
            occurrence: {
              __typename?: 'OccurrenceNode';
              id: string;
              time: any;
              venue: {
                __typename?: 'VenueNode';
                id: string;
                name: string | null;
                address: string | null;
              };
              event: {
                __typename?: 'EventNode';
                id: string;
                name: string | null;
                shortDescription: string | null;
                duration: number | null;
                image: string;
                imageAltText: string | null;
                participantsPerInvite: EventParticipantsPerInvite;
              };
            };
          }
        | {
            __typename: 'LippupisteEnrolmentNode';
            id: string;
            event: {
              __typename?: 'EventNode';
              id: string;
              name: string | null;
              shortDescription: string | null;
              duration: number | null;
              image: string;
              imageAltText: string | null;
              participantsPerInvite: EventParticipantsPerInvite;
            };
          }
        | {
            __typename: 'TicketmasterEnrolmentNode';
            id: string;
            event: {
              __typename?: 'EventNode';
              id: string;
              name: string | null;
              shortDescription: string | null;
              duration: number | null;
              image: string;
              imageAltText: string | null;
              participantsPerInvite: EventParticipantsPerInvite;
            };
          }
        | {
            __typename: 'TixlyEnrolmentNode';
            id: string;
            event: {
              __typename?: 'EventNode';
              id: string;
              name: string | null;
              shortDescription: string | null;
              duration: number | null;
              image: string;
              imageAltText: string | null;
              participantsPerInvite: EventParticipantsPerInvite;
            };
          }
        | null;
    } | null>;
  } | null;
  upcomingEventsAndEventGroups: {
    __typename?: 'EventOrEventGroupConnection';
    edges: Array<{
      __typename?: 'EventOrEventGroupEdge';
      node:
        | {
            __typename: 'EventGroupNode';
            id: string;
            name: string | null;
            shortDescription: string | null;
            image: string;
            imageAltText: string | null;
            canChildEnroll: boolean | null;
          }
        | {
            __typename: 'EventNode';
            id: string;
            name: string | null;
            shortDescription: string | null;
            image: string;
            imageAltText: string | null;
            participantsPerInvite: EventParticipantsPerInvite;
            canChildEnroll: boolean | null;
          }
        | null;
    } | null>;
  } | null;
  pastEvents: {
    __typename?: 'EventConnection';
    edges: Array<{
      __typename?: 'EventEdge';
      node: {
        __typename?: 'EventNode';
        id: string;
        name: string | null;
        shortDescription: string | null;
        image: string;
        imageAltText: string | null;
        participantsPerInvite: EventParticipantsPerInvite;
        occurrences: {
          __typename?: 'OccurrenceNodeConnection';
          edges: Array<{
            __typename?: 'OccurrenceNodeEdge';
            node: {
              __typename?: 'OccurrenceNode';
              id: string;
              time: any;
            } | null;
          } | null>;
        };
      } | null;
    } | null>;
  } | null;
  relationships: {
    __typename?: 'RelationshipNodeConnection';
    edges: Array<{
      __typename?: 'RelationshipNodeEdge';
      node: {
        __typename?: 'RelationshipNode';
        id: string;
        type: RelationshipTypeEnum | null;
      } | null;
    } | null>;
  };
};

export type ChildByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type ChildByIdQuery = {
  __typename?: 'Query';
  child: {
    __typename?: 'ChildNode';
    id: string;
    name: string;
    birthyear: number;
    postalCode: string;
    project: {
      __typename?: 'ProjectNode';
      id: string;
      name: string | null;
      year: number;
    };
    activeInternalAndTicketSystemEnrolments: {
      __typename?: 'InternalOrTicketSystemEnrolmentConnection';
      edges: Array<{
        __typename?: 'InternalOrTicketSystemEnrolmentEdge';
        node:
          | {
              __typename: 'EnrolmentNode';
              id: string;
              referenceId: string | null;
              occurrence: {
                __typename?: 'OccurrenceNode';
                id: string;
                time: any;
                venue: {
                  __typename?: 'VenueNode';
                  id: string;
                  name: string | null;
                  address: string | null;
                };
                event: {
                  __typename?: 'EventNode';
                  id: string;
                  name: string | null;
                  shortDescription: string | null;
                  duration: number | null;
                  image: string;
                  imageAltText: string | null;
                  participantsPerInvite: EventParticipantsPerInvite;
                };
              };
            }
          | {
              __typename: 'LippupisteEnrolmentNode';
              id: string;
              event: {
                __typename?: 'EventNode';
                id: string;
                name: string | null;
                shortDescription: string | null;
                duration: number | null;
                image: string;
                imageAltText: string | null;
                participantsPerInvite: EventParticipantsPerInvite;
              };
            }
          | {
              __typename: 'TicketmasterEnrolmentNode';
              id: string;
              event: {
                __typename?: 'EventNode';
                id: string;
                name: string | null;
                shortDescription: string | null;
                duration: number | null;
                image: string;
                imageAltText: string | null;
                participantsPerInvite: EventParticipantsPerInvite;
              };
            }
          | {
              __typename: 'TixlyEnrolmentNode';
              id: string;
              event: {
                __typename?: 'EventNode';
                id: string;
                name: string | null;
                shortDescription: string | null;
                duration: number | null;
                image: string;
                imageAltText: string | null;
                participantsPerInvite: EventParticipantsPerInvite;
              };
            }
          | null;
      } | null>;
    } | null;
    upcomingEventsAndEventGroups: {
      __typename?: 'EventOrEventGroupConnection';
      edges: Array<{
        __typename?: 'EventOrEventGroupEdge';
        node:
          | {
              __typename: 'EventGroupNode';
              id: string;
              name: string | null;
              shortDescription: string | null;
              image: string;
              imageAltText: string | null;
              canChildEnroll: boolean | null;
            }
          | {
              __typename: 'EventNode';
              id: string;
              name: string | null;
              shortDescription: string | null;
              image: string;
              imageAltText: string | null;
              participantsPerInvite: EventParticipantsPerInvite;
              canChildEnroll: boolean | null;
            }
          | null;
      } | null>;
    } | null;
    pastEvents: {
      __typename?: 'EventConnection';
      edges: Array<{
        __typename?: 'EventEdge';
        node: {
          __typename?: 'EventNode';
          id: string;
          name: string | null;
          shortDescription: string | null;
          image: string;
          imageAltText: string | null;
          participantsPerInvite: EventParticipantsPerInvite;
          occurrences: {
            __typename?: 'OccurrenceNodeConnection';
            edges: Array<{
              __typename?: 'OccurrenceNodeEdge';
              node: {
                __typename?: 'OccurrenceNode';
                id: string;
                time: any;
              } | null;
            } | null>;
          };
        } | null;
      } | null>;
    } | null;
    relationships: {
      __typename?: 'RelationshipNodeConnection';
      edges: Array<{
        __typename?: 'RelationshipNodeEdge';
        node: {
          __typename?: 'RelationshipNode';
          id: string;
          type: RelationshipTypeEnum | null;
        } | null;
      } | null>;
    };
  } | null;
};

export type ChildNotesByIdQueryFieldsFragment = {
  __typename?: 'ChildNotesNode';
  childId: string | null;
  notes: string;
};

export type ChildNotesByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type ChildNotesByIdQuery = {
  __typename?: 'Query';
  childNotes: {
    __typename?: 'ChildNotesNode';
    childId: string | null;
    notes: string;
  } | null;
};

export type AssignTicketSystemPasswordMutationVariables = Exact<{
  input: AssignTicketSystemPasswordMutationInput;
}>;

export type AssignTicketSystemPasswordMutation = {
  __typename?: 'Mutation';
  assignTicketSystemPassword: {
    __typename?: 'AssignTicketSystemPasswordMutationPayload';
    password: string | null;
  } | null;
};

export type EnrolOccurrencesFieldsFragment = {
  __typename?: 'OccurrenceNodeConnection';
  edges: Array<{
    __typename?: 'OccurrenceNodeEdge';
    node: {
      __typename?: 'OccurrenceNode';
      id: string;
      time: any;
      event: {
        __typename?: 'EventNode';
        id: string;
        image: string;
        imageAltText: string | null;
        description: string | null;
        shortDescription: string | null;
        name: string | null;
        duration: number | null;
        participantsPerInvite: EventParticipantsPerInvite;
      };
      venue: {
        __typename?: 'VenueNode';
        id: string;
        name: string | null;
        address: string | null;
        accessibilityInfo: string | null;
        arrivalInstructions: string | null;
        additionalInfo: string | null;
        wwwUrl: string | null;
        wcAndFacilities: string | null;
      };
    } | null;
  } | null>;
};

export type EnrolOccurrenceMutationPayloadFieldsFragment = {
  __typename?: 'EnrolOccurrenceMutationPayload';
  clientMutationId: string | null;
  enrolment: {
    __typename?: 'EnrolmentNode';
    id: string;
    occurrence: {
      __typename?: 'OccurrenceNode';
      id: string;
      event: { __typename?: 'EventNode'; id: string };
      venue: { __typename?: 'VenueNode'; id: string };
    };
    child: {
      __typename?: 'ChildNode';
      id: string;
      occurrences: {
        __typename?: 'OccurrenceNodeConnection';
        edges: Array<{
          __typename?: 'OccurrenceNodeEdge';
          node: {
            __typename?: 'OccurrenceNode';
            id: string;
            time: any;
            event: {
              __typename?: 'EventNode';
              id: string;
              image: string;
              imageAltText: string | null;
              description: string | null;
              shortDescription: string | null;
              name: string | null;
              duration: number | null;
              participantsPerInvite: EventParticipantsPerInvite;
            };
            venue: {
              __typename?: 'VenueNode';
              id: string;
              name: string | null;
              address: string | null;
              accessibilityInfo: string | null;
              arrivalInstructions: string | null;
              additionalInfo: string | null;
              wwwUrl: string | null;
              wcAndFacilities: string | null;
            };
          } | null;
        } | null>;
      };
      pastEvents: {
        __typename?: 'EventConnection';
        edges: Array<{
          __typename?: 'EventEdge';
          node: { __typename?: 'EventNode'; id: string } | null;
        } | null>;
      } | null;
      availableEvents: {
        __typename?: 'EventConnection';
        edges: Array<{
          __typename?: 'EventEdge';
          node: { __typename?: 'EventNode'; id: string } | null;
        } | null>;
      } | null;
    } | null;
  } | null;
};

export type EnrolOccurrenceMutationVariables = Exact<{
  input: EnrolOccurrenceMutationInput;
}>;

export type EnrolOccurrenceMutation = {
  __typename?: 'Mutation';
  enrolOccurrence: {
    __typename?: 'EnrolOccurrenceMutationPayload';
    clientMutationId: string | null;
    enrolment: {
      __typename?: 'EnrolmentNode';
      id: string;
      occurrence: {
        __typename?: 'OccurrenceNode';
        id: string;
        event: { __typename?: 'EventNode'; id: string };
        venue: { __typename?: 'VenueNode'; id: string };
      };
      child: {
        __typename?: 'ChildNode';
        id: string;
        occurrences: {
          __typename?: 'OccurrenceNodeConnection';
          edges: Array<{
            __typename?: 'OccurrenceNodeEdge';
            node: {
              __typename?: 'OccurrenceNode';
              id: string;
              time: any;
              event: {
                __typename?: 'EventNode';
                id: string;
                image: string;
                imageAltText: string | null;
                description: string | null;
                shortDescription: string | null;
                name: string | null;
                duration: number | null;
                participantsPerInvite: EventParticipantsPerInvite;
              };
              venue: {
                __typename?: 'VenueNode';
                id: string;
                name: string | null;
                address: string | null;
                accessibilityInfo: string | null;
                arrivalInstructions: string | null;
                additionalInfo: string | null;
                wwwUrl: string | null;
                wcAndFacilities: string | null;
              };
            } | null;
          } | null>;
        };
        pastEvents: {
          __typename?: 'EventConnection';
          edges: Array<{
            __typename?: 'EventEdge';
            node: { __typename?: 'EventNode'; id: string } | null;
          } | null>;
        } | null;
        availableEvents: {
          __typename?: 'EventConnection';
          edges: Array<{
            __typename?: 'EventEdge';
            node: { __typename?: 'EventNode'; id: string } | null;
          } | null>;
        } | null;
      } | null;
    } | null;
  } | null;
};

export type SubscribeToFreeSpotNotificationMutationVariables = Exact<{
  input: SubscribeToFreeSpotNotificationMutationInput;
}>;

export type SubscribeToFreeSpotNotificationMutation = {
  __typename?: 'Mutation';
  subscribeToFreeSpotNotification: {
    __typename?: 'SubscribeToFreeSpotNotificationMutationPayload';
    clientMutationId: string | null;
  } | null;
};

export type UnenrolOccurrencesFieldsFragment = {
  __typename?: 'OccurrenceNodeConnection';
  edges: Array<{
    __typename?: 'OccurrenceNodeEdge';
    node: {
      __typename?: 'OccurrenceNode';
      id: string;
      time: any;
      event: {
        __typename?: 'EventNode';
        id: string;
        image: string;
        imageAltText: string | null;
        description: string | null;
        shortDescription: string | null;
        name: string | null;
        duration: number | null;
        participantsPerInvite: EventParticipantsPerInvite;
      };
      venue: {
        __typename?: 'VenueNode';
        id: string;
        name: string | null;
        address: string | null;
        accessibilityInfo: string | null;
        arrivalInstructions: string | null;
        additionalInfo: string | null;
        wwwUrl: string | null;
        wcAndFacilities: string | null;
      };
    } | null;
  } | null>;
};

export type UnenrolOccurrenceMutationPayloadFieldsFragment = {
  __typename?: 'UnenrolOccurrenceMutationPayload';
  clientMutationId: string | null;
  occurrence: {
    __typename?: 'OccurrenceNode';
    id: string;
    event: { __typename?: 'EventNode'; id: string };
  } | null;
  child: {
    __typename?: 'ChildNode';
    id: string;
    availableEvents: {
      __typename?: 'EventConnection';
      edges: Array<{
        __typename?: 'EventEdge';
        node: { __typename?: 'EventNode'; id: string } | null;
      } | null>;
    } | null;
    occurrences: {
      __typename?: 'OccurrenceNodeConnection';
      edges: Array<{
        __typename?: 'OccurrenceNodeEdge';
        node: {
          __typename?: 'OccurrenceNode';
          id: string;
          time: any;
          event: {
            __typename?: 'EventNode';
            id: string;
            image: string;
            imageAltText: string | null;
            description: string | null;
            shortDescription: string | null;
            name: string | null;
            duration: number | null;
            participantsPerInvite: EventParticipantsPerInvite;
          };
          venue: {
            __typename?: 'VenueNode';
            id: string;
            name: string | null;
            address: string | null;
            accessibilityInfo: string | null;
            arrivalInstructions: string | null;
            additionalInfo: string | null;
            wwwUrl: string | null;
            wcAndFacilities: string | null;
          };
        } | null;
      } | null>;
    };
    pastEvents: {
      __typename?: 'EventConnection';
      edges: Array<{
        __typename?: 'EventEdge';
        node: { __typename?: 'EventNode'; id: string } | null;
      } | null>;
    } | null;
  } | null;
};

export type UnenrolOccurrenceMutationVariables = Exact<{
  input: UnenrolOccurrenceMutationInput;
}>;

export type UnenrolOccurrenceMutation = {
  __typename?: 'Mutation';
  unenrolOccurrence: {
    __typename?: 'UnenrolOccurrenceMutationPayload';
    clientMutationId: string | null;
    occurrence: {
      __typename?: 'OccurrenceNode';
      id: string;
      event: { __typename?: 'EventNode'; id: string };
    } | null;
    child: {
      __typename?: 'ChildNode';
      id: string;
      availableEvents: {
        __typename?: 'EventConnection';
        edges: Array<{
          __typename?: 'EventEdge';
          node: { __typename?: 'EventNode'; id: string } | null;
        } | null>;
      } | null;
      occurrences: {
        __typename?: 'OccurrenceNodeConnection';
        edges: Array<{
          __typename?: 'OccurrenceNodeEdge';
          node: {
            __typename?: 'OccurrenceNode';
            id: string;
            time: any;
            event: {
              __typename?: 'EventNode';
              id: string;
              image: string;
              imageAltText: string | null;
              description: string | null;
              shortDescription: string | null;
              name: string | null;
              duration: number | null;
              participantsPerInvite: EventParticipantsPerInvite;
            };
            venue: {
              __typename?: 'VenueNode';
              id: string;
              name: string | null;
              address: string | null;
              accessibilityInfo: string | null;
              arrivalInstructions: string | null;
              additionalInfo: string | null;
              wwwUrl: string | null;
              wcAndFacilities: string | null;
            };
          } | null;
        } | null>;
      };
      pastEvents: {
        __typename?: 'EventConnection';
        edges: Array<{
          __typename?: 'EventEdge';
          node: { __typename?: 'EventNode'; id: string } | null;
        } | null>;
      } | null;
    } | null;
  } | null;
};

export type UnsubscribeFromFreeSpotNotificationMutationVariables = Exact<{
  input: UnsubscribeFromFreeSpotNotificationMutationInput;
}>;

export type UnsubscribeFromFreeSpotNotificationMutation = {
  __typename?: 'Mutation';
  unsubscribeFromFreeSpotNotification: {
    __typename?: 'UnsubscribeFromFreeSpotNotificationMutationPayload';
    clientMutationId: string | null;
  } | null;
};

export type EventOccurrenceFieldsFragment = {
  __typename?: 'OccurrenceNode';
  id: string;
  time: any;
  remainingCapacity: number | null;
  childHasFreeSpotNotificationSubscription: boolean | null;
  event: {
    __typename?: 'EventNode';
    id: string;
    name: string | null;
    duration: number | null;
  };
  venue: {
    __typename?: 'VenueNode';
    id: string;
    name: string | null;
    address: string | null;
  };
  ticketSystem:
    | { __typename?: 'InternalOccurrenceTicketSystem'; type: TicketSystem }
    | {
        __typename?: 'LippupisteOccurrenceTicketSystem';
        url: string;
        type: TicketSystem;
      }
    | {
        __typename?: 'TicketmasterOccurrenceTicketSystem';
        url: string;
        type: TicketSystem;
      }
    | {
        __typename?: 'TixlyOccurrenceTicketSystem';
        url: string;
        type: TicketSystem;
      }
    | null;
};

export type EventOccurrencesFieldsFragment = {
  __typename?: 'OccurrenceNodeConnection';
  edges: Array<{
    __typename?: 'OccurrenceNodeEdge';
    node: {
      __typename?: 'OccurrenceNode';
      id: string;
      time: any;
      remainingCapacity: number | null;
      childHasFreeSpotNotificationSubscription: boolean | null;
      event: {
        __typename?: 'EventNode';
        id: string;
        name: string | null;
        duration: number | null;
      };
      venue: {
        __typename?: 'VenueNode';
        id: string;
        name: string | null;
        address: string | null;
      };
      ticketSystem:
        | { __typename?: 'InternalOccurrenceTicketSystem'; type: TicketSystem }
        | {
            __typename?: 'LippupisteOccurrenceTicketSystem';
            url: string;
            type: TicketSystem;
          }
        | {
            __typename?: 'TicketmasterOccurrenceTicketSystem';
            url: string;
            type: TicketSystem;
          }
        | {
            __typename?: 'TixlyOccurrenceTicketSystem';
            url: string;
            type: TicketSystem;
          }
        | null;
    } | null;
  } | null>;
};

export type EventQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  date: InputMaybe<Scalars['Date']['input']>;
  time: InputMaybe<Scalars['Time']['input']>;
  childId: Scalars['ID']['input'];
}>;

export type EventQuery = {
  __typename?: 'Query';
  event: {
    __typename?: 'EventNode';
    id: string;
    name: string | null;
    description: string | null;
    shortDescription: string | null;
    image: string;
    imageAltText: string | null;
    participantsPerInvite: EventParticipantsPerInvite;
    duration: number | null;
    capacityPerOccurrence: number | null;
    canChildEnroll: boolean | null;
    eventGroup: { __typename?: 'EventGroupNode'; id: string } | null;
    occurrences: {
      __typename?: 'OccurrenceNodeConnection';
      edges: Array<{
        __typename?: 'OccurrenceNodeEdge';
        node: {
          __typename?: 'OccurrenceNode';
          id: string;
          time: any;
          remainingCapacity: number | null;
          childHasFreeSpotNotificationSubscription: boolean | null;
          event: {
            __typename?: 'EventNode';
            id: string;
            name: string | null;
            duration: number | null;
          };
          venue: {
            __typename?: 'VenueNode';
            id: string;
            name: string | null;
            address: string | null;
          };
          ticketSystem:
            | {
                __typename?: 'InternalOccurrenceTicketSystem';
                type: TicketSystem;
              }
            | {
                __typename?: 'LippupisteOccurrenceTicketSystem';
                url: string;
                type: TicketSystem;
              }
            | {
                __typename?: 'TicketmasterOccurrenceTicketSystem';
                url: string;
                type: TicketSystem;
              }
            | {
                __typename?: 'TixlyOccurrenceTicketSystem';
                url: string;
                type: TicketSystem;
              }
            | null;
        } | null;
      } | null>;
    };
    allOccurrences: {
      __typename?: 'OccurrenceNodeConnection';
      edges: Array<{
        __typename?: 'OccurrenceNodeEdge';
        node: {
          __typename?: 'OccurrenceNode';
          id: string;
          time: any;
          remainingCapacity: number | null;
          childHasFreeSpotNotificationSubscription: boolean | null;
          event: {
            __typename?: 'EventNode';
            id: string;
            name: string | null;
            duration: number | null;
          };
          venue: {
            __typename?: 'VenueNode';
            id: string;
            name: string | null;
            address: string | null;
          };
          ticketSystem:
            | {
                __typename?: 'InternalOccurrenceTicketSystem';
                type: TicketSystem;
              }
            | {
                __typename?: 'LippupisteOccurrenceTicketSystem';
                url: string;
                type: TicketSystem;
              }
            | {
                __typename?: 'TicketmasterOccurrenceTicketSystem';
                url: string;
                type: TicketSystem;
              }
            | {
                __typename?: 'TixlyOccurrenceTicketSystem';
                url: string;
                type: TicketSystem;
              }
            | null;
        } | null;
      } | null>;
    };
    ticketSystem:
      | { __typename?: 'InternalEventTicketSystem'; type: TicketSystem }
      | {
          __typename?: 'LippupisteEventTicketSystem';
          childPassword: string | null;
          url: string;
          type: TicketSystem;
        }
      | {
          __typename?: 'TicketmasterEventTicketSystem';
          childPassword: string | null;
          url: string;
          type: TicketSystem;
        }
      | {
          __typename?: 'TixlyEventTicketSystem';
          childPassword: string | null;
          url: string;
          type: TicketSystem;
        }
      | null;
  } | null;
};

export type EventOccurrenceQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  childId: Scalars['ID']['input'];
}>;

export type EventOccurrenceQuery = {
  __typename?: 'Query';
  occurrence: {
    __typename?: 'OccurrenceNode';
    id: string;
    time: any;
    remainingCapacity: number | null;
    childHasFreeSpotNotificationSubscription: boolean | null;
    event: {
      __typename?: 'EventNode';
      id: string;
      name: string | null;
      duration: number | null;
    };
    venue: {
      __typename?: 'VenueNode';
      id: string;
      name: string | null;
      address: string | null;
    };
    ticketSystem:
      | { __typename?: 'InternalOccurrenceTicketSystem'; type: TicketSystem }
      | {
          __typename?: 'LippupisteOccurrenceTicketSystem';
          url: string;
          type: TicketSystem;
        }
      | {
          __typename?: 'TicketmasterOccurrenceTicketSystem';
          url: string;
          type: TicketSystem;
        }
      | {
          __typename?: 'TixlyOccurrenceTicketSystem';
          url: string;
          type: TicketSystem;
        }
      | null;
  } | null;
};

export type EventExternalTicketSystemPasswordQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  childId: Scalars['ID']['input'];
}>;

export type EventExternalTicketSystemPasswordQuery = {
  __typename?: 'Query';
  event: {
    __typename?: 'EventNode';
    participantsPerInvite: EventParticipantsPerInvite;
    ticketSystem:
      | { __typename?: 'InternalEventTicketSystem' }
      | {
          __typename?: 'LippupisteEventTicketSystem';
          childPassword: string | null;
          url: string;
        }
      | {
          __typename?: 'TicketmasterEventTicketSystem';
          childPassword: string | null;
          url: string;
        }
      | {
          __typename?: 'TixlyEventTicketSystem';
          childPassword: string | null;
          url: string;
        }
      | null;
  } | null;
};

export type EventExternalTicketSystemHasAnyFreePasswordsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type EventExternalTicketSystemHasAnyFreePasswordsQuery = {
  __typename?: 'Query';
  event: {
    __typename?: 'EventNode';
    ticketSystem:
      | { __typename?: 'InternalEventTicketSystem'; type: TicketSystem }
      | {
          __typename?: 'LippupisteEventTicketSystem';
          hasAnyFreePasswords: boolean;
          type: TicketSystem;
        }
      | {
          __typename?: 'TicketmasterEventTicketSystem';
          hasAnyFreePasswords: boolean;
          type: TicketSystem;
        }
      | {
          __typename?: 'TixlyEventTicketSystem';
          hasAnyFreePasswords: boolean;
          type: TicketSystem;
        }
      | null;
  } | null;
};

export type TicketmasterEventFieldsFragment = {
  __typename?: 'TicketmasterEventTicketSystem';
  childPassword: string | null;
  url: string;
};

export type LippupisteEventFieldsFragment = {
  __typename?: 'LippupisteEventTicketSystem';
  childPassword: string | null;
  url: string;
};

export type TixlyEventFieldsFragment = {
  __typename?: 'TixlyEventTicketSystem';
  childPassword: string | null;
  url: string;
};

export type ExternalTicketSystemEventFieldsFragment = {
  __typename?: 'EventNode';
  id: string;
  name: string | null;
  description: string | null;
  image: string;
  imageAltText: string | null;
  participantsPerInvite: EventParticipantsPerInvite;
  occurrences: {
    __typename?: 'OccurrenceNodeConnection';
    edges: Array<{
      __typename?: 'OccurrenceNodeEdge';
      node: {
        __typename?: 'OccurrenceNode';
        ticketSystem:
          | {
              __typename?: 'InternalOccurrenceTicketSystem';
              type: TicketSystem;
            }
          | {
              __typename?: 'LippupisteOccurrenceTicketSystem';
              url: string;
              type: TicketSystem;
            }
          | {
              __typename?: 'TicketmasterOccurrenceTicketSystem';
              url: string;
              type: TicketSystem;
            }
          | {
              __typename?: 'TixlyOccurrenceTicketSystem';
              url: string;
              type: TicketSystem;
            }
          | null;
      } | null;
    } | null>;
  };
  ticketSystem:
    | { __typename?: 'InternalEventTicketSystem'; type: TicketSystem }
    | {
        __typename?: 'LippupisteEventTicketSystem';
        type: TicketSystem;
        childPassword: string | null;
        url: string;
      }
    | {
        __typename?: 'TicketmasterEventTicketSystem';
        type: TicketSystem;
        childPassword: string | null;
        url: string;
      }
    | {
        __typename?: 'TixlyEventTicketSystem';
        type: TicketSystem;
        childPassword: string | null;
        url: string;
      }
    | null;
};

export type ExternalTicketSystemEventQueryVariables = Exact<{
  eventId: Scalars['ID']['input'];
  childId: Scalars['ID']['input'];
}>;

export type ExternalTicketSystemEventQuery = {
  __typename?: 'Query';
  event: {
    __typename?: 'EventNode';
    id: string;
    name: string | null;
    description: string | null;
    image: string;
    imageAltText: string | null;
    participantsPerInvite: EventParticipantsPerInvite;
    occurrences: {
      __typename?: 'OccurrenceNodeConnection';
      edges: Array<{
        __typename?: 'OccurrenceNodeEdge';
        node: {
          __typename?: 'OccurrenceNode';
          ticketSystem:
            | {
                __typename?: 'InternalOccurrenceTicketSystem';
                type: TicketSystem;
              }
            | {
                __typename?: 'LippupisteOccurrenceTicketSystem';
                url: string;
                type: TicketSystem;
              }
            | {
                __typename?: 'TicketmasterOccurrenceTicketSystem';
                url: string;
                type: TicketSystem;
              }
            | {
                __typename?: 'TixlyOccurrenceTicketSystem';
                url: string;
                type: TicketSystem;
              }
            | null;
        } | null;
      } | null>;
    };
    ticketSystem:
      | { __typename?: 'InternalEventTicketSystem'; type: TicketSystem }
      | {
          __typename?: 'LippupisteEventTicketSystem';
          type: TicketSystem;
          childPassword: string | null;
          url: string;
        }
      | {
          __typename?: 'TicketmasterEventTicketSystem';
          type: TicketSystem;
          childPassword: string | null;
          url: string;
        }
      | {
          __typename?: 'TixlyEventTicketSystem';
          type: TicketSystem;
          childPassword: string | null;
          url: string;
        }
      | null;
  } | null;
};

export type OccurrenceEventFieldsFragment = {
  __typename?: 'EventNode';
  id: string;
  image: string;
  imageAltText: string | null;
  description: string | null;
  shortDescription: string | null;
  name: string | null;
  duration: number | null;
  participantsPerInvite: EventParticipantsPerInvite;
  eventGroup: { __typename?: 'EventGroupNode'; id: string } | null;
};

export type OccurrenceVenueFieldsFragment = {
  __typename?: 'VenueNode';
  id: string;
  name: string | null;
  address: string | null;
  accessibilityInfo: string | null;
  arrivalInstructions: string | null;
  additionalInfo: string | null;
  wwwUrl: string | null;
  wcAndFacilities: string | null;
};

export type OccurrenceFieldsFragment = {
  __typename?: 'OccurrenceNode';
  id: string;
  time: any;
  remainingCapacity: number | null;
  childHasFreeSpotNotificationSubscription: boolean | null;
  event: {
    __typename?: 'EventNode';
    id: string;
    image: string;
    imageAltText: string | null;
    description: string | null;
    shortDescription: string | null;
    name: string | null;
    duration: number | null;
    participantsPerInvite: EventParticipantsPerInvite;
    eventGroup: { __typename?: 'EventGroupNode'; id: string } | null;
  };
  venue: {
    __typename?: 'VenueNode';
    id: string;
    name: string | null;
    address: string | null;
    accessibilityInfo: string | null;
    arrivalInstructions: string | null;
    additionalInfo: string | null;
    wwwUrl: string | null;
    wcAndFacilities: string | null;
  };
};

export type OccurrenceQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  childId: InputMaybe<Scalars['ID']['input']>;
}>;

export type OccurrenceQuery = {
  __typename?: 'Query';
  occurrence: {
    __typename?: 'OccurrenceNode';
    id: string;
    time: any;
    remainingCapacity: number | null;
    childHasFreeSpotNotificationSubscription: boolean | null;
    event: {
      __typename?: 'EventNode';
      id: string;
      image: string;
      imageAltText: string | null;
      description: string | null;
      shortDescription: string | null;
      name: string | null;
      duration: number | null;
      participantsPerInvite: EventParticipantsPerInvite;
      eventGroup: { __typename?: 'EventGroupNode'; id: string } | null;
    };
    venue: {
      __typename?: 'VenueNode';
      id: string;
      name: string | null;
      address: string | null;
      accessibilityInfo: string | null;
      arrivalInstructions: string | null;
      additionalInfo: string | null;
      wwwUrl: string | null;
      wcAndFacilities: string | null;
    };
  } | null;
};

export type EventGroupEventFieldsFragment = {
  __typename?: 'EventNode';
  id: string;
  name: string | null;
  shortDescription: string | null;
  image: string;
  imageAltText: string | null;
  canChildEnroll: boolean | null;
};

export type EventGroupEventsFieldsFragment = {
  __typename?: 'EventNodeConnection';
  edges: Array<{
    __typename?: 'EventNodeEdge';
    node: {
      __typename?: 'EventNode';
      id: string;
      name: string | null;
      shortDescription: string | null;
      image: string;
      imageAltText: string | null;
      canChildEnroll: boolean | null;
    } | null;
  } | null>;
};

export type EventGroupFieldsFragment = {
  __typename?: 'EventGroupNode';
  id: string;
  name: string | null;
  shortDescription: string | null;
  description: string | null;
  events: {
    __typename?: 'EventNodeConnection';
    edges: Array<{
      __typename?: 'EventNodeEdge';
      node: {
        __typename?: 'EventNode';
        id: string;
        name: string | null;
        shortDescription: string | null;
        image: string;
        imageAltText: string | null;
        canChildEnroll: boolean | null;
      } | null;
    } | null>;
  };
};

export type EventGroupQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  childId: Scalars['ID']['input'];
}>;

export type EventGroupQuery = {
  __typename?: 'Query';
  eventGroup: {
    __typename?: 'EventGroupNode';
    id: string;
    name: string | null;
    shortDescription: string | null;
    description: string | null;
    events: {
      __typename?: 'EventNodeConnection';
      edges: Array<{
        __typename?: 'EventNodeEdge';
        node: {
          __typename?: 'EventNode';
          id: string;
          name: string | null;
          shortDescription: string | null;
          image: string;
          imageAltText: string | null;
          canChildEnroll: boolean | null;
        } | null;
      } | null>;
    };
  } | null;
};

export type GuardiansQueryVariables = Exact<{ [key: string]: never }>;

export type GuardiansQuery = {
  __typename?: 'Query';
  guardians: {
    __typename?: 'GuardianNodeConnection';
    edges: Array<{
      __typename?: 'GuardianNodeEdge';
      node: {
        __typename?: 'GuardianNode';
        id: string;
        createdAt: any;
        updatedAt: any;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        language: Language;
        email: string;
        children: {
          __typename?: 'ChildNodeConnection';
          edges: Array<{
            __typename?: 'ChildNodeEdge';
            node: { __typename?: 'ChildNode'; id: string } | null;
          } | null>;
        };
        relationships: {
          __typename?: 'RelationshipNodeConnection';
          edges: Array<{
            __typename?: 'RelationshipNodeEdge';
            node: { __typename?: 'RelationshipNode'; id: string } | null;
          } | null>;
        };
      } | null;
    } | null>;
  } | null;
};

export type LanguageFieldsFragment = {
  __typename?: 'LanguageNode';
  id: string;
  name: string | null;
};

export type LanguagesFieldsFragment = {
  __typename?: 'LanguageNodeConnection';
  edges: Array<{
    __typename?: 'LanguageNodeEdge';
    node: {
      __typename?: 'LanguageNode';
      id: string;
      name: string | null;
    } | null;
  } | null>;
};

export type LanguageQueryVariables = Exact<{ [key: string]: never }>;

export type LanguageQuery = {
  __typename?: 'Query';
  languages: {
    __typename?: 'LanguageNodeConnection';
    edges: Array<{
      __typename?: 'LanguageNodeEdge';
      node: {
        __typename?: 'LanguageNode';
        id: string;
        name: string | null;
      } | null;
    } | null>;
  } | null;
};

export type RequestEmailUpdateTokenMutationVariables = Exact<{
  input: RequestEmailUpdateTokenMutationInput;
}>;

export type RequestEmailUpdateTokenMutation = {
  __typename?: 'Mutation';
  requestEmailUpdateToken: {
    __typename?: 'RequestEmailUpdateTokenMutationPayload';
    email: string | null;
    emailUpdateTokenRequested: boolean | null;
  } | null;
};

export type UpdateMyCommunicationSubscriptionsMutationVariables = Exact<{
  input: UpdateMyCommunicationSubscriptionsMutationInput;
}>;

export type UpdateMyCommunicationSubscriptionsMutation = {
  __typename?: 'Mutation';
  updateMyCommunicationSubscriptions: {
    __typename?: 'UpdateMyCommunicationSubscriptionsMutationPayload';
    guardian: {
      __typename?: 'GuardianCommunicationSubscriptionsNode';
      firstName: string;
      lastName: string;
      language: string;
      hasAcceptedCommunication: boolean;
    } | null;
  } | null;
};

export type UpdateMyEmailMutationVariables = Exact<{
  input: UpdateMyEmailMutationInput;
}>;

export type UpdateMyEmailMutation = {
  __typename?: 'Mutation';
  updateMyEmail: {
    __typename?: 'UpdateMyEmailMutationPayload';
    myProfile: {
      __typename?: 'GuardianNode';
      id: string;
      firstName: string;
      lastName: string;
      language: Language;
      email: string;
    } | null;
  } | null;
};

export type UpdateMyProfileMutationVariables = Exact<{
  input: UpdateMyProfileMutationInput;
}>;

export type UpdateMyProfileMutation = {
  __typename?: 'Mutation';
  updateMyProfile: {
    __typename?: 'UpdateMyProfileMutationPayload';
    myProfile: {
      __typename?: 'GuardianNode';
      id: string;
      firstName: string;
      lastName: string;
      language: Language;
      email: string;
      hasAcceptedCommunication: boolean;
    } | null;
  } | null;
};

export type MyCommunicationSubscriptionsQueryVariables = Exact<{
  authToken: InputMaybe<Scalars['String']['input']>;
}>;

export type MyCommunicationSubscriptionsQuery = {
  __typename?: 'Query';
  myCommunicationSubscriptions: {
    __typename?: 'GuardianCommunicationSubscriptionsNode';
    firstName: string;
    lastName: string;
    language: string;
    hasAcceptedCommunication: boolean;
  } | null;
};

export type ProfileChildrenQueryVariables = Exact<{ [key: string]: never }>;

export type ProfileChildrenQuery = {
  __typename?: 'Query';
  myProfile: {
    __typename?: 'GuardianNode';
    id: string;
    children: {
      __typename?: 'ChildNodeConnection';
      edges: Array<{
        __typename?: 'ChildNodeEdge';
        node: { __typename?: 'ChildNode'; id: string } | null;
      } | null>;
    };
  } | null;
};

export type MyProfileEnrolmentFieldsFragment = {
  __typename?: 'EnrolmentNode';
  id: string;
  occurrence: {
    __typename?: 'OccurrenceNode';
    id: string;
    time: any;
    venue: { __typename?: 'VenueNode'; id: string; name: string | null };
    event: {
      __typename?: 'EventNode';
      id: string;
      name: string | null;
      duration: number | null;
    };
  };
};

export type MyProfileEnrolmentsFieldsFragment = {
  __typename?: 'EnrolmentNodeConnection';
  edges: Array<{
    __typename?: 'EnrolmentNodeEdge';
    node: {
      __typename?: 'EnrolmentNode';
      id: string;
      occurrence: {
        __typename?: 'OccurrenceNode';
        id: string;
        time: any;
        venue: { __typename?: 'VenueNode'; id: string; name: string | null };
        event: {
          __typename?: 'EventNode';
          id: string;
          name: string | null;
          duration: number | null;
        };
      };
    } | null;
  } | null>;
};

export type MyProfileChildProjectFieldsFragment = {
  __typename?: 'ProjectNode';
  id: string;
  name: string | null;
  year: number;
};

export type MyProfileChildFieldsFragment = {
  __typename?: 'ChildNode';
  id: string;
  name: string;
  birthyear: number;
  postalCode: string;
  project: {
    __typename?: 'ProjectNode';
    id: string;
    name: string | null;
    year: number;
  };
  relationships: {
    __typename?: 'RelationshipNodeConnection';
    edges: Array<{
      __typename?: 'RelationshipNodeEdge';
      node: {
        __typename?: 'RelationshipNode';
        id: string;
        type: RelationshipTypeEnum | null;
      } | null;
    } | null>;
  };
  upcomingEventsAndEventGroups: {
    __typename?: 'EventOrEventGroupConnection';
    edges: Array<{
      __typename?: 'EventOrEventGroupEdge';
      node:
        | { __typename?: 'EventGroupNode'; id: string; name: string | null }
        | {
            __typename?: 'EventNode';
            id: string;
            name: string | null;
            duration: number | null;
            participantsPerInvite: EventParticipantsPerInvite;
          }
        | null;
    } | null>;
  } | null;
  occurrences: {
    __typename?: 'OccurrenceNodeConnection';
    edges: Array<{
      __typename?: 'OccurrenceNodeEdge';
      node: {
        __typename?: 'OccurrenceNode';
        id: string;
        event: {
          __typename?: 'EventNode';
          id: string;
          name: string | null;
          shortDescription: string | null;
        };
      } | null;
    } | null>;
  };
  enrolments: {
    __typename?: 'EnrolmentNodeConnection';
    edges: Array<{
      __typename?: 'EnrolmentNodeEdge';
      node: {
        __typename?: 'EnrolmentNode';
        id: string;
        occurrence: {
          __typename?: 'OccurrenceNode';
          id: string;
          time: any;
          venue: { __typename?: 'VenueNode'; id: string; name: string | null };
          event: {
            __typename?: 'EventNode';
            id: string;
            name: string | null;
            duration: number | null;
          };
        };
      } | null;
    } | null>;
  };
};

export type MyProfileChildrenFieldsFragment = {
  __typename?: 'ChildNodeConnection';
  edges: Array<{
    __typename?: 'ChildNodeEdge';
    node: {
      __typename?: 'ChildNode';
      id: string;
      name: string;
      birthyear: number;
      postalCode: string;
      project: {
        __typename?: 'ProjectNode';
        id: string;
        name: string | null;
        year: number;
      };
      relationships: {
        __typename?: 'RelationshipNodeConnection';
        edges: Array<{
          __typename?: 'RelationshipNodeEdge';
          node: {
            __typename?: 'RelationshipNode';
            id: string;
            type: RelationshipTypeEnum | null;
          } | null;
        } | null>;
      };
      upcomingEventsAndEventGroups: {
        __typename?: 'EventOrEventGroupConnection';
        edges: Array<{
          __typename?: 'EventOrEventGroupEdge';
          node:
            | { __typename?: 'EventGroupNode'; id: string; name: string | null }
            | {
                __typename?: 'EventNode';
                id: string;
                name: string | null;
                duration: number | null;
                participantsPerInvite: EventParticipantsPerInvite;
              }
            | null;
        } | null>;
      } | null;
      occurrences: {
        __typename?: 'OccurrenceNodeConnection';
        edges: Array<{
          __typename?: 'OccurrenceNodeEdge';
          node: {
            __typename?: 'OccurrenceNode';
            id: string;
            event: {
              __typename?: 'EventNode';
              id: string;
              name: string | null;
              shortDescription: string | null;
            };
          } | null;
        } | null>;
      };
      enrolments: {
        __typename?: 'EnrolmentNodeConnection';
        edges: Array<{
          __typename?: 'EnrolmentNodeEdge';
          node: {
            __typename?: 'EnrolmentNode';
            id: string;
            occurrence: {
              __typename?: 'OccurrenceNode';
              id: string;
              time: any;
              venue: {
                __typename?: 'VenueNode';
                id: string;
                name: string | null;
              };
              event: {
                __typename?: 'EventNode';
                id: string;
                name: string | null;
                duration: number | null;
              };
            };
          } | null;
        } | null>;
      };
    } | null;
  } | null>;
};

export type LanguageSpokenAtHomeFieldsFragment = {
  __typename?: 'LanguageNode';
  id: string;
};

export type LanguagesSpokenAtHomeFieldsFragment = {
  __typename?: 'LanguageNodeConnection';
  edges: Array<{
    __typename?: 'LanguageNodeEdge';
    node: { __typename?: 'LanguageNode'; id: string } | null;
  } | null>;
};

export type MyProfileFieldsFragment = {
  __typename?: 'GuardianNode';
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  language: Language;
  hasAcceptedCommunication: boolean;
  children: {
    __typename?: 'ChildNodeConnection';
    edges: Array<{
      __typename?: 'ChildNodeEdge';
      node: {
        __typename?: 'ChildNode';
        id: string;
        name: string;
        birthyear: number;
        postalCode: string;
        project: {
          __typename?: 'ProjectNode';
          id: string;
          name: string | null;
          year: number;
        };
        relationships: {
          __typename?: 'RelationshipNodeConnection';
          edges: Array<{
            __typename?: 'RelationshipNodeEdge';
            node: {
              __typename?: 'RelationshipNode';
              id: string;
              type: RelationshipTypeEnum | null;
            } | null;
          } | null>;
        };
        upcomingEventsAndEventGroups: {
          __typename?: 'EventOrEventGroupConnection';
          edges: Array<{
            __typename?: 'EventOrEventGroupEdge';
            node:
              | {
                  __typename?: 'EventGroupNode';
                  id: string;
                  name: string | null;
                }
              | {
                  __typename?: 'EventNode';
                  id: string;
                  name: string | null;
                  duration: number | null;
                  participantsPerInvite: EventParticipantsPerInvite;
                }
              | null;
          } | null>;
        } | null;
        occurrences: {
          __typename?: 'OccurrenceNodeConnection';
          edges: Array<{
            __typename?: 'OccurrenceNodeEdge';
            node: {
              __typename?: 'OccurrenceNode';
              id: string;
              event: {
                __typename?: 'EventNode';
                id: string;
                name: string | null;
                shortDescription: string | null;
              };
            } | null;
          } | null>;
        };
        enrolments: {
          __typename?: 'EnrolmentNodeConnection';
          edges: Array<{
            __typename?: 'EnrolmentNodeEdge';
            node: {
              __typename?: 'EnrolmentNode';
              id: string;
              occurrence: {
                __typename?: 'OccurrenceNode';
                id: string;
                time: any;
                venue: {
                  __typename?: 'VenueNode';
                  id: string;
                  name: string | null;
                };
                event: {
                  __typename?: 'EventNode';
                  id: string;
                  name: string | null;
                  duration: number | null;
                };
              };
            } | null;
          } | null>;
        };
      } | null;
    } | null>;
  };
  languagesSpokenAtHome: {
    __typename?: 'LanguageNodeConnection';
    edges: Array<{
      __typename?: 'LanguageNodeEdge';
      node: { __typename?: 'LanguageNode'; id: string } | null;
    } | null>;
  };
};

export type ProfileQueryVariables = Exact<{ [key: string]: never }>;

export type ProfileQuery = {
  __typename?: 'Query';
  myProfile: {
    __typename?: 'GuardianNode';
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    language: Language;
    hasAcceptedCommunication: boolean;
    children: {
      __typename?: 'ChildNodeConnection';
      edges: Array<{
        __typename?: 'ChildNodeEdge';
        node: {
          __typename?: 'ChildNode';
          id: string;
          name: string;
          birthyear: number;
          postalCode: string;
          project: {
            __typename?: 'ProjectNode';
            id: string;
            name: string | null;
            year: number;
          };
          relationships: {
            __typename?: 'RelationshipNodeConnection';
            edges: Array<{
              __typename?: 'RelationshipNodeEdge';
              node: {
                __typename?: 'RelationshipNode';
                id: string;
                type: RelationshipTypeEnum | null;
              } | null;
            } | null>;
          };
          upcomingEventsAndEventGroups: {
            __typename?: 'EventOrEventGroupConnection';
            edges: Array<{
              __typename?: 'EventOrEventGroupEdge';
              node:
                | {
                    __typename?: 'EventGroupNode';
                    id: string;
                    name: string | null;
                  }
                | {
                    __typename?: 'EventNode';
                    id: string;
                    name: string | null;
                    duration: number | null;
                    participantsPerInvite: EventParticipantsPerInvite;
                  }
                | null;
            } | null>;
          } | null;
          occurrences: {
            __typename?: 'OccurrenceNodeConnection';
            edges: Array<{
              __typename?: 'OccurrenceNodeEdge';
              node: {
                __typename?: 'OccurrenceNode';
                id: string;
                event: {
                  __typename?: 'EventNode';
                  id: string;
                  name: string | null;
                  shortDescription: string | null;
                };
              } | null;
            } | null>;
          };
          enrolments: {
            __typename?: 'EnrolmentNodeConnection';
            edges: Array<{
              __typename?: 'EnrolmentNodeEdge';
              node: {
                __typename?: 'EnrolmentNode';
                id: string;
                occurrence: {
                  __typename?: 'OccurrenceNode';
                  id: string;
                  time: any;
                  venue: {
                    __typename?: 'VenueNode';
                    id: string;
                    name: string | null;
                  };
                  event: {
                    __typename?: 'EventNode';
                    id: string;
                    name: string | null;
                    duration: number | null;
                  };
                };
              } | null;
            } | null>;
          };
        } | null;
      } | null>;
    };
    languagesSpokenAtHome: {
      __typename?: 'LanguageNodeConnection';
      edges: Array<{
        __typename?: 'LanguageNodeEdge';
        node: { __typename?: 'LanguageNode'; id: string } | null;
      } | null>;
    };
  } | null;
};

export type SubmitGuardianFieldsFragment = {
  __typename?: 'GuardianNode';
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  language: Language;
  hasAcceptedCommunication: boolean;
  children: {
    __typename?: 'ChildNodeConnection';
    edges: Array<{
      __typename?: 'ChildNodeEdge';
      node: {
        __typename?: 'ChildNode';
        id: string;
        name: string;
        birthyear: number;
        postalCode: string;
        project: {
          __typename?: 'ProjectNode';
          id: string;
          name: string | null;
          year: number;
        };
        relationships: {
          __typename?: 'RelationshipNodeConnection';
          edges: Array<{
            __typename?: 'RelationshipNodeEdge';
            node: {
              __typename?: 'RelationshipNode';
              id: string;
              type: RelationshipTypeEnum | null;
            } | null;
          } | null>;
        };
      } | null;
    } | null>;
  };
};

export type SubmitChildrenAndGuardianMutationPayloadFieldsFragment = {
  __typename?: 'SubmitChildrenAndGuardianMutationPayload';
  guardian: {
    __typename?: 'GuardianNode';
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    language: Language;
    hasAcceptedCommunication: boolean;
    children: {
      __typename?: 'ChildNodeConnection';
      edges: Array<{
        __typename?: 'ChildNodeEdge';
        node: {
          __typename?: 'ChildNode';
          id: string;
          name: string;
          birthyear: number;
          postalCode: string;
          project: {
            __typename?: 'ProjectNode';
            id: string;
            name: string | null;
            year: number;
          };
          relationships: {
            __typename?: 'RelationshipNodeConnection';
            edges: Array<{
              __typename?: 'RelationshipNodeEdge';
              node: {
                __typename?: 'RelationshipNode';
                id: string;
                type: RelationshipTypeEnum | null;
              } | null;
            } | null>;
          };
        } | null;
      } | null>;
    };
  } | null;
};

export type SubmitChildrenAndGuardianMutationVariables = Exact<{
  children: Array<ChildInput> | ChildInput;
  guardian: GuardianInput;
}>;

export type SubmitChildrenAndGuardianMutation = {
  __typename?: 'Mutation';
  submitChildrenAndGuardian: {
    __typename?: 'SubmitChildrenAndGuardianMutationPayload';
    guardian: {
      __typename?: 'GuardianNode';
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      language: Language;
      hasAcceptedCommunication: boolean;
      children: {
        __typename?: 'ChildNodeConnection';
        edges: Array<{
          __typename?: 'ChildNodeEdge';
          node: {
            __typename?: 'ChildNode';
            id: string;
            name: string;
            birthyear: number;
            postalCode: string;
            project: {
              __typename?: 'ProjectNode';
              id: string;
              name: string | null;
              year: number;
            };
            relationships: {
              __typename?: 'RelationshipNodeConnection';
              edges: Array<{
                __typename?: 'RelationshipNodeEdge';
                node: {
                  __typename?: 'RelationshipNode';
                  id: string;
                  type: RelationshipTypeEnum | null;
                } | null;
              } | null>;
            };
          } | null;
        } | null>;
      };
    } | null;
  } | null;
};

export const DeleteChildMutationPayloadFieldsFragmentDoc = gql`
  fragment DeleteChildMutationPayloadFields on DeleteChildMutationPayload {
    clientMutationId
  }
`;
export const UpdateChildMutationPayloadFieldsFragmentDoc = gql`
  fragment UpdateChildMutationPayloadFields on UpdateChildMutationPayload {
    child {
      id
      name
      birthyear
      postalCode
      project {
        id
        name
        year
      }
      relationships {
        edges {
          node {
            id
            type
          }
        }
      }
    }
  }
`;
export const UpdateChildNotesMutationPayloadFieldsFragmentDoc = gql`
  fragment UpdateChildNotesMutationPayloadFields on UpdateChildNotesMutationPayload {
    childNotes {
      childId
      notes
    }
  }
`;
export const ChildByIdQueryProjectFieldsFragmentDoc = gql`
  fragment ChildByIdQueryProjectFields on ProjectNode {
    id
    name
    year
  }
`;
export const EnrolmentVenueFieldsFragmentDoc = gql`
  fragment EnrolmentVenueFields on VenueNode {
    id
    name
    address
  }
`;
export const EnrolmentEventFieldsFragmentDoc = gql`
  fragment EnrolmentEventFields on EventNode {
    id
    name
    shortDescription
    duration
    image
    imageAltText
    participantsPerInvite
  }
`;
export const EnrolmentOccurrenceFieldsFragmentDoc = gql`
  fragment EnrolmentOccurrenceFields on OccurrenceNode {
    id
    time
    venue {
      ...EnrolmentVenueFields
    }
    event {
      ...EnrolmentEventFields
    }
  }
  ${EnrolmentVenueFieldsFragmentDoc}
  ${EnrolmentEventFieldsFragmentDoc}
`;
export const ActiveInternalEnrolmentFieldsFragmentDoc = gql`
  fragment ActiveInternalEnrolmentFields on EnrolmentNode {
    id
    referenceId
    occurrence {
      ...EnrolmentOccurrenceFields
    }
    __typename
  }
  ${EnrolmentOccurrenceFieldsFragmentDoc}
`;
export const ActiveTicketmasterEnrolmentFieldsFragmentDoc = gql`
  fragment ActiveTicketmasterEnrolmentFields on TicketmasterEnrolmentNode {
    id
    event {
      ...EnrolmentEventFields
    }
    __typename
  }
  ${EnrolmentEventFieldsFragmentDoc}
`;
export const ActiveLippupisteEnrolmentFieldsFragmentDoc = gql`
  fragment ActiveLippupisteEnrolmentFields on LippupisteEnrolmentNode {
    id
    event {
      ...EnrolmentEventFields
    }
    __typename
  }
  ${EnrolmentEventFieldsFragmentDoc}
`;
export const ActiveTixlyEnrolmentFieldsFragmentDoc = gql`
  fragment ActiveTixlyEnrolmentFields on TixlyEnrolmentNode {
    id
    event {
      ...EnrolmentEventFields
    }
    __typename
  }
  ${EnrolmentEventFieldsFragmentDoc}
`;
export const ActiveInternalAndTicketSystemEnrolmentsFieldsFragmentDoc = gql`
  fragment ActiveInternalAndTicketSystemEnrolmentsFields on InternalOrTicketSystemEnrolmentConnection {
    edges {
      node {
        ... on EnrolmentNode {
          ...ActiveInternalEnrolmentFields
        }
        ... on TicketmasterEnrolmentNode {
          ...ActiveTicketmasterEnrolmentFields
        }
        ... on LippupisteEnrolmentNode {
          ...ActiveLippupisteEnrolmentFields
        }
        ... on TixlyEnrolmentNode {
          ...ActiveTixlyEnrolmentFields
        }
      }
    }
  }
  ${ActiveInternalEnrolmentFieldsFragmentDoc}
  ${ActiveTicketmasterEnrolmentFieldsFragmentDoc}
  ${ActiveLippupisteEnrolmentFieldsFragmentDoc}
  ${ActiveTixlyEnrolmentFieldsFragmentDoc}
`;
export const UpcomingEventFieldsFragmentDoc = gql`
  fragment UpcomingEventFields on EventNode {
    id
    name
    shortDescription
    image
    imageAltText
    participantsPerInvite
    canChildEnroll(childId: $id)
    __typename
  }
`;
export const UpcomingEventGroupFieldsFragmentDoc = gql`
  fragment UpcomingEventGroupFields on EventGroupNode {
    id
    name
    shortDescription
    image
    imageAltText
    canChildEnroll(childId: $id)
    __typename
  }
`;
export const UpcomingEventsAndEventGroupsFieldsFragmentDoc = gql`
  fragment UpcomingEventsAndEventGroupsFields on EventOrEventGroupConnection {
    edges {
      node {
        ... on EventNode {
          ...UpcomingEventFields
        }
        ... on EventGroupNode {
          ...UpcomingEventGroupFields
        }
      }
    }
  }
  ${UpcomingEventFieldsFragmentDoc}
  ${UpcomingEventGroupFieldsFragmentDoc}
`;
export const PastEventOccurrenceFieldsFragmentDoc = gql`
  fragment PastEventOccurrenceFields on OccurrenceNode {
    id
    time
  }
`;
export const PastEventOccurrencesFieldsFragmentDoc = gql`
  fragment PastEventOccurrencesFields on OccurrenceNodeConnection {
    edges {
      node {
        ...PastEventOccurrenceFields
      }
    }
  }
  ${PastEventOccurrenceFieldsFragmentDoc}
`;
export const PastEventFieldsFragmentDoc = gql`
  fragment PastEventFields on EventNode {
    id
    name
    shortDescription
    image
    imageAltText
    participantsPerInvite
    occurrences {
      ...PastEventOccurrencesFields
    }
  }
  ${PastEventOccurrencesFieldsFragmentDoc}
`;
export const PastEventsFieldsFragmentDoc = gql`
  fragment PastEventsFields on EventConnection {
    edges {
      node {
        ...PastEventFields
      }
    }
  }
  ${PastEventFieldsFragmentDoc}
`;
export const RelationshipFieldsFragmentDoc = gql`
  fragment RelationshipFields on RelationshipNode {
    id
    type
  }
`;
export const RelationshipsFieldsFragmentDoc = gql`
  fragment RelationshipsFields on RelationshipNodeConnection {
    edges {
      node {
        ...RelationshipFields
      }
    }
  }
  ${RelationshipFieldsFragmentDoc}
`;
export const ChildByIdQueryFieldsFragmentDoc = gql`
  fragment ChildByIdQueryFields on ChildNode {
    id
    name
    birthyear
    postalCode
    project {
      ...ChildByIdQueryProjectFields
    }
    activeInternalAndTicketSystemEnrolments {
      ...ActiveInternalAndTicketSystemEnrolmentsFields
    }
    upcomingEventsAndEventGroups {
      ...UpcomingEventsAndEventGroupsFields
    }
    pastEvents {
      ...PastEventsFields
    }
    relationships {
      ...RelationshipsFields
    }
  }
  ${ChildByIdQueryProjectFieldsFragmentDoc}
  ${ActiveInternalAndTicketSystemEnrolmentsFieldsFragmentDoc}
  ${UpcomingEventsAndEventGroupsFieldsFragmentDoc}
  ${PastEventsFieldsFragmentDoc}
  ${RelationshipsFieldsFragmentDoc}
`;
export const ChildNotesByIdQueryFieldsFragmentDoc = gql`
  fragment ChildNotesByIdQueryFields on ChildNotesNode {
    childId
    notes
  }
`;
export const EnrolOccurrencesFieldsFragmentDoc = gql`
  fragment EnrolOccurrencesFields on OccurrenceNodeConnection {
    edges {
      node {
        id
        time
        event {
          id
          image
          imageAltText
          description
          shortDescription
          name
          duration
          participantsPerInvite
        }
        venue {
          id
          name
          address
          accessibilityInfo
          arrivalInstructions
          additionalInfo
          wwwUrl
          wcAndFacilities
        }
      }
    }
  }
`;
export const EnrolOccurrenceMutationPayloadFieldsFragmentDoc = gql`
  fragment EnrolOccurrenceMutationPayloadFields on EnrolOccurrenceMutationPayload {
    clientMutationId
    enrolment {
      id
      occurrence {
        id
        event {
          id
        }
        venue {
          id
        }
      }
      child {
        id
        occurrences(upcoming: true) {
          ...EnrolOccurrencesFields
        }
        pastEvents {
          edges {
            node {
              id
            }
          }
        }
        availableEvents {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
  ${EnrolOccurrencesFieldsFragmentDoc}
`;
export const UnenrolOccurrencesFieldsFragmentDoc = gql`
  fragment UnenrolOccurrencesFields on OccurrenceNodeConnection {
    edges {
      node {
        id
        time
        event {
          id
          image
          imageAltText
          description
          shortDescription
          name
          duration
          participantsPerInvite
        }
        venue {
          id
          name
          address
          accessibilityInfo
          arrivalInstructions
          additionalInfo
          wwwUrl
          wcAndFacilities
        }
      }
    }
  }
`;
export const UnenrolOccurrenceMutationPayloadFieldsFragmentDoc = gql`
  fragment UnenrolOccurrenceMutationPayloadFields on UnenrolOccurrenceMutationPayload {
    clientMutationId
    occurrence {
      id
      event {
        id
      }
    }
    child {
      id
      availableEvents {
        edges {
          node {
            id
          }
        }
      }
      occurrences(upcomingWithOngoing: true) {
        ...UnenrolOccurrencesFields
      }
      pastEvents {
        edges {
          node {
            id
          }
        }
      }
    }
  }
  ${UnenrolOccurrencesFieldsFragmentDoc}
`;
export const EventOccurrenceFieldsFragmentDoc = gql`
  fragment EventOccurrenceFields on OccurrenceNode {
    id
    time
    remainingCapacity
    event {
      id
      name
      duration
    }
    venue {
      id
      name
      address
    }
    childHasFreeSpotNotificationSubscription(childId: $childId)
    ticketSystem {
      type
      ... on TicketmasterOccurrenceTicketSystem {
        url
      }
      ... on LippupisteOccurrenceTicketSystem {
        url
      }
      ... on TixlyOccurrenceTicketSystem {
        url
      }
    }
  }
`;
export const EventOccurrencesFieldsFragmentDoc = gql`
  fragment EventOccurrencesFields on OccurrenceNodeConnection {
    edges {
      node {
        ...EventOccurrenceFields
      }
    }
  }
  ${EventOccurrenceFieldsFragmentDoc}
`;
export const TicketmasterEventFieldsFragmentDoc = gql`
  fragment TicketmasterEventFields on TicketmasterEventTicketSystem {
    childPassword(childId: $childId)
    url
  }
`;
export const LippupisteEventFieldsFragmentDoc = gql`
  fragment LippupisteEventFields on LippupisteEventTicketSystem {
    childPassword(childId: $childId)
    url
  }
`;
export const TixlyEventFieldsFragmentDoc = gql`
  fragment TixlyEventFields on TixlyEventTicketSystem {
    childPassword(childId: $childId)
    url
  }
`;
export const ExternalTicketSystemEventFieldsFragmentDoc = gql`
  fragment ExternalTicketSystemEventFields on EventNode {
    id
    name
    description
    image
    imageAltText
    participantsPerInvite
    occurrences: occurrences(upcoming: true, first: 1) {
      edges {
        node {
          ticketSystem {
            type
            ... on TicketmasterOccurrenceTicketSystem {
              url
            }
            ... on LippupisteOccurrenceTicketSystem {
              url
            }
            ... on TixlyOccurrenceTicketSystem {
              url
            }
          }
        }
      }
    }
    ticketSystem {
      type
      ... on TicketmasterEventTicketSystem {
        ...TicketmasterEventFields
      }
      ... on LippupisteEventTicketSystem {
        ...LippupisteEventFields
      }
      ... on TixlyEventTicketSystem {
        ...TixlyEventFields
      }
    }
  }
  ${TicketmasterEventFieldsFragmentDoc}
  ${LippupisteEventFieldsFragmentDoc}
  ${TixlyEventFieldsFragmentDoc}
`;
export const OccurrenceEventFieldsFragmentDoc = gql`
  fragment OccurrenceEventFields on EventNode {
    id
    image
    imageAltText
    description
    shortDescription
    name
    duration
    participantsPerInvite
    eventGroup {
      id
    }
  }
`;
export const OccurrenceVenueFieldsFragmentDoc = gql`
  fragment OccurrenceVenueFields on VenueNode {
    id
    name
    address
    accessibilityInfo
    arrivalInstructions
    additionalInfo
    wwwUrl
    wcAndFacilities
  }
`;
export const OccurrenceFieldsFragmentDoc = gql`
  fragment OccurrenceFields on OccurrenceNode {
    id
    time
    remainingCapacity
    event {
      ...OccurrenceEventFields
    }
    venue {
      ...OccurrenceVenueFields
    }
    childHasFreeSpotNotificationSubscription(childId: $childId)
  }
  ${OccurrenceEventFieldsFragmentDoc}
  ${OccurrenceVenueFieldsFragmentDoc}
`;
export const EventGroupEventFieldsFragmentDoc = gql`
  fragment EventGroupEventFields on EventNode {
    id
    name
    shortDescription
    image
    imageAltText
    canChildEnroll(childId: $childId)
  }
`;
export const EventGroupEventsFieldsFragmentDoc = gql`
  fragment EventGroupEventsFields on EventNodeConnection {
    edges {
      node {
        ...EventGroupEventFields
      }
    }
  }
  ${EventGroupEventFieldsFragmentDoc}
`;
export const EventGroupFieldsFragmentDoc = gql`
  fragment EventGroupFields on EventGroupNode {
    id
    name
    shortDescription
    description
    events(upcoming: true) {
      ...EventGroupEventsFields
    }
  }
  ${EventGroupEventsFieldsFragmentDoc}
`;
export const LanguageFieldsFragmentDoc = gql`
  fragment LanguageFields on LanguageNode {
    id
    name
  }
`;
export const LanguagesFieldsFragmentDoc = gql`
  fragment LanguagesFields on LanguageNodeConnection {
    edges {
      node {
        ...LanguageFields
      }
    }
  }
  ${LanguageFieldsFragmentDoc}
`;
export const MyProfileChildProjectFieldsFragmentDoc = gql`
  fragment MyProfileChildProjectFields on ProjectNode {
    id
    name
    year
  }
`;
export const MyProfileEnrolmentFieldsFragmentDoc = gql`
  fragment MyProfileEnrolmentFields on EnrolmentNode {
    id
    occurrence {
      id
      time
      venue {
        id
        name
      }
      event {
        id
        name
        duration
      }
    }
  }
`;
export const MyProfileEnrolmentsFieldsFragmentDoc = gql`
  fragment MyProfileEnrolmentsFields on EnrolmentNodeConnection {
    edges {
      node {
        ...MyProfileEnrolmentFields
      }
    }
  }
  ${MyProfileEnrolmentFieldsFragmentDoc}
`;
export const MyProfileChildFieldsFragmentDoc = gql`
  fragment MyProfileChildFields on ChildNode {
    id
    name
    birthyear
    postalCode
    project {
      ...MyProfileChildProjectFields
    }
    relationships {
      edges {
        node {
          id
          type
        }
      }
    }
    upcomingEventsAndEventGroups {
      edges {
        node {
          ... on EventGroupNode {
            id
            name
          }
          ... on EventNode {
            id
            name
            duration
            participantsPerInvite
          }
        }
      }
    }
    occurrences {
      edges {
        node {
          id
          event {
            id
            name
            shortDescription
          }
        }
      }
    }
    enrolments {
      ...MyProfileEnrolmentsFields
    }
  }
  ${MyProfileChildProjectFieldsFragmentDoc}
  ${MyProfileEnrolmentsFieldsFragmentDoc}
`;
export const MyProfileChildrenFieldsFragmentDoc = gql`
  fragment MyProfileChildrenFields on ChildNodeConnection {
    edges {
      node {
        ...MyProfileChildFields
      }
    }
  }
  ${MyProfileChildFieldsFragmentDoc}
`;
export const LanguageSpokenAtHomeFieldsFragmentDoc = gql`
  fragment LanguageSpokenAtHomeFields on LanguageNode {
    id
  }
`;
export const LanguagesSpokenAtHomeFieldsFragmentDoc = gql`
  fragment LanguagesSpokenAtHomeFields on LanguageNodeConnection {
    edges {
      node {
        ...LanguageSpokenAtHomeFields
      }
    }
  }
  ${LanguageSpokenAtHomeFieldsFragmentDoc}
`;
export const MyProfileFieldsFragmentDoc = gql`
  fragment MyProfileFields on GuardianNode {
    id
    firstName
    lastName
    email
    phoneNumber
    language
    hasAcceptedCommunication
    children {
      ...MyProfileChildrenFields
    }
    languagesSpokenAtHome {
      ...LanguagesSpokenAtHomeFields
    }
  }
  ${MyProfileChildrenFieldsFragmentDoc}
  ${LanguagesSpokenAtHomeFieldsFragmentDoc}
`;
export const SubmitGuardianFieldsFragmentDoc = gql`
  fragment SubmitGuardianFields on GuardianNode {
    id
    firstName
    lastName
    email
    phoneNumber
    language
    hasAcceptedCommunication
    children {
      edges {
        node {
          id
          name
          birthyear
          postalCode
          project {
            id
            name
            year
          }
          relationships {
            edges {
              node {
                id
                type
              }
            }
          }
        }
      }
    }
  }
`;
export const SubmitChildrenAndGuardianMutationPayloadFieldsFragmentDoc = gql`
  fragment SubmitChildrenAndGuardianMutationPayloadFields on SubmitChildrenAndGuardianMutationPayload {
    guardian {
      ...SubmitGuardianFields
    }
  }
  ${SubmitGuardianFieldsFragmentDoc}
`;
export const AddNewChildDocument = gql`
  mutation addNewChild($input: AddChildMutationInput!) {
    addChild(input: $input) {
      child {
        id
        name
        birthyear
        postalCode
        project {
          id
          name
          year
        }
      }
    }
  }
`;
export type AddNewChildMutationFn = Apollo.MutationFunction<
  AddNewChildMutation,
  AddNewChildMutationVariables
>;
export type AddNewChildMutationResult =
  Apollo.MutationResult<AddNewChildMutation>;
export type AddNewChildMutationOptions = Apollo.BaseMutationOptions<
  AddNewChildMutation,
  AddNewChildMutationVariables
>;
export const DeleteChildDocument = gql`
  mutation deleteChild($input: DeleteChildMutationInput!) {
    deleteChild(input: $input) {
      ...DeleteChildMutationPayloadFields
    }
  }
  ${DeleteChildMutationPayloadFieldsFragmentDoc}
`;
export type DeleteChildMutationFn = Apollo.MutationFunction<
  DeleteChildMutation,
  DeleteChildMutationVariables
>;
export type DeleteChildMutationResult =
  Apollo.MutationResult<DeleteChildMutation>;
export type DeleteChildMutationOptions = Apollo.BaseMutationOptions<
  DeleteChildMutation,
  DeleteChildMutationVariables
>;
export const UpdateChildDocument = gql`
  mutation updateChild($input: UpdateChildMutationInput!) {
    updateChild(input: $input) {
      ...UpdateChildMutationPayloadFields
    }
  }
  ${UpdateChildMutationPayloadFieldsFragmentDoc}
`;
export type UpdateChildMutationFn = Apollo.MutationFunction<
  UpdateChildMutation,
  UpdateChildMutationVariables
>;
export type UpdateChildMutationResult =
  Apollo.MutationResult<UpdateChildMutation>;
export type UpdateChildMutationOptions = Apollo.BaseMutationOptions<
  UpdateChildMutation,
  UpdateChildMutationVariables
>;
export const UpdateChildNotesDocument = gql`
  mutation updateChildNotes($input: UpdateChildNotesMutationInput!) {
    updateChildNotes(input: $input) {
      ...UpdateChildNotesMutationPayloadFields
    }
  }
  ${UpdateChildNotesMutationPayloadFieldsFragmentDoc}
`;
export type UpdateChildNotesMutationFn = Apollo.MutationFunction<
  UpdateChildNotesMutation,
  UpdateChildNotesMutationVariables
>;
export type UpdateChildNotesMutationResult =
  Apollo.MutationResult<UpdateChildNotesMutation>;
export type UpdateChildNotesMutationOptions = Apollo.BaseMutationOptions<
  UpdateChildNotesMutation,
  UpdateChildNotesMutationVariables
>;
export const ChildEnrolmentCountDocument = gql`
  query ChildEnrolmentCount($childId: ID!) {
    child(id: $childId) {
      id
      enrolmentCount
      pastEnrolmentCount
      project {
        id
        enrolmentLimit
      }
    }
  }
`;
export type ChildEnrolmentCountQueryResult = Apollo.QueryResult<
  ChildEnrolmentCountQuery,
  ChildEnrolmentCountQueryVariables
>;
export const ChildEventInvitationLabelQueryDocument = gql`
  query ChildEventInvitationLabelQuery($childId: ID!) {
    child(id: $childId) {
      id
      upcomingEventsAndEventGroups {
        edges {
          node {
            ... on EventGroupNode {
              id
              canChildEnroll(childId: $childId)
            }
            ... on EventNode {
              id
              canChildEnroll(childId: $childId)
            }
          }
        }
      }
    }
  }
`;
export type ChildEventInvitationLabelQueryQueryResult = Apollo.QueryResult<
  ChildEventInvitationLabelQuery,
  ChildEventInvitationLabelQueryVariables
>;
export const ChildByIdQueryDocument = gql`
  query childByIdQuery($id: ID!) {
    child(id: $id) {
      ...ChildByIdQueryFields
    }
  }
  ${ChildByIdQueryFieldsFragmentDoc}
`;
export type ChildByIdQueryQueryResult = Apollo.QueryResult<
  ChildByIdQuery,
  ChildByIdQueryVariables
>;
export const ChildNotesByIdQueryDocument = gql`
  query childNotesByIdQuery($id: ID!) {
    childNotes(id: $id) {
      ...ChildNotesByIdQueryFields
    }
  }
  ${ChildNotesByIdQueryFieldsFragmentDoc}
`;
export type ChildNotesByIdQueryQueryResult = Apollo.QueryResult<
  ChildNotesByIdQuery,
  ChildNotesByIdQueryVariables
>;
export const AssignTicketSystemPasswordMutationDocument = gql`
  mutation assignTicketSystemPasswordMutation(
    $input: AssignTicketSystemPasswordMutationInput!
  ) {
    assignTicketSystemPassword(input: $input) {
      password
    }
  }
`;
export type AssignTicketSystemPasswordMutationMutationFn =
  Apollo.MutationFunction<
    AssignTicketSystemPasswordMutation,
    AssignTicketSystemPasswordMutationVariables
  >;
export type AssignTicketSystemPasswordMutationMutationResult =
  Apollo.MutationResult<AssignTicketSystemPasswordMutation>;
export type AssignTicketSystemPasswordMutationMutationOptions =
  Apollo.BaseMutationOptions<
    AssignTicketSystemPasswordMutation,
    AssignTicketSystemPasswordMutationVariables
  >;
export const EnrolOccurrenceMutationDocument = gql`
  mutation enrolOccurrenceMutation($input: EnrolOccurrenceMutationInput!) {
    enrolOccurrence(input: $input) {
      ...EnrolOccurrenceMutationPayloadFields
    }
  }
  ${EnrolOccurrenceMutationPayloadFieldsFragmentDoc}
`;
export type EnrolOccurrenceMutationMutationFn = Apollo.MutationFunction<
  EnrolOccurrenceMutation,
  EnrolOccurrenceMutationVariables
>;
export type EnrolOccurrenceMutationMutationResult =
  Apollo.MutationResult<EnrolOccurrenceMutation>;
export type EnrolOccurrenceMutationMutationOptions = Apollo.BaseMutationOptions<
  EnrolOccurrenceMutation,
  EnrolOccurrenceMutationVariables
>;
export const SubscribeToFreeSpotNotificationMutationDocument = gql`
  mutation subscribeToFreeSpotNotificationMutation(
    $input: SubscribeToFreeSpotNotificationMutationInput!
  ) {
    subscribeToFreeSpotNotification(input: $input) {
      clientMutationId
    }
  }
`;
export type SubscribeToFreeSpotNotificationMutationMutationFn =
  Apollo.MutationFunction<
    SubscribeToFreeSpotNotificationMutation,
    SubscribeToFreeSpotNotificationMutationVariables
  >;
export type SubscribeToFreeSpotNotificationMutationMutationResult =
  Apollo.MutationResult<SubscribeToFreeSpotNotificationMutation>;
export type SubscribeToFreeSpotNotificationMutationMutationOptions =
  Apollo.BaseMutationOptions<
    SubscribeToFreeSpotNotificationMutation,
    SubscribeToFreeSpotNotificationMutationVariables
  >;
export const UnenrolOccurrenceMutationDocument = gql`
  mutation unenrolOccurrenceMutation($input: UnenrolOccurrenceMutationInput!) {
    unenrolOccurrence(input: $input) {
      ...UnenrolOccurrenceMutationPayloadFields
    }
  }
  ${UnenrolOccurrenceMutationPayloadFieldsFragmentDoc}
`;
export type UnenrolOccurrenceMutationMutationFn = Apollo.MutationFunction<
  UnenrolOccurrenceMutation,
  UnenrolOccurrenceMutationVariables
>;
export type UnenrolOccurrenceMutationMutationResult =
  Apollo.MutationResult<UnenrolOccurrenceMutation>;
export type UnenrolOccurrenceMutationMutationOptions =
  Apollo.BaseMutationOptions<
    UnenrolOccurrenceMutation,
    UnenrolOccurrenceMutationVariables
  >;
export const UnsubscribeFromFreeSpotNotificationMutationDocument = gql`
  mutation unsubscribeFromFreeSpotNotificationMutation(
    $input: UnsubscribeFromFreeSpotNotificationMutationInput!
  ) {
    unsubscribeFromFreeSpotNotification(input: $input) {
      clientMutationId
    }
  }
`;
export type UnsubscribeFromFreeSpotNotificationMutationMutationFn =
  Apollo.MutationFunction<
    UnsubscribeFromFreeSpotNotificationMutation,
    UnsubscribeFromFreeSpotNotificationMutationVariables
  >;
export type UnsubscribeFromFreeSpotNotificationMutationMutationResult =
  Apollo.MutationResult<UnsubscribeFromFreeSpotNotificationMutation>;
export type UnsubscribeFromFreeSpotNotificationMutationMutationOptions =
  Apollo.BaseMutationOptions<
    UnsubscribeFromFreeSpotNotificationMutation,
    UnsubscribeFromFreeSpotNotificationMutationVariables
  >;
export const EventQueryDocument = gql`
  query eventQuery($id: ID!, $date: Date, $time: Time, $childId: ID!) {
    event(id: $id) {
      id
      name
      description
      shortDescription
      image
      imageAltText
      participantsPerInvite
      duration
      capacityPerOccurrence
      canChildEnroll(childId: $childId)
      eventGroup {
        id
      }
      occurrences(upcoming: true, date: $date, time: $time) {
        ...EventOccurrencesFields
      }
      allOccurrences: occurrences(upcoming: true) {
        ...EventOccurrencesFields
      }
      ticketSystem {
        type
        ... on TicketmasterEventTicketSystem {
          childPassword(childId: $childId)
          url
        }
        ... on LippupisteEventTicketSystem {
          childPassword(childId: $childId)
          url
        }
        ... on TixlyEventTicketSystem {
          childPassword(childId: $childId)
          url
        }
      }
    }
  }
  ${EventOccurrencesFieldsFragmentDoc}
`;
export type EventQueryQueryResult = Apollo.QueryResult<
  EventQuery,
  EventQueryVariables
>;
export const EventOccurrenceQueryDocument = gql`
  query eventOccurrenceQuery($id: ID!, $childId: ID!) {
    occurrence(id: $id) {
      ...EventOccurrenceFields
    }
  }
  ${EventOccurrenceFieldsFragmentDoc}
`;
export type EventOccurrenceQueryQueryResult = Apollo.QueryResult<
  EventOccurrenceQuery,
  EventOccurrenceQueryVariables
>;
export const EventExternalTicketSystemPasswordQueryDocument = gql`
  query eventExternalTicketSystemPasswordQuery($id: ID!, $childId: ID!) {
    event(id: $id) {
      participantsPerInvite
      ticketSystem {
        ... on TicketmasterEventTicketSystem {
          childPassword(childId: $childId)
          url
        }
        ... on LippupisteEventTicketSystem {
          childPassword(childId: $childId)
          url
        }
        ... on TixlyEventTicketSystem {
          childPassword(childId: $childId)
          url
        }
      }
    }
  }
`;
export type EventExternalTicketSystemPasswordQueryQueryResult =
  Apollo.QueryResult<
    EventExternalTicketSystemPasswordQuery,
    EventExternalTicketSystemPasswordQueryVariables
  >;
export const EventExternalTicketSystemHasAnyFreePasswordsQueryDocument = gql`
  query eventExternalTicketSystemHasAnyFreePasswordsQuery($id: ID!) {
    event(id: $id) {
      ticketSystem {
        type
        ... on TicketmasterEventTicketSystem {
          hasAnyFreePasswords
        }
        ... on LippupisteEventTicketSystem {
          hasAnyFreePasswords
        }
        ... on TixlyEventTicketSystem {
          hasAnyFreePasswords
        }
      }
    }
  }
`;
export type EventExternalTicketSystemHasAnyFreePasswordsQueryQueryResult =
  Apollo.QueryResult<
    EventExternalTicketSystemHasAnyFreePasswordsQuery,
    EventExternalTicketSystemHasAnyFreePasswordsQueryVariables
  >;
export const ExternalTicketSystemEventQueryDocument = gql`
  query externalTicketSystemEventQuery($eventId: ID!, $childId: ID!) {
    event(id: $eventId) {
      ...ExternalTicketSystemEventFields
    }
  }
  ${ExternalTicketSystemEventFieldsFragmentDoc}
`;
export type ExternalTicketSystemEventQueryQueryResult = Apollo.QueryResult<
  ExternalTicketSystemEventQuery,
  ExternalTicketSystemEventQueryVariables
>;
export const OccurrenceQueryDocument = gql`
  query occurrenceQuery($id: ID!, $childId: ID) {
    occurrence(id: $id) {
      ...OccurrenceFields
    }
  }
  ${OccurrenceFieldsFragmentDoc}
`;
export type OccurrenceQueryQueryResult = Apollo.QueryResult<
  OccurrenceQuery,
  OccurrenceQueryVariables
>;
export const EventGroupQueryDocument = gql`
  query eventGroupQuery($id: ID!, $childId: ID!) {
    eventGroup(id: $id) {
      ...EventGroupFields
    }
  }
  ${EventGroupFieldsFragmentDoc}
`;
export type EventGroupQueryQueryResult = Apollo.QueryResult<
  EventGroupQuery,
  EventGroupQueryVariables
>;
export const GuardiansQueryDocument = gql`
  query GuardiansQuery {
    guardians {
      edges {
        node {
          id
          createdAt
          updatedAt
          firstName
          lastName
          phoneNumber
          language
          children {
            edges {
              node {
                id
              }
            }
          }
          relationships {
            edges {
              node {
                id
              }
            }
          }
          email
        }
      }
    }
  }
`;
export type GuardiansQueryQueryResult = Apollo.QueryResult<
  GuardiansQuery,
  GuardiansQueryVariables
>;
export const LanguageQueryDocument = gql`
  query languageQuery {
    languages {
      ...LanguagesFields
    }
  }
  ${LanguagesFieldsFragmentDoc}
`;
export type LanguageQueryQueryResult = Apollo.QueryResult<
  LanguageQuery,
  LanguageQueryVariables
>;
export const RequestEmailUpdateTokenDocument = gql`
  mutation RequestEmailUpdateToken(
    $input: RequestEmailUpdateTokenMutationInput!
  ) {
    requestEmailUpdateToken(input: $input) {
      email
      emailUpdateTokenRequested
    }
  }
`;
export type RequestEmailUpdateTokenMutationFn = Apollo.MutationFunction<
  RequestEmailUpdateTokenMutation,
  RequestEmailUpdateTokenMutationVariables
>;
export type RequestEmailUpdateTokenMutationResult =
  Apollo.MutationResult<RequestEmailUpdateTokenMutation>;
export type RequestEmailUpdateTokenMutationOptions = Apollo.BaseMutationOptions<
  RequestEmailUpdateTokenMutation,
  RequestEmailUpdateTokenMutationVariables
>;
export const UpdateMyCommunicationSubscriptionsDocument = gql`
  mutation UpdateMyCommunicationSubscriptions(
    $input: UpdateMyCommunicationSubscriptionsMutationInput!
  ) {
    updateMyCommunicationSubscriptions(input: $input) {
      guardian {
        firstName
        lastName
        language
        hasAcceptedCommunication
      }
    }
  }
`;
export type UpdateMyCommunicationSubscriptionsMutationFn =
  Apollo.MutationFunction<
    UpdateMyCommunicationSubscriptionsMutation,
    UpdateMyCommunicationSubscriptionsMutationVariables
  >;
export type UpdateMyCommunicationSubscriptionsMutationResult =
  Apollo.MutationResult<UpdateMyCommunicationSubscriptionsMutation>;
export type UpdateMyCommunicationSubscriptionsMutationOptions =
  Apollo.BaseMutationOptions<
    UpdateMyCommunicationSubscriptionsMutation,
    UpdateMyCommunicationSubscriptionsMutationVariables
  >;
export const UpdateMyEmailMutationDocument = gql`
  mutation UpdateMyEmailMutation($input: UpdateMyEmailMutationInput!) {
    updateMyEmail(input: $input) {
      myProfile {
        id
        firstName
        lastName
        language
        email
      }
    }
  }
`;
export type UpdateMyEmailMutationMutationFn = Apollo.MutationFunction<
  UpdateMyEmailMutation,
  UpdateMyEmailMutationVariables
>;
export type UpdateMyEmailMutationMutationResult =
  Apollo.MutationResult<UpdateMyEmailMutation>;
export type UpdateMyEmailMutationMutationOptions = Apollo.BaseMutationOptions<
  UpdateMyEmailMutation,
  UpdateMyEmailMutationVariables
>;
export const UpdateMyProfileDocument = gql`
  mutation updateMyProfile($input: UpdateMyProfileMutationInput!) {
    updateMyProfile(input: $input) {
      myProfile {
        id
        firstName
        lastName
        language
        email
        hasAcceptedCommunication
      }
    }
  }
`;
export type UpdateMyProfileMutationFn = Apollo.MutationFunction<
  UpdateMyProfileMutation,
  UpdateMyProfileMutationVariables
>;
export type UpdateMyProfileMutationResult =
  Apollo.MutationResult<UpdateMyProfileMutation>;
export type UpdateMyProfileMutationOptions = Apollo.BaseMutationOptions<
  UpdateMyProfileMutation,
  UpdateMyProfileMutationVariables
>;
export const MyCommunicationSubscriptionsDocument = gql`
  query MyCommunicationSubscriptions($authToken: String) {
    myCommunicationSubscriptions(authToken: $authToken) {
      firstName
      lastName
      language
      hasAcceptedCommunication
    }
  }
`;
export type MyCommunicationSubscriptionsQueryResult = Apollo.QueryResult<
  MyCommunicationSubscriptionsQuery,
  MyCommunicationSubscriptionsQueryVariables
>;
export const ProfileChildrenQueryDocument = gql`
  query profileChildrenQuery {
    myProfile {
      id
      children {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`;
export type ProfileChildrenQueryQueryResult = Apollo.QueryResult<
  ProfileChildrenQuery,
  ProfileChildrenQueryVariables
>;
export const ProfileQueryDocument = gql`
  query profileQuery {
    myProfile {
      ...MyProfileFields
    }
  }
  ${MyProfileFieldsFragmentDoc}
`;
export type ProfileQueryQueryResult = Apollo.QueryResult<
  ProfileQuery,
  ProfileQueryVariables
>;
export const SubmitChildrenAndGuardianDocument = gql`
  mutation submitChildrenAndGuardian(
    $children: [ChildInput!]!
    $guardian: GuardianInput!
  ) {
    submitChildrenAndGuardian(
      input: { children: $children, guardian: $guardian }
    ) {
      ...SubmitChildrenAndGuardianMutationPayloadFields
    }
  }
  ${SubmitChildrenAndGuardianMutationPayloadFieldsFragmentDoc}
`;
export type SubmitChildrenAndGuardianMutationFn = Apollo.MutationFunction<
  SubmitChildrenAndGuardianMutation,
  SubmitChildrenAndGuardianMutationVariables
>;
export type SubmitChildrenAndGuardianMutationResult =
  Apollo.MutationResult<SubmitChildrenAndGuardianMutation>;
export type SubmitChildrenAndGuardianMutationOptions =
  Apollo.BaseMutationOptions<
    SubmitChildrenAndGuardianMutation,
    SubmitChildrenAndGuardianMutationVariables
  >;
