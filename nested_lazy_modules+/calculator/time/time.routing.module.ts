import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TimeComponent } from "./time.component";

const routes: Routes = [
  {
    path: "", //"" when using children inside calculator module
    component: TimeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeRoutingModule {}
