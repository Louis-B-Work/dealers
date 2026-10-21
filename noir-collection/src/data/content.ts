/**
 * Page copy that is data rather than layout: the service pages, FAQs and the
 * illustrative reviews. Everything here is demo content. Nothing promises a
 * specific warranty, price, appointment or outcome, so a dealer can replace it
 * with their own terms.
 */

export interface Faq {
  question: string
  answer: string
}

export interface ServicePage {
  slug: 'mot' | 'warranty' | 'body-shop' | 'breakdown'
  path: string
  navLabel: string
  icon: string
  title: string
  intro: string
  leadTitle: string
  leadText: string
  checklist: string[]
  steps: { title: string; text: string }[]
  faqs: Faq[]
  /** pre-selects the subject on the contact form */
  subject: string
  action: string
}

export const servicePages: ServicePage[] = [
  {
    slug: 'mot',
    path: '/mot',
    navLabel: 'MOT & servicing',
    icon: 'file',
    title: 'MOT and servicing',
    intro:
      'From the annual MOT to the next service, planned care helps keep every journey straightforward.',
    leadTitle: 'Keep it running well',
    leadText:
      'Choose the right kind of workshop conversation for your car. In a live dealership the team would confirm the schedule, scope and price before any work begins.',
    checklist: [
      'MOT enquiries for cars and light passenger vehicles',
      'Interim or full servicing to suit mileage and age',
      'Oil, filters, brakes and tyre condition discussed',
      'Extra work only after a clear explanation and your approval',
    ],
    steps: [
      {
        title: 'Share the details',
        text: 'Your registration, mileage and MOT expiry date let the workshop prepare properly.',
      },
      {
        title: 'Agree the scope',
        text: 'Choose an MOT, a service or both. Ask what is included and what would cost extra.',
      },
      {
        title: 'Approve before work',
        text: 'Findings and costs should be explained to you before any additional work is carried out.',
      },
    ],
    faqs: [
      {
        question: 'Can I book a slot online?',
        answer:
          'This demo previews an enquiry only. It does not show live workshop availability or create a booking.',
      },
      {
        question: 'Will extra work be done without asking?',
        answer:
          'The intended process is to explain findings, costs and options before asking for approval. Always agree the scope and price with the real workshop.',
      },
      {
        question: 'What should I bring?',
        answer:
          'For a real appointment, bring your service record, any locking wheel nut key and details of warning lights or symptoms.',
      },
    ],
    subject: 'MOT & servicing',
    action: 'Enquire about a service',
  },
  {
    slug: 'warranty',
    path: '/warranty',
    navLabel: 'Warranty',
    icon: 'shield',
    title: 'Warranty cover',
    intro:
      'Know what to check in a warranty and where to turn if something does not feel right after you drive away.',
    leadTitle: 'Peace of mind, in plain English',
    leadText:
      'A useful warranty starts with clear terms. Before a real purchase you should know the provider, duration, claim limits and exclusions, not just the name of the plan.',
    checklist: [
      'Check which components are covered and any claim limits',
      'Understand wear-and-tear and pre-existing fault exclusions',
      'Keep servicing up to date and retain receipts',
      'Contact the provider before authorising a repair',
    ],
    steps: [
      {
        title: 'Before handover',
        text: 'Ask for the full policy wording, start date, excess and claims process, and get any cover confirmed in writing.',
      },
      {
        title: 'While you own the car',
        text: 'Follow the maintenance schedule and act on warning lights. Warranty and routine upkeep serve different purposes.',
      },
      {
        title: 'When you need help',
        text: 'Note the symptoms and contact the named provider. Get authorisation before repairs if the policy requires it.',
      },
    ],
    faqs: [
      {
        question: 'Is warranty cover included in this demo?',
        answer:
          'No policy is sold or issued here. A real dealer must agree the duration, provider and benefits; this page does not promise a particular plan.',
      },
      {
        question: 'Does a warranty replace my consumer rights?',
        answer:
          'No. A commercial warranty is additional to your statutory rights. Seek independent advice if you are unsure.',
      },
      {
        question: 'Can cover be extended?',
        answer:
          'A real provider may offer extensions subject to eligibility, age, mileage and terms. Ask for a quote and the policy wording before deciding.',
      },
    ],
    subject: 'Warranty',
    action: 'Ask about warranty',
  },
  {
    slug: 'body-shop',
    path: '/body-shop',
    navLabel: 'Body shop',
    icon: 'wrench',
    title: 'Body shop',
    intro:
      'From an everyday scuff to a larger paint and panel repair, a careful assessment is the first step.',
    leadTitle: 'A proper finish',
    leadText:
      'Every repair needs a closer look. Share what happened and which panels are affected so a workshop can explain the approach, timing and cost.',
    checklist: [
      'Paintwork and bumper scuff enquiries',
      'Panel damage and dent assessment',
      'Alloy wheel refurbishment enquiries',
      'A written scope and estimate before work begins',
    ],
    steps: [
      {
        title: 'Describe the damage',
        text: 'Say where it is, how it happened and whether the car is safe to drive. This demo does not accept photo uploads.',
      },
      {
        title: 'Agree the approach',
        text: 'A real repairer would inspect the damage and discuss repair or replacement, paint matching and cost.',
      },
      {
        title: 'Check the finish',
        text: 'At collection, review the completed work and ask about paint aftercare or a repair guarantee.',
      },
    ],
    faqs: [
      {
        question: 'Can you price a repair from this form?',
        answer:
          'No. This is a demo enquiry, not an estimate. A real body shop needs enough detail and usually an inspection to quote accurately.',
      },
      {
        question: 'Do you handle insurance repairs?',
        answer:
          'Confirm insurer approval and the repairer process before booking. This preview does not make insurance arrangements.',
      },
      {
        question: 'What if the car is unsafe to drive?',
        answer:
          'Do not drive it. Seek professional recovery advice and contact your insurer or roadside assistance provider.',
      },
    ],
    subject: 'Body shop',
    action: 'Discuss a repair',
  },
  {
    slug: 'breakdown',
    path: '/breakdown',
    navLabel: 'Breakdown',
    icon: 'lifebuoy',
    title: 'Breakdown assistance',
    intro:
      'Know who to call and what to check before you need roadside help. A calm next step matters when a journey is interrupted.',
    leadTitle: 'A plan for the unplanned',
    leadText:
      'Roadside assistance varies by provider and policy. Check your cover documents for the right number, recovery limits and exclusions before you set off.',
    checklist: [
      'Keep your provider contact details somewhere accessible',
      'Check whether the vehicle or the person is covered',
      'Understand roadside, home-start and recovery limits',
      'Confirm start dates, exclusions and onward-travel benefits',
    ],
    steps: [
      {
        title: 'Keep yourself safe',
        text: 'Follow road safety guidance. In immediate danger or a medical emergency, contact the emergency services.',
      },
      {
        title: 'Contact your provider',
        text: 'Use the assistance number on your own policy. Share your location, registration and the problem.',
      },
      {
        title: 'Understand the next step',
        text: 'Your provider can explain attendance, recovery and onward-travel options under your specific cover.',
      },
    ],
    faqs: [
      {
        question: 'Can I request emergency recovery here?',
        answer:
          'No. This website is a non-operational design preview and is not monitored. Use your roadside provider or the emergency services.',
      },
      {
        question: 'Is breakdown cover included with these cars?',
        answer:
          'No cover is provided in this demo. A real purchase needs written confirmation of provider, duration, limits and exclusions.',
      },
      {
        question: 'Can I arrange support through the form?',
        answer:
          'The form only previews a non-urgent enquiry. Nothing is sent or booked, so never rely on it for urgent help.',
      },
    ],
    subject: 'Breakdown assistance',
    action: 'Ask about breakdown cover',
  },
]

export const reviews = [
  {
    name: 'Edward H.',
    detail: 'Collected a grand tourer',
    text: 'The car was waiting under the lights, exactly as described. No rush, no pressure, just an honest walk-round and a proper test drive.',
  },
  {
    name: 'Charlotte M.',
    detail: 'Part-exchanged a performance estate',
    text: 'They handled the part-exchange and finance quietly and clearly. Every figure was explained before I signed anything.',
  },
  {
    name: 'Rajiv S.',
    detail: 'Bought a weekend car',
    text: 'Provenance, history and condition were all documented. It felt like buying from a private collector, not a forecourt.',
  },
]

export const subjects = [
  'General enquiry',
  'Vehicle viewing',
  'Finance',
  'Part-exchange',
  'Sell my car',
  'MOT & servicing',
  'Warranty',
  'Body shop',
  'Breakdown assistance',
] as const
