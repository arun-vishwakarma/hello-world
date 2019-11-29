import { Component, OnInit, OnDestroy } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormControl } from "@angular/forms";

import * as Highcharts from "highcharts/highstock";
import { HttpclientService } from "../service/httpclient.service";
import { AppConstants } from "../constant";

import { Subscription } from "rxjs";
import { AuthService } from "../shared/services/auth.service";

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

  rangeArr: any = [];
  flagArr: any = [];
  flagDBPArr: any = [];
  flagNotMetArr: any = [];
  flagNotMetDBPArr: any = [];
  deviceDetailsArr: any = [];

  heartRateArr: any = [];
  category: any = [];

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

  scrollDataArr: any = [];
  //currentTimeZoneOffsetInHours:any;

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
          let nextLegendWidth = maxItemWidth * 2 + itemDistance;
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
          let nextLegendWidth = maxItemWidth * 2 + itemDistance;
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
      }
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
        min: 40,
        gridLineColor: "transparent",
        max: 220,
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
        connectNulls: true
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
        var tooltipDbp =
          '<tr><td></td></tr><tr><td></td></tr><tr><td><span style="font-weight:bold;">DBP: </span><span style="color:' +
          this.points[1].color +
          '">' +
          this.points[1].y +
          " mmHg</span></td></tr>";
        var tooltipHeartRate =
          '<tr><td></td></tr><tr><td></td></tr><tr><td><span style="font-weight:bold;">Heart Rate: </span>' +
          this.points[4].y +
          " bpm</td></tr>";

        if (
          this.points[2].series.name == "Not met clinical criteria" ||
          this.points[2].series.name == "Not met clinical criteria SBP"
        ) {
          var tooltipProfile =
            '<tr><td></td></tr><tr><td></td></tr><tr><td class="checkTextBox"><span>Clinical Profile </span> <i class="fa fa-times-circle colorCancel"></i></td></tr>';
          //var tooltipProfile = '<tr><td></td></tr><tr><td></td></tr><tr><td><span style="font-weight:bold;">Clinical Profile</span>  <img style="width:16px;height:16px" src="/assets/images/cross-flat.png"/></td></tr>';
        } else {
          var tooltipProfile =
            '<tr><td></td></tr><tr><td></td></tr><tr><td class="checkTextBox"><span>Clinical Profile </span> <i class="fa fa-check-circle colorTick"></i></td></tr>';
        }

        if (this.points[6] && this.points[6].point.isValidDevice == "Y") {
          var tooltipmanufacturer =
            '<tr><td></td></tr><tr><td></td></tr><tr style="border-bottom: 1px solid #bdbdbd;"><td></td><tr><td></td></tr><tr><td></td></tr></tr><tr><td></td></tr><tr><td><span style="font-weight:bold;">Manufacturer: </span>' +
            this.points[2].point.manufacturer +
            "</td></tr>";
          var tooltipModel =
            '<tr><td></td></tr><tr><td></td></tr><tr><td><span style="font-weight:bold;">Model: </span>' +
            this.points[2].point.device +
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
      //useHTML: true,
      itemDistance: 0,
      padding: 0,
      //width:800,
      x: 50,
      //		itemWidth:350,
      itemStyle: {
        width: 350
      },
      labelFormatter: function() {
        if (this.name == "Met clinical criteria") {
          //DBP or SBP above BP goal
          return '<div style="width:50%; font-size:12px;"><span style="float:right;">Met clinical profile, SBP or DBP at or above goal</span></div>';
        }

        if (this.name == "Met clinical criteria SBP") {
          return '<div style="width:50%; font-size:12px;"><span style="float:right;">Met clinical profile, SBP and DBP within goal</span></div>';
        }

        if (this.name == "Not met clinical criteria") {
          // this.legendSymbol.destroy();//BP reading didn't meet clinical profile

          //return '<div style="width:50%;"><span style="float:right;padding:9px">Not met clinical criteria, beyond goal</span></div>';
          //return '<div style="width:50%;"><span style="float:right;padding:9px">Didn\'t meet clinical profile, above goal</span></div>';
          return '<div style="width:50%;font-size:12px;"><span style="float:right;">Didn\'t meet clinical profile, SBP or DBP at or above goal</span></div>';
        }

        if (this.name == "Not met clinical criteria SBP") {
          // this.legendSymbol.destroy();//
          //return '<div style="width:50%;"><span style="float:right;padding:9px">Didn\'t meet clinical profile, within goal</span></div>';
          return '<div style="width:50%; font-size:12px;"><span style="float:right;">Didn\'t meet clinical profile, SBP and DBP within goal</span></div>';
        }

        if (this.name == "Heart Rate") {
          return '<div style="width:50%; font-size:12px;"><span style="float:right;">Heart Rate</span></div>';
        }

        if (this.name == "Goal BP") {
          return '<div style="width:50%; font-size:12px;"><span style="float:right;">Goal BP</span></div>';
        }

        if (this.name == "ValidatedDeviceForSbp") {
          return '<div style="width:50%; font-size:12px;"><span style="float:right;">Validated Device</span></div>';
        }
      }
    },
    series: [
      {
        name: "SBP",

        data: this.sbpArr,

        id: "seriesSbp",

        color: "red",

        lineWidth: 1,

        showInLegend: false,

        events: {
          legendItemClick: () => false // disable legend click
        },

        dashStyle: "LongDashDotDot",

        tooltip: {
          //pointFormat: '<br/><span style="color:{point.color}"><b>{series.name}</b></span>: <span style="color:{point.color}">{point.y}</span> <br/>',
          pointFormat: ""
        },

        marker: {
          enabled: false
          //symbol: 'circle',

          //radius: 3
        },

        states: {
          hover: {
            lineWidthPlus: 1
          }
        },

        zones: [
          {
            value: this.goal_sbp_value,

            color: "#505050"
          },
          {
            color: "red"
          }
        ]
      },
      {
        name: "DBP",

        data: this.dbpArr,

        id: "dbp",

        lineWidth: 1,

        color: "black",

        dashStyle: "LongDashDotDot",

        showInLegend: false,

        events: {
          legendItemClick: () => false // disable legend click
        },

        tooltip: {
          pointFormat: ""
          //pointFormat: '<br/><span style="color:{point.color}"><b>{series.name}</b></span>: <span style="color:{point.color}">{point.y}</span><br/>',
        },

        marker: {
          enabled: false
          //symbol: 'circle',

          //radius: 3
        },

        states: {
          hover: {
            lineWidthPlus: 1
          }
        },

        zones: [
          {
            value: this.goal_dbp_value,

            color: "#505050"
          },
          {
            color: "red"
          }
        ]
      },

      {
        name: "Not met clinical criteria",

        lineWidth: 0,

        data: this.flagNotMetDBPArr,

        showInLegend: true,

        legendIndex: 3,

        events: {
          legendItemClick: () => false // disable legend click
        },

        //enableMouseTracking: true,

        onSeries: "dbp",

        color: "red",

        states: {
          hover: {
            lineWidthPlus: 0
          },

          inactive: {
            opacity: 1
          }
        },

        marker: {
          enabled: true,

          symbol: "triangle",

          radius: 5
        },

        zones: [
          {
            value: this.goal_dbp_value,

            color: "black"
          },
          {
            color: "red"
          }
        ],

        tooltip: {
          pointFormat: ""
          //pointFormat: '<br/><span style="color:black;font-weight:bold;">Didn\'t meet clinical profile</span><br/><span style="color:black;font-weight:bold;">Model: </span>{point.device}<br/><span style="color:black;font-weight:bold;">Manufacturer: </span>{point.manufacturer}<br/>'
        }
      },

      {
        name: "Not met clinical criteria SBP",

        lineWidth: 0,

        data: this.flagNotMetArr,

        showInLegend: true,

        legendIndex: 2,

        events: {
          legendItemClick: () => false // disable legend click
        },

        color: "black",

        enableMouseTracking: true,

        onSeries: "seriesSbp",

        marker: {
          enabled: true,
          symbol: "triangle",
          radius: 5
        },

        zones: [
          {
            value: this.goal_sbp_value,

            color: "black"
          },
          {
            color: "red"
          }
        ],

        states: {
          hover: {
            lineWidthPlus: 0
          },

          inactive: {
            opacity: 1
          }
        },

        tooltip: {
          pointFormat: ""
        }
      },

      {
        name: "Met clinical criteria",

        lineWidth: 0,

        data: this.flagDBPArr,

        showInLegend: true,

        legendIndex: 1,

        events: {
          legendItemClick: () => false // disable legend click
        },

        enableMouseTracking: true,

        onSeries: "dbp",

        color: "red",

        states: {
          hover: {
            lineWidthPlus: 0
          },

          inactive: {
            opacity: 1
          }
        },

        marker: {
          enabled: true,

          symbol: "circle",

          radius: 3
        },

        zones: [
          {
            value: this.goal_dbp_value,

            color: "black"
          },
          {
            color: "red"
          }
        ],

        tooltip: {
          pointFormat: ""
          //pointFormat: '<br/><span style="color:black;font-weight:bold;">Met clinical profile</span><br/><span style="color:black;font-weight:bold;">Model: </span>:{point.device}<br/><span style="color:black;font-weight:bold;">Manufacturer: </span>:{point.manufacturer}<br/>'
        }
      },

      {
        name: "Met clinical criteria SBP",

        lineWidth: 0,

        data: this.flagArr,

        showInLegend: true,

        legendIndex: 0,

        events: {
          legendItemClick: () => false // disable legend click
        },

        color: "black",

        enableMouseTracking: true,

        onSeries: "seriesSbp",

        marker: {
          enabled: true,

          symbol: "circle",

          radius: 3
        },

        zones: [
          {
            value: this.goal_sbp_value,

            color: "black"
          },
          {
            color: "red"
          }
        ],

        states: {
          hover: {
            lineWidthPlus: 0
          },

          inactive: {
            opacity: 1
          }
        },

        tooltip: {
          pointFormat: ""
        }
      },

      {
        type: "line",

        lineWidth: 1,

        name: "Heart Rate",

        dashStyle: "Dot",

        legendIndex: 4,

        data: this.heartRateArr,

        id: "HeartRate",

        marker: {
          enabled: true,

          radius: 3,

          symbol: "circle"
        },

        yAxis: 1,

        color: "grey",

        showInLegend: true,

        events: {
          legendItemClick: () => false // disable legend click
        },

        tooltip: {
          valueSuffix: " bpm"
          //pointFormat: '<br/><span style="color:{point.color}"><b>{series.name}</b></span>: <span style="color:{point.color}">{point.y}</span><br/>'
        },

        states: {
          hover: {
            lineWidthPlus: 1
          }
        }
      },
      {
        type: "line",
        name: "Goal BP",
        color: "lightgrey",
        dashStyle: "Dash",
        legendIndex: 5,
        marker: {
          enabled: false,

          //radius: 3,

          symbol: "dashline"
        }
      },

      {
        data: this.validDeviceMarkerArr,
        name: "ValidatedDeviceForSbp",
        linkedTo: "seriesSbp",
        lineWidth: 0,
        legendIndex: 6,
        showInLegend: true,
        tooltip: {
          //pointFormat: '<br/><span style="color:black;"><b>Devices Used</b></span>: <span>{point.isValidDevice}</span><br/>'
          pointFormat: ""
        },
        marker: {
          radius: 8,
          lineColor: "black",
          fillColor: "transparent",
          lineWidth: 1,
          symbol: "circle",
          //enabledThreshold:0,
          enabled: true
        },
        states: {
          hover: {
            lineWidthPlus: 0,
            lineWidth: 0
          }
        },

        zones: [
          {
            value: this.goal_sbp_value,
            color: "#505050"
          },
          {
            color: "red"
          }
        ]

        //color: 'white'
      },
      {
        data: this.validDeviceMarkerDbpArr,
        name: "ValidatedDeviceForDbp",
        linkedTo: "dbp",
        lineWidth: 0,
        showInLegend: false,
        tooltip: {
          pointFormat: ""
        },
        marker: {
          radius: 8,
          lineColor: "black",
          fillColor: "transparent",
          lineWidth: 1,
          symbol: "circle",
          enabled: true
        },
        states: {
          hover: {
            lineWidthPlus: 0,
            lineWidth: 0
          }
        },

        zones: [
          {
            value: this.goal_dbp_value,

            color: "#505050"
          },
          {
            color: "red"
          }
        ]
        //color: 'white'
      }
    ]
  };

  constructor(
    private httpClientService: HttpclientService,
    private authService: AuthService
  ) {
    //console.log("construuuu", this.observationActualResponse);
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

    //this.mrn = 1818;
    //this.httpClientService.getDateRangeData(this.dateRange, this.validity, this.mrn).subscribe(response => this.handleSuccessfulResponse(response));

    /* this.httpClientService.getDateRangeData(90,this.validity,this.mrn).subscribe(response => this.handleSuccessfulResponse(response));		
		this.httpClientService.getObservationCPT(this.dateRange,this.mrn).subscribe(cptresponse => this.cptResponse(cptresponse)); */

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

    // var end_date = new Date().toISOString().slice(0, 10);
    // var d = new Date();
    // d.setDate(d.getDate() - (dateRange-1));
    // var start_date = d.toISOString().slice(0, 10);
    // return {start_date:start_date,end_date:end_date};

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

    //this.createTiles();

    this.refresh();

    // if (this.isGraphShow == true) {
    // 	this.options.series[1].zones[0].value = this.goal_sbp_value;
    // 	this.options.series[2].zones[0].value = this.goal_dbp_value;
    // 	this.options.series[3].zones[0].value = this.goal_dbp_value;
    // 	this.options.series[4].zones[0].value = this.goal_sbp_value;
    // 	this.options.series[5].zones[0].value = this.goal_sbp_value;
    // 	this.options.series[6].zones[0].value = this.goal_dbp_value;

    // 	this.options.yAxis[0].plotLines[0].value = this.goal_dbp_value;
    // 	this.options.yAxis[0].plotLines[1].value = this.goal_sbp_value;
    // 	this.chart = Highcharts.chart('container', this.options);

    // 	//console.log(this.chart);
    // 	this.getArray(this.bpColumnRangeData);
    // 	this.chart.series[0].setData(this.rangeArr, true);
    // 	this.chart.series[1].setData(this.sbpArr, true);
    // 	this.chart.series[2].setData(this.dbpArr, true);

    // 	this.chart.series[3].setData(this.flagNotMetDBPArr, true);
    // 	this.chart.series[4].setData(this.flagNotMetArr, true);

    // 	this.chart.series[5].setData(this.flagArr, true);
    // 	this.chart.series[6].setData(this.flagDBPArr, true);

    // 	this.chart.series[7].setData(this.heartRateArr, true);

    // 	this.chart.redraw();
    // }
  }
  /* getDateRangeData() {
		this.dateRange = (<HTMLInputElement>document.getElementById("dateRange")).value;
		this.validity = (<HTMLInputElement>document.getElementById("selectValue")).value;
		this.httpClientService.getDateRangeData(this.dateRange, this.validity, this.mrn).subscribe(response => this.handleSuccessfulResponse(response));
	} */
  getArray(bpdata) {
    //console.log('array start here...');
    //bpdata = bpdata.filter((o, i) => o.sbpValue != null);

    bpdata = bpdata.sort((a, b) => {
      return parseInt(a.timeInMilliSeconds) - parseInt(b.timeInMilliSeconds);
    });

    console.log(bpdata);
    this.rangeArr = [];
    this.flagArr = [];
    this.flagDBPArr = [];
    this.flagNotMetArr = [];
    this.flagNotMetDBPArr = [];

    this.sbpArr = [];
    this.dbpArr = [];

    this.heartRateArr = [];
    this.category = [];

    var y3 = new Array(bpdata.length);
    var y4 = new Array(bpdata.length);
    var y5 = new Array();
    var arrflag = new Array();
    var arrflagDBP = new Array();
    var arrflagNotMet = new Array();
    var arrflagNotMetDBP = new Array();

    var deviceDetails = new Array();
    var validDeviceMarker = new Array();
    var validDeviceMarkerDbp = new Array();

    var arrheartRate = new Array();

    var arrModel = new Array();

    var arrManufacturer = new Array();

    var category = new Array();

    var annotationLabels = new Array();
    var plotLinesArray = new Array();

    var k = 0;
    var kk = 0;
    var ii = 0;
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

    this.scrollDataArr = [];
    for (var i = 0; i < bpdata.length; i++) {
      var val = bpdata[i];
      /* var sbp = new Array(2);
      sbp[0] = parseInt(val.timeInMilliSeconds);
      sbp[1] = parseInt(val.sbpValue);

      var dbp = new Array(2);
      dbp[0] = parseInt(val.timeInMilliSeconds);
      dbp[1] = parseInt(val.dbpValue);

      y3[i] = sbp;
      y4[i] = dbp; */

      let sbp = [];
      let colorCodeForSbpDbp =
        parseInt(val.sbpValue) >= 135 || parseInt(val.dbpValue) >= 85
          ? "red"
          : "black";

      let sbdData = {
        x: parseInt(val.timeInMilliSeconds),
        y: parseInt(val.sbpValue),
        color: colorCodeForSbpDbp
        /* marker: {
          enabled: true,
          fillColor: colorCodeForSbpDbp
        } */
      };
      sbp.push(sbdData);
      let dbp = [];
      let dbpData = {
        x: parseInt(val.timeInMilliSeconds),
        y: parseInt(val.dbpValue),
        color: colorCodeForSbpDbp
        /* marker: {
          enabled: true,
          fillColor: colorCodeForSbpDbp
        } */
      };
      dbp.push(dbpData);

      y3[i] = sbdData;
      y4[i] = dbpData;

      var hr = new Array(2);

      hr[0] = parseInt(val.timeInMilliSeconds);
      hr[1] = parseInt(val.heartRate);

      arrheartRate[i] = hr;

      if (val.isValidDevice == "Y") {
        deviceDetails[i] = {
          x: parseInt(val.timeInMilliSeconds),
          y: parseInt(val.sbpValue),
          isValidDevice: "Y",
          device: val.device.model,
          manufacturer: val.device.manufacturer
        };

        validDeviceMarker.push({
          x: parseInt(val.timeInMilliSeconds),
          y: parseInt(val.sbpValue),
          isValidDevice: "Y",
          title: " ",
          text: " "
        });
        validDeviceMarkerDbp.push({
          x: parseInt(val.timeInMilliSeconds),
          y: parseInt(val.dbpValue),
          isValidDevice: "Y",
          title: " ",
          text: " "
        });

        //this.scrollDataArr.push({x: parseInt(val.timeInMilliSeconds), y: parseInt(val.dbpValue), isValidDevice: "Y", title: " ", text: " "});
      } else {
        deviceDetails[i] = {
          x: parseInt(val.timeInMilliSeconds),
          y: parseInt(val.sbpValue),
          isValidDevice: "N",
          device: "Invalid Device"
        };

        //this.scrollDataArr.push({x: parseInt(val.timeInMilliSeconds), y:0, isValidDevice: "", title: " ", text: " "});
      }

      if (val.isValid == "Y") {
        arrflag[k] = {
          x: parseInt(val.timeInMilliSeconds),
          y: parseInt(val.sbpValue),
          title: " ",
          text: " ",
          marker: {
            enabled: true,
            fillColor: colorCodeForSbpDbp
          }
        };
        if (val.isValidDevice == "Y") {
          arrflagDBP[k] = {
            x: parseInt(val.timeInMilliSeconds),
            y: parseInt(val.dbpValue),
            title: " ",
            text: " ",
            isValidDevice: "Y",
            device: val.device.model,
            manufacturer: val.device.manufacturer,
            marker: {
              enabled: true,
              fillColor: colorCodeForSbpDbp
            }
          };
        } else {
          arrflagDBP[k] = {
            x: parseInt(val.timeInMilliSeconds),
            y: parseInt(val.dbpValue),
            title: " ",
            text: " ",
            isValidDevice: "N",
            device: "",
            manufacturer: "",
            marker: {
              enabled: true,
              fillColor: colorCodeForSbpDbp
            }
          };
        }
        k++;
      } else {
        arrflagNotMet[kk] = {
          x: parseInt(val.timeInMilliSeconds),
          y: parseInt(val.sbpValue),
          title: " ",
          text: " ",
          marker: {
            enabled: true,
            fillColor: colorCodeForSbpDbp
          }
        };
        if (val.isValidDevice == "Y") {
          arrflagNotMetDBP[kk] = {
            x: parseInt(val.timeInMilliSeconds),
            y: parseInt(val.dbpValue),
            title: " ",
            text: " ",
            isValidDevice: "Y",
            device: val.device.model,
            manufacturer: val.device.manufacturer,
            marker: {
              enabled: true,
              fillColor: colorCodeForSbpDbp
            }
          };
        } else {
          arrflagNotMetDBP[kk] = {
            x: parseInt(val.timeInMilliSeconds),
            y: parseInt(val.dbpValue),
            title: " ",
            text: " ",
            isValidDevice: "N",
            device: "",
            manufacturer: "",
            marker: {
              enabled: true,
              fillColor: colorCodeForSbpDbp
            }
          };
        }
        //plotLinesArray[kk] = { color: 'grey', width: .5, value: parseInt(val.timeInMilliSeconds) };
        //annotationLabels[kk] = { point: { xAxis: 0, yAxis: 0, x: parseInt(val.timeInMilliSeconds), y: 210 }, text: ' ' };
        kk++;
      }

      var model = new Array(2);
      model[0] = parseInt(val.timeInMilliSeconds);
      model[1] = val.isValidDevice == "Y" ? val.device.model : "";
      var manufacturer = new Array(2);
      manufacturer[0] = parseInt(val.timeInMilliSeconds);
      manufacturer[1] = val.isValidDevice == "Y" ? val.device.manufacturer : "";
      arrModel[i] = model;
      arrManufacturer[i] = manufacturer;
      ii++;
    }

    this.flagArr = arrflag;
    this.sbpArr = y3;
    this.dbpArr = y4;

    this.flagDBPArr = arrflagDBP;
    this.flagNotMetArr = arrflagNotMet;
    this.flagNotMetDBPArr = arrflagNotMetDBP;

    this.heartRateArr = arrheartRate;
    this.category = category;

    this.modelArr = arrModel;
    this.manufacturerArr = arrManufacturer;

    this.deviceDetailsArr = deviceDetails;
    this.validDeviceMarkerArr = validDeviceMarker;

    this.validDeviceMarkerDbpArr = validDeviceMarkerDbp;
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

    //this.httpClientService.getObservationCPT(this.dateRange,this.mrn).subscribe(cptresponse => this.cptResponse(cptresponse));
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
    for (t = 0; t <= 3; t++) {
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

        // if(averageObservations[t].ihmiAverage == 'N/A'){
        // class_name = 'weekCard highColor3 mar'+sideOfTiles+'-M15';
        // sbp_class_name = '';
        // dbp_class_name = '';
        // tiles[t] = {inadequate_data:'Y',class_name:class_name,sbp:'',sbp_class_name:sbp_class_name,dbp:'',dbp_class_name:dbp_class_name,start_date:'',end_date:''};
        // }else{
        // tempArr = averageObservations[t].ihmiAverage.split('/');
        // if(tempArr[0] >= this.goal_sbp_value){
        // 	// coloring red  //weekCard marR-M15
        // 	class_name = 'weekCard highColor mar'+sideOfTiles+'-M15';
        // 	sbp_class_name = 'red';

        // }else{
        // 	// coloring black
        // 	class_name = 'weekCard mar'+sideOfTiles+'-M15';
        // 	sbp_class_name = '';
        // }
        // if(tempArr[1] >= this.goal_dbp_value){
        // 	// coloring red
        // 	class_name = 'weekCard highColor mar'+sideOfTiles+'-M15';
        // 	dbp_class_name = 'red';
        // }else{
        // 	// coloring black
        // 	class_name = 'weekCard mar'+sideOfTiles+'-M15';
        // 	dbp_class_name = '';
        // }
        // tiles[t] = {inadequate_data:'N',class_name:class_name,sbp:tempArr[0],sbp_class_name:sbp_class_name,dbp:tempArr[1],dbp_class_name:dbp_class_name,start_date:averageObservations[t].startTime,end_date:averageObservations[t].endTime};
        // }
      }
      let deviceLength = this.showTilesVDL(t, true);
      tiles[t]["deviceLength"] = deviceLength;
    }
    this.tilesArr = tiles;
    /*
		Tiles creations ends here ....
		*/
  }

  refresh() {
    this.createTiles();
    if (this.isGraphShow == true) {
      this.options.xAxis.labels.dateRange = this.dateRange;

      this.options.series[0].zones[0].value = this.goal_sbp_value;
      this.options.series[1].zones[0].value = this.goal_dbp_value;
      this.options.series[2].zones[0].value = this.goal_dbp_value;
      this.options.series[3].zones[0].value = this.goal_sbp_value;
      this.options.series[4].zones[0].value = this.goal_dbp_value;
      this.options.series[5].zones[0].value = this.goal_sbp_value;

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

      //console.log(this.chart);
      this.getArray(this.bpColumnRangeData);

      if (this.dateRange != "7" && this.dateRange != "30") {
        this.options.rangeSelector.buttons[1].count = 30;
        this.options.scrollbar.enabled = true;
      } else {
        this.options.rangeSelector.buttons[1].count = parseInt(this.dateRange);
        this.options.scrollbar.enabled = false;
      }

      this.chart = Highcharts.chart("container", this.options);

      //this.chart.series[0].setData(this.rangeArr, true);
      this.chart.series[0].setData(this.sbpArr, true);
      this.chart.series[1].setData(this.dbpArr, true);

      this.chart.series[2].setData(this.flagNotMetDBPArr, true);
      this.chart.series[3].setData(this.flagNotMetArr, true);

      this.chart.series[4].setData(this.flagDBPArr, true);
      this.chart.series[5].setData(this.flagArr, true);

      this.chart.series[6].setData(this.heartRateArr, true);

      this.chart.series[8].setData(this.validDeviceMarkerArr, true);
      this.chart.series[9].setData(this.validDeviceMarkerDbpArr, true);
      this.chart.redraw();

      /* if (document.querySelector(".highcharts-scrollbar")) {
        document
          .querySelector(".highcharts-scrollbar")
          .lastElementChild.dispatchEvent(new Event("click"));
      } */
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

  ngOnDestroy() {
    if (this.authListenerSubs) this.authListenerSubs.unsubscribe();
  }
}
