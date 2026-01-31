export interface Rect {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export const areIntersecting = (r1: Rect, r2: Rect) => {
  // Check left/right overlap first, with short-circuits to avoid unnecessary property reads.
  const l2 = r2.left;
  const r1r = r1.right;
  if (!(l2 < r1r)) return false;

  const r2r = r2.right;
  const l1 = r1.left;
  if (!(r2r > l1)) return false;

  // Check top/bottom overlap next.
  const t2 = r2.top;
  const b1 = r1.bottom;
  if (!(t2 < b1)) return false;

  const b2 = r2.bottom;
  const t1 = r1.top;
  return b2 > t1;
};
