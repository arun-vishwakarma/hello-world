import { Component } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ModalComponent } from "./modal/modal.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "angular-test";
  openModal: boolean = false;

  closeResult: string;
  constructor(private modalService: NgbModal) {}

  open(content) {
    /*  this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      ); */

    this.modalService.open(content);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with eee: ${reason}`;
    }
  }

  openM(content) {
    this.openModal = true;
    //this.modalService.open(content);
    const modalRef = this.modalService.open(ModalComponent);
    //modalRef.componentInstance.name = "World";  //not must
  }
}
