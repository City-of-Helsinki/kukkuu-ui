import { faker } from '@faker-js/faker';

import { ChildNotesByIdQuery } from '../../api/generatedTypes/graphql';

export const fakeChildNotes = (
  childId: string
): NonNullable<ChildNotesByIdQuery['childNotes']> => ({
  childId,
  notes: faker.lorem.paragraph(),
});
