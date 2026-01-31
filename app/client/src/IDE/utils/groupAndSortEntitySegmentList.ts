import type { EntityItem } from "ee/IDE/Interfaces/EntityItem";
import { groupBy, sortBy } from "lodash";

export type EditorSegmentList<T> = Array<{
  group: string | "NA";
  items: T[];
}>;

export const groupAndSortEntitySegmentList = <T extends EntityItem>(
  items: T[],
): EditorSegmentList<T> => {
  // Group items in a single pass using Map for O(n) complexity
  const groups = new Map<string, T[]>();
  
  for (let i = 0, len = items.length; i < len; i++) {
    const item = items[i];
    const groupKey = item.group || "NA";
    const groupItems = groups.get(groupKey);
    
    if (groupItems) {
      groupItems.push(item);
    } else {
      groups.set(groupKey, [item]);
    }
  }

  // Convert to array and sort items within each group
  const result: EditorSegmentList<T> = [];
  
  for (const [group, groupItems] of groups) {
    // Sort items by title in-place
    groupItems.sort((a, b) => {
      const titleA = a.title;
      const titleB = b.title;
      return titleA < titleB ? -1 : titleA > titleB ? 1 : 0;
    });
    
    result.push({
      group,
      items: groupItems,
    });
  }

  // Entity Segment Lists are sorted alphabetically at both group and item level
  result.sort((a, b) => {
    const groupA = a.group;
    const groupB = b.group;
    return groupA < groupB ? -1 : groupA > groupB ? 1 : 0;
  });

  return result;
};
