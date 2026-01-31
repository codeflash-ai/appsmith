import type { Property } from "entities/Action";
import getValidProperties from "./getValidProperties";

function getParamsCount(
  actionParams?: Property[],
  datasourceParams?: Property[],
) {
  let count = 0;

  if (Array.isArray(actionParams)) {
    for (let i = 0; i < actionParams.length; i++) {
      if (actionParams[i].key && actionParams[i].key !== "") {
        count++;
      }
    }
  }

  if (Array.isArray(datasourceParams)) {
    for (let i = 0; i < datasourceParams.length; i++) {
      if (datasourceParams[i].key && datasourceParams[i].key !== "") {
        count++;
      }
    }
  }

  return count;
}

export default getParamsCount;
