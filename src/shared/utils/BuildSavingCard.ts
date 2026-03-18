import { jsPDF } from "jspdf";
import printJS from "print-js";
import Logo from "../../assets/caja_logo.png";
import { FontColorEnum, FontEnum, FontStyleEnum, getCenter, setText } from "./pdf.utils";
import { PartnerData } from "../../store/interfaces/PartnerState.interfaces.ts";
import { ContributionProcessed } from "../../components/modals/PartnerSavingList/state/usePartnerSavingListState.tsx";

const MARGIN = 5;
const STX = getCenter(2, "H") + MARGIN; // x inicial de la mitad derecha
const END_X = 297 - MARGIN; // x final de la página
const CONTENT_W = END_X - STX; // ancho disponible en la mitad derecha

// Anchos de columnas (suma = CONTENT_W = 138.5mm)
const COL_FECHA = 25;
const COL_DESC = 54;
const COL_VOUCHER = 22;
const COL_VALUE = 19;
const COL_TOTAL = CONTENT_W - COL_FECHA - COL_DESC - COL_VOUCHER - COL_VALUE;

const ROW_H = 6;

const buildDivider = (doc: jsPDF) => {
  doc.setLineDashPattern([2, 2], 1);
  doc.line(getCenter(2, "H"), 0, getCenter(2, "H"), 210);
  doc.setLineDashPattern([], 0);
};

const buildCardHeader = (doc: jsPDF, partner: PartnerData) => {
  // Logo
  doc.addImage(Logo, "PNG", STX, 4, 18, 18);

  // Nombre institución centrado en la mitad derecha
  const centerX = STX + CONTENT_W / 2;
  setText(doc, FontEnum.HELVETICA, FontStyleEnum.BOLD, 11);
  doc.text("CAJA COMUNAL CEPO DE ORO", centerX, 11, undefined, "center");
  setText(doc, FontEnum.TIMES, FontStyleEnum.ITALIC, 10);
  doc.text("Sembrando para el futuro", centerX, 16, undefined, "center");
  setText(doc, FontEnum.HELVETICA, FontStyleEnum.BOLD, 10);
  doc.text("LIBRETA DE AHORROS", centerX, 22, undefined, "center");

  // Fila 1: nombre a la izquierda, N° cuenta a la derecha
  setText(doc, FontEnum.HELVETICA, FontStyleEnum.NORMAL, 9);
  doc.text("Socio:", STX, 30);
  setText(doc, FontEnum.HELVETICA, FontStyleEnum.BOLD, 9);
  doc.text(`${partner.names} ${partner.surnames}`, STX + 13, 30);

  setText(doc, FontEnum.HELVETICA, FontStyleEnum.NORMAL, 9);
  doc.text("N° Cuenta:", END_X - 30, 30);
  setText(doc, FontEnum.HELVETICA, FontStyleEnum.BOLD, 9, FontColorEnum.RED);
  doc.text(`${partner.number ?? ""}`, END_X, 30, undefined, "right");

  // Fila 2: cédula a la izquierda (debajo del nombre)
  setText(doc, FontEnum.HELVETICA, FontStyleEnum.NORMAL, 9);
  doc.text("Cédula:", STX, 36);
  setText(doc, FontEnum.HELVETICA, FontStyleEnum.BOLD, 9);
  doc.text(partner.dni, STX + 13, 36);
};

const buildTableHeader = (doc: jsPDF, stY: number) => {
  setText(doc, FontEnum.HELVETICA, FontStyleEnum.BOLD, 7);

  let x = STX;
  doc.rect(x, stY, COL_FECHA, ROW_H);
  doc.text("Fecha", x + 2, stY + 4);

  x += COL_FECHA;
  doc.rect(x, stY, COL_DESC, ROW_H);
  doc.text("Descripción", x + 2, stY + 4);

  x += COL_DESC;
  doc.rect(x, stY, COL_VOUCHER, ROW_H);
  doc.text("Comprobante", x + 2, stY + 4);

  x += COL_VOUCHER;
  doc.rect(x, stY, COL_VALUE, ROW_H);
  doc.text("Valor", x + 2, stY + 4);

  x += COL_VALUE;
  doc.rect(x, stY, COL_TOTAL, ROW_H);
  doc.text("Total", x + 2, stY + 4);
};

const buildFirstRow = (doc: jsPDF, stY: number, item: ContributionProcessed) => {
  setText(doc, FontEnum.HELVETICA, FontStyleEnum.NORMAL, 7);
  let x = STX;

  doc.rect(x, stY, COL_FECHA, ROW_H);
  doc.text(item.date, x + 2, stY + 4);
  x += COL_FECHA;

  doc.rect(x, stY, COL_DESC, ROW_H);
  doc.text(item.description, x + 2, stY + 4);
  x += COL_DESC;

  doc.rect(x, stY, COL_VOUCHER, ROW_H);
  doc.text(`${item.entryNumber}`, x + 2, stY + 4);
  x += COL_VOUCHER;

  doc.rect(x, stY, COL_VALUE, ROW_H);
  doc.text(`${item.value}`, x + 2, stY + 4);
  x += COL_VALUE;

  doc.rect(x, stY, COL_TOTAL, ROW_H);
  setText(doc, FontEnum.HELVETICA, FontStyleEnum.BOLD, 7);
  doc.text(`${item.accumulate}`, x + 2, stY + 4);
};

const buildEmptyRows = (doc: jsPDF, startY: number, rowCount: number) => {
  setText(doc, FontEnum.HELVETICA, FontStyleEnum.NORMAL, 8);

  for (let i = 0; i < rowCount; i++) {
    const y = startY + i * ROW_H;
    let x = STX;

    doc.rect(x, y, COL_FECHA, ROW_H);
    x += COL_FECHA;
    doc.rect(x, y, COL_DESC, ROW_H);
    x += COL_DESC;
    doc.rect(x, y, COL_VOUCHER, ROW_H);
    x += COL_VOUCHER;
    doc.rect(x, y, COL_VALUE, ROW_H);
    x += COL_VALUE;
    doc.rect(x, y, COL_TOTAL, ROW_H);
  }
};

export const buildSavingCard = (
  partner: PartnerData,
  lastContribution?: ContributionProcessed
) => {
  const doc = new jsPDF("l", "mm", "A4");

  // ── Página 1: mitad izquierda vacía, mitad derecha con encabezado + tabla ──
  buildDivider(doc);
  buildCardHeader(doc, partner);

  const tableStartY1 = 42;
  buildTableHeader(doc, tableStartY1);

  let dataRowsOffset = 0;
  if (lastContribution) {
    buildFirstRow(doc, tableStartY1 + ROW_H, lastContribution);
    dataRowsOffset = 1;
  }

  // Filas vacías restantes
  const rowsPage1 =
    Math.floor((210 - tableStartY1 - ROW_H - MARGIN) / ROW_H) - dataRowsOffset;
  buildEmptyRows(doc, tableStartY1 + ROW_H * (1 + dataRowsOffset), rowsPage1);

  // ── Página 2: mitad izquierda vacía, mitad derecha solo con tabla ──
  doc.addPage();
  buildDivider(doc);

  const tableStartY2 = 10;
  buildTableHeader(doc, tableStartY2);

  const rowsPage2 = Math.floor((210 - tableStartY2 - ROW_H - MARGIN) / ROW_H);
  buildEmptyRows(doc, tableStartY2 + ROW_H, rowsPage2);

  printJS(URL.createObjectURL(doc.output("blob")));
};