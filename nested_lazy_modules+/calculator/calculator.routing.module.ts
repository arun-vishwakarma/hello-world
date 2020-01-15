import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CalculatorComponent } from "./calculator.component";
/* import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component'; */

const routes: Routes = [
  {
    path: "",
    component: CalculatorComponent,
    //use to have calulator menu (Time | Mdm) always and on click load child module
    children: [
      { path: "time", loadChildren: "./time/time.module#TimeModule" },
      { path: "mdm", loadChildren: "./mdm/mdm.module#MdmModule" }
    ]
  }
  //Below will use if we want to remove calulator html data (menu or Links) and use only child module data
  /* {
    path: "time",
    loadChildren: "./time/time.module#TimeModule"
  },
  {
    path: "mdm",
    loadChildren: "./mdm/mdm.module#MdmModule"
  } */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalculatorRoutingModule {}
