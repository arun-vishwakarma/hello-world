import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { forkJoin, Observable } from "rxjs";
import { publishReplay, refCount } from "rxjs/operators";

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class HttpclientService {
  bpData;
  bpValidData;
  bpInvalidData;
  cptData;

  apiUrl: string = environment.apiBaseUrl + ":" + environment.port;
  patients: any = [];
  currentPatient: any;

  configs: Observable<any>;

  constructor(private httpClient: HttpClient) {}

  getPatients() {
    let url = "http://10.131.48.60:8080/smart/enrolees/getAll";

    /* this.httpClient.get(url).subscribe((data) => {
      console.log("patients data api..", data);
      this.patients = data;
    }); */

    return this.httpClient.get(url);
  }

  setPatientData(currentPatientObj: any) {
    this.currentPatient = currentPatientObj;
    console.log("CP..", this.currentPatient);
  }

  getPatientData() {
    return this.currentPatient;
  }

  getAge(birthDateString) {
    const today = new Date();
    const birthDate = new Date(birthDateString);
    const yearsDifference = today.getFullYear() - birthDate.getFullYear();
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      return yearsDifference - 1;
    }
    return yearsDifference;
  }

  getDateRangeData(dateRange, validity, mrn) {
    if (!this.configs) {
      let dateObj = this.getDates(dateRange);
      let url1 =
        this.apiUrl +
        "/smart/patient/observations?mrn=" +
        mrn +
        "&start=" +
        dateObj.start_date +
        "&end=" +
        dateObj.end_date;

      let dateObj2 = this.getDates(30);
      let url2 =
        this.apiUrl +
        "/smart/patient/observationsCPT?mrn=" +
        mrn +
        "&start=" +
        dateObj2.start_date +
        "&end=" +
        dateObj2.end_date;

      let url3 = this.apiUrl + "/smart/getPatents";

      let observation = this.httpClient.get(url1);
      let billing = this.httpClient.get(url2);
      //let patients = this.httpClient.get(url3);

      this.configs = forkJoin([observation, billing]).pipe(
        publishReplay(2), // this tells Rx to cache the latest emitted
        refCount() // and this tells Rx to keep the Observable alive as long as there are any Subscribers
      );
      //return this.bpData;
    }
    return this.configs;
  }

  // Clear configs
  clearCache() {
    this.configs = null;
  }

  getDates(dateRange) {
    var currentDate = new Date();
    var customDateString = currentDate.toISOString().slice(0, 10);
    var customDate =
      this.getCookie("customDate") == ""
        ? customDateString
        : this.getCookie("customDate");

    var end_date = new Date(customDate).toISOString().slice(0, 10);
    var d = new Date(customDate);
    d.setDate(d.getDate() - (dateRange - 1));
    var start_date = d.toISOString().slice(0, 10);
    return { start_date: start_date, end_date: end_date };
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

  getObservationCPT(dateRange, mrn) {
    var dateObj = this.getDates(dateRange);
    //var url = window.location.protocol+'//'+ '10.131.48.60' +':8443/smart/patient/observations?mrn='+mrn+'&start='+dateObj.start_date+'&end='+dateObj.end_date;
    //var url = window.location.protocol+'//'+ '10.131.48.60' +':8080/smart/patient/observations?mrn='+mrn+'&start='+dateObj.start_date+'&end='+dateObj.end_date;
    //var url = 'http://'+ '10.131.129.54' +':8080/smart/patient/observationsCPT?mrn='+mrn+'&start='+dateObj.start_date+'&end='+dateObj.end_date;

    var url =
      this.apiUrl +
      "/smart/patient/observationsCPT?mrn=" +
      mrn +
      "&start=" +
      dateObj.start_date +
      "&end=" +
      dateObj.end_date;

    this.cptData = this.httpClient.get(url);

    return this.cptData;
  }
}
