export interface Rect {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export const areIntersecting = (r1: Rect, r2: Rect) => {
  const { left: l1, right: r1r, top: t1, bottom: b1 } = r1;
  const { left: l2, right: r2r, top: t2, bottom: b2 } = r2;

  return l2 < r1r && r2r > l1 && t2 < b1 && b2 > t1;
};
