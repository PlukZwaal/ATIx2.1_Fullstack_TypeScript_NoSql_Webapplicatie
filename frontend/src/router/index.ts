import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import TestView from '../views/Test.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/About.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: TestView
    }
  ]
})

export default router