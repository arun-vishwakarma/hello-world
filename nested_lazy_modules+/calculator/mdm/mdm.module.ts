import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MdmComponent } from "./mdm.component";
import { MdmRoutingModule } from "./mdm.routing.module";

@NgModule({
  declarations: [MdmComponent],
  imports: [CommonModule, MdmRoutingModule]
})
export class MdmModule {}
