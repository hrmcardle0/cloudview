<template>
            <!-- Button trigger modal -->
        <button type="button" id="button-margin" @click="getInitialMetrics" class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#metricsModal">Metrics</button>
        
        <!-- Modal -->
        <div class="modal fade" id="metricsModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Metrics</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <table class="table">
                            <thead>
                                <tr>
                                <th scope="col">Metric Title</th>
                                <th scope="col">Metric Value</th>
                                <th scope="col">Metric Change</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(metric, index) in metrics" :key="index">
                                <td>{{ metric.Name }}</td>
                                <td>{{ metric.Value }}</td>  
                                <td v-if="metric.Change"><i :id="changeDirectionId(metric)" :class="{ 'bi': true, 'bi-arrow-up': getChangeDirection(metric), 'bi-arrow-down': !getChangeDirection(metric) }"></i>{{ metric.Change }}</td>  
                                <td v-if="!metric.Change">N/A</td>  
                                </tr>
                            </tbody>
                        </table>
                        <select @change="metricDateChange($event)" class="form-select form-select" aria-label=".form-select-sm example">
                            <option selected disabled>Select Date</option>
                            <option v-for="(date, index) in dates" :key="index">{{date}}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
    export default {
        /**
         * metrics -> list of metrics generated from QueryPage
         * dates -> populates dropdown menu of selectable dates
         */
        props: ['metrics', 'dates'],
        emits: ['getMetrics'],
        data() {
            return {
                
            }
        },
        methods: {
            /**
             * Returns if a metric has increased or not
             */
            getChangeDirection(metric) {
                if (parseInt(metric.Change) > 0) {
                    return true
                }
                else {
                    return false
                }
            },
            /**
             * returns the direction of the metric change
             */
            changeDirectionId(metric) {
                if (parseInt(metric.Change) > 0) {
                    return "arrowUp"
                }
                else if (parseInt(metric.Change) < 0) {
                    return "arrowDown"
                }
                else {
                    return ""
                }
            },
            /** 
             * Inital call to get all metrics
             */
            getInitialMetrics() {
                this.$emit('getMetrics', 'current')
            },
            /**
             * Called during a metric dropdown change
             */
            metricDateChange(e) {
                this.$emit('getMetrics', e.target.value)
                
            }
        }
    }
</script>

<style>
#arrowUp {
    color: green;
}

#arrowDown {
    color: red;
}
</style>