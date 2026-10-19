/**
 * Marque artwork, hotlinked from the same source the live templates use
 * (the other drafts and the production templates all read from this host)
 * so the logos match across the estate and no trademarked files are vendored
 * into this repo. Keys are lowercase for case-insensitive matching.
 *
 * Every entry here has been confirmed to return a real image — the host
 * answers 200 with an HTML page for an unknown marque rather than a 404, so a
 * guessed slug would fail silently at render time instead of being caught.
 */
export const brandLogos: Record<string, string> = {
  'aston martin': 'https://www.carlogos.org/car-logos/aston-martin-logo.png',
  audi: 'https://www.carlogos.org/car-logos/audi-logo.png',
  bentley: 'https://www.carlogos.org/car-logos/bentley-logo.png',
  bmw: 'https://www.carlogos.org/car-logos/bmw-logo.png',
  ferrari: 'https://www.carlogos.org/car-logos/ferrari-logo.png',
  genesis: 'https://www.carlogos.org/car-logos/genesis-logo.png',
  jaguar: 'https://www.carlogos.org/car-logos/jaguar-logo.png',
  lamborghini: 'https://www.carlogos.org/car-logos/lamborghini-logo.png',
  'land rover': 'https://www.carlogos.org/car-logos/land-rover-logo.png',
  lexus: 'https://www.carlogos.org/car-logos/lexus-logo.png',
  maserati: 'https://www.carlogos.org/car-logos/maserati-logo.png',
  mclaren: 'https://www.carlogos.org/car-logos/mclaren-logo.png',
  'mercedes-amg': 'https://www.carlogos.org/car-logos/mercedes-amg-logo.png',
  'mercedes-benz': 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png',
  mini: 'https://www.carlogos.org/car-logos/mini-logo.png',
  polestar: 'https://www.carlogos.org/car-logos/polestar-logo.png',
  porsche: 'https://www.carlogos.org/car-logos/porsche-logo.png',
  'rolls-royce': 'https://www.carlogos.org/car-logos/rolls-royce-logo.png',
  tesla: 'https://www.carlogos.org/car-logos/tesla-logo.png',
  volvo: 'https://www.carlogos.org/car-logos/volvo-logo.png',
}

/** The artwork for a marque, or undefined when we hold none for it. */
export function logoForMake(make: string): string | undefined {
  return brandLogos[make.trim().toLowerCase()]
}
