import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Scaffolded pages share one view and differ only by route meta, so the nav is
// fully navigable without eight near-identical files.
const stubs: { path: string; name: string; heading: string; intro: string }[] = [
  {
    path: '/finance',
    name: 'finance',
    heading: 'Finance that fits your budget',
    intro:
      'Tell us what you can afford each month and we will find a deal to match. All credit histories considered, and a decision usually within the hour.',
  },
  {
    path: '/sell',
    name: 'sell',
    heading: 'We will buy your car',
    intro:
      'A free, no-obligation valuation in minutes. Sell it outright or put the value straight towards your next one, and we will even settle outstanding finance.',
  },
  {
    path: '/about',
    name: 'about',
    heading: 'The friendly local dealership',
    intro:
      'A family-run forecourt that has been selling honest used cars to the same town for over twenty-five years.',
  },
  {
    path: '/mot',
    name: 'mot',
    heading: 'MOT & servicing',
    intro:
      'Class 4 MOTs, interim and full servicing for any make or model, not just the cars we sell. Free retests and while-you-wait appointments.',
  },
  {
    path: '/warranty',
    name: 'warranty',
    heading: 'Warranty cover',
    intro:
      'Every car we sell comes with warranty cover as standard, with extended plans available at any point in the first year.',
  },
  {
    path: '/body-shop',
    name: 'body-shop',
    heading: 'Body shop',
    intro:
      'Paint and panel work on site, from kerbed alloys and car park dinks to full insurance repair work.',
  },
  {
    path: '/breakdown',
    name: 'breakdown',
    heading: 'Breakdown cover',
    intro:
      'Nationwide roadside assistance and recovery, included for twelve months with every car on the forecourt.',
  },
  {
    path: '/privacy',
    name: 'privacy',
    heading: 'Privacy policy',
    intro: 'How we collect, use and protect the personal information you share with us.',
  },
]

const stubRoutes: RouteRecordRaw[] = stubs.map(({ path, name, heading, intro }) => ({
  path,
  name,
  component: () => import('./views/StubView.vue'),
  meta: { title: `${heading} | Dealership Name`, heading, intro },
}))

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('./views/HomeView.vue'),
    meta: { title: 'Dealership Name | Quality Used Cars For Every Budget' },
  },
  {
    path: '/vehicles',
    name: 'vehicles',
    component: () => import('./views/VehiclesView.vue'),
    meta: { title: 'Used Cars In Stock | Dealership Name' },
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
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 80 }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const title = to.meta?.title as string | undefined
  if (title) document.title = title
})
