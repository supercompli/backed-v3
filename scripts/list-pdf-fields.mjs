import { PDFDocument } from "pdf-lib";
import { readFile } from "fs/promises";

const bytes = await readFile("forms/iTOOPIForm_IT.pdf");
const pdf = await PDFDocument.load(bytes);
const form = pdf.getForm();
const fields = form.getFields();
for (const f of fields) {
  const type = f.constructor.name;
  let extra = "";
  if (type === "PDFRadioGroup") {
    extra = ` options=${JSON.stringify(f.getOptions())}`;
  }
  console.log(`${type}\t${f.getName()}${extra}`);
}
console.log("TOTAL:", fields.length);
