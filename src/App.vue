<template>
    <div class="container-fluid">
        <div class="row flex-nowrap">
            <!--
            <NavBar
                :links="pages"
            ></NavBar>

            v-if="pages[activePage].title == 'Query Findings'"
            -->

            <QueryPage
            ></QueryPage>
        </div>
    </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import QueryPage from './components/QueryPage.vue'

export default {
    components: {
        NavBar,
        QueryPage
    },
    created() {
        this.$bus.$on('activated', (index) => {
            this.activePage = index
            //console.log("activePage set to " + this.activePage)
        })
    },
    data() {
        return {
            data: '',
            objects: ['object1', 'object2'],
            str: '',
            pages: [
                    { 
                        title: "Home", url: "home", icon: ['fs-4', 'bi-house'], subLinks: [], 
                        content: 'An example 2-level sidebar with collasible menu items. The menu functions like an accordion where only a single menu is be open at a time. While the sidebar itself is not toggle-able, it does responsively shrink in width on smaller screens.'
                    },
                    { 
                        title: "My Account", url: "myaccount", icon: ['fs-4', 'bi-file-earmark-person'], subLinks: [],
                        content: 'An example 2-level sidebar with collasible menu items. The menu functions like an accordion where only a single menu is be open at a time. While the sidebar itself is not toggle-able, it does responsively shrink in width on smaller screens.'
                    },
                    { 
                        //title: "Subscriptions", url: "subscriptions", icon: ['fs-4', 'bi-card-list'], subLinks: { type: "subscription", values: ['Clarion', 'Systematic'] },
                        title: "Query Findings", url: "queryFindings", icon: ['fs-4', 'bi-card-list'], subLinks: [],
                        content: 'An example 2-level sidebar with collasible menu items. The menu functions like an accordion where only a single menu is be open at a time. While the sidebar itself is not toggle-able, it does responsively shrink in width on smaller screens.'
                    },
                    {
                        title: "Policies", url: "policies", icon: ['fs-4', 'bi-card-checklist'], subLinks: [],
                        content: ''
                    },
                    {
                        title: "Help", url: "help", icon: ['fs-4', 'bi-patch-question'], subLinks: [], 
                        content: ''
                    }
            ],
            activePage: 0,
            testData : "hello"
        }
    },
    methods: {
        test(text) {
            alert(text)
        },
        buttonClick(data) {
            this.str = data
        }
    }
}
</script>
