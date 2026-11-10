export interface TireSize {
  normalized: string;
  size: string;
  prefix: string;
  widthMm: number;
  aspectRatio: number;
  construction: string;
  rimInches: number;
  loadIndex: number | null;
  dualLoadIndex: number | null;
  speedSymbol: string | null;
  extraLoad: string | null;
  sidewallMm: number;
  diameterMm: number;
  circumferenceMm: number;
}
export function parseTireSize(value: string): TireSize;
export function compareTireSizes(original: string, candidate: string): {
  original: string; candidate: string; diameterDifferenceMm: number;
  diameterDifferencePercent: number; widthDifferenceMm: number; rimDifferenceInches: number;
};
