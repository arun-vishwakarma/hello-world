import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    //console.log(req.url, "intercept ");
    if (req.url.includes('token')) {
      const username = environment.tokenInfo.basic_auth_username;
      const password = environment.tokenInfo.basic_auth_password;
      let authorizationData = 'Basic ' + btoa(username + ':' + password);
      //let authorizationData = 'Basic ' + username + ':' + password;
      //let authorizationData = "Basic bW9iaWxlOnBpbg==";
      let authRequest = req.clone({
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: authorizationData
        })
      });
      return next.handle(authRequest);
    } else {
      const authToken = this.authService.getToken();
      //console.log('auth token using service', authToken);

      if (authToken) {
        //console.log("Other api with token " + authToken);
        let authRequest = req.clone({
          headers: req.headers.set('Authorization', 'Bearer ' + authToken)
        });

        return next.handle(authRequest).pipe(
          catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
              this.authService.logout();
              window.location.href = '/portal/patient';
            } else {
              return throwError(error);
            }
          })
        );
      } else {
        //this.router.navigate(['/portal/patient']);
        window.location.href = '/portal/patient';
      }
    }
  }
}
