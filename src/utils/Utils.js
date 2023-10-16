const sortAlph = [
    'AccountName'
] // array to store sort-by values that are text

export default {
    /**
     * This function is used with the sort: filter query operator to sort results of findings. It will either compare string values such as account names, or 
     * int values such as account IDs.
     * 
     * @param {string} prop - the query filter value to sort by
     * @return {function} - returns a function that dictates how the array will e sorted
     */
    compare(prop) {
        return function(a, b) {
            if (sortAlph.includes(prop)) {
                var textA = a.AccountName.toUpperCase()
                var textB = b.AccountName.toUpperCase()
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            }
            else {
                return a[prop] - b[prop]
            }
        }
    }
    
}