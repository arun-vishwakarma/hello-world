import { Component, ElementRef, ViewChild } from "@angular/core";

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import * as jsPDF from "jspdf";
import html2canvas from "html2canvas";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  constructor() {}

  title = "ng-test";

  generatePdf() {
    let contData = document.getElementById("cont-area").innerHTML;
    const documentDefinition = {
      content: contData
    };
    pdfMake.createPdf(documentDefinition).open();
  }

  @ViewChild("content", { static: false }) content: ElementRef;

  makePdf() {
    /* let doc = new jsPDF();
    doc.addHTML(this.content.nativeElement, function() {
      doc.save("obrz.pdf");
    }); */

    html2canvas(document.getElementById("content") as HTMLElement).then(
      canvas => {
        let pdf = new jsPDF("p", "mm", "a4");
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 211, 298);
        pdf.save("a.pdf");
      }
    );
  }

  public captureScreen() {
    var data = document.getElementById("content");
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL("image/png");
      let pdf = new jsPDF("p", "mm", "a4"); // A4 size page of PDF //1st parameter (landscape or portrait) determines what becomes the width and the height.
      var leftPosition = 10;
      var topPosition = 10;
      pdf.addImage(
        contentDataURL,
        "PNG",
        leftPosition,
        topPosition,
        imgWidth,
        imgHeight
      );
      pdf.save("MYPdf.pdf"); // Generated PDF
    });
  }
}
