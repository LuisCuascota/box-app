import { jsPDF } from "jspdf";
import printJS from "print-js";
import Logo from "../../assets/caja_logo.png";
import {
  FontColorEnum,
  FontEnum,
  FontStyleEnum,
  getCenter,
  setText,
} from "./pdf.utils";
import { getFormattedDate } from "./Date.utils.ts";
import {
  NewEntry,
  EntryHeader,
} from "../../store/interfaces/EntryState.interfaces.ts";

const buildDocHeader = (doc: jsPDF, entryHead: EntryHeader, stX: number) => {
  doc.addImage(Logo, "PNG", stX, 5, 20, 20);

  setText(doc, FontEnum.HELVETICA, FontStyleEnum.BOLD, 16);
  doc.text(
    "CAJA COMUNAL CEPO DE ORO",
    stX + getCenter(4, "H"),
    15,
    undefined,
    "center"
  );
  setText(doc, FontEnum.TIMES, FontStyleEnum.ITALIC, 16);
  doc.text(
    "Sembrando para el futuro",
    stX + getCenter(4, "H"),
    20,
    undefined,
    "center"
  );
  setText(doc, FontEnum.HELVETICA, FontStyleEnum.BOLD, 12, FontColorEnum.RED);
  doc.text(`Nº${entryHead.number}`, stX + 115, 30);

  setText(doc);
  doc.text("COMPROBANTE DE INGRESO", stX, 30);
  doc.text(`Nº Cuenta: ${entryHead.account_number}`, stX, 36);
  doc.text(`Socio: ${entryHead.names} ${entryHead.surnames ?? ""}`, stX, 42);
};

const buildDocTable = (doc: jsPDF, entry: NewEntry, stX: number) => {
  let stY = 52;
  const cellDescW = 105;
  const cellValueW = 25;
  const cellH = 7;
  const mx = 2;
  const my = 5;

  doc.rect(stX + cellDescW, stY - 7, cellValueW, cellH);

  doc.text("Se recibe por concepto de:", stX, stY - 4);
  doc.text("VALOR", stX + cellDescW + mx + 3, stY - 2);

  entry.detail.forEach((option) => {
    doc.rect(stX, stY, cellDescW, cellH);
    doc.rect(stX + cellDescW, stY, cellValueW, cellH);
    doc.text(option.description!, stX + mx, stY + my);
    doc.text(
      option.value ? option.value.toString() : "0",
      stX + mx + cellDescW,
      stY + my
    );
    stY += cellH;
  });

  doc.rect(stX + cellDescW, stY, cellValueW, cellH);
  setText(doc, FontEnum.HELVETICA, FontStyleEnum.BOLD);
  doc.text(`$${entry.header.amount}`, stX + cellDescW + mx, stY + my);
  doc.text("TOTAL: ", stX + 88, stY + my);
  stY += cellH;
  doc.rect(stX + cellDescW, stY, cellValueW, cellH);
  setText(doc);
  doc.text(`$${entry.billDetail.cash}`, stX + cellDescW + mx, stY + my);
  setText(doc, FontEnum.HELVETICA, FontStyleEnum.BOLD);
  doc.text("Efectivo: ", stX + 86, stY + my);
  stY += cellH;
  doc.rect(stX + cellDescW, stY, cellValueW, cellH);
  setText(doc);
  doc.text(`$${entry.billDetail.transfer}`, stX + cellDescW + mx, stY + my);
  setText(doc, FontEnum.HELVETICA, FontStyleEnum.BOLD);
  doc.text("Transferencia: ", stX + 75, stY + my);
  setText(doc);

  doc.text(
    `Lugar: ${entry.header.place}, Fecha: ${getFormattedDate(
      entry.header.date
    )}`,
    stX,
    135
  );
};

const buildDocFooter = (doc: jsPDF) => {
  doc.line(15, 180, 60, 180);
  doc.line(88, 180, 133, 180);
  doc.text("TESORERIA", 37, 185, undefined, "center");
  doc.text("PRESIDENCIA", 111, 185, undefined, "center");
};

const buildDocComplements = (doc: jsPDF) => {
  doc.setLineDashPattern([2, 2], 1);
  doc.line(getCenter(2, "H"), 0, getCenter(2, "H"), 210);

  doc.setTextColor(150);
  doc.setFontSize(140);
  doc.setGState(doc.GState({ opacity: 0.5 }));
  doc.text("COPIA", 180, 160, undefined, 45);
};

export const buildEntryPDFDoc = (newEntry: NewEntry) => {
  const doc = new jsPDF("l", "mm", "A4");
  const stX = 10;

  buildDocHeader(doc, newEntry.header, stX);
  buildDocHeader(doc, newEntry.header, getCenter(2, "H") + stX);
  buildDocTable(doc, newEntry, stX);
  buildDocTable(doc, newEntry, getCenter(2, "H") + stX);
  buildDocFooter(doc);
  buildDocComplements(doc);

  printJS(URL.createObjectURL(doc.output("blob")));
};
