import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { servicePages } from './data/content'

const site = 'Dealership Name'

// The four care pages share one data-driven view; only the route meta differs.
const serviceRoutes: RouteRecordRaw[] = servicePages.map((service) => ({
  path: service.path,
  name: service.slug,
  component: () => import('./views/ServiceView.vue'),
  meta: { title: `${service.title} | ${site}`, service: service.slug },
}))

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('./views/HomeView.vue'),
    meta: { title: `${site} | Find Your Next Car` },
  },
  {
    path: '/vehicles',
    name: 'vehicles',
    component: () => import('./views/VehiclesView.vue'),
    meta: { title: `Used Cars In Stock | ${site}` },
  },
  {
    path: '/vehicles/:id',
    name: 'vehicle',
    component: () => import('./views/VehicleDetailView.vue'),
    meta: { title: `Vehicle Details | ${site}` },
  },
  {
    path: '/finance',
    name: 'finance',
    component: () => import('./views/FinanceView.vue'),
    meta: { title: `Finance | ${site}` },
  },
  {
    path: '/sell',
    name: 'sell',
    component: () => import('./views/SellView.vue'),
    meta: { title: `Sell Your Car | ${site}` },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('./views/AboutView.vue'),
    meta: { title: `About Us | ${site}` },
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('./views/ContactView.vue'),
    meta: { title: `Contact Us | ${site}` },
  },
  ...serviceRoutes,
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('./views/PrivacyView.vue'),
    meta: { title: `Privacy | ${site}` },
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  // Hash routes in production so bookmarks and refreshes work on static hosting.
  history: import.meta.env.PROD ? createWebHashHistory() : createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 110 }
    // Changing a filter rewrites the query on the same page; it must not jump to the top.
    if (to.path === from.path) return false
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const title = to.meta?.title as string | undefined
  if (title) document.title = title
})
