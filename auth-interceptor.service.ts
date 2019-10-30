import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private router:Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    //console.log(req.url, "intercept ");
    let authRequest:any = null;
    if (req.url.includes("token")) {
      //console.log("get Token API without token Key");
      //return next.handle(req);

      const username = environment.tokenInfo.basic_auth_username;
      const password = environment.tokenInfo.basic_auth_password;
      let authorizationData = 'Basic ' + btoa(username + ':' + password);
      //let authorizationData = 'Basic ' + username + ':' + password;    
      //let authorizationData = "Basic bW9iaWxlOnBpbg==";  
        authRequest = req.clone({
        headers: new HttpHeaders({
          'Content-Type':  'application/x-www-form-urlencoded',
          'Authorization': authorizationData
        })
      }); 
      //return next.handle(authRequest);

    }else{

      const authToken = localStorage.getItem("token");
      if (authToken) {
        //console.log("Other api with token " + authToken);
        authRequest = req.clone({
          headers: req.headers.set("Authorization", "Bearer " + authToken)
        });

        //return next.handle(authRequest);
      }else{
        //console.log('Token Expired!');
        this.router.navigate(['/portal/patient']);
      }
    }

    if(authRequest){
      return next.handle(authRequest)
      /*.pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = "An unknown error occurred!";        
          if (error.message) {
            errorMessage = error.message;
            console.log(errorMessage);
          } 
          //alert(errorMessage+', please try again.');
          //this.router.navigate(['/portal/landing']);
          //this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
          // this.errorService.throwError(errorMessage);
          return throwError(error);
        })
      );*/
    }
    

    
  }

}
