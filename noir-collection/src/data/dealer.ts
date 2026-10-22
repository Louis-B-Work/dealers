export interface OpeningHour {
  day: string
  hours: string
}

export interface Dealer {
  name: string
  tagline: string
  established: string
  phone: string
  email: string
  address: {
    line1: string
    line2: string
    city: string
    postcode: string
  }
  openingHours: OpeningHour[]
  socials: { label: string; href: string }[]
  rating: { score: number; count: number; source: string }
}

export const dealer: Dealer = {
  name: 'Dealership Name',
  tagline: 'Exceptional cars, privately presented.',
  established: '2005',
  phone: '01234 567 890',
  email: 'sales@dealershipname.co.uk',
  address: {
    line1: 'Address Line 1',
    line2: 'Address Line 2',
    city: 'Town, County',
    postcode: 'AB12 3CD',
  },
  openingHours: [
    { day: 'Monday – Friday', hours: '09:00 – 18:00' },
    { day: 'Saturday', hours: '09:00 – 17:00' },
    { day: 'Sunday', hours: '10:00 – 16:00' },
    { day: 'Bank Holidays', hours: '10:00 – 16:00' },
  ],
  socials: [
    { label: 'Instagram', href: '#' },
    { label: 'Facebook', href: '#' },
    { label: 'YouTube', href: '#' },
    { label: 'LinkedIn', href: '#' },
  ],
  rating: { score: 4.9, count: 728, source: 'Google Reviews' },
}

/**
 * Regulated finance wording. Kept in one place so the representative APR can
 * never disagree between the calculator, the vehicle cards and the
 * representative example.
 */
export const REPRESENTATIVE_APR = 11.9

export const brokerDisclosure = `Car Finance 247 is a credit broker, not a lender.`

export const representativeExample =
  'Representative Example: Borrow £12,000.00 over 5 years with a £0.00 deposit. ' +
  `Representative ${REPRESENTATIVE_APR}% APR fixed rate. Monthly payment: £262.69. ` +
  'Option to purchase fee £10.00 payable. Total cost of credit: £3,771.40. ' +
  'Total amount repayable: £15,771.40.'

/**
 * The longest term we quote against. Every "from £x a month" figure on the site
 * is this term with no deposit, which is what makes "from" literally true.
 */
export const QUOTE_TERM_MONTHS = 60

/** The effective monthly rate for an APR — not the APR divided by twelve, which
 *  would overstate the monthly payment and put the calculator out of step with
 *  the representative example. */
function monthlyRate(apr: number): number {
  return (1 + apr / 100) ** (1 / 12) - 1
}

/**
 * Standard annuity formula. Every monthly figure in the template comes through
 * here, so the vehicle cards, the homepage calculator and the VDP panel can
 * never quote arithmetic that disagrees.
 */
export function monthlyPaymentFor(
  principal: number,
  termMonths: number = QUOTE_TERM_MONTHS,
  apr: number = REPRESENTATIVE_APR,
): number {
  if (principal <= 0) return 0
  const r = monthlyRate(apr)
  return Math.round((principal * r) / (1 - (1 + r) ** -termMonths))
}

/** The same formula run backwards, from a monthly budget to an amount of credit. */
export function amountBorrowableFor(
  monthlyPayment: number,
  termMonths: number = QUOTE_TERM_MONTHS,
  apr: number = REPRESENTATIVE_APR,
): number {
  if (monthlyPayment <= 0) return 0
  const r = monthlyRate(apr)
  return (monthlyPayment * (1 - (1 + r) ** -termMonths)) / r
}
