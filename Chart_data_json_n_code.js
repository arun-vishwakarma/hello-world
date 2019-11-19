xAxis: {type: "datetime", lineColor: "grey", tickInterval: 43200000, min: 1556735400000, max: 1561919400000, …}

1556735400000 1561919400000 "aaaa"
___________________________________________________________________________________

chart: {height: 700, events: {…}}
credits: {enabled: false}
exporting: {sourceWidth: 1200, sourceHeight: 600, buttons: {…}}
legend: {itemDistance: 0, padding: 0, x: 50, itemStyle: {…}, labelFormatter: ƒ}
plotOptions: {series: {…}, line: {…}}
rangeSelector: {enabled: true, buttonTheme: {…}, labelStyle: {…}, inputEnabled: false, zoom: {…}, …}
scrollbar: {enabled: true, align: 0}
series: (10) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
subtitle: {text: ""}
title: {text: " "}
tooltip: {pointFormat: "<br/><span style="color:{series.color}"><b>{series.name}</b></span>: <b>{point.y}</b> <br/>", shared: true, xDateFormat: "<b>%Y-%m-%d %H:%M</b>", valueDecimals: 0, crosshairs: {…}, …}
xAxis: {type: "datetime", lineColor: "grey", tickInterval: 43200000, min: 1556735400000, max: 1561919400000, …}
yAxis: (2) [{…}, {…}]


________________________________________________________________________________

chart: {height: 700, events: {…}}
credits: {enabled: false}
exporting: {sourceWidth: 1200, sourceHeight: 600, buttons: {…}}
legend: {itemDistance: 0, padding: 0, x: 50, itemStyle: {…}, labelFormatter: ƒ}
plotOptions:
line:
dataLabels: {enabled: false}
__proto__: Object
series:
connectNulls: true
__proto__: Object
__proto__: Object
rangeSelector: {enabled: true, buttonTheme: {…}, labelStyle: {…}, inputEnabled: false, zoom: {…}, …}
scrollbar: {enabled: true, align: 0}
series: (10) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
subtitle: {text: ""}
title: {text: " "}
tooltip: {pointFormat: "<br/><span style="color:{series.color}"><b>{series.name}</b></span>: <b>{point.y}</b> <br/>", shared: true, xDateFormat: "<b>%Y-%m-%d %H:%M</b>", valueDecimals: 0, crosshairs: {…}, …}
xAxis: {type: "datetime", lineColor: "grey", tickInterval: 43200000, min: 1556735400000, max: 1561919400000, …}
yAxis: (2) [{…}, {…}]


________________________________________________________________________________

{chart: {…}, title: {…}, subtitle: {…}, credits: {…}, xAxis: {…}, …}
chart: {height: 700, events: {…}}
credits: {enabled: false}
exporting: {sourceWidth: 1200, sourceHeight: 600, buttons: {…}}
legend:
itemDistance: 0
itemStyle: {width: 350}
labelFormatter: ƒ ()
padding: 0
x: 50
__proto__: Object
plotOptions: {series: {…}, line: {…}}
rangeSelector: {enabled: true, buttonTheme: {…}, labelStyle: {…}, inputEnabled: false, zoom: {…}, …}
scrollbar:
align: 0
enabled: true
__proto__: Object
series: (10) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
subtitle: {text: ""}
title: {text: " "}
tooltip: {pointFormat: "<br/><span style="color:{series.color}"><b>{series.name}</b></span>: <b>{point.y}</b> <br/>", shared: true, xDateFormat: "<b>%Y-%m-%d %H:%M</b>", valueDecimals: 0, crosshairs: {…}, …}
xAxis: {type: "datetime", lineColor: "grey", tickInterval: 43200000, min: 1556735400000, max: 1561919400000, …}
yAxis: (2) [{…}, {…}]
__proto__: Object


___________________________________________________________________________________________________
chart: {height: 700, events: {…}}
credits: {enabled: false}
exporting: {sourceWidth: 1200, sourceHeight: 600, buttons: {…}}
legend: {itemDistance: 0, padding: 0, x: 50, itemStyle: {…}, labelFormatter: ƒ}
plotOptions: {series: {…}, line: {…}}
rangeSelector: {enabled: true, buttonTheme: {…}, labelStyle: {…}, inputEnabled: false, zoom: {…}, …}
scrollbar: {enabled: true, align: 0}
series: (10) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
subtitle: {text: ""}
title: {text: " "}
tooltip: {pointFormat: "<br/><span style="color:{series.color}"><b>{series.name}</b></span>: <b>{point.y}</b> <br/>", shared: true, xDateFormat: "<b>%Y-%m-%d %H:%M</b>", valueDecimals: 0, crosshairs: {…}, …}
xAxis: {type: "datetime", lineColor: "grey", tickInterval: 43200000, min: 1556735400000, max: 1561919400000, …}
yAxis: (2) [{…}, {…}]

________________________________________________________________________
//this.options.scrollbar.margin = 0;
				//this.options.scrollbar.min = 0;
				//console.log('chart xxxx',this.chart.xAxis);
				//this.chart.xAxis[0].setExtremes(this.minX,this.maxX+90);

				/* setTimeout(()=>{
					//this.options.tickInterval = 1000 * 3600 * 12;
					alert(this.observationActualResponse.observations.length);					
					var catLen = this.observationActualResponse.observations.length - 1;
					this.chart.xAxis[0].setExtremes(this.minX,this.maxX-123123213213);	
				},2000); */
				
				
				
________________________________________________________________________
https://jsfiddle.net/zfh9kc08/8/
 
 

Highcharts.chart('container', {
    chart: {
        type: 'line',
        marginLeft: 150
    },
    title: {
        text: 'Most popular ideas by April 2016'
    },
    subtitle: {
        text: 'Source: <a href="https://highcharts.uservoice.com/forums/55896-highcharts-javascript-api">UserVoice</a>'
    },
    xAxis: {
        type: 'datetime',
        title: {
            text: null
        },
        min: 0,
        max: 10,
        scrollbar: {
            enabled: true
        },
        tickLength: 0
    },
    yAxis: {
        min: 0,
        max:1200,
        title: {
            text: 'Votes',
            align: 'high'
        }
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true
            },
            cropThreshold: 1000
        }
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    series: [{
        name: 'Votes',
        connectNulls:true,
        data: [
            [null, null],
           [null, null],
            [null, null],[null, null],[null, null],[null, null],[null, null],[null, null],[null, null],[null, null],[null, null],[null, null],
            [null, null],[null, null],[null, null],[null, null],[null, null],[null, null],[null, null],[null, null],
            ["Test1", 1],
            ["Test2", 2],
            ["Test3", 3],
            ["Test4", 343],
            ["Test5", 343],
            ["Test6", 343],
            ["Test7", 343],
            ["Test8", 4],
            ["Test9", 343],
            ["Test10", 343],
            ["Test11", 345],
            ["Test12", 343],
            ["Test13", 34],
            ["Test14", 343],
            ["Test15", 343],
            ["Test16", 34],
            ["Test17", 343],
            ["Test18", 343],
            ["Test19", 343],
            ["Test20", 343],
            ["Test21", 343],
            ["Test22", 343],
            ["Test23", 343],
            ["Test24", 343],
            ["Test25", 343],
            ["Test26", 343],
            ["Test27", 343],
            ["Test28", 343],
            ["Test29", 343],
            ["Test30", 343],
            ["Test31", 343]        
        ]
    }]
});


-----------------------------------------------
https://jsfiddle.net/b5kLq4go/


------------------------------------------------------------------
0: (2) [1511188200000, 169.98]
1: (2) [1511274600000, 173.14]
2: (2) [1511361000000, 174.96]
3: (2) [1511533800000, 174.97]
4: (2) [1511793000000, 174.09]
5: (2) [1511879400000, 173.07]
6: (2) [1511965800000, 169.48]
7: (2) [1512052200000, 171.85]
8: (2) [1512138600000, 171.05]
9: (2) [1512397800000, 169.8]
10: (2) [1512484200000, 169.64]
11: (2) [1512570600000, 169.01]
12: (2) [1512657000000, 169.32]
13: (2) [1512743400000, 169.37]
14: (2) [1513002600000, 172.67]
15: (2) [1513089000000, 171.7]
16: (2) [1513175400000, 172.27]
17: (2) [1513261800000, 172.22]
18: (2) [1513348200000, 173.97]
19: (2) [1513607400000, 176.42]
20: (2) [1513693800000, 174.54]
21: (2) [1513780200000, 174.35]
22: (2) [1513866600000, 175.01]
23: (2) [1513953000000, 175.01]
24: (2) [1514298600000, 170.57]
25: (2) [1514385000000, 170.6]
26: (2) [1514471400000, 171.08]
27: (2) [1514557800000, 169.23]
28: (2) [1514903400000, 172.26]
29: (2) [1514989800000, 172.23]
30: (2) [1515076200000, 173.03]
31: (2) [1515162600000, 175]
32: (2) [1515421800000, 174.35]
33: (2) [1515508200000, 174.33]
34: (2) [1515594600000, 174.29]
35: (2) [1515681000000, 175.28]
36: (2) [1515767400000, 177.09]
37: (2) [1516113000000, 176.19]
38: (2) [1516199400000, 179.1]
39: (2) [1516285800000, 179.26]
40: (2) [1516372200000, 178.46]
41: (2) [1516631400000, 177]
42: (2) [1516717800000, 177.04]
43: (2) [1516804200000, 174.22]
44: (2) [1516890600000, 171.11]
45: (2) [1516977000000, 171.51]
46: (2) [1517236200000, 167.96]
47: (2) [1517322600000, 166.97]
48: (2) [1517409000000, 167.43]
49: (2) [1517495400000, 167.78]
50: (2) [1517581800000, 160.5]
51: (2) [1517841000000, 156.49]
52: (2) [1517927400000, 163.03]
53: (2) [1518013800000, 159.54]
54: (2) [1518100200000, 155.15]
55: (2) [1518186600000, 156.41]
56: (2) [1518445800000, 162.71]
57: (2) [1518532200000, 164.34]
58: (2) [1518618600000, 167.37]
59: (2) [1518705000000, 172.99]
60: (2) [1518791400000, 172.43]
61: (2) [1519137000000, 171.85]
62: (2) [1519223400000, 171.07]
63: (2) [1519309800000, 172.5]
64: (2) [1519396200000, 175.5]
65: (2) [1519655400000, 178.97]
66: (2) [1519741800000, 178.39]
67: (2) [1519828200000, 178.12]
68: (2) [1519914600000, 175]
69: (2) [1520001000000, 176.21]
70: (2) [1520260200000, 176.82]
71: (2) [1520346600000, 176.67]
72: (2) [1520433000000, 175.03]
73: (2) [1520519400000, 176.94]
74: (2) [1520605800000, 179.98]
75: (2) [1520861400000, 181.72]
76: (2) [1520947800000, 179.97]
77: (2) [1521034200000, 178.44]
78: (2) [1521120600000, 178.65]
79: (2) [1521207000000, 178.02]


--------------------------------------------------------------
 var gData = [
    [
        1511188200000,
        169.98
    ],
    [
        1511274600000,
        173.14
    ],
    [
        1511361000000,
        174.96
    ],
    [
        1511533800000,
        174.97
    ],
    [
        1511793000000,
        174.09
    ],
    [
        1511879400000,
        173.07
    ],
     [
        1511965800000,
        169.48
    ],
    [
        1512052200000,
        171.85
    ],
    [
        1512138600000,
        171.05
    ],
    [
        1512397800000,
        169.8
    ],
    [
        1512484200000,
        169.64
    ],
    [
        1512570600000,
        169.01
    ],
    [
        1512657000000,
        169.32
    ],
    [
        1512743400000,
        169.37
    ],
      [
        1513002600000,
        172.67
    ],
    [
        1513089000000,
        171.7
    ],
    [
        1513175400000,
        172.27
    ],
    [
        1513261800000,
        172.22
    ],
    [
        1513348200000,
        173.97
    ],
    [
        1513607400000,
        176.42
    ],
    [
        1513693800000,
        174.54
    ],
    [
        1513780200000,
        174.35
    ],
    [
        1513866600000,
        175.01
    ],
    [
        1513953000000,
        175.01
    ],
    [
        1514298600000,
        170.57
    ],
    [
        1514385000000,
        170.6
    ],
    [
        1514471400000,
        171.08
    ],
    [
        1514557800000,
        169.23
    ],
    [
        1514903400000,
        172.26
    ],
    [
        1514989800000,
        172.23
    ],
    [
        1515076200000,
        173.03
    ],
    [
        1515162600000,
        175
    ],
    [
        1515421800000,
        174.35
    ],
    [
        1515508200000,
        174.33
    ],
    [
        1515594600000,
        174.29
    ],
    [
        1515681000000,
        175.28
    ],
    [
        1515767400000,
        177.09
    ],
    [
        1516113000000,
        176.19
    ],
    [
        1516199400000,
        179.1
    ],
    [
        1516285800000,
        179.26
    ],
    [
        1516372200000,
        178.46
    ],
    [
        1516631400000,
        177
    ],
    [
        1516717800000,
        177.04
    ],
    [
        1516804200000,
        174.22
    ],
    [
        1516890600000,
        171.11
    ],
    [
        1516977000000,
        171.51
    ],
    [
        1517236200000,
        167.96
    ],
    [
        1517322600000,
        166.97
    ],
    [
        1517409000000,
        167.43
    ],
    [
        1517495400000,
        167.78
    ],
    [
        1517581800000,
        160.5
    ],
    [
        1517841000000,
        156.49
    ],
    [
        1517927400000,
        163.03
    ],
    [
        1518013800000,
        159.54
    ],
    [
        1518100200000,
        155.15
    ],
    [
        1518186600000,
        156.41
    ],
    [
        1518445800000,
        162.71
    ],
    [
        1518532200000,
        164.34
    ],
    [
        1518618600000,
        167.37
    ],
    [
        1518705000000,
        172.99
    ],
    [
        1518791400000,
        172.43
    ],
    [
        1519137000000,
        171.85
    ],
    [
        1519223400000,
        171.07
    ],
    [
        1519309800000,
        172.5
    ],
    [
        1519396200000,
        175.5
    ],
    [
        1519655400000,
        178.97
    ],
    [
        1519741800000,
        178.39
    ],
    [
        1519828200000,
        178.12
    ],
    [
        1519914600000,
        175
    ],
    [
        1520001000000,
        176.21
    ],
    [
        1520260200000,
        176.82
    ],
    [
        1520346600000,
        176.67
    ],
    [
        1520433000000,
        175.03
    ],
    [
        1520519400000,
        176.94
    ],
    [
        1520605800000,
        179.98
    ],
    [
        1520861400000,
        181.72
    ],
    [
        1520947800000,
        179.97
    ],
    [
        1521034200000,
        178.44
    ],
    [
        1521120600000,
        178.65
    ],
    [
        1521207000000,
        178.02
    ],
    ];
	
	
	
----------------------------------------------------

0: (2) [1521207000000, 178.02]
1: (2) [1521120600000, 178.65]
2: (2) [1521034200000, 178.44]
3: (2) [1520947800000, 179.97]
4: (2) [1520861400000, 181.72]
5: (2) [1520605800000, 179.98]
6: (2) [1520519400000, 176.94]
7: (2) [1520433000000, 175.03]
8: (2) [1520346600000, 176.67]
9: (2) [1520260200000, 176.82]
10: (2) [1520001000000, 176.21]
11: (2) [1519914600000, 175]
12: (2) [1519828200000, 178.12]
13: (2) [1519741800000, 178.39]
14: (2) [1519655400000, 178.97]
15: (2) [1519396200000, 175.5]
16: (2) [1519309800000, 172.5]
17: (2) [1519223400000, 171.07]
18: (2) [1519137000000, 171.85]
19: (2) [1518791400000, 172.43]
20: (2) [1518705000000, 172.99]
21: (2) [1518618600000, 167.37]
22: (2) [1518532200000, 164.34]
23: (2) [1518445800000, 162.71]
24: (2) [1518186600000, 156.41]
25: (2) [1518100200000, 155.15]
26: (2) [1518013800000, 159.54]
27: (2) [1517927400000, 163.03]
28: (2) [1517841000000, 156.49]
29: (2) [1517581800000, 160.5]
30: (2) [1517495400000, 167.78]
31: (2) [1517409000000, 167.43]
32: (2) [1517322600000, 166.97]
33: (2) [1517236200000, 167.96]
34: (2) [1516977000000, 171.51]
35: (2) [1516890600000, 171.11]
36: (2) [1516804200000, 174.22]
37: (2) [1516717800000, 177.04]
38: (2) [1516631400000, 177]
39: (2) [1516372200000, 178.46]
40: (2) [1516285800000, 179.26]
41: (2) [1516199400000, 179.1]
42: (2) [1516113000000, 176.19]
43: (2) [1515767400000, 177.09]
44: (2) [1515681000000, 175.28]
45: (2) [1515594600000, 174.29]
46: (2) [1515508200000, 174.33]
47: (2) [1515421800000, 174.35]
48: (2) [1515162600000, 175]
49: (2) [1515076200000, 173.03]
50: (2) [1514989800000, 172.23]
51: (2) [1514903400000, 172.26]
52: (2) [1514557800000, 169.23]
53: (2) [1514471400000, 171.08]
54: (2) [1514385000000, 170.6]
55: (2) [1514298600000, 170.57]
56: (2) [1513953000000, 175.01]
57: (2) [1513866600000, 175.01]
58: (2) [1513780200000, 174.35]
59: (2) [1513693800000, 174.54]
60: (2) [1513607400000, 176.42]
61: (2) [1513348200000, 173.97]
62: (2) [1513261800000, 172.22]
63: (2) [1513175400000, 172.27]
64: (2) [1513089000000, 171.7]
65: (2) [1513002600000, 172.67]
66: (2) [1512743400000, 169.37]
67: (2) [1512657000000, 169.32]
68: (2) [1512570600000, 169.01]
69: (2) [1512484200000, 169.64]
70: (2) [1512397800000, 169.8]
71: (2) [1512138600000, 171.05]
72: (2) [1512052200000, 171.85]
73: (2) [1511965800000, 169.48]
74: (2) [1511879400000, 173.07]
75: (2) [1511793000000, 174.09]
76: (2) [1511533800000, 174.97]
77: (2) [1511361000000, 174.96]
78: (2) [1511274600000, 173.14]
79: (2) [1511188200000, 169.98]



----------------------------
setTimeout(()=>{
					//let el = document.querySelector('.highcharts-scrollbar g');
					//el.dispatchEvent(new Event('scroll'));
					//el.scrollIntoView({behavior: "smooth", block: "end"});
					//el.setAttribute("transform", "translate(500,-0.5)");
				},100);
				
				
				
--------------------------------------------

dataMax: 1561401000000
dataMin: 1556735400000
max: 1561401000000
min: 1558809000000
userMax: 1561401000000
userMin: 1558809000000

------------------------------------------------------
Renderer.. 
a.SVGRenderer {style: {…}, isSVG: true, box: svg, boxWrapper: a.SVGElement, alignedObjects: Array(3), …}
alignedObjects: (3) [a.SVGElement, a.SVGElement, a.SVGElement]
allowHTML: undefined
box: svg
boxWrapper: a.SVGElement {element: svg, renderer: a.SVGRenderer, styles: {…}}
cache: {0000-00-00,0,12px,,: {…}, 0000-00-00,-90,12px,77,ellipsis: {…}, 00 mmHg,0,12px,,: {…}, 000 mmHg,0,12px,,: {…}, 00 BPM,0,11px,,: {…}, …}
cacheKeys: (15) ["0000-00-00,0,12px,,", "0000-00-00,-90,12px,77,ellipsis", "00 mmHg,0,12px,,", "000 mmHg,0,12px,,", "00 BPM,0,11px,,", "000 BPM,0,11px,,", "Zoom,0,,,", "<div style="width:50%; font-size:12px;"><span styl… DBP within goal</span></div>,0,12px,350,ellipsis", "<div style="width:50%; font-size:12px;"><span styl…at or above goal</span></div>,0,12px,350,ellipsis", "<div style="width:50%; font-size:12px;"><span styl… DBP within goal</span></div>,0,12px,350,ellipsis", "<div style="width:50%;font-size:12px;"><span style…at or above goal</span></div>,0,12px,350,ellipsis", "<div style="width:50%; font-size:12px;"><span styl…ght;">Heart Rate</span></div>,0,12px,350,ellipsis", "<div style="width:50%; font-size:12px;"><span styl…:right;">Goal BP</span></div>,0,12px,350,ellipsis", "<div style="width:50%; font-size:12px;"><span styl…Validated Device</span></div>,0,12px,350,ellipsis", "No data to display,0,12px,,"]
chartIndex: 4
defs: a.SVGElement {element: defs, renderer: a.SVGRenderer, parentInverted: undefined, added: true, undefined: undefined}
forExport: undefined
globalAnimation: true
gradients: {}
height: 700
imgCount: 0
isSVG: true
plotBox: {x: 90, y: 43, width: 1015, height: 439}
spacingBox: {x: 10, y: 10, width: 1156, height: 675}
style: {fontFamily: ""Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif", fontSize: "12px"}
styledMode: false
url: "http://localhost:4200/portal/patient"
width: 1176


-------------------------------------------
setTimeout(()=>{

					//let containerElemWidth = (document.querySelector("#container div")  as HTMLElement).style.width;
					
					//let numericValue = containerElemWidth.match(/(\d+)/); 

					//alert(numericValue[0]);

					alert('mmove right');

					//let el = document.querySelector('.highcharts-scrollbar g');
					
					//el.dispatchEvent(new Event('scroll'));
					//el.scrollIntoView({behavior: "smooth", block: "end"});
					//el.setAttribute("transform", "translate(500,-0.5)");
					//var screenPosition = el.getBoundingClientRect();
					//console.log(screenPosition);
					//el.scrollLeft += +numericValue[0];

					/* let el2 = document.querySelector('.highcharts-scrollbar g rect');
					let gRectwidth = +el2.getAttribute('width') + 10;
					console.log(gRectwidth);
					el.setAttribute("transform", "translate("+gRectwidth+",-0.5)"); */

					

					//var cav = this.chart.xAxis[0].getExtremes();
					//this.chart.xAxis[0].setExtremes(cav.min + 864000000,cav.max + 864000000);
					//this.chart.xAxis[0].setExtremes(cav.min+84000000,cav.dataMax);

					//console.log(Highcharts.SVGElement);

					//console.log('Renderer..',this.chart.renderer)

					//this.chart.renderer.box.children[14].childNodes[1].scrollLeft = -100;

					//this.chart.renderer.box.children[14].childNodes[3].dispatchEvent(new Event('click'));

					//this.chart.renderer.box.children[14].childNodes[1].attributes[0].nodeValue = "translate(500,-0.5)";

					//console.log('Renderer..',this.chart.renderer);

					//console.log(cav);


					let elm = document.querySelector('.highcharts-scrollbar').lastElementChild.dispatchEvent(new Event('click'));  //finaly worked
					//console.log(elm);

				},100);

