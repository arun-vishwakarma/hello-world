import { Component } from "@angular/core";
//import { SmbpuiComponent } from './smbpui/smbpui.component';
import { HighchartdemoComponent } from "./highchartdemo/highchartdemo.component";
import { AuthService } from "./shared/services/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title: any = "angular-demo";
  patientObject: any = {};
  birthdate: any;
  mrn: any;
  fname: any;
  lname: any;
  productVersion: any;
  productVersionClass: any;

  constructor(private authService: AuthService) {
    if (!localStorage.getItem("token")) this.authService.getTokenAPI();
  }

  ngOnInit() {
    console.log("getting patient object...");

    this.productVersion =
      this.getCookie("customDate") == "" ? "Production Mode" : "Demo Mode";
    this.productVersionClass =
      this.getCookie("customDate") == "" ? "textProduction" : "textDemo";

    this.patientObject = JSON.parse(this.getCookie("patientObject"));
    console.log(this.patientObject);

    var obj = this.patientObject;
    this.fname = this.patientObject.fname[0];
    if (this.patientObject.fname[1] != undefined) {
      this.fname = this.fname + this.patientObject.fname[1];
    }
    this.lname = this.patientObject.lname;
    this.birthdate = this.patientObject.birthdate;
    this.mrn = this.patientObject.mrn;
  }

  getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
}
declarations: [
  HighchartdemoComponent
  //SmbpuiComponent
];
