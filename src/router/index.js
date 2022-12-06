import { createRouter, createWebHistory } from 'vue-router'
import Visual from '@/views/visual/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },
    {
      path: '/visual',
      name:'visual',
      component: Visual,
    }
  ]
})

export default router
