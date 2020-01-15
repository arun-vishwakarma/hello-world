import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CalculatorRoutingModule } from "./calculator.routing.module"; //Added
import { CalculatorComponent } from "./calculator.component";
import { CalculatorHeaderComponent } from "./calculator-header/calculator-header.component";
import { MdmBreadcrumbComponent } from "./mdm-breadcrumb/mdm-breadcrumb.component";

@NgModule({
  declarations: [
    CalculatorComponent,
    CalculatorHeaderComponent,
    MdmBreadcrumbComponent
  ],
  imports: [CommonModule, CalculatorRoutingModule]
})
export class CalculatorModule {}
