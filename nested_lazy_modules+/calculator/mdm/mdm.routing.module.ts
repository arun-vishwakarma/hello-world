import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MdmComponent } from "./mdm.component";

const routes: Routes = [
  {
    path: "",
    component: MdmComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MdmRoutingModule {}
