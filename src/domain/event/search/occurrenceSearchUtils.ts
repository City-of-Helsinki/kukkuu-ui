import type {
  ChildAvailableOccurrencesQuery,
  FlattenedOccurrenceItem,
} from '../types/ChildAvailableOccurrencesTypes';

export const flattenAvailableOccurrences = (
  child?: ChildAvailableOccurrencesQuery['child'] | null
): FlattenedOccurrenceItem[] => {
  if (!child?.availableEvents?.edges) {
    return [];
  }

  const items: FlattenedOccurrenceItem[] = [];

  for (const eventEdge of child.availableEvents.edges) {
    const event = eventEdge?.node;
    if (!event || !event.occurrences?.edges) {
      continue;
    }

    for (const occurrenceEdge of event.occurrences.edges) {
      const occurrence = occurrenceEdge?.node;
      if (!occurrence) {
        continue;
      }
      items.push({ event, occurrence });
    }
  }

  return items.sort((a, b) => {
    const timeA = new Date(a.occurrence.time).getTime();
    const timeB = new Date(b.occurrence.time).getTime();
    return timeA - timeB;
  });
};

export const isOccurrenceEnrollable = (
  item: FlattenedOccurrenceItem
): boolean => {
  if (!item.event.canChildEnroll) {
    return false;
  }
  if (item.occurrence.remainingCapacity === 0) {
    return false;
  }
  return true;
};
