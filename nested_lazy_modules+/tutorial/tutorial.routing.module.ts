import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { TutorialComponent } from "./tutorial.component";
/* import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component'; */

const routes: Routes = [
  {
    path: "",
    component: TutorialComponent
    /* children: [
      { path: "/:id", component: TutorialComponent },
      { path: "", component: TutorialComponent }
    ] */
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
  //declarations: [TutorialComponent]
})
export class TutorialRoutingModule {}
