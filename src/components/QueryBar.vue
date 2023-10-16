<template>
    <div class="container-fluid">
        <div class="form-outline">
            <input type="text" id="typeText" class="form-control" v-model="query" @click.prevent="resetForm()" @keypress="enterForm($event)"/>
            <label class="form-label" for="typeText"></label>
            <span v-if="!querySuccess" :class="{ queryFailed: !querySuccess }">Query Failed</span>
            <span v-if="queryLoading">Query Loading</span>
            <!-- <span v-if="querySuccess && !queryLoading && query != 'Filter Query'" :class="{ querySuccess: querySuccess }">Query Successful</span> -->
        </div>
        <button id="button-margin" class="btn btn-success" :disabled="isQuery" @click.prevent="$emit('queryFilter', query)">Run Query</button>
                <button type="button" id="button-margin" :disabled="isQuery" @click.prevent="resetQuery()" class="btn btn-danger">Reset</button>
        
        <!-- Button trigger modal -->
        <button type="button" id="button-margin" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Load or Save Query</button>
        <button type="button" id="button-margin" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#cacheModal" @click.prevent="clearCache()">Clear Cache</button>
        
        <!-- clear cache modal -->
        <div class="modal fade" id="cacheModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-sm">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Cache Cleared</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                    Your cache has been cleared.
                    </div>
                </div>
            </div>
        </div>

        <!-- saved query modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Saved Queries</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <table class="table">
                            <thead>
                                <tr>
                                <th scope="col">Query Title</th>
                                <th scope="col">Query Type</th>
                                <th scope="col">Query Text</th>
                                <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(query, index) in filteredQueries" :key="index">
                                <td>{{ query.QueryName }}</td>
                                <td>{{ query.QueryType }}</td>
                                <td>{{ query.QueryText }}</td>
                                <td><button type="button" class="btn btn-warning btn-sm" data-bs-dismiss="modal" @click="loadQuery(query)">Load</button></td>
                                <td><button type="button" class="btn btn-danger btn-sm" data-bs-dismiss="modal" @click="deleteQuery(query)">Delete</button></td>
                                </tr>
                                <tr>
                                <td><input type="text" id="typeText" v-model="savedQueryName"></td>
                                <td><input type="text" id="typeText" v-model="savedQueryType"></td>
                                <td><input type="text" v-model="query" id="typeText"></td>
                                <td><button type="button" class="btn btn-success btn-sm" data-bs-dismiss="modal" @click="saveQuery()">Save</button></td>
                                </tr>
                            </tbody>
                        </table>
                        <select id="queryType" @change="queryChange($event)" class="form-select form-select" aria-label=".form-select-sm example">
                            <option default>Select Query Type</option>
                            <option>All</option>
                            <option v-for="(query, index) in queryTypes">{{ query }}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    /**
     * querySuccess -> check if query has succeeded or not to display appropriate text
     * queryLoading -> check if query is still loading to display appropriate text
     * login -> API password
     */
    props: ['querySuccess', 'queryLoading', 'login'],
    data() {
        return {
            query: 'Filter Query',
            savedQueryName: '',
            savedQueryType: '',
            savedQueries: [],
            filteredQueries: [],
            times: 0,
            queryTypes: []
        }
    },
    created() {
        // inital call to get all queries from DB
        this.getQueries()
    },
    computed: {
        /**
         *  Will disable button if query is empty or at default value
         */
        isQuery() {
            if (this.query == "Filter Query" || this.query == '') {
                return true
            }
            else {
                return false
            }
        },
        /**
         * Checks if query has failed or not to present error text
         */
        hasQueryFailed() {
            if (this.querySuccess == "Query Failed") {
                console.log(this.querySuccess)
                return true 
            }
            else { return false 
            }
        }
    },
    methods: {
        /**
         * Runs everytime the query type dropdown is changed. Each time, get the new value and determin which queries to show
         */
        queryChange(e) {
            // do nothing at first, with 'Select Query Type' as placeholder
            if (e.target.value != "Select Query Type") {
                // if 'All' is selected, set the queries shown (filteredQueries) equal to the entire saved queries array
                if (e.target.value == "All") {
                    this.filteredQueries = this.savedQueries
                }
                
                // else, a specific query type is selected
                else 
                {
                    // create temp array to house  new queries
                    let newQ = []
                    
                    // iterate over our saved queries, check if they match the current type
                    this.savedQueries.forEach(function(obj, index) {
                        
                        if (obj.QueryType == e.target.value) {
                            newQ.push(obj)
                        }
                    })
                    this.filteredQueries = newQ
                }
            }
            // else, 'Select Query Type' is selected, show nothing
            else
            {
                this.filteredQueries = []
            }
        },
        /**
         * Clear the Cache
         */
        clearCache() {
            this.$cache.clearCache()
        },
        
        /**
         * Initially get queries, called upon component creation,
         * populates savedQueries. Only called once!
         */
        async getQueries() {
            
            // get default values first
            this.savedQueries = this.$queries.queries 
            let tmpArr = []
            let tmpSavedArr = []
            
            // get all database-saved queries
            let res = await fetch('https://dgzwfgko18.execute-api.eu-west-1.amazonaws.com/v6/findings', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({"password": this.login, "sqlCommand": "select * from queries;"})
            })
            
            let data = await res.json()

            // iterate over response
            data.body.forEach(function (obj) {
                let found = -1
                // check if query already exists in tmpSavedArr
                for (const i in tmpSavedArr) {
                    if (obj[3] == tmpSavedArr[i].QueryText) {
                        found = i
                    }
                }
                // if not exists in tmpSavedArr, push query to tmpSavedArr
                if (found == -1 ) {
                    tmpSavedArr.push({QueryType: obj[2], QueryName: obj[1], QueryText: obj[3]})
                }
            })
            
            // push all in tmpSavdArr to savedQueries
            for (const i in tmpSavedArr) {
                this.savedQueries.push(tmpSavedArr[i])
            }
            
            // loop over queries to check query types
            this.savedQueries.forEach(function(obj) { 
                // if tmpArr does not include the query type already, push it
                // avoids setting duplicates
                if (!tmpArr.includes(obj.QueryType)) {
                    tmpArr.push(obj.QueryType)
                }
            })
            
            // set queryTypes on view 
            this.queryTypes = tmpArr
            
            // set initial queries shown to nothing
            this.filteredQueries = []
        },
        /**
         * Called to reset the querybar form initially to nothing. Initially it starts with 'Filter Query' but upon clicking, it should empty
         */
        resetForm() {
            //increment time to keep track
            this.times = this.times + 1
            
            // only empty the query bar the first time
            if (this.times == 1) {
                this.query = ''
            }
        },
        /**
         *  Called each time a keypress event occurs on query bar, allows users to hit Enter key to run query
         */
        enterForm(e) {
            // check if user hits enter key and query is not empty before running query
            if (e.key == "Enter" && this.query != '') {
                this.$emit('queryFilter', this.query)
            }

        },
        /**
         * Reset the query form, enable the select all dropdown
         */
        resetQuery() {
            this.query = ''
            this.$emit('enableSelectAll')
        },
        /** 
         * Called from saved query modal allowing users to load queries
         * 
         */
        loadQuery(query) {
            // increment times to keep track
            this.times = this.times + 1
            // set current query equal to the targed queryText
            this.query = query.QueryText
        },
        /**
         * Saves a query in the queries db
         */
        async saveQuery() {
            
            // sanitize query to escape single quotes
            // insert the saved query into db
            let iQuery = this.query.replaceAll("'","''")
            let res = await fetch('https://dgzwfgko18.execute-api.eu-west-1.amazonaws.com/v6/findings', { // get all initial metrics
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({"action": "query-insert", "password": this.login, "sqlCommand": "insert into queries (name, type, value) select '" + this.savedQueryName + "', '" + this.savedQueryType + "', '" + iQuery + "' where not exists (select id from queries where value = '" + iQuery + "');"})
            }) 
            
            // Check to see if it already exists in local var
            let found = 0
            for (const i in this.savedQueries) {
                if (this.savedQueries[i].QueryText == this.query) {
                    found = 1
                }
            }
            
            // if query doesn't exist in local var
            if (found == 0) {
                // push query to local  var
                this.savedQueries.push({QueryType: this.savedQueryType, QueryName: this.savedQueryName, QueryText: this.query})
                if (!this.queryTypes.includes(this.savedQueryType)) {
                    this.queryTypes.push(this.savedQueryType)
                }
            }
            
            // reset saved query
            this.savedQueryName = ''
             // reset account form to be 'All Accounts'
            let element = document.getElementById("queryType")
            element.value = 'Select Query Type'
        },
        /**
         * Delete query from saved queries db and local var
         */
        async deleteQuery(query) {
            
            //santize query
            let iQuery = query.QueryText.replaceAll("'","''")
            // delete queries from db
            let res = await fetch('https://dgzwfgko18.execute-api.eu-west-1.amazonaws.com/v6/findings', { // get all initial metrics
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({"action": "query-delete", "password": this.login, "sqlCommand": "delete from queries where value = '" + iQuery + "';"})
            }) 
            
            // temp arrays
            let tmpArr = []
            console.log(query.QueryText)
            // effecitvely remove query from local vars
            this.savedQueries.forEach(function(obj, i) {
                if (obj.QueryText != query.QueryText) {
                    tmpArr.push(obj)
                }
            })

            let data = await res.json()
            this.savedQueries = tmpArr
  
        }
    },
    watch: {
        /**
         * emite system reset query event if user empties the query box
         */
        query(newQuery, oldQuery) {          
            //user has deleted their query, refresh the findings
            if (newQuery == '') { 
               this.$emit('queryFilter', "SYSTEM:RESET")

            }
        }
    }
}
</script>

<style>
.align {
    text-align: center;
}

#button-margin {
    margin: 5px;
}

#bootstrap-overrides {
    color: white;
}

.queryFailed {
    color: red;
}

.querySuccess {
    color: green;
}

#exampleModal {

}

</style>