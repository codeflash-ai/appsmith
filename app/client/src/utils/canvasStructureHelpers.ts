import { pick } from "lodash";

import type {
  CanvasStructure,
  DSL,
} from "reducers/uiReducers/pageCanvasStructureReducer";
import type {
  CanvasWidgetStructure,
  FlattenedWidgetProps,
} from "WidgetProvider/types";
import { WIDGET_DSL_STRUCTURE_PROPS } from "constants/WidgetConstants";

interface DenormalizeOptions {
  widgetTypeForHaltingRecursion?: string;
}

export const compareAndGenerateImmutableCanvasStructure = (
  original: CanvasStructure,
  current: DSL,
) => {
  const newStructure = getCanvasStructureFromDSL(current);

  if (JSON.stringify(newStructure) === JSON.stringify(original)) {
    return original;
  }

  return newStructure;
};

export const getCanvasStructureFromDSL = (dsl: DSL): CanvasStructure => {
  let children = dsl.children;
  let structureChildren: CanvasStructure[] | undefined = undefined;

  // Todo(abhinav): abstraction leak
  if (dsl.type === "TABS_WIDGET") {
    if (children && children.length > 0) {
      const len = children.length;
      const out = new Array<CanvasStructure>(len);
      for (let i = 0; i < len; i++) {
        const childTab = children[i];
        out[i] = {
          widgetName: childTab.tabName,
          widgetId: childTab.widgetId,
          type: "TABS_WIDGET",
          children: childTab.children,
        };
      }
      structureChildren = out;
    }
  } else if (children && children.length === 1) {
    if (children[0].type === "CANVAS_WIDGET") {
      children = children[0].children;
    }
  }

  let mappedChildren: CanvasStructure[] | undefined;
  if (structureChildren) {
    mappedChildren = structureChildren;
  } else if (children) {
    const len = children.length;
    // Only allocate a result array when there are truthy children
    const temp: CanvasStructure[] = [];
    for (let i = 0; i < len; i++) {
      const ch = children[i];
      if (ch) {
        temp.push(getCanvasStructureFromDSL(ch));
      }
    }
    mappedChildren = temp;
  } else {
    mappedChildren = undefined;
  }

  return {
    widgetId: dsl.widgetId,
    widgetName: dsl.widgetName,
    type: dsl.type,
    children: mappedChildren,
  };
};

/**
 * Generate dsl type skeletal structure from widgets
 * @param rootWidgetId
 * @param widgets
 * @returns
 */
export function denormalize(
  rootWidgetId: string,
  widgets: Record<string, FlattenedWidgetProps>,
  options?: DenormalizeOptions,
): CanvasWidgetStructure {
  const { widgetTypeForHaltingRecursion } = options || {};
  const rootWidget = widgets[rootWidgetId];
  let children;

  /**
   * For certain widget, we do not want to denormalize further,
   * like for the List v2, where a another inner list widget is encountered
   * we would want to halt the recursion.
   *  */
  if (widgetTypeForHaltingRecursion !== rootWidget?.type) {
    children = (rootWidget?.children || []).map((childId) =>
      denormalize(childId, widgets, options),
    );
  }

  const staticProps = Object.keys(WIDGET_DSL_STRUCTURE_PROPS);

  const structure = pick(rootWidget, staticProps) as CanvasWidgetStructure;

  structure.children = children;

  return structure;
}
