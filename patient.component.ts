import { Component, OnInit, AfterContentInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as Highcharts from 'highcharts/highstock';
import { HttpclientService } from '../service/httpclient.service';
import{ AppConstants} from '../constant';

import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');
let Export = require('highcharts/modules/exporting');
let ExportData = require('highcharts/modules/export-data');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
Export(Highcharts);
ExportData(Highcharts);


@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css', '../../../node_modules/highcharts/css/stocktools/gui.css']
})


export class PatientComponent implements OnInit {
	userIsAuthenticated = false;
  	private authListenerSubs: Subscription;

	bpColumnRangeData: any;
	chart;
	bpData;
	dateRange = '30';
	validity = 'All';
	patientObject: any;
  mrn: any;
  fname: any;
  lname: any;
  birthdate:any;
  gender:any;
  age:any;
	isTableShow: boolean = false;//true;
	isGraphShow: boolean = true;//false;
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

	lastFourWeekArray:any = [];
	observationActualResponse:any;

	observationCount:any = 0;

	minX:any;
	maxX:any;
	customDate:any;

	timezoneConstant:any;

	showComments:boolean=false;
	rowId:any;
	patientComment:any;
	
	showVDLModal:boolean=false;
	manufacturer:any;
	model:any;

	showTilesVDLModal:boolean = false;

	arrModel:any = [];
	arrManufacturer:any = [];

	modelArr:any = [];
  manufacturerArr:any = [];
  
  leftPannelChange:any="";
  expandClass:any="open";
  expand:boolean=false;
  bodyWrapClass:any = "bodyWrapSection";

  subHeaderClass:any = "subHeader-moreInfo";

  subHeaderContent:any = "subHeader-content";

  subHeaderToggle:any = "subHeaderShow";

  subHeaderExpand:boolean=false;

  minDate:any;

  maxDate:any;

  lastBilledDate:any = '';
  countOfObservationReviewed:any='';
  billingAverage:any = '';

  showDevicesUsedModal:boolean=false;
  devicesUsedArr:any;
  greenTick:boolean=false;
  crossTick:boolean=false;

	//currentTimeZoneOffsetInHours:any;

	public options: any = {

		// time: {

		// 	timezoneOffset: this.currentTimeZoneOffsetInHours
	
		// },
		chart: {

			height: 700,
			//plotBackgroundColor: '#e6f2ff',

		},
		title: {

			text: ' '

		},

		subtitle: {

			text: ''

		},

		credits: {

			enabled: false

		},

		xAxis: {

			type: 'datetime',

			lineColor: 'grey',

			//lineWidth: 1,

			tickInterval: 1000 * 3600 * 12,

			min:this.minX,
			max:this.maxX,

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

				format: '{value:%Y-%m-%d}',

				useHTML: true,

				formatter: function () {

					
					//var label = this.axis.defaultLabelFormatter.call(this);

					//var label = Highcharts.dateFormat('%p', this.value);

					var hours = Highcharts.dateFormat('%H', this.value);

					if (hours == '00') {

						return Highcharts.dateFormat('%Y-%m-%d', this.value);

					}

					if (hours == '12' && this.axis.options.labels.dateRange == 7) {

						//return "Noon";

						return "Noon";

					}

					//if(hours == '18'){

					//return "Noon";

					//}

				},
				dateRange : this.dateRange,

				rotation: -90,



				style: {

					color: 'grey',

					fontWeight: 'bold',

					fontSize:'12px'

				},

			}

		},

		scrollbar: {

			enabled: false

		},

		/*    annotations: [{
		
				labelOptions: {
		
				   backgroundColor: 'lightgreen',
		
				   verticalAlign: 'top',
		
					y: -10
		
				},
		
										//yAxis: 1,
		
										allowOverlap: true,
		
				labels: annotationLabels
		
			}],
		
		**/

		exporting: {

sourceWidth: 1200,

			sourceHeight: 600,
			buttons: {

				contextButton: {

					menuItems: ["viewFullscreen",

						"printChart",

						"separator",

						"downloadPNG",

						"downloadJPEG",

						"downloadPDF"]

				}

			}

		},

		rangeSelector: {

			enabled: true,

			buttonTheme: {

				width: 0,

				height: 0,

				style: {

					color: 'white',

					fontWeight: 'bold'

				},

			},

			labelStyle: {

				color: 'white'

			},

			inputEnabled: false,

			zoom: {

				text: '',

				style: {

					color: 'white',

					fontWeight: 'bold'

				}

			},

			buttons: [

				{

					type: 'all',

					approximation: 'averages',

					dataGrouping: {

						enabled: false

					},

					text: ''

				},

				{

					type: 'day',

					approximation: 'averages',

					count: parseInt(this.dateRange),

					dataGrouping: {

						enabled: false

					},

					text: ''

				}

			],

			selected: 1

		},

		yAxis: [{

			labels: {

				format: '{value} mmHg',

				style: {

					color: 'grey',
					fontSize:'12px'

				},

			},

			height: '70%',

			resize: {

				enabled: true

			},

			opposite: false,

			lineColor: 'grey',

			lineWidth: 1,

			tickInterval: 20,

			min: 40,

			gridLineColor: 'transparent',

			max: 220,

			title: {

				text: ''

			},

			plotLines: [{

				color: 'lightgrey',

				width: 1,

				dashStyle: 'longdash',

				value: this.goal_dbp_value,

				label: {

					//text: 'DBP threshhold (85)',

					align: 'right',

					style: {

						color: 'gray'

					}

				}

			}, {

				color: 'lightgrey',

				width: 1,

				dashStyle: 'longdash',

				value: this.goal_sbp_value,

				label: {

					//text: 'SBP threshhold ('+threshholdHigher+')',

					align: 'center',

					style: {

						color: 'gray'

					}

				}

			}]

		}, {

			labels: {

				format: '{value} BPM',

				style: {

					color: 'grey'

				},

			},

			opposite: true,

			lineColor: 'grey',

			lineWidth: 1,

			top: '75%',

			height: '25%',

			offset: 0,

			tickInterval: 40,

			min: 40,

			gridLineColor: 'transparent',

			max: 120,

			title: {

				text: ''

			}

		}],

		plotOptions: {

			
			// series:{
			// 	turboThreshold:0//larger threshold or set to 0 to disable
			// },
			
			line: {
				
				dataLabels: {

					enabled: false

				},

				//enableMouseTracking: false

			}, 

		},

		tooltip: {

			pointFormat: '<br/><span style="color:{series.color}"><b>{series.name}</b></span>: <b>{point.y}</b> <br/>',

			shared: true,

			xDateFormat: '<b>%Y-%m-%d %H:%M</b>',

			valueDecimals: 0,

			crosshairs: {

				color: 'grey',

				dashStyle: 'solid'

			},

			lineWidth: .1,

			valueSuffix: ' mmHg'

		},



		////



		legend: {

			//useHTML: true,

			labelFormatter: function () {

				if (this.name == "Met clinical criteria") {
					//DBP or SBP above BP goal

					return '<div style="width:50%; font-size:12px;"><span style="float:right;padding:9px">Met clinical profile, SBP or DBP at or above goal</span></div>';

				}

				if (this.name == "Met clinical criteria SBP") {

					return '<div style="width:50%; font-size:12px;"><span style="float:right;padding:9px">Met clinical profile, SBP and DBP within goal</span></div>';

				}

				if (this.name == "Not met clinical criteria") {

					// this.legendSymbol.destroy();//BP reading didn't meet clinical profile

					//return '<div style="width:50%;"><span style="float:right;padding:9px">Not met clinical criteria, beyond goal</span></div>';
					//return '<div style="width:50%;"><span style="float:right;padding:9px">Didn\'t meet clinical profile, above goal</span></div>';
					return '<div style="width:50%;font-size:12px;"><span style="float:right;padding:9px">Didn\'t meet clinical profile, SBP or DBP at or above goal</span></div>';
					

				}

				if (this.name == "Not met clinical criteria SBP") {

					// this.legendSymbol.destroy();// 

					//return '<div style="width:50%;"><span style="float:right;padding:9px">Didn\'t meet clinical profile, within goal</span></div>';
					return '<div style="width:50%; font-size:12px;"><span style="float:right;padding:9px">Didn\'t meet clinical profile, SBP and DBP within goal</span></div>';
					
				}

				

				if (this.name == "Heart Rate") {

					return '<div style="width:50%; font-size:12px;"><span style="float:right;padding:9px">Heart Rate</span></div>';

				}

				if(this.name == "Goal BP"){
					return '<div style="width:50%; font-size:12px;"><span style="float:right;padding:9px">Goal BP</span></div>';
				}

			

			}

		},

		////

		series: [

			{

				name: 'SBP',
				
				data: this.sbpArr,

				id: 'seriesSbp',

				color: 'red',

				lineWidth: 1,

				showInLegend: false,
				

				events: {

					legendItemClick: () => false  // disable legend click

				},

				dashStyle: 'LongDashDotDot',

				tooltip: {

					pointFormat: '<br/><span style="color:{point.color}"><b>{series.name}</b></span>: <span style="color:{point.color}">{point.y}</span> <br/>',

				},

				marker: {

					enabled: false,
					//symbol: 'circle',

					//radius: 3

				},

				states: {

					hover: {

						lineWidthPlus: 1

					}

				},

				zones: [{

					value: this.goal_sbp_value,

					color: '#505050'

				}, {

					color: 'red'

				}]

			}, {

				name: 'DBP',

				data: this.dbpArr,

				id: 'dbp',

				lineWidth: 1,

				color: 'black',

				dashStyle: 'LongDashDotDot',

				showInLegend: false,

				events: {

					legendItemClick: () => false  // disable legend click

				},

				tooltip: {

					pointFormat: '<br/><span style="color:{point.color}"><b>{series.name}</b></span>: <span style="color:{point.color}">{point.y}</span><br/>',

				},

				marker: {

					enabled: false,
					//symbol: 'circle',

					//radius: 3

				},

				states: {

					hover: {

						lineWidthPlus: 1

					}

				},

				zones: [{

					value: this.goal_dbp_value,

					color: '#505050'

				}, {

					color: 'red'

				}]

			},

			{

				name: 'Not met clinical criteria',

				lineWidth: 0,

				data: this.flagNotMetDBPArr,

				showInLegend: true,

				legendIndex:3,

				events: {

					legendItemClick: () => false  // disable legend click

				},

				//enableMouseTracking: true,

				onSeries: 'dbp',

				color: 'red',

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

					symbol: 'triangle',

					radius: 5

				},

				zones: [{

					value: this.goal_dbp_value,

					color: 'black'

				}, {

					color: 'red'

				}],

				tooltip: {

					pointFormat: '<br/><span style="color:black;font-weight:bold;">Didn\'t meet clinical profile</span><br/><span style="color:black;font-weight:bold;">Model: </span>{point.device}<br/><span style="color:black;font-weight:bold;">Manufacturer: </span>{point.manufacturer}<br/>'

				}

			},
			
			{

				name: 'Not met clinical criteria SBP',

				lineWidth: 0,

				data: this.flagNotMetArr,

				showInLegend: true,

				legendIndex:2,

				events: {

					legendItemClick: () => false  // disable legend click

				},

				color: 'black',

				enableMouseTracking: true,

				onSeries: 'seriesSbp',

				marker: {

					enabled: true,

					symbol: 'triangle',

					radius: 5

				},

				zones: [{

					value: this.goal_sbp_value,

					color: 'black'

				}, {

					color: 'red'

				}],

				states: {

					hover: {

						lineWidthPlus: 0

					},

					inactive: {

						opacity: 1

					}

				},

				tooltip: {

					pointFormat: ''

				}

			},

			{

				name: 'Met clinical criteria',

				lineWidth: 0,

				data: this.flagDBPArr,

				showInLegend: true,

				legendIndex:1,

				events: {

					legendItemClick: () => false  // disable legend click

				},

				enableMouseTracking: true,

				onSeries: 'dbp',

				color: 'red',

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

					symbol: 'circle',

					radius: 3

				},

				zones: [{

					value: this.goal_dbp_value,

					color: 'black'

				}, {

					color: 'red'

				}],

				tooltip: {

					pointFormat: '<br/><span style="color:black;font-weight:bold;">Met clinical profile</span><br/><span style="color:black;font-weight:bold;">Model: </span>:{point.device}<br/><span style="color:black;font-weight:bold;">Manufacturer: </span>:{point.manufacturer}<br/>'

				}

			},

			{

				name: 'Met clinical criteria SBP',

				lineWidth: 0,

				data: this.flagArr,

				showInLegend: true,

				legendIndex:0,

				events: {

					legendItemClick: () => false  // disable legend click

				},

				color: 'black',

				enableMouseTracking: true,

				onSeries: 'seriesSbp',

				marker: {

					enabled: true,

					symbol: 'circle',

					radius: 3

				},

				zones: [{

					value: this.goal_sbp_value,

					color: 'black'

				}, {

					color: 'red'

				}],

				states: {

					hover: {

						lineWidthPlus: 0

					},

					inactive: {

						opacity: 1

					}

				},

				tooltip: {

					pointFormat: ''

				}

			},

			{

				type: 'line',

				lineWidth: 1,

				name: 'Heart Rate',

				dashStyle: 'Dot',

				legendIndex:4,

				data: this.heartRateArr,

				id: 'HeartRate',

				marker: {

					enabled: true,

					radius: 3,

					symbol: 'circle'

				},

				yAxis: 1,

				color: 'grey',

				showInLegend: true,

				events: {

					legendItemClick: () => false  // disable legend click

				},

				tooltip: {

					valueSuffix: ' bpm'
					//pointFormat: '<br/><span style="color:{point.color}"><b>{series.name}</b></span>: <span style="color:{point.color}">{point.y}</span><br/>'

				},

				states: {

					hover: {

						lineWidthPlus: 1

					}

				}

			},
			{
				type: 'line',
				name: 'Goal BP',
				color: 'lightgrey',
				dashStyle: 'Dash',
				legendIndex:5,
				marker: {

					enabled: false,

					//radius: 3,

					symbol: 'dashline'

				},
			 }


		]

	}

	

	constructor(private httpClientService: HttpclientService, private authService: AuthService) {}

	ngOnInit() {
		// var x = new Date();
		// console.log(x);
		// this.currentTimeZoneOffsetInHours = x.getTimezoneOffset();
		//  console.log(this.currentTimeZoneOffsetInHours);


		this.filterForm = new FormGroup({
			goal_sbp: new FormControl('135'),
			goal_dbp: new FormControl('85'),
			date_range: new FormControl('30'),
			clinical_criteria: new FormControl('1'),
		});

		
		this.authListenerSubs = this.authService
		.getAuthStatusListener()
		.subscribe(isAuthenticated => {
		console.log('auth..',isAuthenticated)
		this.userIsAuthenticated = isAuthenticated;
		if(isAuthenticated){

			console.log('call patient APIs...');
			//code for patient APIs
			this.loadPatientData();
		}
		});
	    
	}


	loadPatientData(){
		this.timezoneConstant = AppConstants.timezoneConstant;		

		this.patientObject = JSON.parse(this.getCookie('patientObject'));
		var currentDate = new Date();
		var customDateString = currentDate.toISOString().slice(0, 10);
		this.customDate = this.getCookie('customDate') == '' ? customDateString : this.getCookie('customDate');

		
		var obj = this.patientObject;

		this.fname = this.patientObject.fname[0];
		if(this.patientObject.fname[1]!= undefined){
		this.fname = this.fname + this.patientObject.fname[1];
		}
		this.lname = this.patientObject.lname;
		this.birthdate = this.patientObject.birthdate;
		this.mrn = this.patientObject.mrn;
		this.gender = this.patientObject.gender == 'male' ? 'M' : 'F';
		this.age = this.getAge(this.birthdate);

		//this.mrn = 1818;
		//this.httpClientService.getDateRangeData(this.dateRange, this.validity, this.mrn).subscribe(response => this.handleSuccessfulResponse(response));
		
		/* this.httpClientService.getDateRangeData(90,this.validity,this.mrn).subscribe(response => this.handleSuccessfulResponse(response));		
		this.httpClientService.getObservationCPT(this.dateRange,this.mrn).subscribe(cptresponse => this.cptResponse(cptresponse)); */


		this.httpClientService.getDateRangeData(90,this.validity,this.mrn).subscribe(results => {
			// results[0] is our character
			// results[1] is our character homeworld
			this.handleSuccessfulResponse(results[0]);
			this.cptResponse(results[1])
		});


		var lastFourWeekArr = [];
		var start_date_0 = '';
		var start_date_1 = '';
		var start_date_2 = '';
		var start_date_3 = '';

		var end_date_0 = '';
		var end_date_1 = '';
		var end_date_2 = '';
		var end_date_3 = '';

		// var end_date = new Date().toISOString().slice(0, 10);
		// var d = new Date();
		// d.setDate(d.getDate() - (dateRange-1));
	    // var start_date = d.toISOString().slice(0, 10);
		// return {start_date:start_date,end_date:end_date};


				 
		var d0 = new Date(this.customDate);
		end_date_0 = d0.toISOString().slice(0, 10);
		(d0.setDate(d0.getDate() - (6)))
		start_date_0 = d0.toISOString().slice(0, 10);
		//console.log(start_date_0 + ">>>" + end_date_0);

		var d1 = new Date(this.customDate);
		(d1.setDate(d1.getDate() - (13)))
		start_date_1 = d1.toISOString().slice(0, 10);

		var d2 = new Date(this.customDate);
		(d2.setDate(d2.getDate() - (7)))
		end_date_1 = d2.toISOString().slice(0, 10);
		//console.log(start_date_1 + ">>>" + end_date_1);

		var d3 = new Date(this.customDate);
		(d3.setDate(d3.getDate() - (20)))
		start_date_2 = d3.toISOString().slice(0, 10);

		var d4 = new Date(this.customDate);
		(d4.setDate(d4.getDate() - (14)))
		end_date_2 = d4.toISOString().slice(0, 10);
		//console.log(start_date_2 + ">>>" + end_date_2);

		var d5 = new Date(this.customDate);
		(d5.setDate(d5.getDate() - (27)))
		start_date_3 = d5.toISOString().slice(0, 10);

		var d6 = new Date(this.customDate);
		(d6.setDate(d6.getDate() - (21)))
		end_date_3 = d6.toISOString().slice(0, 10);
		//console.log(start_date_3 + ">>>" + end_date_3);
	

		lastFourWeekArr[0] = {start_date: start_date_0,end_date:end_date_0};
		lastFourWeekArr[1] = {start_date: start_date_1,end_date:end_date_1};
		lastFourWeekArr[2] = {start_date: start_date_2,end_date:end_date_2};
		lastFourWeekArr[3] = {start_date: start_date_3,end_date:end_date_3};

		this.lastFourWeekArray = lastFourWeekArr;
	}

	handleSuccessfulResponse(response) {//timeInMilliSeconds

		
		
		this.observationActualResponse = response;
		var observations: any;


		
		// filter clinically valid data
		//observations = response.observations.filter((o, i) => o.isValid == 'Y' || o.isValid == null);
		
		var end_date = new Date(this.customDate).toISOString().slice(0, 10);
		var d = new Date(this.customDate);
		d.setDate(d.getDate() - (parseInt(this.dateRange)-1));
	    var start_date = d.toISOString().slice(0, 10);

		var graphObservations:any;
		if (this.validity == 'Y' && this.isTableShow == true) {
			// filter clinically valid data for table
			observations = response.observations.filter((o, i) => (o.isValid == 'Y' || o.isValid == null || o.isValid == 'N') && (o.date >= start_date && o.date <= end_date));
			
		}
		else if (this.validity == 'Y' && this.isGraphShow == true) {
			// filter clinically valid data for graph seperately bcoz 
			//some sbp dbp value need to be show as '---'.So need to remove invalid points.
			observations = response.observations.filter((o, i) => (o.isValid == 'Y' || o.isValid == null) && (o.date >= start_date && o.date <= end_date));
		}
		else {
			// show all data...
			observations = response.observations.filter((o, i) => (o.date >= start_date && o.date <= end_date));
		}

		
		
		if(this.validity == 'Y'){
			this.observationCount = response.observations.filter((o, i) => (o.isValid == 'Y') && (o.date >= start_date && o.date <= end_date)).length;
		}else{
			this.observationCount = response.observations.filter((o, i) => (o.isValid == 'Y' || o.isValid == 'N') && (o.date >= start_date && o.date <= end_date)).length;
		}
		//console.log(this.observationCount);
		if (observations) {

			this.isLoaderOn = false;
		} else {

			this.isLoaderOn = true;
		}
		console.log(observations);
		this.responseobservations = observations;
		this.avgObservations = response.averageObservations;
		var averageObservations = response.averageObservations;
		var arr = [];
		var month;
		var date;
		var exactDate;

		var validity = this.validity;

		var arr = [];
        console.log('T3');
		if (averageObservations.length > 0 && observations.length > 0) {
			averageObservations.forEach(function (object) {

				var res = [];
				var avgArr = [];
				res = observations.filter((o, i) => (o.date >= object.startTime && o.date <= object.endTime));

				if (res.length > 0) {
					res[0].rowspan = res.length;


					if (validity == 'Y'  && object.ihmiAverage == "N/A") {
						res[0].Average = 'Inadequate data';
						res[0].AverageSBP = '';
						res[0].AverageDBP = '';
						res[0].ihmiStrict = 'N';
					}

					else if (validity == 'Y'  && object.ihmiAverage != "N/A") {
						res[0].Average = object.ihmiAverage;
						avgArr = object.ihmiAverage.split('/');
						res[0].AverageSBP = avgArr[0];
						res[0].AverageDBP = avgArr[1];
						res[0].ihmiStrict = 'Y';
					} 

					else if (object.ihmiAverage == "N/A" && object.simpleAverage == "N/A") {
						res[0].Average = 'Inadequate data';
						res[0].AverageSBP = '';
						res[0].AverageDBP = '';
						res[0].ihmiStrict = 'N';
					}

					else if (object.ihmiAverage != "N/A") {
						res[0].Average = object.ihmiAverage;
						avgArr = object.ihmiAverage.split('/');
						res[0].AverageSBP = avgArr[0];
						res[0].AverageDBP = avgArr[1];
						res[0].ihmiStrict = 'Y';
					} else {
						res[0].Average = object.simpleAverage;
						avgArr = object.simpleAverage.split('/');
						res[0].AverageSBP = avgArr[0];
						res[0].AverageDBP = avgArr[1];
						res[0].ihmiStrict = 'N';
					}
					// if (object.ihmiAvertrueage == "N/A") {toUTCString() 
					// 	res[0].ihmiAveragetrue = 'Inadequate data';
					// 	res[0].ihmiAverageSBP = '';
					// 	res[0].ihmiAverageDBP = '';
					// } else {
					// 	avgArr = object.ihmiAverage.split('/');
					// 	res[0].ihmiAverage = object.ihmiAverage;
					// 	res[0].ihmiAverageSBP = avgArr[0];
					// 	res[0].ihmiAverageDBP = avgArr[1];
					// }


					res.forEach(function (obj) {
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
	getDateRangeData() {
		this.dateRange = (<HTMLInputElement>document.getElementById("dateRange")).value;
		this.validity = (<HTMLInputElement>document.getElementById("selectValue")).value;
		this.httpClientService.getDateRangeData(this.dateRange, this.validity, this.mrn).subscribe(response => this.handleSuccessfulResponse(response));
	}
	getArray(bpdata) {
		console.log('array start here...');
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
		var arrflag = new Array();
		var arrflagDBP = new Array();
		var arrflagNotMet = new Array();
		var arrflagNotMetDBP = new Array();

		var deviceDetails = new Array();


		var arrheartRate = new Array();

		var arrModel = new Array();

		var arrManufacturer = new Array();

		var category = new Array();

		var annotationLabels = new Array();
		var plotLinesArray = new Array();

		var k = 0;
		var kk = 0;
		var ii = 0;
		
		for (var i = 0; i < bpdata.length; i++) {

			var val = bpdata[i];


			

                if(i == 0){

					//var x = new Date(parseInt(val.timeInMilliSeconds));

					//var x1 = new Date(x.getFullYear(), x.getMonth(), x.getDate()+1);
					//alert(x1);

								this.minX =  parseInt(val.timeInMilliSeconds);//alert(">>min>>"+this.minX)
								this.options.xAxis.min = this.minX;
								this.minDate = this.minX;
								

                }

                if(i == bpdata.length-1){

                                var d= new Date(parseInt(val.timeInMilliSeconds));

                                var d1 = new Date(d.getFullYear(), d.getMonth(), d.getDate()+1);
								//alert(d1);
								this.maxX =  d1.getTime();//alert(this.maxX)
								this.options.xAxis.max = this.maxX;
								this.maxDate = parseInt(val.timeInMilliSeconds);
								
				}

			//if (val.sbpValue != null) {
				

				var sbp = new Array(2);
				sbp[0] = parseInt(val.timeInMilliSeconds);
				sbp[1] = parseInt(val.sbpValue);

				var dbp = new Array(2);
				dbp[0] = parseInt(val.timeInMilliSeconds);
				dbp[1] = parseInt(val.dbpValue);

				y3[i] = sbp;
				y4[i] = dbp;

				var hr = new Array(2);

				hr[0] = parseInt(val.timeInMilliSeconds);
				hr[1] = parseInt(val.heartRate);

				arrheartRate[i] = hr;

				if(val.isValidDevice== 'Y'){
					deviceDetails[i]  = { x: parseInt(val.timeInMilliSeconds), y: parseInt(val.sbpValue), device: val.device.model, manufacturer: val.device.manufacturer};
				}else{
					deviceDetails[i]  = { x: parseInt(val.timeInMilliSeconds), y: parseInt(val.sbpValue), device: 'Invalid Device'};
				}

				if (val.isValid == 'Y') {
					arrflag[k] = { x: parseInt(val.timeInMilliSeconds), y: parseInt(val.sbpValue), title: ' ', text: ' ' };
					if(val.isValidDevice== 'Y'){
						arrflagDBP[k] = { x: parseInt(val.timeInMilliSeconds), y: parseInt(val.dbpValue), title: ' ', text: ' ',  device: val.device.model, manufacturer: val.device.manufacturer};
					}
					else{
						arrflagDBP[k] = { x: parseInt(val.timeInMilliSeconds), y: parseInt(val.dbpValue), title: ' ', text: ' ',  device: '', manufacturer:''};
					}
					k++;
				}
				else {

					arrflagNotMet[kk] = { x: parseInt(val.timeInMilliSeconds), y: parseInt(val.sbpValue), title: ' ', text: ' ' };
					if(val.isValidDevice== 'Y'){
						arrflagNotMetDBP[kk] = { x: parseInt(val.timeInMilliSeconds), y: parseInt(val.dbpValue), title: ' ', text: ' ', device: val.device.model, manufacturer: val.device.manufacturer};
					}
					else{
						arrflagNotMetDBP[kk] = { x: parseInt(val.timeInMilliSeconds), y: parseInt(val.dbpValue), title: ' ', text: ' ', device: '', manufacturer: ''};
					}

					//plotLinesArray[kk] = { color: 'grey', width: .5, value: parseInt(val.timeInMilliSeconds) };
					//annotationLabels[kk] = { point: { xAxis: 0, yAxis: 0, x: parseInt(val.timeInMilliSeconds), y: 210 }, text: ' ' };

					kk++;

				}

				var model = new Array(2);
				model[0] = parseInt(val.timeInMilliSeconds);
				model[1] = val.isValidDevice == 'Y' ? val.device.model : '';

				var manufacturer = new Array(2);
				manufacturer[0] = parseInt(val.timeInMilliSeconds);
				manufacturer[1] = val.isValidDevice == 'Y' ? val.device.manufacturer : '';

				arrModel[i] = model;
				arrManufacturer[i] = manufacturer;

				ii++;
			//}

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
	

		console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>');
		 console.log(this.deviceDetailsArr);
		// console.log(this.dbpArr);
		// console.log(this.flagDBPArr);
		// console.log(this.flagNotMetArr);
		// console.log(this.flagNotMetDBPArr);
		 console.log(this.heartRateArr);

	}


	getCookie(cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}


	showTable() {

		this.isTableShow = true;
		this.isGraphShow = false;

		this.tableButtonClass = "nav-link active";
		this.graphButtonClass = "nav-link";

		this.isLoaderOn = true;
		this.handleSuccessfulResponse(this.observationActualResponse);
		//this.httpClientService.getDateRangeData(this.dateRange, this.validity, this.mrn).subscribe(response => this.handleSuccessfulResponse(response));
	}

	showGraph() {

		this.isGraphShow = true;
		this.isTableShow = false;

		this.tableButtonClass = "nav-link";
		this.graphButtonClass = "nav-link active";

		this.isLoaderOn = true;
		this.handleSuccessfulResponse(this.observationActualResponse);
		console.log(this.options.rangeSelector);
		//this.httpClientService.getDateRangeData(this.dateRange, this.validity, this.mrn).subscribe(response => this.handleSuccessfulResponse(response));

	}

	setDateRange(date_range_value) {
		this.dateRange = date_range_value;
		if (this.isGraphShow == true) {
			this.showGraph();
		}
		if (this.isTableShow == true) {
			this.showTable();
		}

		//this.httpClientService.getObservationCPT(this.dateRange,this.mrn).subscribe(cptresponse => this.cptResponse(cptresponse));

	}

	setClinicalCriteria(clinical_criteria_value) {
		this.validity = clinical_criteria_value;
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
		console.log(averageObservations);
		var t = 0;
		var tempArr = [];
		var class_name = '';
		var sbp_class_name = '';
		var dbp_class_name = '';
		var sideOfTiles = 'L';
		var naStartDate = '';
		var naEndDate = '';
		var tilesCount = parseInt(this.dateRange)/7 >= 4 ? 4 : parseInt(this.dateRange)/7;
		for (t = 0; t <= 3; t++) {

			sideOfTiles = (t == 0 || t == 2 ? "L" : "R")
			class_name = '';
			sbp_class_name = '';
			dbp_class_name = '';
			if (averageObservations[t] == undefined || (this.dateRange == '7' && t > 0)) {
				// Not available...
				class_name = 'weekCard highColor3 inadequateDate mar' + sideOfTiles + '-M15';
				sbp_class_name = '';
				dbp_class_name = '';

				naStartDate = this.lastFourWeekArray[t].start_date;
				naEndDate = this.lastFourWeekArray[t].end_date;

				

				tiles[t] = {isValidDevice:'N',inadequate_data: 'NA', class_name: class_name, sbp: '', sbp_class_name: sbp_class_name, dbp: '', dbp_class_name: '', start_date: naStartDate, end_date: naEndDate };

			} else {


				// res[0].Average = object.simpleAverage;
				// avgArr = object.simpleAverage.split('/');
				// res[0].AverageSBP = avgArr[0];
				// res[0].AverageDBP = avgArr[1];


				if(this.validity == 'Y' && averageObservations[t].ihmiAverage != "N/A"){

					tempArr = averageObservations[t].ihmiAverage.split('/');
					if (tempArr[0] >= this.goal_sbp_value) {
						// coloring red  //weekCard marR-M15
						class_name = 'weekCard highColor mar' + sideOfTiles + '-M15';
						sbp_class_name = 'red';

					} else {
						// coloring black
						//class_name = 'weekCard mar' + sideOfTiles + '-M15';
						class_name = 'weekCard highColor mar' + sideOfTiles + '-M15';
						sbp_class_name = '';
					}
					if (tempArr[1] >= this.goal_dbp_value) {
						// coloring red  
						class_name = 'weekCard highColor mar' + sideOfTiles + '-M15';
						dbp_class_name = 'red';
					} else {
						// coloring black
						//class_name = 'weekCard mar' + sideOfTiles + '-M15';
						class_name = 'weekCard highColor mar' + sideOfTiles + '-M15';
						dbp_class_name = '';
					}
					tiles[t] = {isValidDevice:'Y',inadequate_data: 'N', class_name: class_name, sbp: tempArr[0], sbp_class_name: sbp_class_name, dbp: tempArr[1], dbp_class_name: dbp_class_name, start_date: averageObservations[t].startTime, end_date: averageObservations[t].endTime };
					
				}

				else if(this.validity == 'Y' && averageObservations[t].ihmiAverage == "N/A"){
					class_name = 'weekCard highColor3 inadequateDate mar' + sideOfTiles + '-M15';
					sbp_class_name = '';
					dbp_class_name = '';
					tiles[t] = {isValidDevice:'Y', inadequate_data: 'Y', class_name: class_name, sbp: '', sbp_class_name: sbp_class_name, dbp: '', dbp_class_name: dbp_class_name,start_date: averageObservations[t].startTime, end_date: averageObservations[t].endTime};
				}	

				else if (averageObservations[t].ihmiAverage == 'N/A' && averageObservations[t].simpleAverage == 'N/A') {

					class_name = 'weekCard highColor3 inadequateDate mar' + sideOfTiles + '-M15';
					sbp_class_name = '';
					dbp_class_name = '';
					tiles[t] = {isValidDevice:'Y', inadequate_data: 'Y', class_name: class_name, sbp: '', sbp_class_name: sbp_class_name, dbp: '', dbp_class_name: dbp_class_name,start_date: averageObservations[t].startTime, end_date: averageObservations[t].endTime};
				}
				else if (averageObservations[t].ihmiAverage != "N/A") {

					tempArr = averageObservations[t].ihmiAverage.split('/');
					if (tempArr[0] >= this.goal_sbp_value) {
						// coloring red  //weekCard marR-M15
						class_name = 'weekCard highColor mar' + sideOfTiles + '-M15';
						sbp_class_name = 'red';

					} else {
						// coloring black
						//class_name = 'weekCard mar' + sideOfTiles + '-M15';
						class_name = 'weekCard highColor mar' + sideOfTiles + '-M15';
						sbp_class_name = '';
					}
					if (tempArr[1] >= this.goal_dbp_value) {
						// coloring red  
						class_name = 'weekCard highColor mar' + sideOfTiles + '-M15';
						dbp_class_name = 'red';
					} else {
						// coloring black
						//class_name = 'weekCard mar' + sideOfTiles + '-M15';
						class_name = 'weekCard highColor mar' + sideOfTiles + '-M15';
						dbp_class_name = '';
					}
					tiles[t] = {isValidDevice:'Y', inadequate_data: 'N', class_name: class_name, sbp: tempArr[0], sbp_class_name: sbp_class_name, dbp: tempArr[1], dbp_class_name: dbp_class_name, start_date: averageObservations[t].startTime, end_date: averageObservations[t].endTime };

				}
				else {


					tempArr = averageObservations[t].simpleAverage.split('/');
					if (tempArr[0] >= this.goal_sbp_value) {
						// coloring red  //weekCard marR-M15
						class_name = 'weekCard highColor2 mar' + sideOfTiles + '-M15';
						sbp_class_name = 'red';

					} else {
						// coloring black
						//class_name = 'weekCard mar' + sideOfTiles + '-M15';
						class_name = 'weekCard highColor2 mar' + sideOfTiles + '-M15';
						sbp_class_name = '';
					}
					if (tempArr[1] >= this.goal_dbp_value) {
						// coloring red  
						class_name = 'weekCard highColor2 mar' + sideOfTiles + '-M15';
						dbp_class_name = 'red';
					} else {
						// coloring black
						//class_name = 'weekCard mar' + sideOfTiles + '-M15';
						class_name = 'weekCard highColor2 mar' + sideOfTiles + '-M15';
						dbp_class_name = '';
					}
					tiles[t] = {isValidDevice:'Y',inadequate_data: 'N', class_name: class_name, sbp: tempArr[0], sbp_class_name: sbp_class_name, dbp: tempArr[1], dbp_class_name: dbp_class_name, start_date: averageObservations[t].startTime, end_date: averageObservations[t].endTime };


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
				global: {
				  useUTC: false
				}
			  });
			

			//console.log(this.chart);
			this.getArray(this.bpColumnRangeData);

			if(this.dateRange != '7' && this.dateRange != '30'){
				this.options.rangeSelector.buttons[1].count = 30;
				this.options.scrollbar.enabled = true;
			}else{
				this.options.rangeSelector.buttons[1].count = parseInt(this.dateRange);
				this.options.scrollbar.enabled = false;
			}

			this.chart = Highcharts.chart('container', this.options);

			//this.chart.series[0].setData(this.rangeArr, true);
			this.chart.series[0].setData(this.sbpArr, true);
			this.chart.series[1].setData(this.dbpArr, true);

			this.chart.series[2].setData(this.flagNotMetDBPArr, true);
			this.chart.series[3].setData(this.flagNotMetArr, true);

			this.chart.series[4].setData(this.flagDBPArr, true);
			this.chart.series[5].setData(this.flagArr, true);

			this.chart.series[6].setData(this.heartRateArr, true);

			//this.chart.series[8].setData(this.deviceDetailsArr, true);
			



			this.chart.redraw();

			//this.showGraph();
		}
		if (this.isTableShow == true) {
			//Below code is use for date change in Table view			
			let bpdata = this.bpColumnRangeData;
			this.minDate =  parseInt(bpdata[bpdata.length-1].timeInMilliSeconds);
			this.maxDate =  parseInt(bpdata[0].timeInMilliSeconds);
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


	showComment(id)
	{
	this.showComments = true; // Show-Hide Modal Check
	this.rowId = id;
	this.patientComment = document.getElementById("patientComment"+this.rowId).innerHTML;
	
	}
	//Bootstrap Modal Close event
	hideComment()
	{
	  this.showComments = false;
	}

	showVDL(id){

	this.showVDLModal = true; // Show-Hide Modal Check
	
	this.model = document.getElementById("model"+ id).innerHTML;
	this.manufacturer = document.getElementById("manufacturer"+ id).innerHTML;
	
	}

	hideVDL(){
		this.showVDLModal = false;
	}

	showTilesVDL(tileIndex){

		this.showTilesVDLModal = true;

		var varObservations = this.bpColumnRangeData;
		varObservations = varObservations.filter((o, i) => (o.date >= this.lastFourWeekArray[tileIndex].start_date && o.date <= this.lastFourWeekArray[tileIndex].end_date));

		varObservations = Array.from(new Set(varObservations.map(obj => {

			return obj.device.model + "###" + obj.device.manufacturer;

		})));

		var arrModel = [];
		var arrManufacturer = [];

		for(var i=0;i< varObservations.length;i++){
			arrModel[i] = varObservations[i].split("###")[0];
			arrManufacturer[i] = varObservations[i].split("###")[1];
		}

		this.arrModel = arrModel;
		this.arrManufacturer = arrManufacturer;

		

		console.log(this.arrModel);

	}

	hideTilesVDL(){

		this.showTilesVDLModal = false;
  }
  

  expandCollaps(){
  
  this.expand = !this.expand;

  this.expandClass = this.expand == true ? "" : "open";
  this.leftPannelChange = this.expand == true ? "leftPannelChange" : "";
  this.bodyWrapClass = this.expand == true ? "bodyWrapSection bodyWrapSection-full" : "bodyWrapSection";

  if(this.isGraphShow == true){
	  setTimeout(() => {
		this.showGraph();
	  }, 1000);
	  
	  //let element:HTMLElement = document.getElementById('graphRef');
	  //element.click();
  }

  if(this.isTableShow == true){
	this.showTable();
	
  }
  
  }

  subHeaderToggleAction(){

    this.subHeaderExpand = !this.subHeaderExpand;

    this.subHeaderClass = this.subHeaderExpand == true ?  "subHeader-moreInfo subHeader-hide":"subHeader-moreInfo";

    this.subHeaderContent = this.subHeaderExpand == true ?  "subHeader-content showSection" : "subHeader-content";

    this.subHeaderToggle = this.subHeaderExpand == true ?  "subHeaderShow close2" : "subHeaderShow";
    
  }
  
  getAge(birthDateString){


  const today = new Date();
  const birthDate = new Date(birthDateString);

  const yearsDifference = today.getFullYear() - birthDate.getFullYear();

  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
  ) {
    return yearsDifference - 1;
  }

  return yearsDifference;

  }

  cptResponse(cptresponse){


	console.log('adsadsadsa');
    console.log(cptresponse);
    console.log('>>>>>');
	this.lastBilledDate = cptresponse.lastBilledDate
	this.countOfObservationReviewed = cptresponse.countOfObservationReviewed
	this.billingAverage = cptresponse.billingAverage

	this.billingAverage = (this.billingAverage == 'N/A') ? 'Not enough data to compute an average' : this.billingAverage;

	this.devicesUsedArr = cptresponse.devices;

	var dateObject = this.httpClientService.getDates(this.dateRange);

	if(cptresponse.countOfObservationReviewed >=12 && cptresponse.lastBilledDate <= dateObject.start_date){

		// Green tick
		this.greenTick = true;
		this.crossTick = false;
	}else{
		// red cross
		this.greenTick = false;
		this.crossTick = true;
	}
	
  }

  showDevicesUsed(){

	this.showDevicesUsedModal = true;

  }


}
