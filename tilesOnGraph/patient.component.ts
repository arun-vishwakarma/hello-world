import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  HostListener
} from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { Subscription } from "rxjs";
import { DatePipe } from "@angular/common";

import { AuthService } from "../shared/services/auth.service";

import * as Highcharts from "highcharts/highstock";
Highcharts.SVGRenderer.prototype.symbols.cross = function(x, y, w, h) {
  return ["M", x, y, "L", x + w, y + h, "M", x + w, y, "L", x, y + h, "z"];
};

import { HttpclientService } from "../service/httpclient.service";
import { AppConstants } from "../constant";

declare var require: any;
let Boost = require("highcharts/modules/boost");
let noData = require("highcharts/modules/no-data-to-display");
let More = require("highcharts/highcharts-more");
let Export = require("highcharts/modules/exporting");
let ExportData = require("highcharts/modules/export-data");

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
Export(Highcharts);
ExportData(Highcharts);

@Component({
  selector: "app-patient",
  templateUrl: "./patient.component.html",
  styleUrls: [
    "./patient.component.css",
    "../../../node_modules/highcharts/css/stocktools/gui.css"
  ]
})
export class PatientComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  patients: any = [];
  selectedPatient: string = "";
  billingInfo: any = {};
  showWeeklyAvgTootipLabel: boolean = false;

  public config: any = {
    id: "custom",
    itemsPerPage: 10,
    currentPage: 1,
    maxSize: 7
  };

  bpColumnRangeData: any;
  chart;
  bpData;
  dateRange = "30";
  validity = "All";
  patientObject: any;
  mrn: any;
  fname: any;
  lname: any;
  birthdate: any;
  gender: any;
  age: any;
  isTableShow: boolean = false; //true;
  isGraphShow: boolean = true; //false;
  isLoaderOn: any = true;
  responseobservations: any;
  avgObservations: any;
  tableButtonClass: any = "nav-link";
  graphButtonClass: any = "nav-link active";
  filterForm: FormGroup;
  goal_sbp_value: any = 135;
  goal_dbp_value: any = 85;
  ymin: any = 0;
  ymax: any = 220;
  tilesArr: any = [];

  heartRateArr: any = [];
  sbpArr: any = [];
  dbpArr: any = [];

  lastFourWeekArray: any = [];
  observationActualResponse: any;

  observationCount: any = 0;
  observationMetCount: any = 0;
  observationAllCount: any = 0;

  minX: any;
  maxX: any;
  customDate: any;

  timezoneConstant: any;

  showComments: boolean = false;
  rowId: any;
  patientComment: any;

  showVDLModal: boolean = false;
  manufacturer: any;
  model: any;

  showTilesVDLModal: boolean = false;

  arrModel: any = [];
  arrManufacturer: any = [];

  modelArr: any = [];
  manufacturerArr: any = [];

  leftPannelChange: any = "";
  expandClass: any = "open";
  expand: boolean = false;
  bodyWrapClass: any = "bodyWrapSection";
  subHeaderClass: any = "subHeader-moreInfo";
  subHeaderContent: any = "subHeader-content";
  subHeaderToggle: any = "subHeaderShow";

  subHeaderExpand: boolean = false;
  minDate: any;
  maxDate: any;

  showDevicesUsedModal: boolean = false;
  greenTick: boolean = false;
  crossTick: boolean = false;
  isCountAll: boolean = true;

  validDeviceMarkerArr: any = [];
  validDeviceMarkerDbpArr: any = [];

  minY: any = 0;
  maxY: any = 0;

  minYHeartRate: any = 0;
  maxYHeartRate: any = 0;
  showBillingReview: boolean = false;
  //currentTimeZoneOffsetInHours:any;

  plotLinesArrOnXAxis: any = [];
  tilesTopSeries: any = [];

  public options: any = {
    // time: {
    // 	timezoneOffset: this.currentTimeZoneOffsetInHours
    // },
    chart: {
      height: 700,
      events: {
        load: function() {
          if (this.legend) {
            this.legend.destroy();
          }
          //distance between 2 elements
          let itemDistance = this.legend.options.itemDistance;
          //the biggest element
          let maxItemWidth = this.legend.maxItemWidth;
          //make the width of the legend in the size of 2 largest elements + distance
          let nextLegendWidth = maxItemWidth * 0 + itemDistance;
          //container width
          let boxWidth = this.plotBox.width;
          //if the length of the 2 largest elements + the distance between them is less than the width of 			container, we make 1 row, else set legend width 2 max elements + distance between
          if (boxWidth < nextLegendWidth) {
            this.legend.options.width = maxItemWidth;
          } else {
            this.legend.options.width = nextLegendWidth;
          }
          this.render();
        },
        redraw: function() {
          if (this.legend) {
            this.legend.destroy();
          }
          //distance between 2 elements
          let itemDistance = this.legend.options.itemDistance;
          //the biggest element
          let maxItemWidth = this.legend.maxItemWidth;
          //make the width of the legend in the size of 2 largest elements + distance
          let nextLegendWidth = maxItemWidth * 0 + itemDistance;
          //container width
          let boxWidth = this.plotBox.width;
          //if the length of the 2 largest elements + the distance between them is less than the width of 			container, we make 1 row, else set legend width 2 max elements + distance between
          if (boxWidth < nextLegendWidth) {
            this.legend.options.width = maxItemWidth;
          } else {
            this.legend.options.width = nextLegendWidth;
          }

          this.render();

          //responsive setting graph
          //if (this.chart) this.chart.reflow();
        }
      }
      //plotBackgroundColor: '#e6f2ff',
    },
    title: {
      text: " "
    },
    subtitle: {
      text: ""
    },
    credits: {
      enabled: false
    },
    xAxis: {
      //ordinal: true,
      type: "datetime",
      lineColor: "grey",
      //lineWidth: 1,
      tickInterval: 1000 * 3600 * 12,
      min: this.minX,
      max: this.maxX,
      //tickPixelInterval: 5,
      uniqueNames: false,
      //minorGridLineColor: '#C5EEFA',
      //minorGridLineWidth: .3,
      //plotLines: plotLinesArray,
      //minorTickInterval: 'auto',
      endOnTick: true,
      showLastLabel: true,
      startOnTick: true,
      gridLineWidth: 1,
      labels: {
        enabled: true,
        format: "{value:%Y-%m-%d}",
        useHTML: true,
        formatter: function() {
          //var label = this.axis.defaultLabelFormatter.call(this);
          //var label = Highcharts.dateFormat('%p', this.value);
          var hours = Highcharts.dateFormat("%H", this.value);
          if (hours == "00") {
            return Highcharts.dateFormat("%Y-%m-%d", this.value);
          }

          if (hours == "12" && this.axis.options.labels.dateRange == 7) {
            //return "Noon";
            return "Noon";
          }
          //if(hours == '18'){
          //return "Noon";
          //}
        },
        dateRange: this.dateRange,
        rotation: -90,
        style: {
          color: "grey",
          fontWeight: "bold",
          fontSize: "12px"
        }
      },
      plotLines: [] // this.plotLinesArrOnXAxis
    },

    scrollbar: {
      enabled: false
    },
    exporting: {
      sourceWidth: 1200,
      sourceHeight: 600,
      buttons: {
        contextButton: {
          menuItems: [
            "viewFullscreen",
            "printChart",
            "separator",
            "downloadPNG",
            "downloadJPEG",
            "downloadPDF"
          ]
        }
      }
    },

    rangeSelector: {
      enabled: true,
      buttonTheme: {
        width: 0,
        height: 0,
        style: {
          color: "white",
          fontWeight: "bold"
        }
      },
      labelStyle: {
        color: "white"
      },
      inputEnabled: false,
      zoom: {
        text: "",
        style: {
          color: "white",
          fontWeight: "bold"
        }
      },
      buttons: [
        {
          type: "all",
          approximation: "averages",
          dataGrouping: {
            enabled: false
          },
          text: ""
        },
        {
          type: "day",
          approximation: "averages",
          count: parseInt(this.dateRange),
          dataGrouping: {
            enabled: false
          },
          text: ""
        }
      ],
      selected: 1
    },

    yAxis: [
      {
        labels: {
          format: "{value} mmHg",
          style: {
            color: "grey",
            fontSize: "12px"
          }
        },
        height: "70%",
        resize: {
          enabled: true
        },
        opposite: false,
        lineColor: "grey",
        lineWidth: 1,
        tickInterval: 20,
        min: this.minY,
        gridLineColor: "transparent",
        max: this.maxY,
        title: {
          text: ""
        },

        plotLines: [
          {
            color: "lightgrey",
            width: 1,
            dashStyle: "longdash",
            value: this.goal_dbp_value,
            label: {
              //text: 'DBP threshhold (85)',
              align: "right",
              style: {
                color: "gray"
              }
            }
          },
          {
            color: "lightgrey",
            width: 1,
            dashStyle: "longdash",
            value: this.goal_sbp_value,
            label: {
              //text: 'SBP threshhold ('+threshholdHigher+')',
              align: "center",
              style: {
                color: "gray"
              }
            }
          },
          {
            color: "lightgrey",
            width: 1,
            value: this.goal_sbp_value
          },
          {
            color: "lightgrey",
            width: 1,
            value: this.goal_sbp_value + 20
          }
        ]
      },
      {
        labels: {
          format: "{value} BPM",
          style: {
            color: "grey"
          }
        },
        opposite: true,
        lineColor: "grey",
        lineWidth: 1,
        top: "75%",
        height: "25%",
        offset: 0,
        tickInterval: 40,
        min: 40,
        gridLineColor: "transparent",
        max: 120,
        title: {
          text: ""
        }
      }
    ],

    plotOptions: {
      // series:{
      // 	turboThreshold:0//larger threshold or set to 0 to disable
      // },
      series: {
        connectNulls: true,
        //use to remove hover
        states: {
          hover: {
            enabled: false
          }
        }
      },
      line: {
        dataLabels: {
          enabled: false
        }
        //enableMouseTracking: false
      }
    },

    tooltip: {
      //pointFormat: '<br/><span style="color:{series.color}"><b>{series.name}</b></span>: <b>{point.y}</b> <br/>',
      shared: true,
      //xDateFormat: '<b>%Y-%m-%d %H:%M</b>',
      useHTML: true,
      borderColor: "grey",
      shadow: false,
      borderRadius: 0,
      valueDecimals: 0,
      backgroundColor: "rgba(255,255,255,0)",
      crosshairs: {
        color: "grey",
        dashStyle: "solid"
      },
      lineWidth: 0.1,
      valueSuffix: " mmHg",
      borderWidth: 0,
      percentageDecimals: 2,
      formatter: function() {
        //return "";

        if (!this.points[2]) return ""; //use to remove undefined error on tooltip

        var tooltipHeader =
          '<div class="graphPopsection"><table width="100%" class="popGraphTable"><tr><td class="heading">' +
          Highcharts.dateFormat("%Y-%m-%d &nbsp; %H:%M", this.x);
        +'</td></tr><tr><td><div  style="height:12px; background-color:red;"></div>></td></tr>';
        var tooltipSbp =
          '<tr><td></td></tr><tr style="border-bottom: 1px solid #bdbdbd;"><td></td></tr><tr><td></td></tr><tr><td></td></tr><tr><td><span style="font-weight:bold;">SBP: </span><span style="color:' +
          this.points[0].color +
          '">' +
          this.points[0].y +
          " mmHg</span></td></tr>";

        var tooltipDbp = this.points[1]
          ? '<tr><td></td></tr><tr><td></td></tr><tr><td><span style="font-weight:bold;">DBP: </span><span style="color:' +
            this.points[1].color +
            '">' +
            this.points[1].y +
            " mmHg</span></td></tr>"
          : "";

        var tooltipHeartRate = this.points[2]
          ? '<tr><td></td></tr><tr><td></td></tr><tr><td><span style="font-weight:bold;">Heart Rate: </span>' +
            this.points[2].y +
            " bpm</td></tr>"
          : "";

        if (
          this.points[0] &&
          this.points[0].point.validityDeviceJSon &&
          this.points[0].point.validityDeviceJSon.isValid == "N"
        ) {
          var tooltipProfile =
            '<tr><td></td></tr><tr><td></td></tr><tr><td class="checkTextBox"><span>Clinical Profile </span> <i class="fa fa-times-circle colorCancel"></i></td></tr>';
          //var tooltipProfile = '<tr><td></td></tr><tr><td></td></tr><tr><td><span style="font-weight:bold;">Clinical Profile</span>  <img style="width:16px;height:16px" src="/assets/images/cross-flat.png"/></td></tr>';
        } else {
          var tooltipProfile =
            '<tr><td></td></tr><tr><td></td></tr><tr><td class="checkTextBox"><span>Clinical Profile </span> <i class="fa fa-check-circle colorTick"></i></td></tr>';
        }

        if (
          this.points[0] &&
          this.points[0].point.validityDeviceJSon &&
          this.points[0].point.validityDeviceJSon.isValidDevice == "Y"
        ) {
          var tooltipmanufacturer =
            '<tr><td></td></tr><tr><td></td></tr><tr style="border-bottom: 1px solid #bdbdbd;"><td></td><tr><td></td></tr><tr><td></td></tr></tr><tr><td></td></tr><tr><td><span style="font-weight:bold;">Manufacturer: </span>' +
            this.points[0].point.validityDeviceJSon.manufacturer +
            "</td></tr>";
          var tooltipModel =
            '<tr><td></td></tr><tr><td></td></tr><tr><td><span style="font-weight:bold;">Model: </span>' +
            this.points[0].point.validityDeviceJSon.device +
            "</td></tr>";
          var tooltipValidDevice =
            '<tr><td></td></tr><tr><td></td></tr><tr><td class="checkTextBox last"><span>Device Used </span> <i class="fa fa-check-circle colorTick"></i></td></tr></table>';
        } else {
          var tooltipmanufacturer =
            '<tr><td></td></tr><tr><td></td></tr><tr style="border-bottom: 1px solid #bdbdbd;"><td></td><tr><td></td></tr><tr><td></td></tr></tr><tr><td></td></tr><tr><td><span style="font-weight:bold;">Manufacturer: </span>' +
            "Unknown Device" +
            "</td></tr>";
          var tooltipModel =
            '<tr><td></td></tr><tr><td></td></tr><tr><td><span style="font-weight:bold;">Model: </span>' +
            "</td></tr>";
          var tooltipValidDevice =
            '<tr><td></td></tr><tr><td></td></tr><tr><td class="checkTextBox last"><span>Device Used </span> <i class="fa fa-times-circle colorCancel"></i></td></tr></table></div>';
        }
        return (
          tooltipHeader +
          tooltipSbp +
          tooltipDbp +
          tooltipHeartRate +
          tooltipProfile +
          tooltipmanufacturer +
          tooltipModel +
          tooltipValidDevice
        );
      }
    },
    legend: {
      useHTML: true,
      symbolPadding: 0,
      symbolWidth: 0,
      symbolRadius: 0,
      itemDistance: 0,
      ///symbolRadius: 4,
      padding: 5,
      //width:1800,
      x: 30,
      // itemWidth:800,
      itemStyle: {
        width: 350
      },
      labelFormatter: function() {
        //alert('sadasd');
        //return 'gsdfgdfgfdsggsfgdfg<span title="' + this.name + '">' + this.name + '</span>';

        //   return '<div style="font-size:12px;"><span style="float:right;">Met Procedural Criteria</span>' +
        //  '<span style="float:right;margin-left:10px;">Didn\'t Meet Procedural Criteria</span>' +
        //  '<span style="float:right;">Heart Rate</span>' +
        //  '<span style="float:right;color:red">Red - Above Goal</span>' +
        //  '<span style="float:right;">Black - Below Goal</span></div>'
        //<i class="fas fa-times"></i>   <i class="fas fa-circle"></i>
        if (this.name == "SBP") {
          //DBP or SBP above BP goal
          return '<div class="graphlist1"><i class="fa fa-circle"></i> Met Procedural Criteria</div>';
        }

        if (this.name == "DBP") {
          return '<div class="graphlist2"><i style="font-size:14px" class="fa fa-times"></i> Didn\'t Meet Procedural Criteria</div>';
        }

        if (this.name == "Heart Rate") {
          return '<div class="graphlist3"><i style="font-size:8px" class="fa fa-circle"></i> Heart Rate</div>';
        }

        if (this.name == "Goal BP") {
          return "<div class='graphlist4'>Red-Above Goal</div>";
        }
        if (this.name == "Goal BP legend") {
          return "<div class='graphlist5'>Black-Below Goal</div>";
        }
      }
    },
    series: [
      {
        name: "SBP",
        color: "black",
        data: this.sbpArr,
        dashStyle: "LongDashDotDot",
        lineWidth: 1, //remove line
        //required to take marker with any symbol value as default to show cross icon on graph
        marker: {
          symbol: "circle",
          lineWidth: 2, //this is also must to use this to show cross icon
          radius: 6 //use 6 to show large circle in legend and further override in sbp data array
        },
        states: {
          hover: {
            lineWidthPlus: 0
          }
        },
        showInLegend: true,
        legendIndex: 0
      },
      {
        name: "DBP",
        color: "black",
        data: this.dbpArr,
        id: "dbp",
        dashStyle: "LongDashDotDot",
        lineWidth: 1, //remove line
        //required to take marker with any symbol value as default to show cross icon on graph
        marker: {
          symbol: "cross",
          lineWidth: 2, //this is also must to use this to show cross icon
          radius: 4,
          lineColor: null //use to show cross icon in legend
        },
        states: {
          hover: {
            lineWidthPlus: 0
          }
        },
        showInLegend: true,
        legendIndex: 1
      },

      {
        type: "line",
        lineWidth: 1,
        name: "Heart Rate",
        legendIndex: 4,
        data: this.heartRateArr,
        id: "HeartRate",
        dashStyle: "Dot",
        marker: {
          enabled: true,
          radius: 3,
          symbol: "circle"
        },
        yAxis: 1,
        color: "#313131",
        showInLegend: true,
        events: {
          legendItemClick: () => false // disable legend click
        },
        tooltip: {
          valueSuffix: " bpm"
          //pointFormat: '<br/><span style="color:{point.color}"><b>{series.name}</b></span>: <span style="color:{point.color}">{point.y}</span><br/>'
        }
        /* states: {
          hover: {
            lineWidthPlus: 1
          }
        } */
      },
      {
        type: "line",
        name: "Goal BP",
        color: "lightgrey",
        dashStyle: "Dash",
        lineWidth: 0,
        legendIndex: 2,
        showInLegend: true,
        marker: {
          enabled: false,
          //radius: 3,
          symbol: "dashline"
        }
      },
      //use to just show in legend
      {
        type: "line",
        name: "Goal BP legend",
        color: "lightgrey",
        dashStyle: "Dash",
        legendIndex: 3,
        showInLegend: true,
        lineWidth: 0,
        marker: {
          enabled: false,
          //radius: 3,
          symbol: "dashline"
        }
      },
      //top tiles series TS
      {
        name: "Tiles",
        data: [], //this.tilesTopSeries,
        marker: {
          enabled: false
        },
        lineWidth: 0,
        dataLabels: [
          {
            enabled: true,
            /* format:
              '<div style="color:red;margin-left:20px;margin-top:10px;float:left;">AAAAAAA<br/>BBB</div><div><img height="50" width="50" src="https://www.highcharts.com/forum/styles/anami/theme/images/highcharts-logo.svg"/></div>',
            useHTML: true, */
            //align: "left",
            useHTML: true,
            formatter: function() {
              if (!this.point.weekDateRange) return;
              let deviceIcon: any, weeklyAvgValue: any, weekAvgClass: any;
              if (this.point.deviceIcon) {
                deviceIcon = '<img src="/assets/images/icon_bp_machine.png"/>';
                weeklyAvgValue =
                  "Weekly Average: " + this.point.sbp + "/" + this.point.dbp;
                weekAvgClass = "week-vy";
              } else {
                deviceIcon = "";
                weeklyAvgValue = "Inadequate Data For Average";
                weekAvgClass = "week-vn";
              }

              return (
                '<div id="week-avg-tiles">' +
                '<span class="' +
                weekAvgClass +
                '">' +
                weeklyAvgValue +
                "</span>" +
                '<br/><span class="week-avg-dr">' +
                this.point.weekDateRange +
                '</span><div class="week-avg-dicon">' +
                deviceIcon +
                "</div></div>"
              );
            },
            states: {
              inactive: {
                opacity: 1
              }
            }
          } /* ,
          {
            enabled: true,
            format:
              '<div style="margin-top:5px;"><img height="50" width="50" src="https://www.highcharts.com/forum/styles/anami/theme/images/highcharts-logo.svg"/></div>',
            useHTML: true,
            align: "right"
          } */
        ],
        showInLegend: false,
        states: {
          hover: {
            lineWidthPlus: 0
          }
        }
      }
    ]
  };

  constructor(
    private httpClientService: HttpclientService,
    private authService: AuthService,
    private datePipe: DatePipe
  ) {}

  @ViewChild("cpu", { static: false }) elemRefCpu: ElementRef;
  @ViewChild("cpc", { static: false }) elemRefCpc: ElementRef;

  //To handle modal popup close event on outside click or on escape
  @HostListener("window:keydown", ["$event"])
  @HostListener("window:click", ["$event.target"])
  onEvent(event: any) {
    if (
      this.showBillingReview &&
      (event.keyCode === 27 || (event && event.id === "myPreviewModal"))
    ) {
      this.showBillingReview = false;
      this.reviewCheckBoxChanged(true);
    }
  }

  ngOnInit() {
    this.expandCollaps(); //by default collapse

    this.filterForm = new FormGroup({
      goal_sbp: new FormControl("135"),
      goal_dbp: new FormControl("85"),
      date_range: new FormControl("30"),
      clinical_criteria: new FormControl("1")
    });

    if (!this.authService.getToken()) {
      this.authListenerSubs = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
          console.log("auth..", isAuthenticated);
          this.userIsAuthenticated = isAuthenticated;
          if (isAuthenticated) {
            console.log("call patient APIs...");
            //code for patient APIs
            this.loadPatientData();
          }
        });
    } else {
      this.loadPatientData();
    }
  }

  getPlottedLinesData(prm = "xAxis") {
    const plotLinesArr = [];
    if (prm == "xAxis") {
      let startDate = new Date(this.minX).toISOString().slice(0, 10);
      let endDate = new Date(this.maxX).toISOString().slice(0, 10);
      console.log("se", startDate, endDate);

      let dateMove1 = new Date(startDate);
      let dateMove7 = new Date(startDate);
      var strDate = startDate;
      while (strDate < endDate) {
        var strDate = dateMove1.toISOString().slice(0, 10);
        let strDate7 = dateMove7.toISOString().slice(0, 10);
        let dateToTimestamp1 = new Date(strDate).getTime();
        let dateToTimestamp7 = new Date(strDate7).getTime();
        plotLinesArr.push({
          color: "lightgrey",
          width: 1,
          value: dateToTimestamp1,
          dashStyle: "dotdot"
        });
        plotLinesArr.push({
          color: "lightgrey",
          width: 1,
          value: dateToTimestamp7
        });
        //xAxisPlotLinesArr.push(dateToTimestamp7+10*24*60*1000);
        if (strDate7 < endDate) {
          let tilesTemp = [dateToTimestamp7, 240];
          //tilesTopSeries.push(tilesTemp);
        }

        dateMove1.setDate(dateMove1.getDate() + 1);
        dateMove7.setDate(dateMove7.getDate() + 7);
      }
      return plotLinesArr;
    } else {
      return plotLinesArr;
    }
  }

  selectPatient(currentPatient: any = null) {
    //reset filter i.e in initial stage
    this.resetFilterValues();

    //collapse left navigation
    this.expandCollaps();

    this.httpClientService.setCurrentPatient(currentPatient);
    this.loadPatientData();
  }

  resetFilterValues() {
    this.filterForm.patchValue({
      goal_sbp: "135",
      goal_dbp: "85",
      date_range: "30",
      clinical_criteria: "1"
    });
    this.dateRange = "30";
    this.validity = "All";
    this.goal_sbp_value = 135;
    this.goal_dbp_value = 85;
  }

  autoSelectCurrentPatient() {
    let cp = this.patients.find((patient: any) => {
      return patient.patientMRN === this.mrn;
    });
    this.httpClientService.setCurrentPatient(cp);
  }

  loadPatientData(currentPatientObj = null) {
    this.isLoaderOn = true;
    this.timezoneConstant = AppConstants.timezoneConstant;

    this.patientObject = JSON.parse(this.getCookie("patientObject"));
    var currentDate = new Date();
    var customDateString = currentDate.toISOString().slice(0, 10);
    this.customDate =
      this.getCookie("customDate") == ""
        ? customDateString
        : this.getCookie("customDate");

    currentPatientObj = this.httpClientService.getCurrentPatient();
    //get current patinet data
    if (currentPatientObj) {
      this.fname = currentPatientObj.patientFirstName
        ? currentPatientObj.patientFirstName
        : "N/A";
      this.lname = currentPatientObj.patientLastName
        ? currentPatientObj.patientLastName
        : "N/A";
      this.birthdate = currentPatientObj.patientDOB
        ? currentPatientObj.patientDOB.split(" ")[0]
        : "N/A";
      this.mrn = currentPatientObj.patientMRN;
      this.gender = currentPatientObj.patientGender == "male" ? "M" : "F";
      this.age = this.getAge(this.birthdate);
    }

    //Calling patient and billing APIs
    this.httpClientService
      .getDateRangeDataWithBilling(this.dateRange, this.validity, this.mrn)
      .subscribe(results => {
        //console.log('RRRR...',results);
        // results[0] is observations
        // results[1] is billing
        this.observationActualResponse = results[0];
        console.log("first time");
        console.log(this.observationActualResponse);

        if (this.observationActualResponse.observations.length) {
          this.handleSuccessfulResponse(results[0]);
          this.cptResponse(results[1]);
          this.showWeeklyAvgTootipLabel = true;
        }
        this.isLoaderOn = false;
        if (this.patients.length == 0) {
          this.httpClientService.getPatients().subscribe((resp: any) => {
            //console.log('patinet resp..', resp);
            this.patients = resp;
            this.autoSelectCurrentPatient();
            let index = this.patients.findIndex(x => x.patientMRN === this.mrn);
            this.config.currentPage = Math.ceil((index + 1) / 10);
          });
        }
      });

    var lastFourWeekArr = [];
    var start_date_0 = "";
    var start_date_1 = "";
    var start_date_2 = "";
    var start_date_3 = "";
    var end_date_0 = "";
    var end_date_1 = "";
    var end_date_2 = "";
    var end_date_3 = "";

    var d0 = new Date(this.customDate);
    end_date_0 = d0.toISOString().slice(0, 10);
    d0.setDate(d0.getDate() - 6);
    start_date_0 = d0.toISOString().slice(0, 10);
    //console.log(start_date_0 + ">>>" + end_date_0);

    var d1 = new Date(this.customDate);
    d1.setDate(d1.getDate() - 13);
    start_date_1 = d1.toISOString().slice(0, 10);

    var d2 = new Date(this.customDate);
    d2.setDate(d2.getDate() - 7);
    end_date_1 = d2.toISOString().slice(0, 10);
    //console.log(start_date_1 + ">>>" + end_date_1);

    var d3 = new Date(this.customDate);
    d3.setDate(d3.getDate() - 20);
    start_date_2 = d3.toISOString().slice(0, 10);

    var d4 = new Date(this.customDate);
    d4.setDate(d4.getDate() - 14);
    end_date_2 = d4.toISOString().slice(0, 10);
    //console.log(start_date_2 + ">>>" + end_date_2);

    var d5 = new Date(this.customDate);
    d5.setDate(d5.getDate() - 27);
    start_date_3 = d5.toISOString().slice(0, 10);

    var d6 = new Date(this.customDate);
    d6.setDate(d6.getDate() - 21);
    end_date_3 = d6.toISOString().slice(0, 10);
    //console.log(start_date_3 + ">>>" + end_date_3);

    lastFourWeekArr[0] = { start_date: start_date_0, end_date: end_date_0 };
    lastFourWeekArr[1] = { start_date: start_date_1, end_date: end_date_1 };
    lastFourWeekArr[2] = { start_date: start_date_2, end_date: end_date_2 };
    lastFourWeekArr[3] = { start_date: start_date_3, end_date: end_date_3 };

    this.lastFourWeekArray = lastFourWeekArr;
  }

  handleSuccessfulResponse(resp) {
    //timeInMilliSeconds
    console.log("AKV response", resp);
    const response = JSON.parse(JSON.stringify(resp));
    var responseForCount = response.observations;
    if (this.validity == "Y") {
      console.log("met");
      var tempResp = [];
      tempResp = response.observations;
      var arrResp = [];
      var arrInvalidResp = [];
      tempResp.forEach((element, index) => {
        if (
          element.isValid != "Y" &&
          arrInvalidResp[element.date] == undefined
        ) {
          arrInvalidResp[element.date] = "consider";
          arrResp.push(element);
          //element.date
        } else {
          if (arrInvalidResp[element.date] != "consider") arrResp.push(element);
        }
      });
      console.log(arrResp);
      response.observations = arrResp;
    }

    //this.observationActualResponse = response;
    var observations1: any;

    // filter clinically valid data
    //observations = response.observations.filter((o, i) => o.isValid == 'Y' || o.isValid == null);

    var end_date = new Date(this.customDate).toISOString().slice(0, 10);
    var d = new Date(this.customDate);
    d.setDate(d.getDate() - (parseInt(this.dateRange) - 1));
    var start_date = d.toISOString().slice(0, 10);

    var graphObservations: any;
    if (this.validity == "Y" && this.isTableShow == true) {
      // filter clinically valid data for table
      observations1 = response.observations.filter(
        (o, i) =>
          (o.isValid == "Y" || o.isValid == null || o.isValid == "N") &&
          o.date >= start_date &&
          o.date <= end_date
      );
    } else if (this.validity == "Y" && this.isGraphShow == true) {
      // filter clinically valid data for graph seperately bcoz
      //some sbp dbp value need to be show as '---'.So need to remove invalid points.
      observations1 = response.observations.filter(
        (o, i) =>
          (o.isValid == "Y" || o.isValid == null) &&
          o.date >= start_date &&
          o.date <= end_date
      );
    } else {
      // show all data...
      observations1 = response.observations.filter(
        (o, i) => o.date >= start_date && o.date <= end_date
      );
    }

    if (this.validity == "Y") {
      this.observationCount = response.observations.filter(
        (o, i) => o.isValid == "Y" && o.date >= start_date && o.date <= end_date
      ).length;
    } else {
      this.observationCount = response.observations.filter(
        (o, i) =>
          (o.isValid == "Y" || o.isValid == "N") &&
          o.date >= start_date &&
          o.date <= end_date
      ).length;
    }

    this.observationMetCount = responseForCount.filter(
      (o, i) => o.isValid == "Y" && o.date >= start_date && o.date <= end_date
    ).length;

    this.observationAllCount = responseForCount.filter(
      (o, i) =>
        (o.isValid == "Y" || o.isValid == "N") &&
        o.date >= start_date &&
        o.date <= end_date
    ).length;

    //console.log(this.observationCount);
    if (observations1) {
      this.isLoaderOn = false;
    } else {
      this.isLoaderOn = true;
    }

    this.responseobservations = observations1;
    this.avgObservations = response.averageObservations;
    var averageObservations = response.averageObservations;
    var arr = [];

    var validity = this.validity;
    if (
      averageObservations &&
      averageObservations.length > 0 &&
      observations1.length > 0
    ) {
      averageObservations.forEach(function(object) {
        var res = [];
        var avgArr = [];
        res = observations1.filter(
          (o, i) => o.date >= object.startTime && o.date <= object.endTime
        );

        if (res.length > 0) {
          res[0].rowspan = res.length;

          if (validity == "Y" && object.ihmiAverage == "N/A") {
            res[0].Average = "Inadequate data";
            res[0].AverageSBP = "";
            res[0].AverageDBP = "";
            res[0].ihmiStrict = "N";
          } else if (validity == "Y" && object.ihmiAverage != "N/A") {
            res[0].Average = object.ihmiAverage;
            avgArr = object.ihmiAverage.split("/");
            res[0].AverageSBP = avgArr[0];
            res[0].AverageDBP = avgArr[1];
            res[0].ihmiStrict = "Y";
          } else if (
            object.ihmiAverage == "N/A" &&
            object.simpleAverage == "N/A"
          ) {
            res[0].Average = "Inadequate data";
            res[0].AverageSBP = "";
            res[0].AverageDBP = "";
            res[0].ihmiStrict = "N";
          } else if (object.ihmiAverage != "N/A") {
            res[0].Average = object.ihmiAverage;
            avgArr = object.ihmiAverage.split("/");
            res[0].AverageSBP = avgArr[0];
            res[0].AverageDBP = avgArr[1];
            res[0].ihmiStrict = "Y";
          } else {
            res[0].Average = object.simpleAverage;
            avgArr = object.simpleAverage.split("/");
            res[0].AverageSBP = avgArr[0];
            res[0].AverageDBP = avgArr[1];
            res[0].ihmiStrict = "N";
          }

          res.forEach(function(obj) {
            arr.push(obj);
          });
        }
      });
    }

    this.bpColumnRangeData = arr.sort((a, b) => {
      return parseInt(b.timeInMilliSeconds) - parseInt(a.timeInMilliSeconds);
    });

    this.setXAxisRange();
    this.setYAxisRange();
    this.setRequiredXYAxisData();
    this.refresh();
  }

  setRequiredXYAxisData() {
    let sbpYAxisInterval = this.options.yAxis[0].tickInterval;
    this.options.yAxis[0].min = this.minY;
    this.options.yAxis[0].max = this.maxY;
    //Dynamically plot lines on Y axis
    let belowPlotLine = {
      color: "lightgrey",
      width: 1,
      value: this.maxY - sbpYAxisInterval
    };
    let upperPlotLine = {
      color: "lightgrey",
      width: 1,
      value: this.maxY
    };
    this.options.yAxis[0].plotLines[2] = belowPlotLine;
    this.options.yAxis[0].plotLines[3] = upperPlotLine;
  }

  getArray(bpdata) {
    bpdata = bpdata.sort((a, b) => {
      return parseInt(a.timeInMilliSeconds) - parseInt(b.timeInMilliSeconds);
    });

    console.log(bpdata);

    this.sbpArr = [];
    this.dbpArr = [];
    this.heartRateArr = [];

    var y3 = new Array(bpdata.length);
    var y4 = new Array(bpdata.length);
    var arrheartRate = new Array();

    if (this.dateRange != "7" && this.dateRange != "30") {
      //to set scroll left side at x axis
      bpdata.push({
        timeInMilliSeconds: this.maxX,
        sbpValue: null,
        dbpValue: null,
        heartRate: null,
        isValid: null,
        patientComments: "",
        date: "",
        timeZone: null,
        isValidDevice: "N",
        device: null
      });
    }

    for (var i = 0; i < bpdata.length; i++) {
      var val = bpdata[i];

      let colorCodeForSbpDbp =
        parseInt(val.sbpValue) >= this.goal_sbp_value ||
        parseInt(val.dbpValue) >= this.goal_dbp_value
          ? "#ff0000"
          : "#313131";

      let symbol =
        val.isValidDevice == "Y" && val.isValid == "Y" && val.device
          ? "circle"
          : "cross";

      let validityDeviceJSon =
        val.isValidDevice == "Y"
          ? {
              isValidDevice: "Y",
              device: val.device.model,
              manufacturer: val.device.manufacturer,
              isValid: val.isValid
            }
          : {
              isValidDevice: "N",
              device: "Invalid device",
              isValid: val.isValid
            };

      let sbdData = {
        x: parseInt(val.timeInMilliSeconds),
        y: parseInt(val.sbpValue),
        color: colorCodeForSbpDbp,
        validityDeviceJSon,
        marker: {
          lineColor: colorCodeForSbpDbp,
          enabled: true,
          fillColor: colorCodeForSbpDbp,
          symbol: symbol,
          radius: 4, //override initial value (i.e 6 to 4) to show in graph
          states: {
            hover: {
              lineWidthPlus: 0
            }
          }
        }
      };

      let dbpData = {
        x: parseInt(val.timeInMilliSeconds),
        y: parseInt(val.dbpValue),
        color: colorCodeForSbpDbp,
        validityDeviceJSon,
        marker: {
          lineColor: colorCodeForSbpDbp,
          enabled: true,
          fillColor: colorCodeForSbpDbp,
          symbol: symbol,
          states: {
            hover: {
              lineWidthPlus: 0
            }
          }
        }
      };

      y3[i] = sbdData;
      y4[i] = dbpData;

      var hr = new Array(2);
      hr[0] = parseInt(val.timeInMilliSeconds);
      hr[1] = parseInt(val.heartRate);
      arrheartRate[i] = hr;
    }

    this.sbpArr = y3;
    this.dbpArr = y4;
    this.heartRateArr = arrheartRate;
  }

  getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  showTable(onlyDateRangeFilter = false) {
    this.isTableShow = true;
    this.isGraphShow = false;
    this.tableButtonClass = "nav-link active";
    this.graphButtonClass = "nav-link";
    this.isLoaderOn = true;

    if (onlyDateRangeFilter) {
      this.httpClientService
        .getDateRangeData(this.dateRange, this.validity, this.mrn)
        .subscribe(response => {
          this.observationActualResponse = response;
          this.handleSuccessfulResponse(response);
        });
    } else {
      if (this.observationActualResponse) {
        this.handleSuccessfulResponse(this.observationActualResponse);
      }
    }
  }

  showGraph(onlyDateRangeFilter = false) {
    this.isGraphShow = true;
    this.isTableShow = false;
    this.tableButtonClass = "nav-link";
    this.graphButtonClass = "nav-link active";
    this.isLoaderOn = true;
    console.log(this.options.rangeSelector);
    if (onlyDateRangeFilter) {
      this.httpClientService
        .getDateRangeData(this.dateRange, this.validity, this.mrn)
        .subscribe(response => {
          this.observationActualResponse = response;
          this.handleSuccessfulResponse(response);
        });
    } else {
      if (this.observationActualResponse) {
        this.handleSuccessfulResponse(this.observationActualResponse);
      }
    }
  }

  setDateRange(date_range_value) {
    this.dateRange = date_range_value;
    if (this.isGraphShow == true) {
      this.showGraph(true);
    }
    if (this.isTableShow == true) {
      this.showTable(true);
    }
  }

  setClinicalCriteria(clinical_criteria_value) {
    this.validity = clinical_criteria_value;
    this.isCountAll = clinical_criteria_value == "All" ? true : false;
    if (this.isGraphShow == true) {
      this.showGraph();
    }
    if (this.isTableShow == true) {
      this.showTable();
    }
  }

  createTiles() {
    /*
		Tiles creations started here ....
    */
    const tilesTopSeriesArr = [];
    const plotLinesArrOnXAxisArr = [];
    var tiles = [];
    var averageObservations = this.avgObservations;
    //console.log(averageObservations);
    var t = 0;
    var tempArr = [];
    var class_name = "";
    var sbp_class_name = "";
    var dbp_class_name = "";
    var sideOfTiles = "L";
    var naStartDate = "";
    var naEndDate = "";
    var tilesCount =
      parseInt(this.dateRange) / 7 >= 4 ? 4 : parseInt(this.dateRange) / 7;

    for (t = 0; t <= tilesCount - 1; t++) {
      sideOfTiles = t == 0 || t == 2 ? "L" : "R";
      class_name = "";
      sbp_class_name = "";
      dbp_class_name = "";
      if (
        averageObservations[t] == undefined ||
        (this.dateRange == "7" && t > 0)
      ) {
        // Not available...
        class_name =
          "weekCard highColor3 inadequateDate mar" + sideOfTiles + "-M15";
        sbp_class_name = "";
        dbp_class_name = "";

        naStartDate = this.lastFourWeekArray[t].start_date;
        naEndDate = this.lastFourWeekArray[t].end_date;

        tiles[t] = {
          isValidDevice: "N",
          inadequate_data: "NA",
          class_name: class_name,
          sbp: "",
          sbp_class_name: sbp_class_name,
          dbp: "",
          dbp_class_name: "",
          start_date: naStartDate,
          end_date: naEndDate
        };
      } else {
        if (
          this.validity == "Y" &&
          averageObservations[t].ihmiAverage != "N/A"
        ) {
          tempArr = averageObservations[t].ihmiAverage.split("/");
          if (tempArr[0] >= this.goal_sbp_value) {
            // coloring red  //weekCard marR-M15
            class_name = "weekCard highColor mar" + sideOfTiles + "-M15";
            sbp_class_name = "red";
          } else {
            // coloring black
            //class_name = 'weekCard mar' + sideOfTiles + '-M15';
            class_name = "weekCard highColor mar" + sideOfTiles + "-M15";
            sbp_class_name = "";
          }
          if (tempArr[1] >= this.goal_dbp_value) {
            // coloring red
            class_name = "weekCard highColor mar" + sideOfTiles + "-M15";
            dbp_class_name = "red";
          } else {
            // coloring black
            //class_name = 'weekCard mar' + sideOfTiles + '-M15';
            class_name = "weekCard highColor mar" + sideOfTiles + "-M15";
            dbp_class_name = "";
          }
          tiles[t] = {
            isValidDevice: "Y",
            inadequate_data: "N",
            class_name: class_name,
            sbp: tempArr[0],
            sbp_class_name: sbp_class_name,
            dbp: tempArr[1],
            dbp_class_name: dbp_class_name,
            start_date: averageObservations[t].startTime,
            end_date: averageObservations[t].endTime
          };
        } else if (
          this.validity == "Y" &&
          averageObservations[t].ihmiAverage == "N/A"
        ) {
          class_name =
            "weekCard highColor3 inadequateDate mar" + sideOfTiles + "-M15";
          sbp_class_name = "";
          dbp_class_name = "";
          tiles[t] = {
            isValidDevice: "Y",
            inadequate_data: "Y",
            class_name: class_name,
            sbp: "",
            sbp_class_name: sbp_class_name,
            dbp: "",
            dbp_class_name: dbp_class_name,
            start_date: averageObservations[t].startTime,
            end_date: averageObservations[t].endTime
          };
        } else if (
          averageObservations[t].ihmiAverage == "N/A" &&
          averageObservations[t].simpleAverage == "N/A"
        ) {
          class_name =
            "weekCard highColor3 inadequateDate mar" + sideOfTiles + "-M15";
          sbp_class_name = "";
          dbp_class_name = "";
          tiles[t] = {
            isValidDevice: "Y",
            inadequate_data: "Y",
            class_name: class_name,
            sbp: "",
            sbp_class_name: sbp_class_name,
            dbp: "",
            dbp_class_name: dbp_class_name,
            start_date: averageObservations[t].startTime,
            end_date: averageObservations[t].endTime
          };
        } else if (averageObservations[t].ihmiAverage != "N/A") {
          tempArr = averageObservations[t].ihmiAverage.split("/");
          if (tempArr[0] >= this.goal_sbp_value) {
            // coloring red  //weekCard marR-M15
            class_name = "weekCard highColor mar" + sideOfTiles + "-M15";
            sbp_class_name = "red";
          } else {
            // coloring black
            //class_name = 'weekCard mar' + sideOfTiles + '-M15';
            class_name = "weekCard highColor mar" + sideOfTiles + "-M15";
            sbp_class_name = "";
          }
          if (tempArr[1] >= this.goal_dbp_value) {
            // coloring red
            class_name = "weekCard highColor mar" + sideOfTiles + "-M15";
            dbp_class_name = "red";
          } else {
            // coloring black
            //class_name = 'weekCard mar' + sideOfTiles + '-M15';
            class_name = "weekCard highColor mar" + sideOfTiles + "-M15";
            dbp_class_name = "";
          }
          tiles[t] = {
            isValidDevice: "Y",
            inadequate_data: "N",
            class_name: class_name,
            sbp: tempArr[0],
            sbp_class_name: sbp_class_name,
            dbp: tempArr[1],
            dbp_class_name: dbp_class_name,
            start_date: averageObservations[t].startTime,
            end_date: averageObservations[t].endTime
          };
        } else {
          tempArr = averageObservations[t].simpleAverage.split("/");
          if (tempArr[0] >= this.goal_sbp_value) {
            // coloring red  //weekCard marR-M15
            class_name = "weekCard highColor2 mar" + sideOfTiles + "-M15";
            sbp_class_name = "red";
          } else {
            // coloring black
            //class_name = 'weekCard mar' + sideOfTiles + '-M15';
            class_name = "weekCard highColor2 mar" + sideOfTiles + "-M15";
            sbp_class_name = "";
          }
          if (tempArr[1] >= this.goal_dbp_value) {
            // coloring red
            class_name = "weekCard highColor2 mar" + sideOfTiles + "-M15";
            dbp_class_name = "red";
          } else {
            // coloring black
            //class_name = 'weekCard mar' + sideOfTiles + '-M15';
            class_name = "weekCard highColor2 mar" + sideOfTiles + "-M15";
            dbp_class_name = "";
          }

          tiles[t] = {
            isValidDevice: "Y",
            inadequate_data: "N",
            class_name: class_name,
            sbp: tempArr[0],
            sbp_class_name: sbp_class_name,
            dbp: tempArr[1],
            dbp_class_name: dbp_class_name,
            start_date: averageObservations[t].startTime,
            end_date: averageObservations[t].endTime
          };
        }
      }
      let deviceLength = this.showTilesVDL(t, true);
      tiles[t]["deviceLength"] = deviceLength;
      //set device length to show device icon
      tiles[t]["deviceIcon"] =
        tiles[t].deviceLength &&
        tiles[t].isValidDevice == "Y" &&
        tiles[t].inadequate_data != "NA" &&
        tiles[t].inadequate_data != "Y"
          ? true
          : false;

      //Data use to plot lines on X Axis
      let dateToTimestamp7 = new Date(tiles[t].end_date).getTime();
      let dateToTimestamp7Start = new Date(tiles[t].start_date).getTime();
      plotLinesArrOnXAxisArr.push({
        color: "lightgrey",
        width: 1,
        value: dateToTimestamp7 - 330 * 60 * 1000 * 0
      });
      //Data use to make new series above Y xais
      tilesTopSeriesArr.push(
        this.setTilesSeriesData(t, tilesCount, dateToTimestamp7Start, tiles)
      );
      if (t == tilesCount - 1) {
        //plot line for last left x axis using start date  (for t = 0 to tilesCount - 2 take endDate and for t = last take startDate)
        plotLinesArrOnXAxisArr.push({
          color: "lightgrey",
          width: 1,
          value: dateToTimestamp7Start - 330 * 60 * 1000 * 0
        });

        //add series data (start of the date (e.g 1st June) for left side of X Axis)
        let tilesTemp2 = {
          x: this.minX, //need to set maxX
          y: null,
          sbp: null,
          dbp: null,
          deviceIcon: null,
          weekDateRange: null
        };
        tilesTopSeriesArr.push(tilesTemp2);
      }
    }
    this.tilesArr = tiles;

    //sort data as per highchart graph
    this.tilesTopSeries = tilesTopSeriesArr.sort((a, b) => {
      return parseInt(a.x) - parseInt(b.x);
    });
    //set dataLabel arra values in global var
    this.plotLinesArrOnXAxis = plotLinesArrOnXAxisArr;

    /*
		Tiles creations ends here ....
		*/
  }

  setTilesSeriesData(
    t: number,
    tilesCount: number,
    dateToTimestamp7Start: number,
    tiles: any
  ) {
    let extraDaysInTimeStamp = 24 * 60 * 60 * 1000;
    let tilesTemp = {
      x:
        t !== tilesCount - 1
          ? dateToTimestamp7Start + extraDaysInTimeStamp
          : dateToTimestamp7Start + 2 * extraDaysInTimeStamp, //+1 day (24*60*60*1000) more to make data symettric (3+1, 10, 17, 24),
      y: this.maxY,
      sbp: tiles[t].sbp,
      dbp: tiles[t].dbp,
      deviceIcon: tiles[t].deviceIcon,
      weekDateRange:
        this.datePipe.transform(tiles[t].start_date, "MMMM d") +
        " - " +
        this.datePipe.transform(tiles[t].end_date, "MMMM d")
    };
    return tilesTemp;
  }

  refresh() {
    this.createTiles();
    if (this.isGraphShow == true) {
      this.options.xAxis.labels.dateRange = this.dateRange;

      this.options.yAxis[0].plotLines[0].value = this.goal_dbp_value;
      this.options.yAxis[0].plotLines[1].value = this.goal_sbp_value;

      Highcharts.setOptions({
        // time:{
        // 	timezone:"GMT+15:30",
        // 	timezoneOffset: 19800000
        // },
        time: {
          useUTC: true,
          timezoneOffset: -330
        }
      });

      console.log(this.bpColumnRangeData);
      this.getArray(this.bpColumnRangeData);

      //Dynamically plot lines on X axis
      //this.plotLinesArrOnXAxis = this.getPlottedLinesData("xAxis");
      this.options.xAxis.plotLines = this.plotLinesArrOnXAxis;

      if (this.dateRange != "7" && this.dateRange != "30") {
        this.options.rangeSelector.buttons[1].count = 30;
        this.options.scrollbar.enabled = true;
      } else {
        this.options.rangeSelector.buttons[1].count = parseInt(this.dateRange);
        this.options.scrollbar.enabled = false;
      }

      this.chart = Highcharts.chart("container", this.options);
      this.chart.series[0].setData(this.sbpArr, true);
      this.chart.series[1].setData(this.dbpArr, true);
      this.chart.series[2].setData(this.heartRateArr, true);

      //Dynamically set tiles series
      this.chart.series[this.chart.series.length - 1].setData(
        this.tilesTopSeries,
        true
      );

      this.chart.redraw();
    }
    if (this.isTableShow == true) {
      //Below code is use for date change in Table view
      let bpdata = this.bpColumnRangeData; //console.log(bpdata)
      this.minDate = parseInt(bpdata[bpdata.length - 1].timeInMilliSeconds);
      this.maxDate = parseInt(bpdata[0].timeInMilliSeconds);
    }
  }

  increaseSbpGoal(sbpgoal) {
    var val = parseInt(sbpgoal) + 5;
    if (val > 160) {
      this.goal_sbp_value = 160;
    } else {
      this.goal_sbp_value = val;
    }

    this.refresh();
  }

  increaseDbpGoal(dbpgoal) {
    var val = parseInt(dbpgoal) + 5;
    if (val > 90) {
      this.goal_dbp_value = 90;
    } else {
      this.goal_dbp_value = val;
    }
    this.refresh();
  }

  decreaseSbpGoal(sbpgoal) {
    var val = parseInt(sbpgoal) - 5;
    if (val < 110) {
      this.goal_sbp_value = 110;
    } else {
      this.goal_sbp_value = val;
    }
    this.refresh();
  }

  decreaseDbpGoal(dbpgoal) {
    var val = parseInt(dbpgoal) - 5;
    if (val < 70) {
      this.goal_dbp_value = 70;
    } else {
      this.goal_dbp_value = val;
    }
    this.refresh();
  }

  showComment(id) {
    this.showComments = true; // Show-Hide Modal Check
    this.rowId = id;
    this.patientComment = document.getElementById(
      "patientComment" + this.rowId
    ).innerHTML;
  }
  //Bootstrap Modal Close event
  hideComment() {
    this.showComments = false;
  }

  showVDL(id) {
    this.showVDLModal = true; // Show-Hide Modal Check
    this.model = document.getElementById("model" + id).innerHTML;
    this.manufacturer = document.getElementById("manufacturer" + id).innerHTML;
  }

  hideVDL() {
    this.showVDLModal = false;
  }

  showTilesVDL(tileIndex, isDeviceLen = false) {
    this.showTilesVDLModal = !isDeviceLen ? true : false;

    var varObservations = this.bpColumnRangeData;
    varObservations = varObservations.filter(
      (o, i) =>
        o.date >= this.lastFourWeekArray[tileIndex].start_date &&
        o.date <= this.lastFourWeekArray[tileIndex].end_date
    );

    varObservations = Array.from(
      new Set(
        varObservations.map(obj => {
          return obj.device
            ? obj.device.model + "###" + obj.device.manufacturer
            : false;
        })
      )
    );

    var arrModel = [];
    var arrManufacturer = [];

    varObservations = varObservations.filter(Boolean);
    //console.log(varObservations);
    for (var i = 0; i < varObservations.length; i++) {
      arrModel[i] = varObservations[i].split("###")[0];
      arrManufacturer[i] = varObservations[i].split("###")[1];
    }

    this.arrModel = arrModel;
    this.arrManufacturer = arrManufacturer;

    if (isDeviceLen) {
      return this.arrModel.length;
    }
  }

  hideTilesVDL() {
    this.showTilesVDLModal = false;
  }

  expandCollaps() {
    this.expand = !this.expand;

    this.expandClass = this.expand == true ? "" : "open";
    this.leftPannelChange = this.expand == true ? "leftPannelChange" : "";
    this.bodyWrapClass =
      this.expand == true
        ? "bodyWrapSection bodyWrapSection-full"
        : "bodyWrapSection";

    if (this.isGraphShow == true) {
      //set graph width as per container width dynamically
      setTimeout(() => {
        if (this.chart) {
          this.chart.setSize(null, null); //set null for responsiveness
        }
        //this.showGraph();
      }, 300);
    }

    if (this.isTableShow == true) {
      this.showTable();
    }
  }

  subHeaderToggleAction() {
    this.subHeaderExpand = !this.subHeaderExpand;

    this.subHeaderClass =
      this.subHeaderExpand == true
        ? "subHeader-moreInfo subHeader-hide"
        : "subHeader-moreInfo";

    this.subHeaderContent =
      this.subHeaderExpand == true
        ? "subHeader-content showSection"
        : "subHeader-content";

    this.subHeaderToggle =
      this.subHeaderExpand == true ? "subHeaderShow close2" : "subHeaderShow";
  }

  getAge(birthDateString) {
    const today = new Date();
    const birthDate = new Date(birthDateString);

    const yearsDifference = today.getFullYear() - birthDate.getFullYear();

    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      return yearsDifference - 1 > 0 ? yearsDifference - 1 : 0;
    }

    return yearsDifference > 0 ? yearsDifference : 0;
  }

  cptResponse(cptresponse: any) {
    console.log("BR..", cptresponse);
    let dateObject = this.httpClientService.getDates(this.dateRange);
    let compDate = this.getCompDate(dateObject, 30);
    this.billingInfo.lastBilledDate = cptresponse.lastBilledDate;
    this.billingInfo.lastBilledDateFlag =
      cptresponse.lastBilledDate <= compDate ? true : false;

    this.billingInfo.devicesUsedArr = cptresponse.devices;
    this.billingInfo.countDevices = cptresponse.devices
      ? cptresponse.devices.length
      : 0;

    this.billingInfo.countOfObservationReviewed = this.observationAllCount;

    this.billingInfo.billingAverage =
      cptresponse.billingAverage === "N/A" ||
      cptresponse.billingAverage === null
        ? "Inadequate Data For Average"
        : cptresponse.billingAverage;
    this.billingInfo.billingAverageFlag =
      cptresponse.billingAverage === "N/A" ||
      cptresponse.billingAverage === null
        ? false
        : true;

    this.billingInfo.patientMRN = this.mrn;
    this.billingInfo.patientName = this.fname + " " + this.lname;

    this.billingInfo.isCarePlanUpdated = cptresponse.isCarePlanUpdated;
    this.billingInfo.isCarePlanCommunicated =
      cptresponse.isCarePlanCommunicated;
  }

  getCompDate(dateObject: any, days: number) {
    let date_minus_from_end_date = new Date(dateObject.end_date);
    date_minus_from_end_date.setDate(date_minus_from_end_date.getDate() - days);
    let day = date_minus_from_end_date.getDate();
    let month = date_minus_from_end_date.getMonth() + 1;
    let year = date_minus_from_end_date.getFullYear();
    return year + "-" + ("0" + month).slice(-2) + "-" + ("0" + day).slice(-2);
  }

  showDevicesUsed() {
    this.showDevicesUsedModal = true;
  }

  //Dynamic Y-Axis settings
  setYAxisRange() {
    let rangeDataTemp = this.bpColumnRangeData;
    let sbpYAxisInterval = this.options.yAxis[0].tickInterval;
    if (rangeDataTemp.length > 0) {
      //SBP
      let maxValue = Math.max.apply(
        Math,
        rangeDataTemp.map(function(o) {
          return o.sbpValue;
        })
      );
      let remValue = maxValue % sbpYAxisInterval;
      let extraValue =
        remValue == 0
          ? sbpYAxisInterval
          : sbpYAxisInterval - remValue + sbpYAxisInterval;
      this.maxY = maxValue + extraValue;

      //DBP
      this.minY = Math.max.apply(
        Math,
        rangeDataTemp.map(function(o) {
          return o.dbpValue;
        })
      );

      //Heart Rate
      this.maxYHeartRate = Math.max.apply(
        Math,
        rangeDataTemp.map(function(o) {
          return o.heartRate;
        })
      );
      this.minYHeartRate = Math.min.apply(
        Math,
        rangeDataTemp.map(function(o) {
          return o.heartRate;
        })
      );
    }
  }

  //Set X Axis range
  setXAxisRange() {
    let actualObj = this.observationActualResponse.observations;
    console.log(this.observationActualResponse);
    //bpdata = bpdata.filter(ob=>ob.sbpValue != null)
    //setting min-x and max-x
    this.minX = parseInt(actualObj[actualObj.length - 1].timeInMilliSeconds);
    console.log(">>min>>" + this.minX);
    this.options.xAxis.min = this.minX;
    this.minDate = this.minX;

    var d = new Date(parseInt(actualObj[0].timeInMilliSeconds));
    var d1 = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    this.maxX = d1.getTime();
    console.log("mmmxxx", this.maxX);
    this.options.xAxis.max = this.maxX;
    this.maxDate = parseInt(actualObj[0].timeInMilliSeconds);
  }

  //review complete btn functionality implemetation
  reviewComplete() {
    this.billingInfo.showBillingReviewdModal = true;

    this.billingInfo.reviewDate = new Date();
    this.billingInfo.fromDate = this.minDate;
    this.billingInfo.toDate = this.maxDate;

    this.billingInfo.isCarePlanUpdated = this.elemRefCpu.nativeElement.checked
      ? "Y"
      : "N";
    this.billingInfo.isCarePlanCommunicated = this.elemRefCpc.nativeElement
      .checked
      ? "Y"
      : "N";

    this.showBillingReview = true;
    this.billingInfo.error = false;

    if (
      this.elemRefCpu.nativeElement.checked &&
      this.elemRefCpc.nativeElement.checked &&
      this.billingInfo.lastBilledDateFlag &&
      this.billingInfo.countDevices > 0 &&
      this.billingInfo.countOfObservationReviewed >= 12 &&
      this.billingInfo.billingAverageFlag
    ) {
      let postBillingReviewdData = {
        mrn: this.mrn,
        isReviewed: "Y",
        isCarePlanUpdated: this.billingInfo.isCarePlanUpdated,
        isCarePlanCommunicated: this.billingInfo.isCarePlanCommunicated
      };

      this.httpClientService
        .reviewBillingAPi(postBillingReviewdData)
        .subscribe((resp: any) => {
          if (resp.success) {
            this.billingInfo.error = false;
          } else {
            this.billingInfo.error = true;
          }
          //this.hideReviewCompleteMsg();
        });
    } else {
      this.billingInfo.error = true;
      this.hideReviewCompleteMsg();
    }
  }

  hideReviewCompleteMsg() {
    setTimeout(() => {
      //to make sure if error the after few seconds pop will gone
      if (this.billingInfo.error) {
        this.showBillingReview = false;
      }
    }, 5000);
  }

  public reviewCheckBoxChanged(eventDone: boolean) {
    if (eventDone) {
      this.elemRefCpu.nativeElement.checked = false;
      this.elemRefCpc.nativeElement.checked = false;
    }
  }

  ngOnDestroy() {
    if (this.authListenerSubs) this.authListenerSubs.unsubscribe();
  }
}
