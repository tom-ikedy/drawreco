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
    path: '/circle-:cid/create-draw',
    name: 'CreateDraw',
    component: () => import('@/views/CreateDraw.vue')
  },
  {
    path: '/circle-:cid/',
    name: 'Circle',
    component: () => import('@/views/Circle.vue'),
  },
  {
    path: '/circle-:cid/draw-:did/player',
    name: 'Player',
    component: () => import('@/views/Player.vue'),
  },
  {
    path: '/circle-:cid/draw-list',
    name: 'DrawList',
    component: () => import('@/views/DrawList.vue'),
  },
  {
    path: '/circle-:cid/draw-:did/',
    name: 'Draw',
    component: () => import('@/views/Draw.vue'),
  },
  {
    path: '/circle-:cid/draw-:did/match-:mno',
    name: 'Match',
    component: () => import('@/views/Match.vue'),
    props: true,
  },
  {
    path: '/circle-:cid/draw-:did/result',
    name: 'Result',
    component: () => import('@/views/Result.vue'),
  },
  {
    path: '/circle-:cid/draw-:did/ranking',
    name: 'Ranking',
    component: () => import('@/views/Ranking.vue'),
  },
  {
    path: '/circle-:cid/draw-:did/setting',
    name: 'Setting',
    component: () => import('@/views/Setting.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
