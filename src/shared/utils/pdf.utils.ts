import { jsPDF } from "jspdf";

export enum FontEnum {
  HELVETICA = "helvetica",
  TIMES = "times",
}

export enum FontStyleEnum {
  NORMAL = "normal",
  BOLD = "bold",
  ITALIC = "italic",
  BOLD_ITALIC = "bolditalic",
}

export enum FontColorEnum {
  RED = "red",
  BLACK = "black",
}

export const getCenter = (
  multiplicity: number,
  orientation: "H" | "V"
): number => (orientation === "H" ? 297 / multiplicity : 210 / multiplicity);

export const setText = (
  doc: jsPDF,
  font: FontEnum = FontEnum.HELVETICA,
  style: FontStyleEnum = FontStyleEnum.NORMAL,
  size: number = 12,
  color: FontColorEnum = FontColorEnum.BLACK
) => {
  doc.setFont(font, style);
  doc.setTextColor(color);
  doc.setFontSize(size);
};
