Highcharts.chart('container', {
    xAxis: {
        plotBands: [{ // mark the weekend
            color: '#fff',
            from: Date.UTC(2010, 0, 1),
            to: Date.UTC(2010, 0, 6,23,59,59)
        },{ // mark the weekend
            color: '#000',
            from: Date.UTC(2010, 0, 6,23,59,59),
            to: Date.UTC(2010, 0, 13)
        },{ // mark the weekend
            color: '#fff',
            from: Date.UTC(2010, 0, 7),
            to: Date.UTC(2010, 0, 12,23,59,59)
        }],
        tickInterval: 24 * 3600 * 1000, // one day
        type: 'datetime'
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4],
        pointStart: Date.UTC(2010, 0, 1),
        pointInterval: 24 * 3600 * 1000
    }]
});