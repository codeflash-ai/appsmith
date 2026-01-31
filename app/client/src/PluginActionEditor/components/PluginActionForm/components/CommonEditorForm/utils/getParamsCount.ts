import type { Property } from "entities/Action";
import getValidProperties from "./getValidProperties";

function getParamsCount(
  actionParams?: Property[],
  datasourceParams?: Property[],
) {
  let count = 0;

  if (Array.isArray(actionParams)) {
    for (let i = 0, len = actionParams.length; i < len; i++) {
      // Accessing .key directly to preserve original behavior (will throw if element is undefined)
      const k = (actionParams[i] as any).key;
      if (k && k !== "") {
        count++;
      }
    }
  }

  if (Array.isArray(datasourceParams)) {
    for (let i = 0, len = datasourceParams.length; i < len; i++) {
      // Accessing .key directly to preserve original behavior (will throw if element is undefined)
      const k = (datasourceParams[i] as any).key;
      if (k && k !== "") {
        count++;
      }
    }
  }

  return count;
}

export default getParamsCount;
