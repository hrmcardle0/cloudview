<template>
<!--
 <div class="dropdown">
  <button :disabled="hasAccounts" class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
    Select Account
  </button>
  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
    <li v-for="(account, index) in accounts" :key="index">
        <a class="dropdown-item" @click.prevent="$emit('chooseAccount', { accountId: account.AccountId, accountName: account.AccountName } )">{{ account.AccountName }}</a>
    </li>
  </ul>
</div>
-->
<div class="container-fluid margin">
    <select id="accountForm" @change="accountChange($event)" class="form-select form-select" aria-label=".form-select-sm example">
      <option selected disabled>Select Account</option>
      <option>All Accounts</option>
      <option v-for="(account, index) in accounts" :key="index">{{ account.Name }} - {{ account.Account }}</option>
</select>
    <!--
    <div class="form-check">
        <input class="form-check-input" :disabled="allSelectedDisabled" type="checkbox" id="flexCheckDefault" @change="selectAll()" >
        <label class="form-check-label" for="flexCheckDefault">
            {{ `Select All`}}
        </label>
    </div>
    <div>
        <div v-for="(account, index) in accounts" :key="index" class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" :disabled="all || allSelectedDisabled" @change="$emit('chooseAccount', { accountId: account.Account, accountName: account.Name, index: index })">
            <label class="form-check-label" for="flexCheckDefault">
                {{ account.Name }}
            </label>
        </div>
    </div>
    -->
</div>

</template>

<script>
export default {
    /**
     * accounts -> list of all accounts
     */
    props: ['accounts', 'allSelected', 'allSelectedDisabled'],
    data() {
        return {
            all: false
        }
    },
    methods: {
        /**
         * Respond to the changing of accounts in dropdown
         */
        accountChange(e) {
            // if we are targeting all accounts
            if (e.target.value == "All Accounts") {
                this.selectAll()
            // otherwise split account ID and name to grab separately
            } else {
                
                let aId = e.target.value.split("- ")[1]
                let aName = e.target.value.split("- ")[0].trim()
 
                this.$emit('chooseAccount', { accountId: aId, accountName: aName})
            }
        },
        /**
         * Respond to the select all accounts option in dropdown
         */
        selectAll() {
            // ensure that it was before set to false before flipping
            if (this.all == false) {
                this.all = true
                this.$emit('chooseAllAccounts', this.all)
            }
            else {
                this.all = false
                this.$emit('chooseAllAccounts', this.all)
            }
        }
    }
}
</script>

<style>

.margin {
    margin-bottom: 1rem;
}

</style>