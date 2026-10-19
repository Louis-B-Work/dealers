import { countVehicles } from '../composables/useVehicleFilters'
import { vehicles } from './vehicles'

export interface StockedBrand {
  name: string
  count: number
  logo?: string
}

/**
 * Marque artwork, hotlinked from the same source the live templates use
 * (standard-02, standard-03 and premium-01 all read from this host) so the
 * logos match across the estate and no trademarked files are vendored here.
 * Keys are lowercase for case-insensitive matching.
 */
export const brandLogos: Record<string, string> = {
  audi: 'https://www.carlogos.org/car-logos/audi-logo.png',
  bmw: 'https://www.carlogos.org/car-logos/bmw-logo.png',
  citroen: 'https://www.carlogos.org/car-logos/citroen-logo.png',
  'citroën': 'https://www.carlogos.org/car-logos/citroen-logo.png',
  fiat: 'https://www.carlogos.org/car-logos/fiat-logo.png',
  ford: 'https://www.carlogos.org/car-logos/ford-logo.png',
  honda: 'https://www.carlogos.org/car-logos/honda-logo.png',
  hyundai: 'https://www.carlogos.org/car-logos/hyundai-logo.png',
  jaguar: 'https://www.carlogos.org/car-logos/jaguar-logo.png',
  jeep: 'https://www.carlogos.org/car-logos/jeep-logo.png',
  kia: 'https://www.carlogos.org/car-logos/kia-logo.png',
  'land rover': 'https://www.carlogos.org/car-logos/land-rover-logo.png',
  lexus: 'https://www.carlogos.org/car-logos/lexus-logo.png',
  mazda: 'https://www.carlogos.org/car-logos/mazda-logo.png',
  'mercedes-benz': 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png',
  mini: 'https://www.carlogos.org/car-logos/mini-logo.png',
  mitsubishi: 'https://www.carlogos.org/car-logos/mitsubishi-logo.png',
  nissan: 'https://www.carlogos.org/car-logos/nissan-logo.png',
  peugeot: 'https://www.carlogos.org/car-logos/peugeot-logo.png',
  porsche: 'https://www.carlogos.org/car-logos/porsche-logo.png',
  renault: 'https://www.carlogos.org/car-logos/renault-logo.png',
  seat: 'https://www.carlogos.org/car-logos/seat-logo.png',
  skoda: 'https://www.carlogos.org/car-logos/skoda-logo.png',
  'škoda': 'https://www.carlogos.org/car-logos/skoda-logo.png',
  subaru: 'https://www.carlogos.org/car-logos/subaru-logo.png',
  suzuki: 'https://www.carlogos.org/car-logos/suzuki-logo.png',
  tesla: 'https://www.carlogos.org/car-logos/tesla-logo.png',
  toyota: 'https://www.carlogos.org/car-logos/toyota-logo.png',
  vauxhall: 'https://www.carlogos.org/car-logos/vauxhall-logo.png',
  volkswagen: 'https://www.carlogos.org/car-logos/volkswagen-logo.png',
  volvo: 'https://www.carlogos.org/car-logos/volvo-logo.png',
}

/**
 * Read out of the stock list rather than authored, so the site can never
 * advertise a marque the forecourt does not have. Busiest first, then
 * alphabetical so ties do not reorder themselves between renders.
 */
export const stockedBrands: StockedBrand[] = Array.from(
  new Set(vehicles.map((vehicle) => vehicle.make)),
)
  .map((name) => ({
    name,
    count: countVehicles({ make: name }),
    logo: brandLogos[name.toLowerCase()],
  }))
  .filter((brand) => brand.count > 0)
  .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
