export interface Point {
  x: number;
  y: number;
}

export function pointAdd(a: Point, b: Point): Point {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function rectCenter(rect: Rect, relative = false): Point {
  if (relative) {
    return {
      x: rect.width / 2,
      y: rect.height / 2,
    };
  } else {
    return {
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2,
    };
  }
}
