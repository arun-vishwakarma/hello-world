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
//import { borderBottomRightRadius } from "html2canvas/dist/types/css/property-descriptors/border-radius";

declare var require: any;
let Boost = require("highcharts/modules/boost");
let noData = require("highcharts/modules/no-data-to-display");
let More = require("highcharts/highcharts-more");
let Dumbbell = require("highcharts/modules/dumbbell");
let Export = require("highcharts/modules/exporting");
let ExportData = require("highcharts/modules/export-data");
let Accessibility = require("highcharts/modules/accessibility");

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
Export(Highcharts);
ExportData(Highcharts);
Dumbbell(Highcharts);
Accessibility(Highcharts);

@Component({
  selector: "app-patients",
  templateUrl: "./patients.component.html",
  styleUrls: [
    "./patients.component.css",
    "../../../node_modules/highcharts/css/stocktools/gui.css"
  ]
})
export class PatientsComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  patients: any = [];
  selectedPatient: string = "";
  billingInfo: any = {};
  showWeeklyAvgTootipLabel: boolean = false;
  //utcTimeOffset: number = 330 * 60 * 1000;
  timezoneOffset: number = 330;
  ttTopClass: boolean = false;
  limitYAxisFlag: boolean = true;
  isRxShow: boolean = false;

  public config: any = {
    id: "custom",
    itemsPerPage: 10,
    currentPage: 1,
    maxSize: 7
  };

  eventLogData: any = [];

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
  rxButtonClass: any = "nav-link";
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
  tilesMetCriteriaSeries: any = [];

  avgArr: any = [];
  averageArr: any = [];
  averageSBPArr: any = [];
  averageDBPArr: any = [];

  gridColumnData: any = [];

  rxDetailsActualResponse: any;
  rxEventsActualResponse: any;
  rxEventArr: any = [];

  public options: any = {
    // time: {
    // 	timezoneOffset: this.currentTimeZoneOffsetInHours
    // },
    chart: {
      //styledMode: true,
      height: 645,
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
      // offset: 100,
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
      //gridLineWidth: 1,
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
        rotation: -45,
        style: {
          color: "grey",
          fontWeight: "bold",
          fontSize: "12px"
        }
      },
      plotLines: [] // this.plotLinesArrOnXAxis
      /* events: {
        setExtremes: function(e) {                  
        }
      } */
    },

    scrollbar: {
      enabled: false
    },
    exporting: {
      enabled: false,
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
        height: "65%",
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
            color: "grey",
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
            color: "grey",
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
        top: "80%",
        height: "20%",
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
        //stickyTracking: false,
        connectNulls: true,
        //use to remove hover
        states: {
          hover: {
            enabled: false
          },
          inactive: {
            opacity: 1
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
      /* positioner: function(labelWidth, labelHeight, point) {
        let y = point.plotY > 400 ? point.plotY - 300 : point.plotY;
        if (point.plotX > 500) {
          return { x: point.plotX - labelWidth + 70, y };
        }
        return { x: point.plotX + 100, y };
      }, */
      formatter: function() {
        //return "";
        //console.log("sn", this.points[0].series.name);
        if (this.points[0].series.name == "Rx") {
          //console.log(this.points[0].point, this.points[0].x);

          var evtList = "";
          var evtListStopped = "";
          var evtMedDiscontinued = "";

          this.points[0].point.eventData[this.points[0].x].forEach(evtData => {
            //var dateML = new Date(evtData["effectiveDateInMilis"]);
            /* var HHMM =
              " " +
              ("0" + dateML.getHours()).slice(-2) +
              ":" +
              ("0" + dateML.getMinutes()).slice(-2); */

            //Meditaion started/active
            if (evtData["status"] == "active") {
              evtList += "<li><b>" + evtData["medicationDesc"] + "</b></br>";
              evtList += "<b>Frequency</b>: " + evtData["frequency"] + "</br>";
              evtList +=
                "<b>Started on</b>: " + evtData["effectiveDate"] + "</li>";
            }
            //Meditaion discontinued
            if (
              evtData["status"] == "stopped" ||
              evtData["status"] == "inactive" ||
              evtData["status"] == "completed"
            ) {
              evtListStopped +=
                "<li><b>" + evtData["medicationDesc"] + "</b></br>";
              evtListStopped +=
                "<b>Frequency</b>: " + evtData["frequency"] + "</br>";
              evtListStopped +=
                "<b>Discontinued on</b>: " + evtData["effectiveDate"] + "</li>";
            }
          });

          if (evtList != "") {
            evtList =
              "<div><h6>Meditation(s) started</h6><ul>" +
              evtList +
              "</ul></div>";
          }

          //Add Meditaion discontinued
          if (evtListStopped != "") {
            if (evtList != "") evtMedDiscontinued = "<hr>";
            evtMedDiscontinued +=
              "<div><h6>Meditation(s) discontinued</h6><ul>" +
              evtListStopped +
              "</ul></div>";
          }

          var tooltipRx =
            "<div class='rxTooltip'>" + evtList + evtMedDiscontinued + "</div>";

          return tooltipRx;
        }

        if (!this.points[2]) return ""; //use to remove undefined error on tooltip

        if (this.points[0].series.name == "Average") {
          console.log(this.points[0]);
          var tooltipHeader =
            '<div class="graphPopsection"><table width="100%" class="popGraphTable"><tr><td class="heading">' +
            this.points[0].point.weekDateRange +
            '</td></tr><tr><td><div  style="height:12px;"></div></td></tr>';

          var tooltipSubHeader =
            '<tr><td></td></tr><tr style="border-bottom: 1px solid #bdbdbd;"><td></td></tr><tr><td></td></tr><tr><td></td></tr><tr><td><span style="font-weight:bold;">Weekly Average: </span><span style="color:' +
            +'">' +
            "</span></td></tr>";

          var tooltipSbp =
            '<tr><td></td></tr><tr style="border-bottom: 1px solid #bdbdbd;"><td></td></tr><tr><td></td></tr><tr><td></td></tr><tr><td><span style="font-weight:bold;">SBP: </span><span style="color:' +
            this.points[0].color +
            '">' +
            this.points[0].point.high +
            " mmHg</span></td></tr>";

          var tooltipDbp = this.points[1]
            ? '<tr><td></td></tr><tr><td></td></tr><tr><td><span style="font-weight:bold;">DBP: </span><span style="color:' +
              this.points[0].color +
              '">' +
              this.points[0].point.low +
              " mmHg</span></td></tr>"
            : "";

          if (this.points[0].isIhmiStrict) {
            var metClinicalProfile =
              '<tr><td></td></tr><tr><td></td></tr><tr><td class="checkTextBox last"><span>Clinical Profile </span> <i class="fa fa-check-circle colorTick"></i></td></tr>';
          } else {
            var metClinicalProfile =
              '<tr><td></td></tr><tr><td></td></tr><tr><td class="checkTextBox"><span>Clinical Profile </span> <i class="fa fa-times-circle colorCancel"></i></td></tr>';
          }
          var deviceListHeader = "";
          var deviceModel = "";
          var deviceManufacturer = "";
          var deviceList = "";
          var validDevice = "";
          var deviceNumber = 1;
          for (
            var i = 0;
            i < this.points[0].point.deviceinfo.model.length;
            i++
          ) {
            deviceListHeader =
              '<tr><td></td></tr><tr style="border-bottom: 1px solid #bdbdbd;"><td></td></tr><tr><td></td></tr><tr><td></td></tr><tr><td><span style="font-weight:bold;">Device ' +
              deviceNumber +
              " </span>";

            deviceModel =
              '<tr><td></td></tr><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr><tr><td><span style="font-weight:bold;">Model: </span><span style="color:' +
              '">' +
              this.points[0].point.deviceinfo.model[i] +
              "</span></td></tr>";

            deviceManufacturer =
              '<tr><td></td></tr><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr><tr><td><span style="font-weight:bold;">Manufacturer: </span><span style="color:' +
              '">' +
              this.points[0].point.deviceinfo.manufacturer[i] +
              "</span></td></tr>";

            validDevice =
              '<tr><td></td></tr><tr><td></td></tr><tr><td class="checkTextBox last"><span>Device Used</span> <i class="fa fa-check-circle colorTick"></i></td></tr>';
            deviceList =
              deviceList +
              deviceListHeader +
              deviceManufacturer +
              deviceModel +
              validDevice;
            deviceNumber++;
          }

          return (
            tooltipHeader +
            tooltipSubHeader +
            tooltipSbp +
            tooltipDbp +
            metClinicalProfile +
            deviceList +
            "</table>"
          );
        }

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
      x: 0,
      // itemWidth:800,
      itemStyle: {
        width: 350,
        float: "left"
      },
      align: "left",
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
          return '<div class="graphlist3"><i style="font-size:5px" class="fa fa-circle"></i> Heart Rate</div>';
        }

        if (this.name == "Goal BP") {
          return "<div class='graphlist4'>Red-Above Goal</div>";
        }

        if (this.name == "Goal BP legend") {
          return "<div class='graphlist5'>Black-Below Goal</div>";
        }
        if (this.name == "Rx") {
          return "<div class='graphlist6'> <img src='/assets/images/rx-graph-icon.png'> HTN Medication Event</div>";
        }
        /* if (this.name == "Toggle Heartrate Graph") {
          return "<div class='graphlist7'>  Toggle Graph <input type='checkbox' name='tg'></div>";
        } */
      }
    },
    series: [
      {
        name: "SBP",
        color: "black",
        data: this.sbpArr,
        dashStyle: "LongDashDotDot",
        lineWidth: 0, //remove line
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
        legendIndex: 0,
        zIndex: 99999999999999,
        events: {
          legendItemClick: () => false // disable legend click
        }
      },
      {
        name: "DBP",
        color: "black",
        data: this.dbpArr,
        id: "dbp",
        dashStyle: "LongDashDotDot",
        lineWidth: 0, //remove line
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
        legendIndex: 1,
        zIndex: 9999999999999,
        events: {
          legendItemClick: () => false // disable legend click
        }
      },

      {
        type: "line",
        lineWidth: 0.5,
        name: "Heart Rate",
        legendIndex: 4,
        data: this.heartRateArr,
        id: "HeartRate",

        //dashStyle: "Dot",
        marker: {
          enabled: true,
          radius: 2,
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
        },
        events: {
          legendItemClick: () => false // disable legend click
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
        },
        events: {
          legendItemClick: () => false // disable legend click
        }
      },
      {
        name: "Average",
        color: "black",
        linkedTo: "SBP",
        data: this.averageArr,
        type: "dumbbell",
        connectorWidth: 3,
        connectNulls: true,
        marker: {
          enabled: true,
          symbol: "circle",
          lineWidth: 2, //this is also must to use this to show cross icon
          radius: 6 //use 6 to show large circle in legend and further override in sbp data array
        },
        states: {
          hover: {
            lineWidthPlus: 1
          }
        }
      },
      {
        name: "AverageSBP",
        color: "black",
        data: this.averageSBPArr,
        lineWidth: 1,
        connectNulls: true,
        marker: {
          enabled: true,
          symbol: "circle",
          lineWidth: 2, //this is also must to use this to show cross icon
          radius: 6 //use 6 to show large circle in legend and further override in sbp data array
        },
        states: {
          hover: {
            lineWidthPlus: 1
          }
        }
      },
      {
        name: "AverageDBP",
        color: "black",
        data: this.averageDBPArr,
        connectNulls: true,
        lineWidth: 1,
        marker: {
          enabled: true,
          symbol: "circle",
          lineWidth: 2, //this is also must to use this to show cross icon
          radius: 6 //use 6 to show large circle in legend and further override in sbp data array
        },
        states: {
          hover: {
            lineWidthPlus: 1
          }
        }
      },
      {
        name: "weeklyavg",
        color: "black",
        data: [],
        dashStyle: "LongDashDotDot",
        lineWidth: 0, //remove line
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
        name: "Rx",
        color: "blue",
        data: this.rxEventArr,
        dashStyle: "LongDashDotDot",
        lineWidth: 0, //remove line
        //required to take marker with any symbol value as default to show cross icon on graph
        marker: {
          symbol: "url(/assets/images/rx-graph-icon.png)",
          lineWidth: 2, //this is also must to use this to show cross icon
          radius: 6 //use 6 to show large circle in legend and further override in sbp data array
        },
        states: {
          hover: {
            lineWidthPlus: 0
          }
        },
        showInLegend: true,
        legendIndex: 5,
        zIndex: 99999999999999,
        events: {
          legendItemClick: () => false // disable legend click
        }
      },
      {
        name: "",
        type: "column",
        //pointWidth: 1,
        showInLegend: false,
        legendIndex: 100000,
        color: "lightgrey",
        pointStart: 0,
        pointInterval: 12 * 3600 * 1000, // one day,
        data: this.gridColumnData, //[[1561507200000-330*60*1000,160]]
        zIndex: -1000000000
      },

      //use to just show in legend
      /* {
        type: "line",
        name: "Toggle Heartrate Graph",
        color: "lightgrey",
        dashStyle: "Dash",
        legendIndex: 6,
        showInLegend: true,
        lineWidth: 0,
        marker: {
          enabled: false,
          //radius: 3,
          symbol: "dashline"
        },
        events: {
          legendItemClick: () => {
            alert(123);
          }
        }
      }, */
      {
        name: "Tiles Met Criteria",
        type: "line",
        data: [], //this.tilesTopSeries,
        marker: {
          enabled: false //make it false
        },
        styledMode: true,
        lineWidth: 0,
        dataLabels: {
          enabled: true,
          backgroundColor: "#6d31d1",
          borderRadius: 30,
          //borderWidth: 2,
          //borderColor: "#6d31d1",
          padding: 2,
          position: "center",
          align: "center",
          y: -8,
          useHTML: false,
          shape: "callout",
          formatter: function() {
            //return '<span class="tilesMCLabelSeries">MET PROCEDURAL CRITERIA</span>';
            return '<span style="color:#6d31d1;stroke-width:0">..</span>MET PROCEDURAL CRITERIA<span style="color:#6d31d1;stroke-width:0">..</span>';
          },
          style: {
            textAlign: "center",
            fontWeight: "normal",
            fontSize: "7px",
            color: "white",
            strokeWidth: 1,
            whiteSpace: "normal !important"
          },
          states: {
            inactive: {
              opacity: 1 //always to make opacity 1 (on hover)
            }
          }
        },
        showInLegend: false,
        states: {
          hover: {
            lineWidthPlus: 0
          }
        }
      },
      //top tiles series TS
      {
        name: "Tiles",
        type: "line",
        data: [], //this.tilesTopSeries,
        marker: {
          enabled: false //make it false
        },
        styledMode: true,
        lineWidth: 0,
        dataLabels: [
          {
            enabled: true,
            position: "center",
            align: "center",
            y: 8,

            /*  x: 60,
            y: 4, */
            //alignTo: "toPlotEdges",
            /* format:
              '<div style="color:red;margin-left:20px;margin-top:10px;float:left;">AAAAAAA<br/>BBB</div><div><img height="50" width="50" src="https://www.highcharts.com/forum/styles/anami/theme/images/highcharts-logo.svg"/></div>',
            useHTML: true, */

            useHTML: false,
            shape: "callout",
            formatter: function() {
              if (!this.point.weekDateRange) return;

              //return this.point.y + "#" + this.point.x;

              let weeklyAvgValue: any; //, weekAvgClass: any, deviceIcon: any;
              if (this.point.deviceIcon) {
                //deviceIcon = '<img src="/assets/images/icon_bp_machine.png"/>';
                weeklyAvgValue =
                  "<span class='graphWeekText'>Weekly Average: <b>" +
                  this.point.sbp +
                  "/" +
                  this.point.dbp +
                  "</b></span>";
                //weekAvgClass = "week-vy";
              } else {
                //deviceIcon = "";
                weeklyAvgValue =
                  '<span class="graphInadequate">Inadequate Data For Average</span>';
                //weekAvgClass = "week-vn";
              }

              return (
                weeklyAvgValue +
                '<br/><span style="color:#ffffff;stroke-width:0">....</span>' +
                "<span class='graphDateText'>" +
                this.point.weekDateRange +
                "</span>"
              );
            },
            style: {
              textAlign: "center"
            },
            states: {
              inactive: {
                opacity: 1 //always to make opacity 1 (on hover)
              }
            }
          }
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

  //@ViewChild("rc_msg", { static: false }) elemRefRcmsg: ElementRef;

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

  selectPatient(currentPatient: any = null) {
    this.limitYAxisFlag = true;

    //reset review complete checkbox
    this.reviewCheckBoxChanged(true);
    this.showBillingReview = false;

    //by default graph view in each case
    if (this.isTableShow || this.isRxShow) {
      this.showGraph();
    }

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

  //Set Events Log data
  setEventLogData(bpObserVation, weeklyAverage, htn) {
    Array.prototype.push.apply(this.eventLogData, bpObserVation.observations);
    Array.prototype.push.apply(this.eventLogData, weeklyAverage);
    Array.prototype.push.apply(this.eventLogData, htn);
    //console.log("evevt logogo", this.eventLogData);
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
      this.gender =
        currentPatientObj.patientGender == "male" ? "Male" : "Female";
      this.age = this.getAge(this.birthdate);
    }

    //Calling patient and billing APIs
    this.httpClientService
      .getDateRangeDataWithBilling(this.dateRange, this.validity, this.mrn)
      .subscribe(results => {
        console.log("RRRR...", results);
        // results[0] is observations
        // results[1] is billing
        this.observationActualResponse = results[0];
        this.rxDetailsResponse(results[2]);
        this.rxEventsResponse(results[3]);

        this.setEventLogData(results[0], results[1], results[3]);

        console.log("first time");
        console.log(this.observationActualResponse);

        if (this.observationActualResponse.observations.length) {
          this.handleSuccessfulResponse(results[0]);
          this.cptResponse(results[1]);
          this.rxDetailsResponse(results[2]);
          this.rxEventsResponse(results[3]);
          //this.cptResponse(results[3]);
          this.showWeeklyAvgTootipLabel = true;
          //this.addTilesTooltipElement();
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

    //this.lastFourWeekArray = lastFourWeekArr;

    const allWeekArr = [];
    let iEndDateO: any = new Date(this.customDate);
    let iEndDate = iEndDateO.toISOString().slice(0, 10);
    iEndDateO.setDate(iEndDateO.getDate() - 6);
    let iStartDate = iEndDateO.toISOString().slice(0, 10);
    allWeekArr.push({ start_date: iStartDate, end_date: iEndDate });
    for (let dl = 0; dl < 12; dl++) {
      let iEndDateO: any = new Date(allWeekArr[dl].end_date);
      iEndDateO.setDate(iEndDateO.getDate() - 7);
      let iEndDate = iEndDateO.toISOString().slice(0, 10);

      let iStartDateO: any = new Date(allWeekArr[dl].start_date);
      iStartDateO.setDate(iStartDateO.getDate() - 7);
      let iStartDate = iStartDateO.toISOString().slice(0, 10);
      allWeekArr.push({ start_date: iStartDate, end_date: iEndDate });
    }

    this.lastFourWeekArray = allWeekArr;
    console.log("allWeekArr ", allWeekArr);
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

  get extraTickInterVal() {
    return this.minY <= 60 && this.maxY >= 220 && +this.dateRange > 30
      ? true
      : false;
  }

  get topYaxisInterVal() {
    if (this.extraTickInterVal) {
      return 2 * this.options.yAxis[0].tickInterval;
    } else {
      return this.options.yAxis[0].tickInterval;
    }
  }

  get scrollWithFixMaxMinY() {
    return this.minY <= 60 && this.maxY == 180 && +this.dateRange > 30
      ? true
      : false;
  }

  get isScroll() {
    return +this.dateRange > 30 ? true : false;
  }

  setRequiredXYAxisData() {
    let sbpYAxisInterval = this.options.yAxis[0].tickInterval;
    this.options.yAxis[0].min = this.minY;
    this.options.yAxis[0].max = this.maxY;

    //console.log("fff", this.minY, this.maxY, this.dateRange);

    if (this.extraTickInterVal) {
      sbpYAxisInterval = 2 * sbpYAxisInterval;
      this.ttTopClass = true; //to hide Y axis top 2 lables
    } else {
      this.ttTopClass = false;
    }

    //Dynamically plot lines on Y axis
    let belowPlotLine = {
      color: "lightgrey",
      zIndex: 5,
      width: 1,
      value: this.maxY - sbpYAxisInterval
    };
    let upperPlotLine = {
      color: "lightgrey",
      width: 1,
      value: this.maxY
    };

    let bottomPlotLine = {
      color: "lightgrey",
      width: 1,
      value: this.minY
    };

    this.options.yAxis[0].plotLines[2] = belowPlotLine;
    this.options.yAxis[0].plotLines[3] = upperPlotLine;

    this.options.yAxis[0].plotLines[4] = bottomPlotLine;
    this.options.yAxis[0].className = "white-cls"; //to hide left y axis top label
  }

  // Accepts the array and key
  groupBy = (array, key) => {
    // Return the end result
    return array.reduce((result, currentValue) => {
      // If an array already present for key, push it to the array. Else create an array and push the object
      //console.log("cccc", currentValue);
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
      return result;
    }, {}); // empty object is the initial value for result object
  };

  getRxEvents(rxEventData) {
    //console.log("rxEventData", rxEventData);

    var rx = [];
    var eventData = {};
    for (var i = 0; i < rxEventData.length; i++) {
      var effectiveDateInMS =
        new Date(rxEventData[i].effectiveDate).getTime() -
        this.timezoneOffset * 60 * 1000;

      eventData[effectiveDateInMS] = this.groupBy(rxEventData, "effectiveDate")[
        rxEventData[i].effectiveDate
      ];
      /* eventData[effectiveDateInMS] = this.groupBy(
        rxEventData,
        "medicationDesc"
      )[rxEventData[i]["medicationDesc"]]; */

      /* console.log(
        "this.maxY - this.topYaxisInterVal",
        this.maxY,
        this.topYaxisInterVal,
        this.scrollWithFixMaxMinY,
        this.minX,
        this.maxX
      ); */

      if (effectiveDateInMS >= this.minX) {
        rx[i] = {
          x: effectiveDateInMS,
          y:
            this.maxY -
            this.topYaxisInterVal -
            (this.scrollWithFixMaxMinY === true ? 5.5 : 7.5) +
            (this.isScroll ? 0.1 : 2.6),
          eventData
        };
      }
    }
    console.log("rx", rx, eventData);

    var resRxArr = [];
    rx.forEach(function(item) {
      var i = resRxArr.findIndex(x => x.x == item.x);
      if (i <= -1) {
        resRxArr.push({ x: item.x, y: item.y, eventData });
      }
    });

    resRxArr = resRxArr.sort((a, b) => {
      return parseInt(a.x) - parseInt(b.x);
    });

    return resRxArr;
  }

  getArray(bpdata, rxEventData = null) {
    bpdata = bpdata.sort((a, b) => {
      return parseInt(a.timeInMilliSeconds) - parseInt(b.timeInMilliSeconds);
    });

    var averageData = this.avgObservations;

    //console.log(bpdata);

    this.sbpArr = [];
    this.dbpArr = [];
    this.heartRateArr = [];

    this.rxEventArr = [];
    var rx = this.getRxEvents(rxEventData);

    var y3 = new Array(bpdata.length);
    var y4 = new Array(bpdata.length);
    var y5 = new Array();
    var y6 = new Array();
    var y7 = new Array();
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

    for (var k = 0; k < averageData.length; k++) {
      if (averageData[k].ihmiAverage == "N/A") {
        // consider simple avg
        var avg = averageData[k].simpleAverage;
        var isIhmiStrict = false;
      } else {
        //consider ihmi strict
        var avg = averageData[k].ihmiAverage;
        var isIhmiStrict = true;
      }

      let avgDBP = parseInt(avg.split("/")[1]);

      let avgSBP = parseInt(avg.split("/")[0]);

      let colorCodeForSbpDbp =
        avgSBP >= this.goal_sbp_value || avgDBP >= this.goal_dbp_value
          ? "#ff0000"
          : "#313131";

      let symbol = isIhmiStrict == true ? "circle" : "cross";

      let validityDeviceJSon = {};

      var d = new Date(averageData[k].endTime);
      var n =
        d.getTime() +
        (24 * 60 * 60 * 1000 - 1000) -
        this.timezoneOffset * 60 * 1000;
      let avgData1 = {
        x: n,
        isIhmiStrict: isIhmiStrict,
        color: colorCodeForSbpDbp,
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
        },
        low: avgDBP,
        high: avgSBP,
        weekDateRange:
          this.datePipe.transform(averageData[k].startTime, "MMMM d") +
          " - " +
          this.datePipe.transform(averageData[k].endTime, "MMMM d"),
        deviceinfo: this.deviceInfo({
          start_date: averageData[k].startTime,
          end_date: averageData[k].endTime
        })
      };

      y5[k] = avgData1;

      let avgSBPData = {
        x: n,
        y: avgSBP,
        isIhmiStrict: isIhmiStrict,
        color: colorCodeForSbpDbp,
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

      y6[k] = avgSBPData;

      let avgDBPData = {
        x: n,
        y: avgDBP,
        isIhmiStrict: isIhmiStrict,
        color: colorCodeForSbpDbp,
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

      y7[k] = avgDBPData;
    }

    y5 = y5.sort((a, b) => {
      return parseInt(a.x) - parseInt(b.x);
    });

    y6 = y6.sort((a, b) => {
      return parseInt(a.x) - parseInt(b.x);
    });

    y7 = y7.sort((a, b) => {
      return parseInt(a.x) - parseInt(b.x);
    });

    if (this.validity == "Y") {
      y5 = y5.filter(o => o.isIhmiStrict == true);
      y6 = y6.filter(o => o.isIhmiStrict == true);
      y7 = y7.filter(o => o.isIhmiStrict == true);
    }

    this.sbpArr = y3;
    this.dbpArr = y4;
    this.averageArr = y5;
    this.averageSBPArr = y6;
    this.averageDBPArr = y7;

    this.heartRateArr = arrheartRate;
    this.rxEventArr = rx;
    console.log("Rx Arr", this.rxEventArr);
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
    this.isRxShow = false;
    this.isTableShow = true;
    this.isGraphShow = false;
    this.tableButtonClass = "nav-link active";
    this.graphButtonClass = "nav-link";
    this.rxButtonClass = "nav-link";
    this.isLoaderOn = true;

    if (onlyDateRangeFilter) {
      this.httpClientService
        .getDateRangeData(this.dateRange, this.validity, this.mrn)
        .subscribe(response => {
          //this.observationActualResponse = response;
          //this.handleSuccessfulResponse(response);

          this.observationActualResponse = response[0]; // changes after Rx Table introduced
          this.handleSuccessfulResponse(response[0]); // changes after Rx Table introduced
        });
    } else {
      if (this.observationActualResponse) {
        this.handleSuccessfulResponse(this.observationActualResponse);
      }
    }
  }

  showGraph(onlyDateRangeFilter = false) {
    this.isRxShow = false;
    this.isGraphShow = true;
    this.isTableShow = false;
    this.tableButtonClass = "nav-link";
    this.rxButtonClass = "nav-link";
    this.graphButtonClass = "nav-link active";
    this.isLoaderOn = true;
    //console.log(this.options.rangeSelector);

    if (onlyDateRangeFilter) {
      this.httpClientService
        .getDateRangeData(this.dateRange, this.validity, this.mrn)
        .subscribe(response => {
          //this.observationActualResponse = response;
          //this.handleSuccessfulResponse(response);
          this.observationActualResponse = response[0]; // changes after Rx Table introduced
          this.handleSuccessfulResponse(response[0]); // changes after Rx Table introduced
        });
    } else {
      if (this.observationActualResponse) {
        this.handleSuccessfulResponse(this.observationActualResponse);
      }
    }
  }

  setDateRange(date_range_value) {
    this.limitYAxisFlag = true;
    this.dateRange = date_range_value;
    this.reviewCheckBoxChanged(true);
    this.showBillingReview = false;
    if (this.isGraphShow == true) {
      this.showGraph(true);
    }
    if (this.isTableShow == true) {
      this.showTable(true);
    }
    if (this.isRxShow == true) {
      this.showRx(true);
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
    const tilesMetCriteriaSeriesArr = [];
    const plotLinesArrOnXAxisArr = [];
    var tiles = [];
    var averageObservations = this.avgObservations;
    console.log("averageObservations", averageObservations);
    var t = 0;
    var tempArr = [];
    var class_name = "";
    var sbp_class_name = "";
    var dbp_class_name = "";
    var sideOfTiles = "L";
    var naStartDate = "";
    var naEndDate = "";
    var tilesCount = Math.floor(parseInt(this.dateRange) / 7);
    // parseInt(this.dateRange) / 7 >= 4 ? 4 : parseInt(this.dateRange) / 7;

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
        width: 2,
        value:
          dateToTimestamp7 +
          24 * 60 * 60 * 1000 -
          1000 -
          this.timezoneOffset * 60 * 1000,
        zIndex: 3
      });
      //Data use to make new series above Y xais
      tilesTopSeriesArr.push(
        this.setTilesSeriesData(t, tilesCount, dateToTimestamp7Start, tiles)
      );

      //console.log("tiles t", averageObservations[t]);

      //Met Procedural Criteria new series data
      if (averageObservations[t].criteriaMet == "Met Procedural Criteria") {
        let extraDaysInTimeStamp = 24 * 60 * 60 * 1000;
        tilesMetCriteriaSeriesArr.push({
          x: dateToTimestamp7Start + extraDaysInTimeStamp * 3,
          y: this.maxY
        });
      }
      //end

      if (t == tilesCount - 1) {
        //plot line for last left x axis using start date  (for t = 0 to tilesCount - 2 take endDate and for t = last take startDate)
        plotLinesArrOnXAxisArr.push({
          color: "lightgrey",
          width: 2,
          value: dateToTimestamp7Start - this.timezoneOffset * 60 * 1000, //+ 24 * 60 * 60 * 1000 - 1000
          zIndex: 3
        });

        //add series data (start of the date (e.g 1st June) for left side of X Axis)
        let tilesTemp2 = {
          x: this.minX,
          y: null,
          sbp: null,
          dbp: null,
          deviceIcon: null,
          weekDateRange: null
        };
        tilesTopSeriesArr.push(tilesTemp2);
        tilesMetCriteriaSeriesArr.push({ x: this.minX, y: null });
      }
    }
    this.tilesArr = tiles;

    //sort data as per highchart graph
    this.tilesTopSeries = tilesTopSeriesArr.sort((a, b) => {
      return parseInt(a.x) - parseInt(b.x);
    });
    //sort tiles met criteria data as per highchart graph
    this.tilesMetCriteriaSeries = tilesMetCriteriaSeriesArr.sort((a, b) => {
      return parseInt(a.x) - parseInt(b.x);
    });
    //console.log("tilesMetCriteriaSeriesArr", tilesMetCriteriaSeriesArr);
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
          ? dateToTimestamp7Start + extraDaysInTimeStamp * 3 //to show data in center and make managable
          : dateToTimestamp7Start + extraDaysInTimeStamp * 3, // 2 * ext...  //+1 day (24*60*60*1000) more to make data at same alignment (3+1, 10, 17, 24),
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

  drawTilesSeries(loadBool = true) {
    //console.log("ttttsssst", this.tilesTopSeries);
    //Dynamically set tiles series
    this.chart.series[this.chart.series.length - 1].setData(
      this.tilesTopSeries,
      loadBool
    );

    this.chart.series[this.chart.series.length - 2].setData(
      this.tilesMetCriteriaSeries,
      loadBool
    );
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

      //console.log(this.bpColumnRangeData);
      this.getArray(this.bpColumnRangeData, this.rxEventsActualResponse);

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

      //Dynamic Y axis for weekly acerage top position
      /* this.options.series[this.options.series.length - 1].dataLabels[0].y =
        this.minY <= 60 && this.maxY >= 180
          ? this.options.scrollbar.enabled
            ? 0
            : 4
          : 8; */

      var d = new Date(parseInt(this.minX));
      var d1 = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      let minDateTimeStamp = d1.getTime();

      this.options.series[10].pointStart = minDateTimeStamp; // - this.timezoneOffset * 60 * 1000;

      this.gridColumnData = [];
      for (let index = 0; index <= parseInt(this.dateRange) * 2 - 1; index++) {
        let interval = this.extraTickInterVal
          ? 2 * this.options.yAxis[0].tickInterval
          : this.options.yAxis[0].tickInterval;
        this.gridColumnData.push(this.maxY - interval);
      }

      this.chart = Highcharts.chart("container", this.options, chart => {
        //this.gridLineYAxisLimit(chart, this);
      });

      this.chart.series[0].setData(this.sbpArr, true);
      this.chart.series[1].setData(this.dbpArr, true);
      this.chart.series[2].setData(this.heartRateArr, true);
      this.chart.series[5].setData(this.averageArr, true);
      this.chart.series[6].setData(this.averageSBPArr, true);
      this.chart.series[7].setData(this.averageDBPArr, true);
      this.chart.series[9].setData(this.rxEventArr, true);
      this.chart.series[10].setData(this.gridColumnData, true);

      //Dynamically set tiles series and Label (met criteria)
      this.drawTilesSeries();
      this.chart.redraw();
    }
    if (this.isTableShow == true) {
      //Below code is use for date change in Table view
      let bpdata = this.bpColumnRangeData; //console.log(bpdata)
      this.minDate = parseInt(bpdata[bpdata.length - 1].timeInMilliSeconds);
      this.maxDate = parseInt(bpdata[0].timeInMilliSeconds);
    }
  }

  gridLineYAxisLimit(chart: any, patObj: any) {
    this.limitYAxisFlag = false;
    var H = Highcharts;
    H.wrap(H.Tick.prototype, "render", function(p, pts) {
      p.apply(this, [].slice.call(arguments, 1)); //run original function
      if (this.axis.isXAxis && this.gridLine) {
        /* console.log(
          this.axis.chart.yAxis[0].max,
          this.axis.chart.yAxis[0].tickInterval
        ); */
        //var point = this.axis.series[0].options.data[this.pos],

        let xAxisObj = this.axis.chart.xAxis[0];
        let yAxisObj = this.axis.chart.yAxis[0];

        let tickInterVal = patObj.extraTickInterVal
          ? 2 * yAxisObj.tickInterval
          : yAxisObj.tickInterval;

        let plotLineXAxisValues = xAxisObj.options.plotLines.map(d => d.value);
        if (
          !plotLineXAxisValues.includes(this.pos - 1000) &&
          !plotLineXAxisValues.includes(this.pos)
        ) {
          // setTimeout(() => {
          let d = this.gridLine.attr("d").split(" ");
          console.log("d", d);
          d[2] = yAxisObj.toPixels(yAxisObj.max - tickInterVal);
          d = d.join(" ");
          this.gridLine.attr({
            d: d
          });
          //}, 0);
        }
      }
    });
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

    /* if (
      !(this.lastFourWeekArray[tileIndex] && this.lastFourWeekArray[tileIndex])
    ) {
      return 0;
    } */

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
        ? "bodyWrapSection"
        : "bodyWrapSection bodyWrapSection-full";

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

  rxDetailsResponse(rxDetailsRes: any) {
    console.log("Rx Details:---", rxDetailsRes);

    this.rxDetailsActualResponse = rxDetailsRes.sort((a, b) => {
      return b.effectiveDateInMilis - a.effectiveDateInMilis;
    });
  }

  rxEventsResponse(rxEventsRes: any) {
    console.log("Rx Events:---", rxEventsRes);
    this.rxEventsActualResponse = rxEventsRes;
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

    let rangeDataTemp2: any = this.bpColumnRangeData;
    rangeDataTemp2 = rangeDataTemp2.filter(ob => ob.dbpValue != null);

    let sbpYAxisInterval = this.options.yAxis[0].tickInterval;
    if (rangeDataTemp.length > 0) {
      //SBP
      let maxValue = Math.max.apply(
        Math,
        rangeDataTemp.map(function(o) {
          return o.sbpValue;
        })
      );
      console.log("mmm", maxValue);
      let remValue = maxValue % sbpYAxisInterval;
      let extraValue =
        remValue == 0
          ? sbpYAxisInterval
          : sbpYAxisInterval - remValue + sbpYAxisInterval;
      this.maxY = maxValue + extraValue;

      console.log("this.maxY1", this.maxY);

      //DBP
      let minValue = Math.min.apply(
        Math,
        rangeDataTemp2.map(function(o) {
          return o.dbpValue;
        })
      );

      let remValueMin = minValue % sbpYAxisInterval;
      let extraValueMin = remValueMin == 0 ? 0 : remValueMin;
      this.minY = minValue - extraValueMin;

      this.maxY += this.minY <= 60 && this.maxY >= 200 ? sbpYAxisInterval : 0;

      console.log("this.maxY2", this.maxY);

      //Heart Rate
      // this.maxYHeartRate = Math.max.apply(
      //   Math,
      //   rangeDataTemp.map(function(o) {
      //     return o.heartRate;
      //   })
      // );
      // this.minYHeartRate = Math.min.apply(
      //   Math,
      //   rangeDataTemp.map(function(o) {
      //     return o.heartRate;
      //   })
      // );
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
        isCarePlanCommunicated: this.billingInfo.isCarePlanCommunicated,
        startDate: this.datePipe.transform(
          this.billingInfo.fromDate,
          "yyyy-MM-dd"
        ),
        endDate: this.datePipe.transform(this.billingInfo.toDate, "yyyy-MM-dd"),
        isDocumentGenerated: "N",
        ipAddress: this.httpClientService.getPublicIP()
      };

      this.httpClientService
        .reviewBillingAPi(postBillingReviewdData)
        .subscribe((resp: any) => {
          if (resp.success) {
            this.billingInfo.error = false;
            /* this.elemRefRcmsg.nativeElement.innerHTML =
              'Review complete and may be eligible for billing. <a href="javascript:void(0);" (click)="captureScreen()">Click on the link to download the report.</a>'; */
          } else {
            this.billingInfo.error = true;
          }
          //this.hideReviewCompleteMsg();
        });
    } else {
      this.billingInfo.error = true;
      /* this.elemRefRcmsg.nativeElement.innerHTML =
        "Review complete and is not eligible for billing."; */
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

  deviceInfo(dateJson) {
    var varObservations = this.bpColumnRangeData;
    varObservations = varObservations.filter(
      (o, i) => o.date >= dateJson.start_date && o.date <= dateJson.end_date
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

    return {
      model: this.arrModel,
      manufacturer: this.arrManufacturer
    };
    // if (isDeviceLen) {
    //   return this.arrModel.length;
    // }
  }

  showRx(onlyDateRangeFilter = false) {
    this.isRxShow = true;
    this.isGraphShow = false;
    this.isTableShow = false;
    this.tableButtonClass = "nav-link";
    this.graphButtonClass = "nav-link";
    this.rxButtonClass = "nav-link active";
    this.isLoaderOn = true;
    console.log(this.options.rangeSelector);

    if (onlyDateRangeFilter) {
      this.httpClientService
        .getDateRangeData(this.dateRange, this.validity, this.mrn)
        .subscribe(response => {
          this.observationActualResponse = response[0];
          this.handleSuccessfulResponse(response[0]);
        });
    } else {
      if (this.observationActualResponse) {
        this.handleSuccessfulResponse(this.observationActualResponse);
      }
    }
  }

  toggleHeratRateGraph() {
    this.chart.yAxis[0].update({
      height: "100%" //65%
    });
    this.chart.yAxis[1].update({
      labels: {
        style: {
          color: "white" //grey
        }
      }
    });
  }

  toggleHeratRateGraph2() {
    this.chart.yAxis[0].update({
      height: "65%"
    });
    this.chart.yAxis[1].update({
      labels: {
        style: {
          color: "grey"
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.authListenerSubs) this.authListenerSubs.unsubscribe();
  }
}
