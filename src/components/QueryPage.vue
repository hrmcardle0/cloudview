<template>
        

    <div class="col py-3">
        <div v-if="loginSuccess == false" class="form-outline">
            <input type="password" id="typeText" class="form-control" v-model="login" @click.prevent="login=''"/>
            <label class="sr-only" for="inlineFormInputGroupUsername2">Please enter the API password</label>
            <button id="button-margin" class="btn btn-success btn-sm" :disabled="login == 'Enter Password'" @click.prevent="kickstart">Submit</button>
            <span style="color: red;" v-if="loginFailed">Login Failed!</span>
            <!-- <span v-if="querySuccess && !queryLoading && query != 'Filter Query'" :class="{ querySuccess: querySuccess }">Query Successful</span> -->
        </div>
        <div v-if="loginSuccess">
            <h3>Cloud Security Findings</h3>
            <p class="lead">
                A query and search tool that searches the finding database based on the provided input. An account must be selected to proceed. Please read the documentation
                on syntax for more information and provided examples.</p>
            <ul class="list-unstyled">
                <li><h5>About the tool</h5><p>This tool connects to a backend database and allows Coremont users to execute SQL commands against a database containing AWS security findings. Please utilize the LIMIT SQL keyword,
                as the database can contain lots of records and rendering them all could potentionally freeze the browser. The default query generated upon account selection is by default limited to 500.</p></li>
                <p>This tool's use is limited to that of Coremont users only through the use of an IP whitelist. Results are cached locally, so it is wise to clear the cache using the button below every once in awhile</p>
            </ul>
            <ul class="list-unstyled">
                <li><h5>Metrics</h5></li>
                Metrics are collected and can be viewed by clicking below.<br>
                <Metrics
                    :metrics="metrics"
                    :dates="dates"
                    @get-metrics="getMetrics"
                ></Metrics>
                <Charts
                    :login="login"
                ></Charts>
            </ul>
 

            <ul class="list-unstyled">
                <li><h5>Select your AWS Account(s)</h5> Select which AWS accounts that you wish to search the database for below. Select ether an account to view all findings related to that account, or enter a SQL query.</li>
            </ul>
            <div :class="{'loader-container': loading}"><div :class="{'spinner': loading}"></div></div>
                <AccountForm
                    :accounts="nAccounts"
                    @choose-account="chooseAccount"
                    @choose-all-accounts="chooseAllAccounts"
                    :all-selected-disabled='allSelectedDisabled'
                ></AccountForm>
        
                <QueryBar
                    @query-filter="queryFilter"
                    :query-success="querySuccess"
                    :query-loading="queryLoading"
                    @enable-select-all="enableSelectAll"
                    :login="login"
                ></QueryBar>
 
            <div v-if="!loading && initialized">
            <FindingTable
                :findings="filteredFindings"
                :accounts="selectedAccounts"
                :titles="allColumns"
            ></FindingTable>
            </div>
            </div>
    
            <Footer
                :accounts="selectedAccounts"
                :all="allAccounts"
            ></Footer>
    </div>

</template>

<script>
import AccountForm from './AccountForm.vue'
import Footer from './Footer.vue'
import FindingTable from './FindingTable.vue'
import QueryBar from './QueryBar.vue'
import Metrics from './Metrics.vue'
import Charts from './Charts.vue'

export default {
    components: {
        AccountForm,
        Footer,
        FindingTable,
        QueryBar,
        Metrics,
        Charts
    },
    props: [],
    data() {
        return {
            metrics: [],
            dates: [],
            nAccounts: [
                {"Account": "640812199923", "Name": "CM OMS NON-PROD", "Email": "awsomsnonprod@coremont.com"}, {"Account": "355730698374", "Name": "CM Clarion-oms-prod", "Email": "cmclarionomsprod@coremont.com"}, {"Account": "512539878214", "Name": "Digital Production", "Email": "awsdigitalprod@coremont.com"}, {"Account": "446982078222", "Name": "Wintel Team", "Email": "awswintel@coremont.com"}, {"Account": "240577915901", "Name": "CM Digital Sandbox", "Email": "awsdigitalsandbox@coremont.com"}, {"Account": "322675843564", "Name": "CM Clarion-oms-non-prod", "Email": "cmclarionomsnonprod@coremont.com"}, {"Account": "904874138454", "Name": "Spectrum", "Email": "awsspectrum@brevanhoward.com"}, {"Account": "389832110479", "Name": "CM Data Service Dev", "Email": "awscmdataservicedev@coremont.com"}, {"Account": "464696720585", "Name": "Systematic Tech Production", "Email": "awssystematictechprod@coremont.com"}, {"Account": "711055217004", "Name": "Core Services", "Email": "awscoreservices@coremont.com"}, {"Account": "003494141060", "Name": "Network Team", "Email": "awsnetworks@coremont.com"}, {"Account": "021297889435", "Name": "Galahad", "Email": "awsgalahad@coremont.com"}, {"Account": "248857320340", "Name": "CM Dev Platform Non Prod", "Email": "awscmdevplatformnonprod@coremont.com"}, {"Account": "458305147808", "Name": "Cyber Security", "Email": "awscybersecurity@coremont.com"}, {"Account": "412787560016", "Name": "cust-an-infra", "Email": "awsinfrastructure@coremont.com"}, {"Account": "143768866658", "Name": "Systematic AI", "Email": "awssystematicai@brevanhoward.com"}, {"Account": "107686993532", "Name": "Cyber Security Admin Production", "Email": "awscybersecadminproduction@coremont.com"}, {"Account": "880886191504", "Name": "Unix Team", "Email": "awsunix@coremont.com"}, {"Account": "350235547130", "Name": "CM OPS TECH CLOUD", "Email": "awscmopstechcloud@coremont.com"}, {"Account": "944711507862", "Name": "CM NetApp Cloud", "Email": "awscmnetappcloud@coremont.com"}, {"Account": "260059522983", "Name": "Digital Non-Production", "Email": "awsdigitalnonprod@coremont.com"}, {"Account": "187032552263", "Name": "DBA Team", "Email": "awsdba@coremont.com"}, {"Account": "554050439203", "Name": "Perl Team", "Email": "awsperl@coremont.com"}, {"Account": "873378521444", "Name": "Clarion Production", "Email": "awsclarionproduction@coremont.com"}, {"Account": "541809733079", "Name": "CM Dev Platform Prod", "Email": "awscmdevplatformprod@coremont.com"}, {"Account": "796282465664", "Name": "Coremont Networking Services", "Email": "awsnetworkingservices@coremont.com"}, {"Account": "315958533332", "Name": "Scratch", "Email": "awsscratch@coremont.com"}, {"Account": "604939842046", "Name": "CM OMS PROD", "Email": "awsomsprod@coremont.com"}, {"Account": "878818550791", "Name": "Trading Technology", "Email": "awstradingtechnology@coremont.com"}, {"Account": "550632678112", "Name": "Galahad Production", "Email": "awsgalahadprod@coremont.com"}, {"Account": "323290641272", "Name": "CM O2 Prod", "Email": "awscmo2prod@coremont.com"}, {"Account": "686441197206", "Name": "BHCM", "Email": "awsbhcm@brevanhoward.com"}, {"Account": "388476914266", "Name": "Clarion Non-Production", "Email": "awsclarionnonproduction@coremont.com"}, {"Account": "122635197747", "Name": "BH End User Compute", "Email": "awsendusercompute@brevanhoward.com"}, {"Account": "351559453579", "Name": "Systematic Tech", "Email": "awssystematictech@coremont.com"}, {"Account": "452218806866", "Name": "CM Data Service Prod", "Email": "awscmdataserviceprod@coremont.com"}
            ],
            currentAccount: { AccountId: '123', AccountName: '123'},
            selectedAccounts: [],
            allAccounts: false,
            findings: {"Findings": []},
            filteredFindings: '',
            testFindings: require('../assets/testData.json'),
            queryTokens: [
                'finding', 'AccountName', 'AccountId', 'Resource', 'sort'
            ],
            login: "",
            loginSuccess: false,
            loginFailed: false,
            querySuccess: true,
            queryLoading: '',
            titles: ["TimeStamp", "AccountId", "AccountName", "Finding", "Resource"],
            allSelected: false,
            allSelectedDisabled: false,
            loading: true,
            allColumns: '',
            initialized: false,
            metricCache:  {},
            defaultCol: false
        }
    },
    methods: {
        /**
         * Retreive Metrics from Database, this function is called when a change is made to the metric date dropdown
         */
        async getMetrics(date) {
            
            // initial call if no dates
            if (this.dates.length == 0) { 
                let res = await fetch('https://dgzwfgko18.execute-api.eu-west-1.amazonaws.com/v6/findings', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({"password": this.login, "sqlCommand": "select date from metrics order by date desc;"})
                }) 
                
                let data = await res.json()
                let tmpDates = []
                data.body.forEach(function(obj) {
                    if (!tmpDates.includes(obj[0])) {
                        tmpDates.push(obj[0])
                    }
                })
                
                // set dates object to all dates found
                this.dates = tmpDates

            }
            /*
            if (date == "current") { // if today's date // results are not cached
                    let metricStatements = [
                        {"Name": "IAM Access Keys Outdated", "Query": "select count(*) from findings where finding = 'IAM User Access Keys Outdated'" },
                        {"Name": "IAM Users Without Owner Tag", "Query": "select count(*) from findings where finding like '%Owner%'" }
                    ]
                    
                    let tmpArr = []
                    for (const stmt in metricStatements) {
                        let res = await fetch('https://dgzwfgko18.execute-api.eu-west-1.amazonaws.com/v6/findings', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({"password": this.login, "sqlCommand": metricStatements[stmt]["Query"]})
                        }) // get all initial findings
                        
                        let data = await res.json()
                        //this.metricCache.push({"Name": metricStatements[stmt]["Name"], "Value": data.body[0][0]})
                        tmpArr.push(({"Name": metricStatements[stmt]["Name"], "Value": data.body[0][0]}))
                    }
                this.metrics = tmpArr
            } else { // date is not today
            */
            let sqlDate = date
            
            // if date is current, query the latest date, which is the topmost value from the datelist
            if (date == "current" ) { 
                sqlDate = this.dates[0]
            }

            //automatically assume no previous date
            let previousDate = false
            if (this.dates.length > 1) {
                // if previous date exists, set previos date = date immidately before the selected value to get change information
                previousDate = this.dates[this.dates.indexOf(sqlDate)+1]
            }

            // ensure current metric data doesn't exist in cache, or if the cache is empty
            if (Object.keys(this.metricCache).length == 0 || !this.metricCache[sqlDate]) { // cache is empty or cache miss
                // get inital metrics for date
                let res = await fetch('https://dgzwfgko18.execute-api.eu-west-1.amazonaws.com/v6/findings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({"password": this.login, "sqlCommand": "select name, value, date from metrics where date = '" + sqlDate + "';"})
                }) 
                
                let data = await res.json()
                
                // hold current metrics
                let tmpArr = [] 
                data.body.forEach((obj) => tmpArr.push({"Name": obj[0], "Value": obj[1]}))
                //this.metrics = tmpArr
                //this.metricCache[sqlDate] = tmpArr
                
                // if there is a previous date, do the comparison
                if (previousDate != false ) { 
                    // get all previous metrics
                    let resP = await fetch('https://dgzwfgko18.execute-api.eu-west-1.amazonaws.com/v6/findings', { 
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({"password": this.login, "sqlCommand": "select name, value, date from metrics where date = '" + previousDate + "';"})
                    }) 
                            
                    let dataP = await resP.json()
                    
                    // holds the previos metrics
                    let tmpArrP = []
                    dataP.body.forEach((obj) => tmpArrP.push({"Name": obj[0], "Value": obj[1]}))
                    
                    // holds the final objects that are presented as metrics to the Metrics components
                    let finalArr = [] 
                    
                    // compare tmpArrP to tmpArr
                    tmpArr.forEach(function(obj,i) {
                        for (const oi in tmpArrP) {
                            if (obj.Name == tmpArrP[oi].Name) {
                                finalArr.push({"Name": obj.Name, "Value": obj.Value, "Change": parseInt(obj.Value) - parseInt(tmpArrP[oi].Value)})
                            }
                        }
                    })
                    
                    // if previous date response is emptry, set metrics to current metrics, no change included
                    if (tmpArrP.length == 0) {
                        this.metrics = tmpArr
                        this.metricCache[sqlDate] = tmpArr
                    }
                    // otherwise, set metric valule and cache to finalArr, which holds metrics including change
                    else {
                        this.metrics = finalArr // pass metrics to Metrics component
                        this.metricCache[sqlDate] = finalArr // set metrics cache
                    }
                }
                // there is no previous date, set metrics to value received, 'Change' will not be set
                else { 
                    this.metrics = tmpArr
                    this.metricCache[sqlDate] = tmpArr
                }

            }
            // cache hit
            else 
            {
                console.log("Metric Cache Hit!")

                // set metric value = value from cache
                this.metrics = this.metricCache[sqlDate]
            }

        },
        /**
         * Initial application start, called upon after submitting the password. 
         * Password is controlled by Lambda and never displayed in client
         */
        async kickstart() {
            // login
            let res = await fetch('https://dgzwfgko18.execute-api.eu-west-1.amazonaws.com/v6/findings', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({"action": "login", "password": this.login })
            }) 
        
            
            let colData = await res.json()
            if (colData.body == 'login_success') {
                this.loginSuccess = true
                this.loginFailed = false
            } else {
                this.loginFailed = true
            }
            
            //this.getCurrentMetrics() // grab metrics
            
            // initial call to get findings
            this.getFindings() // grab findings
        },
        /**
         * Called during account selecting from dropdown
         */
        chooseAccount(account) {
            // set initial display to show default columns
            this.defaultCol = true
            // set selected accounts to the account picked from dropdown
            this.selectedAccounts = [{Name: account.accountName, Account: account.accountId}]
  
            
            //console.log(this.selectedAccounts)
            this.refreshFindings()

        },
        /**
         * Called when user selects 'All Accounts' from dropdown
         */
        chooseAllAccounts(status) {
            //set initial display to show default columns
            this.defaultCol = true
            this.allAccounts = status
            // set selected accounts to all accounts
            this.selectedAccounts = this.nAccounts
            this.refreshFindings()

        },
        /**
         * Called during initial setpu, grabs all findings
         */
        async getFindings() {
            
            // get all columns to use as a baseline
            let ress = await fetch('https://dgzwfgko18.execute-api.eu-west-1.amazonaws.com/v6/findings', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({"password": this.login, "sqlCommand": "SELECT json_object_keys(to_json(json_populate_record(NULL::public.findings, '{}'::JSON)));"})
            }) 
            
            let colData = await ress.json()
            let tmpArr = []
            
            // loop through results, create array of all column names
            for (const c in colData.body) {
                tmpArr.push(colData.body[c][0]) 
            }
            
            // set current columns to all
            this.allColumns = tmpArr 
            
            // set default columns to all, allows us to reset after each query
            this.allColumnsDefault = tmpArr 

            // get all initial findings
            let res = await fetch('https://dgzwfgko18.execute-api.eu-west-1.amazonaws.com/v6/findings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({"password": this.login, "sqlCommand": "select * from findings order by timestamp desc limit 200;"})
            }) 
            
            this.loading = false
            let data = await res.json()
            let tmp = []
            
            // loop through findings to set this.findings
            for (const i in data.body) {
                let tmpObj = {}
                for (const entry in data.body[i]) {

                    tmpObj[tmpArr[entry]] = data.body[i][entry]
                    //this.findings.Findings.push({"TimeStamp": data.body[i][0], "AccountName": data.body[i][1], "AccountId": data.body[i][2], "Finding": data.body[i][3], "Resource": data.body[i][4]})
                }
                tmp.push(tmpObj)
            }

            // set current findings
            this.findings.Findings = tmp
            //console.log(this.findings)
 
            //this.findings = data
        },
        /**
         * Refresher function that is called after any changes to selected accounts
         */
        refreshFindings() {
            this.initialized = true
            var aids = []
            
            // get all selected account IDs
            for (const account in this.selectedAccounts) {
                aids.push(this.selectedAccounts[account].Account)
            }
            
            // set columns back to default
            if (this.defaultCol == true) {
                this.allColumns = ['timestamp', 'account_name', 'account_id', 'finding', 'resource']
            }

            // set filteredFindings to only include findings with the select account ID
            this.filteredFindings = this.findings.Findings.filter((obj) => aids.includes(obj.account_id))
            
            // when refreshing findings, only show default columns
            this.filteredFindings.forEach((obj, index) => this.filteredFindings[index] = {
                'timestamp': obj['timestamp'],
                'account_name': obj['account_name'],
                'account_id': obj['account_id'],
                'finding': obj['finding'],
                'resource': obj['resource']
            })
            // only show first 200 of these findings
            this.filteredFindings = this.filteredFindings.slice(0,200)

            this.defaultCol = false
        },
        /**
         * Called upon when form is reset
         */
        enableSelectAll() {
            //this.allSelectedDisabled = false
            //this.titles = this.allColumns
            
            // set all columns back to default
            this.allColumns = this.allColumnsDefault
            this.defaultCol = true
            
            // choose all accounts initially
            this.chooseAllAccounts(true)
            
            // reset account form to be 'All Accounts'
            let element = document.getElementById("accountForm") 
            element.value = 'All Accounts'
            this.refreshFindings()
        
        },
        /**
         * Main query function that handles the logic behind input queries from the query bars
         */
        async queryFindings(query) {

            let tmp = []
            this.allSelectedDisabled = true
            this.queryLoading = true
            this.loading = true
            this.allColumns = this.allColumnsDefault
            let data = {}
            
            let queryCacheResult = this.$cache.getCache(query)
            // if cache is hit
            if (queryCacheResult != false) { 
                console.log("query cache hit")
                
                // set data body to already cached result
                data.body = queryCacheResult
                this.loading = false
            // otherwise, subbmit for new query
            } else {
                let res = await fetch('https://dgzwfgko18.execute-api.eu-west-1.amazonaws.com/v6/findings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({"password": this.login, "sqlCommand": query})
                })
                
                data = await res.json()
                this.loading = false
                
                // set result in cache
                this.$cache.setCache(query, data.body) 
            }
            this.queryLoading = false
            
            // convert query to lowercase to avoid having to catch different cases
            query = query.toLowerCase()
            
            // if response is FAILED, show error message, reset all columns
            if (data.body == "FAILED") {
                this.querySuccess = false
                this.titles = this.allColumns
                return
            }
            else {
                this.querySuccess = true
            }
            
            // get column names by slicing query
            let queryColumns = query.slice(query.indexOf("select")+7, query.indexOf(" from")) // get columns requsted by user
            // if columns are explicitly selected
            if (queryColumns != "*") {
                let newArray = []
                queryColumns.split(",").forEach((e) => newArray.push(e.trim()))
                // set current columns shown on table to only those selected
                this.allColumns = newArray 
            }
            else {
                this.titles = this.allColumns
            }
            
            // loop over each array in response. each array is a returned row from db
            for (const i in data.body) {
                let tmpObj = {}
                // loop over the specific response array being targed
                for (const entry in data.body[i]) {
                    // set tmpObj key=column_name, value=value_from_array
                    // example: data.body[i] is [1, "chicago", "55-314"], translates to tmpObj["id"] = 1
                    tmpObj[this.allColumns[entry]] = data.body[i][entry]
                }
                tmp.push(tmpObj)
            }

            // set filteredFindings to the response
            this.filteredFindings = tmp
        },
        /**
         * Initial query parse event handler
         */
        queryFilter(query) {
            this.querySuccess = true
            // if RESET code received, reset all findings
            if (query == "SYSTEM:RESET") {
                this.defaultCol = true
                this.refreshFindings()
                return
            }
            // initially refresh findings to ensure we are working with all finding data, and we do not constantly filter the same filtered findings
            this.refreshFindings()

            let filteredFindings = this.filteredFindings
            
            // call query helper function
            this.queryFindings(query)
            /*
            var commands = query.split(" ") // how many commands are we dealing with
            
            if (!commands.includes("or")) { // if all the actions are 'and' conditionals
                for (const i in commands ) { // loop through commands
                    
                    if (commands[i].includes(" or ") || commands[i].includes(" and ")) { //ignore conditionals
                    console.log(commands[i])
                        continue
                    } 

                    var queryCommand = commands[i].split(":")[0]
                    var queryParams = commands[i].split(":")[1]
                    console.log("command: " + commands[i])
                    if (this.queryTokens.includes(queryCommand)) { // is command valid
                        if (queryCommand.includes("finding")) {
                            filteredFindings = this.filteredFindings.filter((obj) => obj.Finding == queryParams)
                        }
                        if (queryCommand.includes("AccountName")) {
                            filteredFindings = filteredFindings.filter((obj) => obj.AccountName == queryParams)
                        }
                        if (queryCommand.includes("Resource")) {
                            console.log("sorting based on " + queryParams)
                            filteredFindings = filteredFindings.filter((obj) => obj.Resource == queryParams)
                        }
                        if (queryCommand.includes("sort")) {
                            console.log("sorting based on " + queryParams)
                            var querySort = query.split("sort")[1].split(":")[1]
                            if (queryParams == "AccountId") {
                                filteredFindings.sort(this.$propComparator.compare('AccountId'))
                            }
                            if (queryParams == "AccountName") {
                                console.log("sorting based on " + queryParams)
                                filteredFindings.sort(this.$propComparator.compare('AccountName'))
                            }
                        }
                        console.log(filteredFindings)
                    } 
                }
            }
            this.filteredFindings = filteredFindings
            */
        }
    }
}
</script>

<style>
.spinner {
    width: 64px;
    height: 64px;
    border: 8px solid;
    border-color: #3d5af1 transparent #3d5af1 transparent;
    border-radius: 50%;
    animation: spin-anim 1.2s linear infinite;
}

@keyframes spin-anim {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.loader-container {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 1;
}
</style>