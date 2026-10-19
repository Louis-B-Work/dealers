import { monthlyPaymentFor } from './dealer'

export interface Vehicle {
  id: string
  make: string
  model: string
  variant: string
  year: number
  price: number
  /**
   * Indicative monthly payment, derived from the price rather than authored —
   * see the bottom of this file. `0` means "no finance figure quoted", either
   * because there is no price or because the car is outside the lender panel.
   * Nothing in the UI may show a monthly line, a representative APR or a broker
   * disclosure for those vehicles, because they quote no figure.
   */
  monthlyFrom: number
  mileage: number
  fuel: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric'
  transmission: 'Automatic' | 'Manual'
  bodyType: 'Saloon' | 'Estate' | 'SUV' | 'Coupe' | 'Convertible' | 'Hatchback' | 'MPV'
  engine: string
  power: string
  doors: number
  seats: number
  colour: string
  registration: string
  featured: boolean
  badge?: string
  description: string
  features: string[]
  /** two RGB colours used to render the placeholder gallery gradient */
  gradient: [string, string]
  /** card/gallery photo */
  image: string
}

/** Shared stand-in photo until real inventory imagery is wired in. */
export const PLACEHOLDER_CAR_IMAGE =
  'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1200'

/**
 * What the inventory actually records. `monthlyFrom` is never authored by
 * hand — it is derived below from the price and the representative APR, so a
 * card, the homepage calculator and the VDP panel cannot drift apart.
 */
type VehicleSeed = Omit<Vehicle, 'image' | 'monthlyFrom'> & {
  /** `false` for cars too cheap or too old for the lender panel. */
  financeAvailable: boolean
}

const vehicleList: VehicleSeed[] = [
  {
    id: 'ford-fiesta-2019',
    make: 'Ford',
    model: 'Fiesta',
    variant: '1.0 EcoBoost Zetec 5dr',
    year: 2019,
    price: 8495,
    financeAvailable: true,
    mileage: 34200,
    fuel: 'Petrol',
    transmission: 'Manual',
    bodyType: 'Hatchback',
    engine: '1.0L EcoBoost',
    power: '99 bhp',
    doors: 5,
    seats: 5,
    colour: 'Moondust Silver',
    registration: '2019 (19)',
    featured: true,
    badge: 'Low mileage',
    description:
      'A tidy one-owner Fiesta Zetec with the willing 1.0 EcoBoost engine, full service history and a fresh MOT. Cheap to tax, cheap to insure and an easy first car.',
    features: [
      'Apple CarPlay & Android Auto',
      'Air conditioning',
      'DAB radio & Bluetooth',
      'Cruise control',
      '16" alloy wheels',
      'Front fog lights',
    ],
    gradient: ['148 152 156', '206 209 212'],
  },
  {
    id: 'vauxhall-corsa-2018',
    make: 'Vauxhall',
    model: 'Corsa',
    variant: '1.4 SRi 3dr',
    year: 2018,
    price: 6795,
    financeAvailable: true,
    mileage: 41800,
    fuel: 'Petrol',
    transmission: 'Manual',
    bodyType: 'Hatchback',
    engine: '1.4L',
    power: '89 bhp',
    doors: 3,
    seats: 5,
    colour: 'Flame Red',
    registration: '2018 (68)',
    featured: true,
    description:
      'A sharp-looking Corsa SRi in Flame Red with the sports styling pack. Two former keepers, a full stamped book and new front tyres fitted at preparation.',
    features: [
      'SRi sports styling pack',
      'Air conditioning',
      'Bluetooth & USB',
      'Cruise control',
      '16" alloy wheels',
      'Electric front windows',
    ],
    gradient: ['168 62 54', '214 108 96'],
  },
  {
    id: 'volkswagen-polo-2020',
    make: 'Volkswagen',
    model: 'Polo',
    variant: '1.0 TSI Match 5dr',
    year: 2020,
    price: 11495,
    financeAvailable: true,
    mileage: 28400,
    fuel: 'Petrol',
    transmission: 'Manual',
    bodyType: 'Hatchback',
    engine: '1.0L TSI',
    power: '94 bhp',
    doors: 5,
    seats: 5,
    colour: 'Reflex Silver',
    registration: '2020 (70)',
    featured: true,
    badge: 'Just arrived',
    description:
      'A well-specified Polo Match with adaptive cruise, front and rear parking sensors and the digital cockpit. Full Volkswagen service history and two keys.',
    features: [
      'Digital cockpit',
      'Adaptive cruise control',
      'Front & rear parking sensors',
      'Apple CarPlay & Android Auto',
      'Climate control',
      '15" alloy wheels',
    ],
    gradient: ['156 160 166', '210 213 217'],
  },
  {
    id: 'nissan-qashqai-2019',
    make: 'Nissan',
    model: 'Qashqai',
    variant: '1.3 DiG-T Acenta Premium 5dr',
    year: 2019,
    price: 12995,
    financeAvailable: true,
    mileage: 39600,
    fuel: 'Petrol',
    transmission: 'Manual',
    bodyType: 'SUV',
    engine: '1.3L DiG-T',
    power: '138 bhp',
    doors: 5,
    seats: 5,
    colour: 'Gun Metallic',
    registration: '2019 (69)',
    featured: true,
    description:
      'The family favourite, in the well-equipped Acenta Premium trim with the 360-degree camera and panoramic roof. One owner from new with a full service history.',
    features: [
      'Panoramic glass roof',
      '360° around-view camera',
      'Sat nav',
      'Climate control',
      'Rear parking sensors',
      '17" alloy wheels',
    ],
    gradient: ['92 98 104', '150 156 162'],
  },
  {
    id: 'hyundai-tucson-2021',
    make: 'Hyundai',
    model: 'Tucson',
    variant: '1.6 T-GDi SE Connect 5dr',
    year: 2021,
    price: 18995,
    financeAvailable: true,
    mileage: 22600,
    fuel: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'SUV',
    engine: '1.6L T-GDi',
    power: '148 bhp',
    doors: 5,
    seats: 5,
    colour: 'Phantom Black',
    registration: '2021 (21)',
    featured: true,
    badge: 'Just arrived',
    description:
      'A striking late Tucson in Phantom Black with the automatic gearbox and the balance of the manufacturer warranty remaining. Our newest arrival and the top of our range.',
    features: [
      'Balance of manufacturer warranty',
      'Reversing camera',
      'Heated front seats',
      'Wireless phone charging',
      'Lane keep assist',
      '17" alloy wheels',
    ],
    gradient: ['40 44 48', '104 110 116'],
  },
  {
    id: 'toyota-yaris-2020',
    make: 'Toyota',
    model: 'Yaris',
    variant: '1.5 Hybrid Icon 5dr CVT',
    year: 2020,
    price: 12495,
    financeAvailable: true,
    mileage: 24800,
    fuel: 'Hybrid',
    transmission: 'Automatic',
    bodyType: 'Hatchback',
    engine: '1.5L Hybrid',
    power: '99 bhp',
    doors: 5,
    seats: 5,
    colour: 'Pure White',
    registration: '2020 (20)',
    featured: false,
    badge: 'Low running costs',
    description:
      'A self-charging hybrid Yaris returning over 60mpg around town with no plug and no range anxiety. Full Toyota history and low road tax.',
    features: [
      'Self-charging hybrid',
      'Reversing camera',
      'Adaptive cruise control',
      'Automatic gearbox',
      'Air conditioning',
      'Toyota Safety Sense',
    ],
    gradient: ['214 216 218', '242 243 244'],
  },
  {
    id: 'kia-sportage-2019',
    make: 'Kia',
    model: 'Sportage',
    variant: '1.6 GDi 2 5dr',
    year: 2019,
    price: 13995,
    financeAvailable: true,
    mileage: 43200,
    fuel: 'Petrol',
    transmission: 'Manual',
    bodyType: 'SUV',
    engine: '1.6L GDi',
    power: '130 bhp',
    doors: 5,
    seats: 5,
    colour: 'Blue Flame',
    registration: '2019 (19)',
    featured: false,
    description:
      'A roomy Sportage in the popular "2" trim, still carrying the balance of the seven-year Kia warranty. Ideal family transport with a big boot and a high driving position.',
    features: [
      'Balance of 7-year warranty',
      'Reversing camera',
      'Heated front seats',
      'Apple CarPlay & Android Auto',
      'Dual-zone climate control',
      '17" alloy wheels',
    ],
    gradient: ['46 82 124', '106 142 184'],
  },
  {
    id: 'volkswagen-golf-2018',
    make: 'Volkswagen',
    model: 'Golf',
    variant: '1.6 TDI SE Nav 5dr',
    year: 2018,
    price: 11995,
    financeAvailable: true,
    mileage: 57900,
    fuel: 'Diesel',
    transmission: 'Manual',
    bodyType: 'Hatchback',
    engine: '1.6L TDI',
    power: '113 bhp',
    doors: 5,
    seats: 5,
    colour: 'Indium Grey',
    registration: '2018 (18)',
    featured: false,
    description:
      'A sensible diesel Golf SE Nav that will sit at 65mpg on a motorway run. Full service history, cambelt done and a set of matching tyres all round.',
    features: [
      'Sat nav',
      'Adaptive cruise control',
      'Front & rear parking sensors',
      'DAB radio & Bluetooth',
      'Climate control',
      '16" alloy wheels',
    ],
    gradient: ['96 100 104', '158 162 166'],
  },
  {
    id: 'peugeot-208-2019',
    make: 'Peugeot',
    model: '208',
    variant: '1.2 PureTech Allure 5dr',
    year: 2019,
    price: 9295,
    financeAvailable: true,
    mileage: 31500,
    fuel: 'Petrol',
    transmission: 'Manual',
    bodyType: 'Hatchback',
    engine: '1.2L PureTech',
    power: '99 bhp',
    doors: 5,
    seats: 5,
    colour: 'Faro Blue',
    registration: '2019 (69)',
    featured: false,
    description:
      'A smart 208 Allure with the 3D i-Cockpit, rear camera and a genuine 31,500 miles. One owner from new and two keys supplied.',
    features: [
      '3D i-Cockpit display',
      'Reversing camera',
      'Rear parking sensors',
      'Apple CarPlay & Android Auto',
      'Climate control',
      '16" alloy wheels',
    ],
    gradient: ['48 78 128', '112 146 190'],
  },
  {
    id: 'kia-picanto-2021',
    make: 'Kia',
    model: 'Picanto',
    variant: '1.0 2 5dr',
    year: 2021,
    price: 8995,
    financeAvailable: true,
    mileage: 18900,
    fuel: 'Petrol',
    transmission: 'Manual',
    bodyType: 'Hatchback',
    engine: '1.0L',
    power: '66 bhp',
    doors: 5,
    seats: 4,
    colour: 'Clear White',
    registration: '2021 (21)',
    featured: false,
    badge: 'One owner',
    description:
      'Our lowest-mileage car and one of the cheapest to run on the forecourt. Group 4 insurance, tiny road tax and four years of Kia warranty still to go.',
    features: [
      'Balance of 7-year warranty',
      'Apple CarPlay & Android Auto',
      'Reversing camera',
      'Air conditioning',
      'Bluetooth & USB',
      'Electric front windows',
    ],
    gradient: ['226 228 230', '246 247 248'],
  },
  {
    id: 'ford-focus-2017',
    make: 'Ford',
    model: 'Focus',
    variant: '1.5 TDCi Titanium Estate 5dr',
    year: 2017,
    price: 7995,
    financeAvailable: true,
    mileage: 68300,
    fuel: 'Diesel',
    transmission: 'Manual',
    bodyType: 'Estate',
    engine: '1.5L TDCi',
    power: '118 bhp',
    doors: 5,
    seats: 5,
    colour: 'Magnetic Grey',
    registration: '2017 (17)',
    featured: false,
    description:
      'A hard-working Focus Estate in Titanium trim with a big load bay and £20 a year road tax. Motorway miles, full history and a new MOT with no advisories.',
    features: [
      'Sat nav',
      'Heated windscreen',
      'Rear parking sensors',
      'Cruise control',
      'Dual-zone climate control',
      '16" alloy wheels',
    ],
    gradient: ['86 90 94', '146 150 154'],
  },
  {
    id: 'citroen-berlingo-2018',
    make: 'Citroën',
    model: 'Berlingo',
    variant: '1.5 BlueHDi Feel 5dr',
    year: 2018,
    price: 9995,
    financeAvailable: true,
    mileage: 71400,
    fuel: 'Diesel',
    transmission: 'Manual',
    bodyType: 'MPV',
    engine: '1.5L BlueHDi',
    power: '99 bhp',
    doors: 5,
    seats: 5,
    colour: 'Polar White',
    registration: '2018 (68)',
    featured: false,
    description:
      'Enormous inside, easy to park outside. Twin sliding doors, a flat boot floor and three full-size rear seats, the practical answer to a growing family.',
    features: [
      'Twin sliding side doors',
      'Three individual rear seats',
      'Reversing camera',
      'Roof storage box',
      'Air conditioning',
      'Modutop glass roof',
    ],
    gradient: ['222 224 226', '246 246 248'],
  },
  {
    id: 'renault-clio-2018',
    make: 'Renault',
    model: 'Clio',
    variant: '0.9 TCe Dynamique Nav 5dr',
    year: 2018,
    price: 7295,
    financeAvailable: true,
    mileage: 46100,
    fuel: 'Petrol',
    transmission: 'Manual',
    bodyType: 'Hatchback',
    engine: '0.9L TCe',
    power: '89 bhp',
    doors: 5,
    seats: 5,
    colour: 'Flame Red',
    registration: '2018 (18)',
    featured: false,
    description:
      'A well-kept Clio Dynamique Nav with the 7-inch touchscreen and rear sensors. Recently serviced with four good tyres and a twelve-month MOT.',
    features: [
      'Sat nav & 7" touchscreen',
      'Rear parking sensors',
      'Cruise control',
      'DAB radio & Bluetooth',
      'Air conditioning',
      '16" alloy wheels',
    ],
    gradient: ['172 58 50', '218 104 94'],
  },
  {
    id: 'nissan-juke-2016',
    make: 'Nissan',
    model: 'Juke',
    variant: '1.6 Acenta 5dr',
    year: 2016,
    price: 6995,
    financeAvailable: true,
    mileage: 58700,
    fuel: 'Petrol',
    transmission: 'Manual',
    bodyType: 'SUV',
    engine: '1.6L',
    power: '112 bhp',
    doors: 5,
    seats: 5,
    colour: 'Ink Blue',
    registration: '2016 (16)',
    featured: false,
    description:
      'A characterful Juke with the raised driving position of an SUV on a small-car running cost. Three former keepers and a good, honest service history.',
    features: [
      'Reversing camera',
      'Bluetooth & USB',
      'Cruise control',
      'Air conditioning',
      'Privacy glass',
      '17" alloy wheels',
    ],
    gradient: ['40 56 90', '96 118 158'],
  },
  {
    id: 'vauxhall-astra-2017',
    make: 'Vauxhall',
    model: 'Astra',
    variant: '1.4T SRi 5dr',
    year: 2017,
    price: 6495,
    financeAvailable: true,
    mileage: 62400,
    fuel: 'Petrol',
    transmission: 'Manual',
    bodyType: 'Hatchback',
    engine: '1.4L Turbo',
    power: '148 bhp',
    doors: 5,
    seats: 5,
    colour: 'Sovereign Silver',
    registration: '2017 (67)',
    featured: false,
    description:
      'A lot of car for the money: the 148bhp turbo engine, SRi trim and Vauxhall OnStar. Fully serviced by us before sale with a new MOT.',
    features: [
      'SRi sports styling',
      'Apple CarPlay & Android Auto',
      'Rear parking sensors',
      'Cruise control',
      'Air conditioning',
      '17" alloy wheels',
    ],
    gradient: ['160 164 168', '212 215 218'],
  },
  {
    id: 'hyundai-i10-2016',
    make: 'Hyundai',
    model: 'i10',
    variant: '1.0 SE 5dr',
    year: 2016,
    price: 4495,
    financeAvailable: false,
    mileage: 52700,
    fuel: 'Petrol',
    transmission: 'Manual',
    bodyType: 'Hatchback',
    engine: '1.0L',
    power: '65 bhp',
    doors: 5,
    seats: 4,
    colour: 'Sleek Silver',
    registration: '2016 (66)',
    featured: false,
    description:
      'A straightforward, reliable little i10 with five doors, cheap insurance and a full MOT. Cash sale only; finance is not available on vehicles at this price.',
    features: [
      'Air conditioning',
      'Bluetooth & USB',
      'Electric front windows',
      'Remote central locking',
      'Isofix child seat mounts',
      'Full MOT on collection',
    ],
    gradient: ['182 186 190', '224 226 228'],
  },
  {
    id: 'ford-ka-2015',
    make: 'Ford',
    model: 'Ka+',
    variant: '1.2 Zetec 5dr',
    year: 2015,
    price: 3995,
    financeAvailable: false,
    mileage: 81600,
    fuel: 'Petrol',
    transmission: 'Manual',
    bodyType: 'Hatchback',
    engine: '1.2L',
    power: '84 bhp',
    doors: 5,
    seats: 5,
    colour: 'Frozen White',
    registration: '2015 (65)',
    featured: false,
    description:
      'Our cheapest car on the forecourt and an honest one: higher mileage, but serviced on time and driven carefully. Cash sale only; finance is not available at this price.',
    features: [
      'Air conditioning',
      'DAB radio',
      'Bluetooth & USB',
      'Electric front windows',
      'Isofix child seat mounts',
      'Full MOT on collection',
    ],
    gradient: ['220 222 224', '244 245 246'],
  },
]

// Every entry shares one image URL for now, so the browser fetches it once and
// serves the rest from cache. The "from" monthly figure is the longest term we
// quote with no deposit, which is what makes it a *from* price.
export const vehicles: Vehicle[] = vehicleList.map(({ financeAvailable, ...v }) => ({
  ...v,
  monthlyFrom: financeAvailable && v.price > 0 ? monthlyPaymentFor(v.price) : 0,
  image: PLACEHOLDER_CAR_IMAGE,
}))

export function getVehicleById(id: string): Vehicle | undefined {
  return vehicles.find((v) => v.id === id)
}

/**
 * Stand-in gallery size. Real inventory will carry a photo array; until then
 * the card's photo-count badge and the VDP gallery both derive the same number
 * from the id, so the two can never disagree with each other.
 */
export function photoCount(id: string): number {
  let sum = 0
  for (let i = 0; i < id.length; i += 1) sum += id.charCodeAt(i)
  return 14 + (sum % 19)
}
