import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '/',
          name: 'dashboard',
          component: () => import('@/components/Dashboard.vue')
        },
        {
          path: '/orders',
          children : [
            {
              path: '/orders',
              name: 'ordersList',
              component: () => import('@/components/orders/List.vue'),
            },
            {
              path: '/orders/new',
              name: 'newOrder',
              component: () => import('@/components/orders/New.vue'),
            },
            {
              path: '/orders/view/:id',
              name: 'viewOrder',
              component: () => import('@/components/orders/View.vue'),
            },
            {
              path: '/orders/box/:id',
              name: 'boxOrder',
              component: () => import('@/components/orders/Box.vue'),
            },
          ],
        },
        {
          path: '/parcels',
          children : [
            {
              path: '/parcels',
              name: 'parcelsList',
              component: () => import('@/components/parcels/List.vue'),
            },
          ],
        },
        {
          path: '/shipments',
          children : [
            {
              path: '/shipments',
              name: 'shipmentsList',
              component: () => import('@/components/shipments/List.vue'),
            },
          ],
        },
        {
          path: '/',
          name: 'dashboard',
          component: () => import('@/components/Dashboard.vue')
        },
      ]
    }
  ]
})

export default router
