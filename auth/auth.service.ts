import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { throwError as observableThrowError, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpClient: HttpClient) {
    //console.log('token in service const', this.token);
  }

  private isAuthenticated = false;
  private token: string;
  private authUser: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private authErrorMsgListener = new Subject<string>();
  private authMsg: string = '';

  apiUrl: string = environment.apiBaseUrl + ':' + environment.port;
  private tokenUrl =
    this.apiUrl +
    '/smart-is/oauth/token?grant_type=' +
    environment.tokenInfo.grant_type +
    '&username=' +
    environment.tokenInfo.username +
    '&password=' +
    environment.tokenInfo.password;

  getAuthMsg() {
    return this.authMsg;
  }

  getToken() {
    //console.log('token in service get tken', this.token);
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
    let url = this.tokenUrl;
    let postData = {};

    this.httpClient
      .post(url, postData)
      .pipe(
        catchError((error: any) => {
          console.log('catch err', error);
          return observableThrowError(error.message);
        })
      )
      .subscribe(
        (resp: any) => {
          const response = resp;
          console.log('token ', response);
          const token = response.access_token;
          this.token = token;
          //this.authUser = response.email;
          if (this.token) {
            console.log('first time on load..');
            const expiresInDuration = response.expires_in * 1000;
            this.setAuthTimer(expiresInDuration);
            this.setAuthData(this.token, expiresInDuration);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
          }
        },
        (error) => {
          console.log('error resp', error);
          this.authStatusListener.next(false);
          //this.authErrorMsgListener.next(error);
          //alert('Invalid Token, Please try again!');
        }
      );
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
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
    localStorage.removeItem('token');
    localStorage.removeItem('timer');
  }

  setAuthData(token: string, expire: number) {
    localStorage.setItem('token', token);
    const loginTime = Date.now() + expire;
    //const loginTime = Date.now() + 60000;

    localStorage.setItem('timer', JSON.stringify(loginTime));
  }

  getAuthData() {
    const token = localStorage.getItem('token');
    const timer = JSON.parse(localStorage.getItem('timer'));
    if (!token || !timer) {
      return;
    }
    return {
      token,
      timer
    };
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const expiresIn = authInformation.timer - Date.now();
    console.log('expiresIn ms ', expiresIn);
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn);
      this.authStatusListener.next(true);
    }
  }
}
