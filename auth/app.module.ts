import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';

import { SmbpuiComponent } from './smbpui/smbpui.component';
import { HighchartdemoComponent } from './highchartdemo/highchartdemo.component';
import { SelectpatientComponent } from './selectpatient/selectpatient.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PatientComponent } from './patient/patient.component';
import { LandingComponent } from './landing/landing.component';
import { HeaderComponent } from './header/header.component';
import { AuthInterceptorService } from './shared/services/auth-interceptor.service';
import { AlertComponent } from './shared/components/alert/alert.component';
import { CustomPaginationComponent } from './shared/components/custom-pagination/custom-pagination.component';

@NgModule({
  declarations: [
    AppComponent,
    SmbpuiComponent,
    HighchartdemoComponent,
    SelectpatientComponent,
    PatientComponent,
    LandingComponent,
    HeaderComponent,
    AlertComponent,
    CustomPaginationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxPaginationModule
  ],
  bootstrap: [
    AppComponent
    //SmbpuiComponent,
    //HighchartdemoComponent
    //PatientComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,

      useClass: AuthInterceptorService,

      multi: true
    }
  ]
})
export class AppModule {}
