import { Component } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { filter } from "rxjs/operators";
@Component({
  selector: "app-calculator",
  templateUrl: "calculator.component.html"
})
export class CalculatorComponent {
  public href: string = "";
  activeModule: string = "";

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.href = this.router.url;
    //console.log(this.router);
    this.router.events
      .pipe(filter(evt => evt instanceof NavigationEnd))
      .subscribe(event => {
        console.log(event["url"]);
        console.log(this.route.firstChild.routeConfig.path);
        this.activeModule = this.route.firstChild.routeConfig.path;
      });
  }
}
