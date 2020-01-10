import {Component} from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare let ClientIP: any;  //resolve cors issue

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

    publicIP;
 

  constructor(private http: HttpClient) {
    /**
     * To read private IP
     */
    this.publicIP = ClientIP;  //Done



    /**
	 *  OR
     * To read public IP  //cors issue error
     */
    this.http.get('https://api.ipify.org?format=json').subscribe(data => {
      this.publicIP=data['ip'];
    });
  }

}
