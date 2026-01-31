import type { UpdatePropertyArgs } from "sagas/WidgetBlueprintSagas";

/**
 * Util method that makes it easier
 * and takes in readable updates and converts them to blueprint updates
 * @param widgetUpdates
 * @returns
 */
export function getWidgetBluePrintUpdates(widgetUpdates: {
  // TODO: Fix this the next time the file is edited
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}): UpdatePropertyArgs[] {
  const widgetIds = Object.keys(widgetUpdates);

  const updates: UpdatePropertyArgs[] = [];

  // Use index-based loops and cache lengths to reduce iterator/allocation overhead
  for (let i = 0, idsLen = widgetIds.length; i < idsLen; i++) {
    const widgetId = widgetIds[i];
    const updateProps = widgetUpdates[widgetId];

    if (updateProps) {
      const propertyNames = Object.keys(updateProps);

      for (let j = 0, propLen = propertyNames.length; j < propLen; j++) {
        const propertyName = propertyNames[j];
        updates.push({
          widgetId: widgetId,
          propertyName: propertyName,
          propertyValue: updateProps[propertyName],
        });
      }
    }
  }

  return updates;
}
