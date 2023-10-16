const events = new Map(); // store global events

export default {
    /**
     * 
     * @param {string} eventName - event name to tie to the callback function 
     * @param {function} fn - callback function to run when emitting the event
     */
    $on(eventName, fn) {
        if (!events.has(eventName)) {
            events.set(eventName, [])
        }
        
        events.get(eventName).push(fn);
    },

    $off(eventName, fn) {
        throw { message: 'Not Implemented' }
    },
    
    $emit(eventName, data) {
        if (events.has(eventName)) {
            events.get(eventName).forEach(fn => fn(data));
        }
    }
}