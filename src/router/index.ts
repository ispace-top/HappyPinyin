import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomePage.vue'),
    },
    {
      path: '/browser',
      name: 'browser',
      component: () => import('@/pages/BrowserPage.vue'),
    },
    {
      path: '/builder',
      name: 'builder',
      component: () => import('@/pages/BuilderPage.vue'),
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('@/pages/GamePage.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/pages/AboutPage.vue'),
    },
  ],
})

export default router
