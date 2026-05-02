import type { RouterConfig } from '@nuxt/schema'
import type { RouteRecordRaw } from 'vue-router'

export default {
  routes: (_routes) => {
    const routes: RouteRecordRaw[] = [
      {
        path: '/',
        component: () => import('~/views/index.vue'),
        meta: { authRequired: false },
      },
      {
        path: '/who-is-watching',
        component: () => import('~/views/WhoIsWatching.vue'),
      },
      {
        path: '/browse',
        component: () => import('~/views/AccountHome.vue'),
      },
      {
        path: '/series',
        component: () => import('~/views/SeriesPage.vue'),
      },
      {
        path: '/films',
        component: () => import('~/views/FilmsPage.vue'),
      },
      {
        path: '/new-and-popular',
        component: () => import('~/views/NewAndPopular.vue'),
      },
      {
        path: '/my-list',
        component: () => import('~/views/MyList.vue'),
      },
      {
        path: '/browse-by-language',
        component: () => import('~/views/BrowseByLanguage.vue'),
      },
      {
        path: '/watch/:id',
        component: () => import('~/views/WatchPage.vue'),
        meta: { authRequired: true },
      },
      {
        path: '/login',
        component: () => import('~/views/auth/login.vue'),
        meta: { authRequired: false },
      },
      {
        path: '/signup',
        component: () => import('~/views/auth/Signup.vue'),
        meta: { authRequired: false },
      },
      {
        path: '/signup-otp',
        component: () => import('~/views/auth/SignupOtp.vue'),
        meta: { authRequired: false },
      },
      {
        path: '/signup-final',
        component: () => import('~/views/auth/SignupFinal.vue'),
        meta: { authRequired: false },
      },
      {
        path: '/watch/:id',
        component: () => import('~/views/WatchPage.vue'),
      },
    ]

    if (import.meta.dev) {
      routes.push({
        path: '/design-system',
        component: () => import('~/views/design-system.vue'),
      })
    }

    return routes
  },
} satisfies RouterConfig
