export interface LayoutItem {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate?: number;
  radius?: number;
  zIndex?: number;
}

export type Layout = LayoutItem[];