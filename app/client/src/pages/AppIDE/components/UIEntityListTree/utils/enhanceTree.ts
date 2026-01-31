import type { CanvasStructure } from "reducers/uiReducers/pageCanvasStructureReducer";
import type { EntityListTreeItem } from "@appsmith/ads";

export const enhanceItemsTree = (
  items: CanvasStructure[],
  enhancer: (item: CanvasStructure) => EntityListTreeItem,
) => {
  const length = items.length;
  const result = new Array<EntityListTreeItem>(length);

  for (let i = 0; i < length; i++) {
    const child = items[i];
    const enhanced = enhancer(child);

    if (child.children) {
      // Direct assignment avoids spread operator overhead
      result[i] = {
        ...enhanced,
        children: enhanceItemsTree(child.children, enhancer),
      };
    } else {
      result[i] = enhanced;
    }
  }

  return result;
};
