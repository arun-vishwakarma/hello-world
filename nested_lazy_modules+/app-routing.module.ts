import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
//import { AuthComponent } from "./auth/auth.component";
import { HomeComponent } from "./home/home.component";

const appRoutes: Routes = [
  { path: "", redirectTo: "/", pathMatch: "full" },
  {
    path: "",
    component: HomeComponent
    //canActivate: [AuthGuard],
  },
  /*  { path: "auth", component: AuthComponent }, */
  {
    path: "calculator",
    loadChildren: "./calculator/calculator.module#CalculatorModule"
  },
  {
    path: "tutorial/:id",
    //loadChildren: "./tutorial/tutorial.module#TutorialModule"
    loadChildren: () =>
      import("./tutorial/tutorial.module").then(m => m.TutorialModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
