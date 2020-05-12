import Vue from 'vue'
import VueRouter from 'vue-router'
import Checkout from './views/Checkout.vue'
import Complete from './views/Complete.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/',  name: 'checkout', component: Checkout },
  { path: '/complete',  name: 'complete', component: Complete },
]

const router = new VueRouter({
  routes
})

export default router
