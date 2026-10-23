import { faker } from '@faker-js/faker';
import merge from 'lodash/merge';
import mergeWith from 'lodash/mergeWith';

import {
  EventParticipantsPerInvite,
  EventQuery,
  Language,
  ProfileQuery,
} from '../domain/api/generatedTypes/graphql';
import {
  AvailableEvent,
  AvailableOccurrence,
  AvailableVenue,
} from '../domain/event/types/ChildAvailableOccurrencesTypes';
import { OccurrenceNode } from '../domain/event/types/EventQueryTypes';

export type EventQueryEventNode = NonNullable<EventQuery['event']>;
export type ProfileNode = NonNullable<ProfileQuery['myProfile']>;

const replaceArrayCustomizer = (_objValue: unknown, srcValue: unknown) => {
  if (Array.isArray(srcValue)) {
    return srcValue;
  }
};

export const fakeAvailableVenue = (
  overrides?: Partial<AvailableVenue>
): AvailableVenue => {
  return merge<AvailableVenue, typeof overrides>(
    {
      id: faker.string.uuid(),
      name: faker.company.name(),
      address: faker.location.streetAddress(),
    },
    overrides
  );
};

export const fakeAvailableOccurrence = (
  overrides?: Partial<AvailableOccurrence>
): AvailableOccurrence => {
  return merge<AvailableOccurrence, typeof overrides>(
    {
      id: faker.string.uuid(),
      time: faker.date.future().toISOString(),
      remainingCapacity: faker.number.int({ min: 1, max: 20 }),
      occurrenceLanguage: Language.Fi,
      venue: fakeAvailableVenue(),
    },
    overrides
  );
};

export const fakeAvailableEvent = (
  overrides?: Partial<AvailableEvent>
): AvailableEvent => {
  const occurrence = fakeAvailableOccurrence();
  return mergeWith(
    {
      id: faker.string.uuid(),
      name: faker.lorem.words(3),
      shortDescription: faker.lorem.sentence(),
      image: faker.image.url(),
      imageAltText: faker.lorem.words(2),
      duration: 60,
      canChildEnroll: true,
      occurrences: {
        edges: [{ node: occurrence }],
      },
    },
    overrides,
    replaceArrayCustomizer
  );
};

export const fakeOccurrenceNode = (
  overrides?: Partial<OccurrenceNode>
): OccurrenceNode => {
  return merge<OccurrenceNode, typeof overrides>(
    {
      __typename: 'OccurrenceNode',
      id: faker.string.uuid(),
      time: faker.date.future().toISOString(),
      remainingCapacity: faker.number.int({ min: 1, max: 20 }),
      occurrenceLanguage: 'FI',
      ticketSystem: null,
      childHasFreeSpotNotificationSubscription: false,
      event: {
        __typename: 'EventNode',
        id: faker.string.uuid(),
        name: faker.lorem.words(3),
        duration: 60,
      },
      venue: {
        __typename: 'VenueNode',
        id: faker.string.uuid(),
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        postalCode: faker.location.zipCode(),
        city: 'Helsinki',
        description: faker.lorem.sentence(),
        accessibilityInfo: null,
        arrivalInstructions: null,
        wcAndFacilities: null,
        wwwUrl: null,
      },
    } as unknown as OccurrenceNode,
    overrides
  );
};

export const fakeEventNode = (
  overrides?: Partial<EventQueryEventNode>
): EventQueryEventNode => {
  const occ = fakeOccurrenceNode();
  return mergeWith(
    {
      __typename: 'EventNode',
      id: faker.string.uuid(),
      name: faker.lorem.words(3),
      description: faker.lorem.paragraph(),
      shortDescription: faker.lorem.sentence(),
      image: faker.image.url(),
      imageAltText: faker.lorem.words(2),
      participantsPerInvite: EventParticipantsPerInvite.ChildAndGuardian,
      duration: 60,
      capacityPerOccurrence: 20,
      canChildEnroll: true,
      eventGroup: null,
      ticketSystem: null,
      occurrences: {
        __typename: 'OccurrenceNodeConnection',
        edges: [{ __typename: 'OccurrenceNodeEdge', node: occ }],
      },
      allOccurrences: {
        __typename: 'OccurrenceNodeConnection',
        edges: [{ __typename: 'OccurrenceNodeEdge', node: occ }],
      },
    } as unknown as EventQueryEventNode,
    overrides,
    replaceArrayCustomizer
  );
};

export const fakeProfile = (
  overrides?: Record<string, unknown>
): Record<string, unknown> => {
  return merge(
    {
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      children: {
        edges: [
          {
            node: {
              id: faker.string.uuid(),
              name: faker.person.firstName(),
              enrolments: {
                edges: [],
              },
            },
          },
        ],
      },
    },
    overrides
  );
};
