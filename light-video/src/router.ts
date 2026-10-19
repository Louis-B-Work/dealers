import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Scaffolded pages share one view and differ only by route meta, so the nav is
// fully navigable without seven near-identical files.
const stubs: { path: string; name: string; eyebrow: string; heading: string; intro: string }[] = [
  {
    path: '/finance',
    name: 'finance',
    eyebrow: 'Finance made simple',
    heading: 'Finance built around you',
    intro:
      'Representative finance on any vehicle in our collection, with a decision in principle in minutes.',
  },
  {
    path: '/sell',
    name: 'sell',
    eyebrow: 'Sell or part-exchange',
    heading: 'Sell us your car',
    intro:
      'A fair, transparent valuation in minutes. Sell outright or put the value straight towards your next car.',
  },
  {
    path: '/about',
    name: 'about',
    eyebrow: 'Our story',
    heading: 'About us',
    intro:
      'Years of handpicking, preparing and presenting premium vehicles to an exacting standard.',
  },
  {
    path: '/mot',
    name: 'mot',
    eyebrow: 'Servicing',
    heading: 'MOT testing',
    intro:
      'Class 4 MOT testing by our in-house technicians, with free retests and while-you-wait appointments.',
  },
  {
    path: '/warranty',
    name: 'warranty',
    eyebrow: 'Peace of mind',
    heading: 'Warranty cover',
    intro:
      'Every car leaves us with comprehensive warranty cover, with extended plans available at any point.',
  },
  {
    path: '/body-shop',
    name: 'body-shop',
    eyebrow: 'Repairs & refinishing',
    heading: 'Body shop',
    intro:
      'Manufacturer-grade paint and panel work, from stone-chip touch-ups to full accident repair.',
  },
  {
    path: '/breakdown',
    name: 'breakdown',
    eyebrow: 'On the road',
    heading: 'Breakdown assistance',
    intro:
      'Nationwide recovery and roadside assistance, included for twelve months with every vehicle.',
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
