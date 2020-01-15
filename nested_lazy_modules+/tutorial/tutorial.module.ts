import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TutorialRoutingModule } from "./tutorial.routing.module"; //Added
import { TutorialComponent } from "./tutorial.component";

@NgModule({
  declarations: [TutorialComponent],
  imports: [CommonModule, TutorialRoutingModule]
})
export class TutorialModule {}
