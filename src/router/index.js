import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/create-draw',
    name: 'CreateDraw',
    component: () => import('@/views/CreateDraw.vue')
  },
  {
    path: '/:cid/:did/player',
    name: 'Player',
    component: () => import('@/views/Player.vue'),
  },
  {
    path: '/:cid/:did/draw',
    name: 'Draw',
    component: () => import('@/views/Draw.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
