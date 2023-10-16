/**
 * @author Henry McArdle
 * @version N/App
 * 
 * This application is a VueJS proof of concent that allows the searching of security findings found within various AWS environments. The purpose is to allow 
 * users to have a single pane of glass view into all types of vulnerabilities generated from various security audit sources.
 */

import { createApp } from 'vue'
import App from './App.vue'
import $bus from './utils/Events';
import propComparator from './utils/Utils'
import cache from './utils/Cache'
import queries from './utils/Queries'

const app = createApp(App)

app.config.globalProperties.$bus = $bus
app.config.globalProperties.$propComparator = propComparator
app.config.globalProperties.$cache = cache
app.config.globalProperties.$queries = queries
app.mount("#app")