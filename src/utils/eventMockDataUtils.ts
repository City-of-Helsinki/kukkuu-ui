import { faker } from '@faker-js/faker';
import merge from 'lodash/merge';
import mergeWith from 'lodash/mergeWith';

import {
  AccessibilityNode,
  EventParticipantsPerInvite,
  EventQuery,
  ProfileQuery,
  ThemePathFieldsFragment,
  VenueNode,
} from '../domain/api/generatedTypes/graphql';
import {
  AvailableEvent,
  AvailableOccurrence,
  AvailableVenue,
} from '../domain/event/types/EventsSearchTypes';
import { OccurrenceNode } from '../domain/event/types/EventQueryTypes';
import {
  OccurrenceAccessibilityNode,
  OccurrenceLanguageNode,
} from '../domain/event/hooks/useOccurrenceFeatures';

export type EventQueryEventNode = NonNullable<EventQuery['event']>;
export type ProfileNode = NonNullable<ProfileQuery['myProfile']>;

// Realistic sample accessibilities for tests; does not need to stay synced with the database.
const DATABASE_ACCESSIBILITIES = [
  {
    slug: 'sensory_sensitivity',
    name: 'Aistiherkkyys',
    description: 'Aistiherkkyys huomioitu',
    sortOrder: 1,
  },
  {
    slug: 'executive_function',
    name: 'Toiminnanohjauksen tuki',
    description: 'Toiminnanohjauksen tuen tarve huomioitu',
    sortOrder: 2,
  },
  {
    slug: 'vision',
    name: 'Näkemisen tuki',
    description: 'Näkemisen tuen tarve huomioitu',
    sortOrder: 3,
  },
  {
    slug: 'hearing',
    name: 'Kuulemisen tuki',
    description: 'Kuulemisen tuen tarve huomioitu',
    sortOrder: 4,
  },
  {
    slug: 'mobility',
    name: 'Liikkumisrajoitteet',
    description: 'Liikkumisen tuen tarve huomioitu',
    sortOrder: 5,
  },
] as const;

const pickDatabaseAccessibility = (slug?: string) => {
  const matched = slug
    ? DATABASE_ACCESSIBILITIES.find((acc) => acc.slug === slug)
    : undefined;
  return matched ?? faker.helpers.arrayElement(DATABASE_ACCESSIBILITIES);
};

// Realistic sample theme paths for tests; does not need to stay synced with the database.
const DATABASE_THEME_PATHS = [
  {
    slug: 'rhythm',
    name: 'Rytmi',
    description: 'Rytmi-teemapolku koostuu musiikista ja tanssista.',
    sortOrder: 1,
  },
  {
    slug: 'story',
    name: 'Tarina',
    description: 'Tarina-teemapolku tarjoaa teatteria ja sirkusta.',
    sortOrder: 2,
  },
  {
    slug: 'trace',
    name: 'Jälki',
    description:
      'Jälki-teemapolku sisältää visuaalisia taiteita, kulttuuriperintöä ja sanataidetta.',
    sortOrder: 3,
  },
] as const;

const pickDatabaseThemePath = (slug?: string) => {
  const matched = slug
    ? DATABASE_THEME_PATHS.find((tp) => tp.slug === slug)
    : undefined;
  return matched ?? faker.helpers.arrayElement(DATABASE_THEME_PATHS);
};

export const fakeThemePath = (
  overrides?: Partial<ThemePathFieldsFragment>
): ThemePathFieldsFragment => {
  const { slug, name } = pickDatabaseThemePath(overrides?.slug);

  return merge<ThemePathFieldsFragment, typeof overrides>(
    {
      __typename: 'ThemePathNode',
      id: faker.string.uuid(),
      slug,
      name,
    },
    overrides
  );
};

const replaceArrayCustomizer = (_objValue: unknown, srcValue: unknown) => {
  if (Array.isArray(srcValue)) {
    return srcValue;
  }
};

export const fakeOccurrenceLanguage = (
  overrides?: Partial<OccurrenceLanguageNode>
): OccurrenceLanguageNode => {
  const { alpha3, name } = faker.location.language();
  return merge<OccurrenceLanguageNode, typeof overrides>(
    {
      alpha3Code: alpha3,
      name,
    },
    overrides
  );
};

export const fakeOccurrenceAccessibility = (
  overrides?: Partial<OccurrenceAccessibilityNode>
): OccurrenceAccessibilityNode => {
  const { slug, name, sortOrder } = pickDatabaseAccessibility(overrides?.slug);

  return merge<OccurrenceAccessibilityNode, typeof overrides>(
    {
      id: faker.string.uuid(),
      slug,
      name,
      sortOrder,
    },
    overrides
  );
};

export const fakeAccessibilityNode = (
  overrides?: Partial<AccessibilityNode>
): AccessibilityNode => {
  const base = pickDatabaseAccessibility(overrides?.slug);

  return merge<AccessibilityNode, typeof overrides>(
    {
      __typename: 'AccessibilityNode',
      id: faker.string.uuid(),
      ...base,
      translations: [],
    },
    overrides
  );
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

export const fakeVenueNode = (overrides?: Partial<VenueNode>): VenueNode => {
  return merge<VenueNode, typeof overrides>(
    {
      __typename: 'VenueNode',
      id: faker.string.uuid(),
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      description: faker.lorem.sentence(),
      accessibilityInfo: null,
      arrivalInstructions: null,
      wcAndFacilities: null,
      wwwUrl: null,
      additionalInfo: null,
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
      isSystem: false,
      project: null,
      translations: [],
      occurrences: {
        __typename: 'OccurrenceNodeConnection',
        edges: [],
        pageInfo: {
          __typename: 'PageInfo',
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
      },
    },
    overrides
  );
};

export const fakeAvailableOccurrence = (
  overrides?: Partial<AvailableOccurrence>
): AvailableOccurrence => {
  return mergeWith(
    {
      id: faker.string.uuid(),
      time: faker.date.future().toISOString(),
      remainingCapacity: faker.number.int({ min: 1, max: 20 }),
      languages: [{ alpha3Code: 'fin', name: 'suomi' }],
      accessibilities: [],
      venue: fakeAvailableVenue(),
    },
    overrides,
    replaceArrayCustomizer
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
      participantsPerInvite: EventParticipantsPerInvite.ChildAndGuardian,
      enrolmentDeniedReason: null,
      registrationOpensAt: null,
      ticketSystem: null,
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
  return mergeWith(
    {
      __typename: 'OccurrenceNode',
      id: faker.string.uuid(),
      time: faker.date.future().toISOString(),
      remainingCapacity: faker.number.int({ min: 1, max: 20 }),
      languages: [
        { __typename: 'LanguageNode', alpha3Code: 'fin', name: 'suomi' },
      ],
      accessibilities: [],
      ticketSystem: null,
      childHasFreeSpotNotificationSubscription: false,
      event: {
        __typename: 'EventNode',
        id: faker.string.uuid(),
        name: faker.lorem.words(3),
        duration: 60,
        registrationOpensAt: null,
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
    overrides,
    replaceArrayCustomizer
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
      enrolmentDeniedReason: null,
      registrationOpensAt: null,
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
