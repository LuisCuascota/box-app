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
  EgressHeader,
  NewEgress,
} from "../../store/interfaces/EgressState.interfaces.ts";

const buildDocHeader = (
  doc: jsPDF,
  egressHead: EgressHeader,
  stX: number,
  stY: number
) => {
  doc.addImage(Logo, "PNG", stX + 5, stY + 0, 20, 20);

  setText(doc, FontEnum.HELVETICA, FontStyleEnum.BOLD, 16);
  doc.text(
    "CAJA COMUNAL CEPO DE ORO",
    stX + getCenter(4, "H"),
    stY + 10,
    undefined,
    "center"
  );
  setText(doc, FontEnum.TIMES, FontStyleEnum.ITALIC, 16);
  doc.text(
    "Sembrando para el futuro",
    stX + getCenter(4, "H"),
    stY + 15,
    undefined,
    "center"
  );
  setText(doc, FontEnum.HELVETICA, FontStyleEnum.BOLD, 12, FontColorEnum.RED);
  doc.text(`Nº${egressHead.number}`, stX + 130, stY + 23);

  setText(doc);
  doc.text("COMPROBANTE DE EGRESO", stX + 5, stY + 23);
  doc.text(`Fecha: ${getFormattedDate(egressHead.date)}`, stX + 77, stY + 23);
  doc.text(`Beneficiario: ${egressHead.beneficiary}`, stX + 5, stY + 28);
};

const buildDocTable = (
  doc: jsPDF,
  egress: NewEgress,
  stX: number,
  stY: number
) => {
  stX += 5;
  stY += 37;
  const cellDescW = 110;
  const cellValueW = 25;
  const cellH = 7;
  const mx = 2;
  const my = 5;

  doc.rect(stX + cellDescW, stY - 7, cellValueW, cellH);

  doc.text("Se recibe por concepto de:", stX, stY - 4);
  doc.text("VALOR", stX + cellDescW + mx + 3, stY - 2);

  egress.detail.forEach((option) => {
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
  doc.text(`$${egress.header.amount}`, stX + cellDescW + mx, stY + my);
  doc.text("TOTAL: ", stX + 88, stY + my);
  stY += cellH;
  doc.rect(stX + cellDescW, stY, cellValueW, cellH);
  setText(doc);
  doc.text(`$${egress.billDetail.cash}`, stX + cellDescW + mx, stY + my);
  setText(doc, FontEnum.HELVETICA, FontStyleEnum.BOLD);
  doc.text("Efectivo: ", stX + 86, stY + my);
  stY += cellH;
  doc.rect(stX + cellDescW, stY, cellValueW, cellH);
  setText(doc);
  doc.text(`$${egress.billDetail.transfer}`, stX + cellDescW + mx, stY + my);
  setText(doc, FontEnum.HELVETICA, FontStyleEnum.BOLD);
  doc.text("Transferencia: ", stX + 75, stY + my);
  setText(doc);
  setText(doc);
};

const buildDocFooter = (doc: jsPDF, stX: number, stY: number) => {
  stY += 88;
  doc.line(stX + 10, stY + 10, stX + 50, stY + 10);
  doc.line(stX + 54, stY + 10, stX + 94, stY + 10);
  doc.line(stX + 99, stY + 10, stX + 139, stY + 10);
  doc.line(stX + 105, stY + 15, stX + 139, stY + 15);

  doc.text("Presidencia", stX + getCenter(10, "H"), stY, undefined, "center");
  doc.text("Tesorería", stX + getCenter(4, "H"), stY, undefined, "center");
  doc.text(
    "Beneficiario",
    stX + getCenter(10, "H") * 4,
    stY,
    undefined,
    "center"
  );
  doc.text("C.I.", stX + 99, stY + 15);
};

const buildDocComplements = (doc: jsPDF) => {
  doc.setLineDashPattern([2, 2], 1);
  doc.line(getCenter(2, "H"), 0, getCenter(2, "H"), 210);
  //doc.line(0, getCenter(2, "V"), getCenter(2, "H"), getCenter(2, "V"));
  doc.line(getCenter(2, "H"), getCenter(2, "V"), 297, getCenter(2, "V"));

  doc.setTextColor(150);
  doc.setFontSize(110);
  doc.setGState(doc.GState({ opacity: 0.5 }));
  doc.text("COPIA", 190, 210, undefined, 45);
};

export const buildEgressPDFDoc = (newEgress: NewEgress) => {
  const doc = new jsPDF("l", "mm", "A4");

  buildDocHeader(doc, newEgress.header, getCenter(2, "H"), 0);
  buildDocHeader(doc, newEgress.header, getCenter(2, "H"), getCenter(2, "V"));
  buildDocTable(doc, newEgress, getCenter(2, "H"), 0);
  buildDocTable(doc, newEgress, getCenter(2, "H"), getCenter(2, "V"));
  buildDocFooter(doc, getCenter(2, "H"), 0);

  /*buildDocHeader(doc, newEgress.header, getCenter(2, "H"), 0);
  buildDocHeader(doc, newEgress.header, getCenter(2, "H"), getCenter(2, "V"));
  buildDocTable(doc, newEgress.header, newEgress.detail, getCenter(2, "H"), 0);
  buildDocTable(
    doc,
    newEgress.header,
    newEgress.detail,
    getCenter(2, "H"),
    getCenter(2, "V")
  );
  buildDocFooter(doc, getCenter(2, "H"), 0);*/

  buildDocComplements(doc);

  printJS(URL.createObjectURL(doc.output("blob")));
};
