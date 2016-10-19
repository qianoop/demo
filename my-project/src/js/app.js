import  Vue from "vue"
import  VueResource from "vue-resource"
import  VueRouter from "vue-router"




Vue.use(VueRouter)
Vue.use(VueResource)

const  Hello = require("../components/Hello.vue")
const  big =  require("../components/big.vue")
const  outer = require("../components/outer.vue")

const routes = [
  { path: '/', component: Hello,name:"hello" },
  { path: '/big', component: big,name:"big" },
  { path: '/outer', component: outer,name:"outer" },
]
const router = new VueRouter({routes,mode:'history'})
console.log(router);

const app = new Vue({
  router
}).$mount('#app');




