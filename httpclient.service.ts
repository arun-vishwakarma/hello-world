import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { forkJoin } from "rxjs";

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

  constructor(private httpClient: HttpClient) {}

  getDateRangeData(dateRange, validity, mrn) {
    let dateObj = this.getDates(dateRange);
    let url1 =
      this.apiUrl +
      "/smart/patient/observations?mrn=" +
      mrn +
      "&start=" +
      dateObj.start_date +
      "&end=" +
      dateObj.end_date;
    let url2 =
      this.apiUrl +
      "/smart/patient/observationsCPT?mrn=" +
      mrn +
      "&start=" +
      dateObj.start_date +
      "&end=" +
      dateObj.end_date;

    let observation = this.httpClient.get(url1);
    let billing = this.httpClient.get(url2);

    this.bpData = forkJoin([observation, billing]);
    return this.bpData;
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
