import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const designsRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
export const templates = [
  {
    name: 'warm-budget',
    port: 5173,
    expectedTitle: 'Dealership Name | Quality Used Cars For Every Budget',
  },
  {
    name: 'light-video',
    port: 5174,
    expectedTitle: 'Dealership Name | Premium Approved-Used Cars',
  },
  {
    name: 'dark-sidebar',
    port: 5176,
    expectedTitle: 'Dealership Name | Premium Approved-Used Cars',
  },
  {
    name: 'minimal-editorial',
    port: 5177,
    expectedTitle: 'Dealership Name | Premium Approved-Used Cars',
  },
  {
    name: 'bright-mosaic',
    port: 5178,
    expectedTitle: 'Dealership Name | Good Cars, Fair Prices',
  },
  {
    name: 'standard-06',
    port: 5179,
    expectedTitle: 'Dealership Name | Considered Cars',
    staticPreview: 'index.html',
    staticAssets: ['styles.css', 'stock.mjs', 'app.mjs'],
  },
  {
    name: 'stock-marketplace',
    port: 5180,
    expectedTitle: 'Dealership Name | Find Your Next Car',
  },
  {
    name: 'noir-collection',
    port: 5181,
    expectedTitle: 'Dealership Name | The Collection',
  },
]
