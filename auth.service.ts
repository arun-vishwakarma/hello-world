import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../../environments/environment";

import { throwError as observableThrowError, Subject } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  private isAuthenticated = false;
  private token: string;
  private authUser: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private authErrorMsgListener = new Subject<string>();
  private authMsg: string = "";

  apiUrl: string = environment.apiBaseUrl + ":" + environment.port;
  private tokenUrl =
    this.apiUrl +
    "/smart-is/oauth/token?grant_type=" +
    environment.tokenInfo.grant_type +
    "&username=" +
    environment.tokenInfo.username +
    "&password=" +
    environment.tokenInfo.password;

  getAuthMsg() {
    return this.authMsg;
  }

  getToken() {
    return this.token;
  }

  getAuthUser() {
    return this.authUser;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getAuthErrorMsgListener() {
    return this.authErrorMsgListener.asObservable();
  }

  getTokenAPI() {
    //if(this.isAuthenticated) return;

    //let url = "http://localhost:3000/api/token";

    /* let url = "http://10.131.129.54:8083/smart-is/oauth/token";
    let postData = JSON.stringify({
      "grant_type": "password",
      "username": "himanshu.dixit@rsystems.com",
      "password": "smbp@123"
    });  */

    //let url = "http://10.131.129.54:8083/smart-is/oauth/token?grant_type=password&username=himanshu.dixit@rsystems.com&password=smbp@123";
    let url = this.tokenUrl;
    let postData = null;

    this.httpClient
      .post(url, postData)
      .pipe(
        catchError((error: any) => {
          //console.log('catch err',error);
          return observableThrowError(error.message);
        })
      )
      .subscribe(
        (resp: any) => {
          const response = resp;
          console.log("token ", response);
          const token = response.access_token;
          this.token = token;
          //this.authUser = response.email;
          if (this.token) {
            const expiresInDuration = response.expires_in * 1000;
            this.setAuthTimer(expiresInDuration);
            this.setAuthData(this.token, expiresInDuration);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
          }
        },
        (error) => {
          console.log("error resp", error);
          this.authStatusListener.next(false);
          //this.authErrorMsgListener.next(error);
          //alert('Invalid Token, Please try again!');
        }
      );
  }

  setAuthData(token: string, expire: number) {
    localStorage.setItem("token", token);
    const loginTime = Date.now() + expire;
    //const loginTime = Date.now() + 60000;

    localStorage.setItem("timer", JSON.stringify(loginTime));
  }

  getAuthData() {
    const token = localStorage.getItem("token");
    const timer = JSON.parse(localStorage.getItem("timer"));
    if (!token || !timer) {
      return;
    }
    return {
      token,
      timer
    };
  }

  checkTokenExpiry() {
    const timer = JSON.parse(localStorage.getItem("timer"));

    if (!timer) return true;

    if (timer && Date.now() > timer) {
      localStorage.removeItem("timer");
      localStorage.removeItem("token");
      //open popup
      return true;
    }

    return false;
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const expiresIn = authInformation.timer - Date.now();
    console.log("expiresIn ms ", expiresIn);
    if (expiresIn > 0) {
      this.token = authInformation.token;
      //this.authUser = authInformation.email;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn);
      this.authStatusListener.next(true);
    } /* else{
      this.logout();

    } */
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
      //this.clearAuthData();
    }, duration);
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    //this.router.navigate(["/"]);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("timer");
    //localStorage.removeItem("email");
  }
}
