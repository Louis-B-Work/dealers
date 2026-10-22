import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Pages still to be designed share one view and differ only by route meta.
const stubs: { path: string; name: string; eyebrow: string; heading: string; intro: string }[] = [
  {
    path: '/privacy',
    name: 'privacy',
    eyebrow: 'Legal',
    heading: 'Privacy policy',
    intro:
      'How we collect, use and protect the personal information you share with us.',
  },
]

const stubRoutes: RouteRecordRaw[] = stubs.map(({ path, name, eyebrow, heading, intro }) => ({
  path,
  name,
  component: () => import('./views/StubView.vue'),
  meta: { title: `${heading} | Dealership Name`, eyebrow, heading, intro },
}))

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('./views/HomeView.vue'),
    meta: { title: 'Dealership Name | Premium Approved-Used Cars' },
  },
  {
    path: '/vehicles',
    name: 'vehicles',
    component: () => import('./views/VehiclesView.vue'),
    meta: { title: 'Browse Vehicles | Dealership Name' },
  },
  {
    path: '/vehicles/:id',
    name: 'vehicle',
    component: () => import('./views/VehicleDetailView.vue'),
    meta: { title: 'Vehicle Details | Dealership Name' },
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('./views/ContactView.vue'),
    meta: { title: 'Contact Us | Dealership Name' },
  },
  {
    path: '/finance',
    name: 'finance',
    component: () => import('./views/FinanceView.vue'),
    meta: { title: 'Car Finance | Dealership Name' },
  },
  {
    path: '/sell',
    name: 'sell',
    component: () => import('./views/SellView.vue'),
    meta: { title: 'Sell Your Car | Dealership Name' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('./views/AboutView.vue'),
    meta: { title: 'About Us | Dealership Name' },
  },
  {
    path: '/mot',
    name: 'mot',
    component: () => import('./views/MotView.vue'),
    meta: { title: 'MOT & Service | Dealership Name' },
  },
  {
    path: '/warranty',
    name: 'warranty',
    component: () => import('./views/WarrantyView.vue'),
    meta: { title: 'Warranty | Dealership Name' },
  },
  {
    path: '/body-shop',
    name: 'body-shop',
    component: () => import('./views/BodyShopView.vue'),
    meta: { title: 'Body Shop | Dealership Name' },
  },
  {
    path: '/breakdown',
    name: 'breakdown',
    component: () => import('./views/BreakdownView.vue'),
    meta: { title: 'Breakdown | Dealership Name' },
  },
  ...stubRoutes,
  {
    path: '/card-lab',
    name: 'card-lab',
    component: () => import('./views/CardLabView.vue'),
    // `bare` strips the nav and footer so a component can be studied in isolation.
    meta: { title: 'Card lab | Dealership Name', bare: true },
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: import.meta.env.PROD ? createWebHashHistory() : createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 90 }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const title = to.meta?.title as string | undefined
  if (title) document.title = title
})
