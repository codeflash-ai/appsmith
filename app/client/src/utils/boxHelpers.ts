export interface Rect {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export const areIntersecting = (r1: Rect, r2: Rect) => {
  const l1 = r1.left;
  const r1r = r1.right;
  const t1 = r1.top;
  const b1 = r1.bottom;

  const l2 = r2.left;
  const r2r = r2.right;
  const t2 = r2.top;
  const b2 = r2.bottom;

  return l2 < r1r && r2r > l1 && t2 < b1 && b2 > t1;
};
