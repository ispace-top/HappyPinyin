import { createRouter, createWebHashHistory } from 'vue-router'
import { isZoneUnlocked } from '@/utils/kingdomStorage'
import type { ZoneId } from '@/types/kingdom'

function requireZone(zoneId: ZoneId) {
  return () => {
    if (!isZoneUnlocked(zoneId)) {
      return { name: 'kingdom' }
    }
    return true
  }
}

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
      name: 'kingdom',
      component: () => import('@/pages/kingdom/KingdomPage.vue'),
    },
    {
      path: '/game/forest',
      name: 'forest',
      component: () => import('@/pages/kingdom/ForestPage.vue'),
      beforeEnter: requireZone('forest'),
    },
    {
      path: '/game/workshop',
      name: 'workshop',
      component: () => import('@/pages/kingdom/WorkshopPage.vue'),
      beforeEnter: requireZone('workshop'),
    },
    {
      path: '/game/typing',
      name: 'typing',
      component: () => import('@/pages/kingdom/TypingPage.vue'),
      beforeEnter: requireZone('typing'),
    },
    {
      path: '/game/bubble',
      name: 'bubble',
      component: () => import('@/pages/kingdom/BubblePage.vue'),
      beforeEnter: requireZone('bubble'),
    },
    {
      path: '/game/play/:gameId',
      name: 'game-play',
      component: () => import('@/pages/kingdom/GamePlayPage.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/pages/AboutPage.vue'),
    },
  ],
})

export default router
