export const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });
export const money = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 });
export const APR = 11.9;
export const photo = (src, width) => src.includes('pexels')
  ? `${src}?auto=compress&cs=tinysrgb&w=${width}`
  : `${src}?w=${width}&q=75&auto=format&fit=crop`;

export const STOCK = [
  { id: 'range-rover-evoque', make: 'Land Rover', model: 'Range Rover Evoque', trim: '2.0 D180 R-Dynamic SE', year: 2019, miles: 38400, gearbox: 'Automatic', fuel: 'Diesel', bodyType: 'SUV', price: 22950, engine: '2.0 litre', doors: 5, featured: true, img: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg' },
  { id: 'fiat-500', make: 'Fiat', model: '500', trim: '1.0 Mild Hybrid Lounge', year: 2021, miles: 14200, gearbox: 'Manual', fuel: 'Petrol hybrid', bodyType: 'Hatchback', price: 10495, engine: '1.0 litre', doors: 3, featured: true, img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2' },
  { id: 'volkswagen-polo', make: 'Volkswagen', model: 'Polo', trim: '1.0 TSI Match', year: 2020, miles: 26800, gearbox: 'Manual', fuel: 'Petrol', bodyType: 'Hatchback', price: 11990, engine: '1.0 litre', doors: 5, img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d' },
  { id: 'bmw-4-series', make: 'BMW', model: '4 Series', trim: '420i M Sport', year: 2021, miles: 22100, gearbox: 'Automatic', fuel: 'Petrol', bodyType: 'Coupe', price: 25750, engine: '2.0 litre', doors: 2, featured: true, img: 'https://images.unsplash.com/photo-1502877338535-766e1452684a' },
  { id: 'mercedes-slk', make: 'Mercedes-Benz', model: 'SLK', trim: 'SLK 200 AMG Sport', year: 2016, miles: 41800, gearbox: 'Automatic', fuel: 'Petrol', bodyType: 'Convertible', price: 15750, engine: '2.0 litre', doors: 2, img: 'https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg' },
  { id: 'bmw-3-series', make: 'BMW', model: '3 Series', trim: '320d Sport', year: 2020, miles: 34900, gearbox: 'Automatic', fuel: 'Diesel', bodyType: 'Saloon', price: 18995, engine: '2.0 litre', doors: 4, img: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg' },
  { id: 'ford-focus', make: 'Ford', model: 'Focus', trim: '1.0 EcoBoost Titanium', year: 2021, miles: 21400, gearbox: 'Manual', fuel: 'Petrol', bodyType: 'Hatchback', price: 14995, engine: '1.0 litre', doors: 5, featured: true, img: 'https://images.pexels.com/photos/27138933/pexels-photo-27138933/free-photo-of-silver-ford-focus-car-parked-on-the-road.jpeg' },
  { id: 'volkswagen-golf', make: 'Volkswagen', model: 'Golf', trim: '1.5 TSI Life', year: 2020, miles: 30200, gearbox: 'Manual', fuel: 'Petrol', bodyType: 'Hatchback', price: 16250, engine: '1.5 litre', doors: 5, img: 'https://images.unsplash.com/photo-1776075508451-fba29bea6fae' },
  { id: 'toyota-yaris', make: 'Toyota', model: 'Yaris', trim: '1.5 Hybrid Design', year: 2021, miles: 18700, gearbox: 'Automatic', fuel: 'Petrol hybrid', bodyType: 'Hatchback', price: 13995, engine: '1.5 litre', doors: 5, img: 'https://images.pexels.com/photos/20595070/pexels-photo-20595070/free-photo-of-black-toyota-yaris.jpeg' },
  { id: 'kia-ev6', make: 'Kia', model: 'EV6', trim: '77.4 kWh GT-Line', year: 2022, miles: 15300, gearbox: 'Automatic', fuel: 'Electric', bodyType: 'SUV', price: 29995, engine: '77.4 kWh battery', doors: 5, featured: true, img: 'https://images.pexels.com/photos/13592325/pexels-photo-13592325.jpeg' },
  { id: 'volkswagen-golf-estate', make: 'Volkswagen', model: 'Golf Estate', trim: '1.6 TDI Match', year: 2019, miles: 36100, gearbox: 'Manual', fuel: 'Diesel', bodyType: 'Estate', price: 13495, engine: '1.6 litre', doors: 5, img: 'https://images.unsplash.com/photo-1777907159946-9170caa0dab5', focus: '45% 62%' },
];

export const BODY_TYPES = [
  { name: 'SUV', plural: 'SUVs' },
  { name: 'Hatchback', plural: 'hatchbacks' },
  { name: 'Saloon', plural: 'saloons' },
  { name: 'Estate', plural: 'estates' },
  { name: 'Coupe', plural: 'coupes' },
  { name: 'Convertible', plural: 'convertibles' },
];

export function filterStock(params, stock = STOCK) {
  const query = (params.get('query') || '').trim().toLowerCase();
  const max = Number(params.get('maxPrice'));
  const results = stock.filter((car) =>
    (!query || `${car.make} ${car.model} ${car.trim}`.toLowerCase().includes(query)) &&
    ['make', 'model', 'bodyType', 'fuel', 'gearbox'].every((key) => !params.get(key) || car[key] === params.get(key)) &&
    (!max || car.price <= max));
  const sorters = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    'year-desc': (a, b) => b.year - a.year,
    'mileage-asc': (a, b) => a.miles - b.miles,
    featured: (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
  };
  return results.sort(sorters[params.get('sort')] || sorters.featured);
}

export function financeQuote(price, deposit, months, apr = APR) {
  if (![price, deposit, months, apr].every(Number.isFinite) || price <= 0 ||
      deposit < 0 || deposit > price || !Number.isInteger(months) || months <= 0 || apr < 0) {
    throw new RangeError('Enter a positive price, a deposit between zero and the price, and a valid term.');
  }
  const credit = price - deposit;
  const rate = (1 + apr / 100) ** (1 / 12) - 1;
  const payment = credit === 0 ? 0 : rate === 0 ? credit / months : credit * rate / (1 - (1 + rate) ** -months);
  const monthly = Math.round(payment * 100) / 100;
  const repayments = Math.round(monthly * months * 100) / 100;
  return { credit, monthly, interest: Math.round((repayments - credit) * 100) / 100, total: Math.round((deposit + repayments) * 100) / 100 };
}

export function parseRoute(hash) {
  const [path, query = ''] = hash.replace(/^#/, '').split('?');
  return { path: path || '/', params: new URLSearchParams(query) };
}

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}
