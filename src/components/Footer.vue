<template>
        <div class="fixed-bottom bg-dark">
            <div class="align" id="bootstrap-overrides">
                <!-- <span v-if="accounts.length == 0">No Account Selected</span>
                <span v-for="(account, index) in accounts" :key="index"> {{ account.AccountName }} &nbsp;</span> -->
                <span>DB Status: {{ DBStatus }}</span>
            </div>
</div>
    
</template>

<script>


export default {
    props: [],
    data() {
        return {
            DBStatus: ''
        }
    },
    created() {
        // at component creation time, get DB status
        this.getDBStatus() 
    },
    methods: {
        /**
         * Retreive the current status of the RDS DB
         */
        async getDBStatus() {
            // grab status of db
             let res = await fetch('https://dgzwfgko18.execute-api.eu-west-1.amazonaws.com/v6/status', {
                headers: { 'Content-Type': 'application/json' },
                method: 'GET'
            })
        
            let data = await res.json()
            this.DBStatus = data.body
        }
    }
}
</script>

<style>
.align {
    text-align: center;
}

#bootstrap-overrides {
    color: white;
}
</style>