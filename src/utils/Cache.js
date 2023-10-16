const cache = new Map();

export default {
    setCache(query, results) {
        if (!cache.has(query)) {
            cache.set(query, results)
            return true
        }
        else {
            return false
        }
    },
    getCache(query) {
        if (cache.has(query)) {
            return cache.get(query)
        } else {
            return false
        }
    },
    clearCache() {
        cache.clear()
    }
}