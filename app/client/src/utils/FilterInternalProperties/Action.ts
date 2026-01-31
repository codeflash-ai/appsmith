import { entityDefinitions } from "ee/utils/autocomplete/EntityDefinitions";
import type { ActionEntity } from "ee/entities/DataTree/types";
import type { DataTree } from "entities/DataTree/dataTreeTypes";

export const getActionChildrenPeekData = (
  actionName: string,
  dataTree: DataTree,
) => {
  const dataTreeAction = dataTree[actionName] as ActionEntity;

  if (dataTreeAction) {
    const definitions = entityDefinitions.ACTION(dataTreeAction, {});
    const peekData: Record<string, unknown> = {};

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const EMPTY_FN = function () {}; // eslint-disable-next-line @typescript-eslint/no-empty-function

    const keys = Object.keys(definitions);
    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i];
      if (key.indexOf("!") !== -1) continue;

      switch (key) {
        case "data":
        case "isLoading":
        case "responseMeta":
          peekData[key] = dataTreeAction[key];
          break;
        case "run":
        case "clear":
          peekData[key] = EMPTY_FN; // tern inference required here
          break;
        default:
          break;
      }
    }

    return { peekData };
  }
};
