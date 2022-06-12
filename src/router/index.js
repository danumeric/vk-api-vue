import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView,
    meta: { keepAlive: true }
  },
  {
    path: '/user/:payload',
    name: 'UserInfoView',
    props: true,
    component: () => import('../views/UserInfoView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
