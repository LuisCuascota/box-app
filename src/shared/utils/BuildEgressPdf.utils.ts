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
  EgressDetail,
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
  if (egressHead.is_transfer) doc.text("X", stX + 136, stY + 28);
  else doc.text("X", stX + 99, stY + 28);

  setText(doc);
  doc.text("COMPROBANTE DE EGRESO", stX + 5, stY + 23);
  doc.text(`Fecha: ${getFormattedDate(egressHead.date)}`, stX + 77, stY + 23);
  doc.text("Efectivo", stX + 77, stY + 28);
  doc.text("Transferencia", stX + 105, stY + 28);
  doc.text(`Beneficiario: ${egressHead.beneficiary}`, stX + 5, stY + 28);

  doc.rect(stX + 98, stY + 24, 5, 5);
  doc.rect(stX + 135, stY + 24, 5, 5);
};

const buildDocTable = (
  doc: jsPDF,
  egressHead: EgressHeader,
  egressDetail: EgressDetail[],
  stX: number,
  stY: number
) => {
  stX += 5;
  stY += 40;
  const cellDescW = 110;
  const cellValueW = 25;
  const cellH = 7;
  const mx = 2;
  const my = 5;

  doc.rect(stX + cellDescW, stY - 7, cellValueW, cellH);

  doc.text("Se recibe por concepto de:", stX, stY - 4);
  doc.text("VALOR", stX + cellDescW + mx + 3, stY - 2);

  egressDetail.forEach((option) => {
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
  doc.text(egressHead.amount.toString(), stX + cellDescW + mx, stY + my);
  setText(doc, FontEnum.HELVETICA, FontStyleEnum.BOLD);
  doc.text("TOTAL $=", stX + 84, stY + my);
  setText(doc);
};

const buildDocFooter = (doc: jsPDF, stX: number, stY: number) => {
  stY += 88;
  doc.line(stX + 10, stY + 10, stX + 50, stY + 10);
  doc.line(stX + 54, stY + 10, stX + 94, stY + 10);
  doc.line(stX + 99, stY + 10, stX + 139, stY + 10);
  doc.line(stX + 105, stY + 15, stX + 139, stY + 15);

  doc.text("Presidencia", getCenter(10, "H"), stY, undefined, "center");
  doc.text("Tesorería", getCenter(4, "H"), stY, undefined, "center");
  doc.text("Beneficiario", getCenter(10, "H") * 4, stY, undefined, "center");
  doc.text("C.I.", stX + 99, stY + 15);
};

const buildDocComplements = (doc: jsPDF) => {
  doc.setLineDashPattern([2, 2], 1);
  doc.line(getCenter(2, "H"), 0, getCenter(2, "H"), 210);
  doc.line(0, getCenter(2, "V"), getCenter(2, "H"), getCenter(2, "V"));
  //doc.line(getCenter(2, "H"), getCenter(2, "V"), 297, getCenter(2, "V"));

  doc.setTextColor(150);
  doc.setFontSize(110);
  doc.setGState(doc.GState({ opacity: 0.5 }));
  doc.text("COPIA", 40, 210, undefined, 45);
  //doc.text("COPIA", 185, 210, undefined, 45);
};

export const buildEgressPDFDoc = (newEgress: NewEgress) => {
  const doc = new jsPDF("l", "mm", "A4");

  buildDocHeader(doc, newEgress.header, 0, 0);
  buildDocHeader(doc, newEgress.header, 0, getCenter(2, "V"));
  buildDocTable(doc, newEgress.header, newEgress.detail, 0, 0);
  buildDocTable(doc, newEgress.header, newEgress.detail, 0, getCenter(2, "V"));
  buildDocFooter(doc, 0, 0);

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
