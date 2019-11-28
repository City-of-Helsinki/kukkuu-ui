import { getTranslatedRelationshipOptions } from '../childUtils';
import { CHILD_RELATIONSHIP_OPTIONS } from '../constants/ChildRelationshipConstants';

describe('childUtils', () => {
  test('Verify that getTranslatedRelationshipOptions works', () => {
    const result = getTranslatedRelationshipOptions(
      jest.fn(key => {
        return 'HardcodedLabel';
      })
    );
    const test = CHILD_RELATIONSHIP_OPTIONS.map(row => {
      return {
        label: 'HardcodedLabel',
        value: row.value,
      };
    });
    expect(result).toEqual(test);
  });
});
