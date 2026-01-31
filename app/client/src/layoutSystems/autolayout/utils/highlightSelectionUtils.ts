import type { HighlightInfo } from "../../common/utils/types";

export interface Point {
  x: number;
  y: number;
}

/**
 * Select the closest highlight to the mouse position (in the direction of the).
 * @param highlights | HighlightInfo[] : all highlights for the current canvas.
 * @param e | any : mouse event.
 * @param val | Point : mouse coordinates.
 * @returns HighlightInfo | undefined
 */
export const getHighlightPayload = (
  highlights: HighlightInfo[],
  // TODO: Fix this the next time the file is edited
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  e: any,
  val?: Point,
): HighlightInfo | undefined => {
  if (!highlights || !highlights.length) return;

  // Current mouse coordinates.
  const pos: Point = {
    x: e ? e.offsetX || e.layerX : val?.x,
    y: e ? e.offsetY || e.layerY : val?.y,
  };
  /**
   * Filter highlights that  span the current mouse position.
   */
  const filteredHighlights = getViableDropPositions(highlights, pos);

  if (!filteredHighlights || !filteredHighlights.length) return;

  // Find the closest highlight without creating a sorted array.
  let minDistance = Infinity;
  let closest = filteredHighlights[0];
  
  for (let i = 0, len = filteredHighlights.length; i < len; i++) {
    const highlight = filteredHighlights[i];
    const distance = calculateDistance(highlight, pos);
    if (distance < minDistance) {
      minDistance = distance;
      closest = highlight;
    }
  }

  // Return the closest highlight.
  return closest;
};

/**
 * Filter highlights based on direction of drag.
 * @param arr | HighlightInfo[] : all highlights for the current canvas.
 * @param pos | Point : current mouse coordinates.
 * @returns HighlightInfo | undefined
 */
function getViableDropPositions(
  arr: HighlightInfo[],
  pos: Point,
): HighlightInfo[] {
  if (!arr) return arr || [];

  const DEFAULT_DROP_RANGE = 10;
  const selection: HighlightInfo[] = [];
  const posX = pos.x;
  const posY = pos.y;

  // Single pass through all highlights, checking vertical and horizontal conditions
  for (let i = 0, len = arr.length; i < len; i++) {
    const highlight = arr[i];
    
    if (highlight.isVertical) {
      const highlightPosY = highlight.posY;
      const highlightPosX = highlight.posX;
      
      if (posY >= highlightPosY && posY <= highlightPosY + highlight.height) {
        const rightBound = highlightPosX + (highlight.dropZone?.right || DEFAULT_DROP_RANGE);
        const leftBound = highlightPosX - (highlight.dropZone?.left || DEFAULT_DROP_RANGE);
        
        if ((posX >= highlightPosX && posX <= rightBound) ||
            (posX < highlightPosX && posX >= leftBound)) {
          selection.push(highlight);
        }
      }
    }
  }
  
  const hasVerticalSelection = selection.length > 0;
  const verticalMultiplier = hasVerticalSelection ? 0.2 : 1;
  const topMultiplier = hasVerticalSelection ? 0.3 : 1;

  // Second pass for horizontal highlights
  for (let i = 0, len = arr.length; i < len; i++) {
    const highlight = arr[i];
    
    if (!highlight.isVertical) {
      const highlightPosX = highlight.posX;
      const highlightPosY = highlight.posY;
      
      if (posX >= highlightPosX && posX <= highlightPosX + highlight.width) {
        const bottomRange = highlight.dropZone?.bottom !== undefined
          ? highlight.dropZone.bottom * verticalMultiplier
          : DEFAULT_DROP_RANGE;
        const topRange = highlight.dropZone?.top !== undefined
          ? highlight.dropZone.top * topMultiplier
          : DEFAULT_DROP_RANGE;
        
        const bottomBound = highlightPosY + bottomRange;
        const topBound = highlightPosY - topRange;
        
        if ((posY >= highlightPosY && posY <= bottomBound) ||
            (posY < highlightPosY && posY >= topBound)) {
          selection.push(highlight);
        }
      }
    }
  }

  return selection;
}

function calculateDistance(a: HighlightInfo, b: Point): number {
  let distX = 0,
    distY = 0;

  if (a.isVertical) {
    distX = b.x - a.posX;

    if (b.y < a.posY) {
      distY = b.y - a.posY;
    } else if (b.y > a.posY + a.height) {
      distY = b.y - (a.posY + a.height);
    } else {
      distY = 0;
    }
  } else {
    distY = b.y - a.posY;

    if (b.x < a.posX) {
      distX = b.x - a.posX;
    } else if (b.x > a.posX + a.width) {
      distX = b.x - (a.posX + a.width);
    } else {
      distX = 0;
    }
  }

  return Math.hypot(distX, distY);
}
