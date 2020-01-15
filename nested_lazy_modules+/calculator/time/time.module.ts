import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
//import { RouterModule } from "@angular/router";
import { TimeComponent } from "./time.component";
import { TimeRoutingModule } from "./time.routing.module";

@NgModule({
  declarations: [TimeComponent],
  imports: [CommonModule, TimeRoutingModule]
})
export class TimeModule {}
