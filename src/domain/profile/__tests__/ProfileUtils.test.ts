import { normalizeProfileChild } from '../ProfileUtil';
import { RelationshipTypeEnum } from '../../api/generatedTypes/globalTypes';
import { childByIdQuery_child as ChildByIdResponse } from '../../api/generatedTypes/childByIdQuery';

describe('ProfileUtils', () => {
  describe('normalizeProfileChild', () => {
    test('input a fetched child and return a child for mutation', () => {
      const child: ChildByIdResponse = {
        id: 'foo',
        firstName: 'foo',
        lastName: 'bar',
        birthdate: '2020-01-01',
        postalCode: '00100',
        project: {
          id: '1',
          year: 2020,
          name: 'Project name',
        },
        occurrences: {
          edges: [],
        },
        upcomingEventsAndEventGroups: {
          edges: [],
        },
        pastEvents: {
          edges: [],
        },
        relationships: {
          edges: [
            {
              node: {
                id: '1',
                type: RelationshipTypeEnum.PARENT,
              },
            },
          ],
        },
      };

      // Have relationship and homeCity autofill
      const expected = {
        id: 'foo',
        firstName: 'foo',
        lastName: 'bar',
        homeCity: 'Helsinki',
        birthdate: '2020-01-01',
        postalCode: '00100',
        project: { id: '1', name: 'Project name', year: 2020 },
        occurrences: { edges: [] },
        upcomingEventsAndEventGroups: { edges: [] },
        pastEvents: { edges: [] },
        relationship: {
          type: 'PARENT',
        },
      };

      const outputChild = normalizeProfileChild(child);

      expect(outputChild).toEqual(expected);
    });
  });
});
