<template>
        <!-- Button trigger modal -->
        <button type="button" id="button-margin" @click.prevent="getMetricData" class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#chartsModal">Graphs</button>
        
        <!-- Chart modal -->
        <div class="modal fade" id="chartsModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Metric Graphs</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <canvas id="myChart" ref="myChart" style="width:100%;max-width:600px"></canvas>
                        <select @change="metricTypeChange($event)" class="form-select form-select" aria-label=".form-select-sm example">
                            <option selected disabled>Select Metric</option>
                            <option v-for="(metricName, index) in metricNames" :key="index">{{metricName}}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
</template>

<script>

import { defineComponent, ref, onMounted } from 'vue'
export default {
    props: ['login'],
    data() {
        return {
            xValues: [], // dates
            yValues: [], // values
            dates: [],
            metrics: [],
            metricNames: [],
            totalMetrics: [],
            metricName: ''
        }
    },
    mounted() {
        
    },
    computed: {
 
    },
    methods: {
        /**
         * returns an object containing only unique key/value pairs
         */
         uniq(a) {
            var seen = {};
            return a.filter(function(item) {
                return seen.hasOwnProperty(item) ? false : (seen[item] = true);
            });
        },
        /**
         * Called during metric dropdown changes
         */
        metricTypeChange(e) {
            let dates = []
            let values = []
            this.metricName = e.target.value
            
            // loop through all metrics
            for (const i in this.totalMetrics) {
                // if current select metric is found
                if (this.totalMetrics[i].Metric.Name == this.metricName) {
                    // push the date and value into x and y values
                    dates.push(this.totalMetrics[i].Date)
                    values.push(this.totalMetrics[i].Metric.Value)
                    }
            }
           this.xValues = dates
           this.yValues = values
           
           // generate new chart for selected metric
           this.generateChart()
        },
        /**
         * Initial call to get all metric data, called after clicking Graphs button
         */
        async getMetricData() { //get all metric data
        
            // initial call if no dates, grab all dates from db
            if (this.dates.length == 0) { 
                let res = await fetch('https://dgzwfgko18.execute-api.eu-west-1.amazonaws.com/v6/findings', { // get all dates
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({"password": this.login, "sqlCommand": "select date from metrics order by date asc;"})
                }) 
                
                let data = await res.json()
                
                // set current dates
                let tmpDates = []
                data.body.forEach(function(obj) {
                    if (!tmpDates.includes(obj[0])) {
                        tmpDates.push(obj[0])
                    }
                })
                this.dates = tmpDates
    
            }
            
            // only need to do API call once to populate the metrics array
            if (this.totalMetrics.length == 0) { 
            
                // hold current metrics
                let tmpArr = [] 
            
                // get metrics for all dates
                for (const i in this.dates) { 
                    let res = await fetch('https://dgzwfgko18.execute-api.eu-west-1.amazonaws.com/v6/findings', { // get all initial metrics
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({"password": this.login, "sqlCommand": "select name, value, date from metrics where date = '" + this.dates[i] + "';"})
                        }) 
                    
                    let data = await res.json()
                    data.body.forEach((obj) => tmpArr.push({"Date": this.dates[i], "Metric": {"Name": obj[0], "Value": obj[1]}}))
                }
    
                // set metrics 
                this.totalMetrics = tmpArr
                
                // push each metric and add names to list only once
                for (const i in tmpArr) {
                    // this.metrics.push(tmpArr[i].Metric)
                    if (!this.metricNames.includes(tmpArr[i].Metric.Name)) {
                        this.metricNames.push(tmpArr[i].Metric.Name)
                    }
                }
            }
            
            // generate chart, at this point is a blank chart
            this.generateChart()
                
        },
        /**
         * Generate a chart from Chart.js -- X:Axis -> Dates, Y:Axis -> Metric Value
         */
        generateChart() {
            // create new chart object based on xValues and yValues
            new Chart(this.$refs.myChart, { //declare chart
                type: 'line',
                data: {
                  labels: this.xValues,
                  datasets: [{
                      fill: false,
                      lineTension: 0,
                      backgroundColor: "rgba(0,0,255,1.0)",
                      borderColor: "rgba(0,0,255,0.1)",
                      data: this.yValues
                  }]
                },
                  options: {
                    legend: {display: false}
                  }
            })
        }
    }
}
</script>

<style>

</style>