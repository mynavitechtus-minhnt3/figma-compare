// Type definitions for the Figma Compare API

export type BoundingBox = [number, number, number, number]; // [y1, x1, y2, x2]

export type BugSeverity = "High" | "Medium" | "Low";

export type BugType = 
  | "Missing_Extra_Element"
  | "Typography"
  | "Content_Mismatch"
  | "Color_Mismatch"
  | "Color_Accessibility"
  | "Spacing_Mismatch"
  | "Size_Mismatch"
  | "Alignment_Mismatch"
  | "Layout";

export interface Bug {
  id: number;
  type: BugType;
  severity: BugSeverity;
  description: string;
  bounding_box: BoundingBox;
}

export interface ComparisonResult {
  analysis_log: string;
  is_pass: boolean;
  total_bugs: number;
  bugs: Bug[];
}
