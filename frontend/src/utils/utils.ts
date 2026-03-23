/**
 * Clamp a numeric value between min and max bounds.
 */
export const clamp = (value: number, min = 0, max = 1): number =>
  Math.max(min, Math.min(max, value));
