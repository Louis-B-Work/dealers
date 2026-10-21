import { STOCK, BODY_TYPES, APR, gbp, money, photo, filterStock, financeQuote, parseRoute, escapeHtml as esc } from './stock.mjs';

const homeTitle = 'Dealership Name | Considered Cars';
const showroomImage = 'https://images.unsplash.com/photo-1563720223185-11003d516935';
const routeTitles = {
  '/vehicles': 'The collection', '/finance': 'Finance', '/sell': 'Sell your car',
  '/about': 'Our approach', '/contact': 'Visit & contact', '/mot': 'MOT & servicing',
  '/warranty': 'Warranty cover', '/body-shop': 'Body shop', '/breakdown': 'Breakdown assistance',
  '/privacy': 'Privacy',
};

function header(eyebrow, title, intro, breadcrumb = '') {
  return `<header class="page-header"><div class="shell"><div class="breadcrumbs"><a href="#/">Home</a><span aria-hidden="true">/</span>${breadcrumb || esc(eyebrow)}</div><p class="eyebrow">${esc(eyebrow)}</p><h1 tabindex="-1">${esc(title)}</h1><p class="intro">${esc(intro)}</p></div></header>`;
}

function options(values, selected, first = 'Any') {
  return `<option value="">${esc(first)}</option>${values.map((value) => `<option value="${esc(value)}"${value === selected ? ' selected' : ''}>${esc(value)}</option>`).join('')}`;
}

function cta(title = 'A good conversation goes a long way.', text = 'Tell us what you have in mind. We will help you work out the next step.', href = '#/contact', label = 'Talk to our team') {
  return `<div class="callout"><div><h2>${esc(title)}</h2><p>${esc(text)}</p></div><a class="button" href="${esc(href)}">${esc(label)} &nearr;</a></div>`;
}

function faqs(items) {
  return `<div class="faq"><h2>A few useful answers.</h2>${items.map(([question, answer]) => `<details><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`).join('')}</div>`;
}

function steps(items) {
  return `<div class="three-grid">${items.map(([title, text], index) => `<article class="content-card"><span class="step-number">0${index + 1}</span><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join('')}</div>`;
}

function vehicleCard(car) {
  const quote = financeQuote(car.price, 0, 60);
  return `<li class="stock-card"><a href="#/vehicles/${car.id}" aria-label="${esc(`${car.year} ${car.make} ${car.model}, ${gbp.format(car.price)}`)}"><span class="stock-media"><img src="${photo(car.img, 900)}" alt="${esc(`${car.make} ${car.model} illustrative stock photograph`)}" loading="lazy"${car.focus ? ` style="object-position:${car.focus}"` : ''} /><span class="stock-badge">${car.featured ? 'Our pick' : 'In the collection'}</span></span><span class="stock-body"><span class="stock-make">${esc(car.make)}</span><strong class="stock-model">${esc(car.model)}</strong><span class="stock-spec">${esc(car.trim)}</span><span class="stock-spec">${car.year} &middot; ${car.miles.toLocaleString('en-GB')} miles &middot; ${car.gearbox}</span><span class="stock-spec">${car.fuel} &middot; ${car.bodyType}</span><span class="stock-foot"><span class="stock-price">${gbp.format(car.price)}</span><span class="stock-go" aria-hidden="true">&nearr;</span></span><span class="stock-monthly">${money.format(quote.monthly)}/mo illustration &middot; ${APR}% APR</span></span></a></li>`;
}

function stockPage(params) {
  const makes = [...new Set(STOCK.map((car) => car.make))].sort();
  return `${header('The collection', 'Your next chapter, on four wheels.', 'A considered collection of cars for everyday life and the occasional long way home. Each one with its own detail page, and no surprises in the small print.')}<div class="shell page-content">
    <form id="stock-filters" class="filters" role="search" aria-label="Filter the collection">
      <label class="field">Search<input type="search" name="query" value="${esc(params.get('query') || '')}" placeholder="Make, model or trim" /></label>
      <label class="field">Make<select name="make">${options(makes, params.get('make'), 'Any make')}</select></label>
      <label class="field">Model<select name="model" ${params.get('make') ? '' : 'disabled'}>${options(STOCK.filter((car) => car.make === params.get('make')).map((car) => car.model), params.get('model'), 'Any model')}</select></label>
      <label class="field">Body type<select name="bodyType">${options(BODY_TYPES.map((body) => body.name), params.get('bodyType'), 'Any body type')}</select></label>
      <label class="field">Fuel<select name="fuel">${options([...new Set(STOCK.map((car) => car.fuel))].sort(), params.get('fuel'), 'Any fuel')}</select></label>
      <label class="field">Transmission<select name="gearbox">${options(['Automatic', 'Manual'], params.get('gearbox'), 'Any transmission')}</select></label>
      <label class="field">Maximum price<select name="maxPrice"><option value="">No maximum</option>${[8000, 10000, 12500, 15000, 20000, 25000, 30000].map((price) => `<option value="${price}"${String(price) === params.get('maxPrice') ? ' selected' : ''}>${gbp.format(price)}</option>`).join('')}</select></label>
      <button class="button" type="submit">Update collection &nearr;</button>
    </form>
    <div class="filter-actions"><p id="results-count" role="status"></p><label class="field">Sort by<select id="stock-sort">${['featured', 'price-asc', 'price-desc', 'year-desc', 'mileage-asc'].map((value, index) => `<option value="${value}"${(params.get('sort') || 'featured') === value ? ' selected' : ''}>${['Our picks first', 'Price: low to high', 'Price: high to low', 'Newest year', 'Lowest mileage'][index]}</option>`).join('')}</select></label><button class="quiet-button" type="button" data-clear-filters>Clear all filters</button></div>
    <ul class="vehicle-grid" id="vehicle-results"></ul><div class="empty-state" id="no-results" hidden><h2>No cars quite match. Yet.</h2><p>Try a different make, a higher budget or a wider search.</p><button class="button" type="button" data-clear-filters>Show the full collection</button></div>
    <p class="fine-print section-gap">Illustrative stock and specifications. Photos may not show the exact model or trim. Monthly figures assume no deposit and 60 payments at ${APR}% APR, with no fees or balloon payment. Not a credit offer.</p>
    ${cta('Not quite found your fit?', 'Tell us what your next car needs to do. It is a good place to start.')}
  </div>`;
}

function setupStock(root) {
  const form = root.querySelector('#stock-filters');
  const sort = root.querySelector('#stock-sort');
  const update = () => {
    const params = new URLSearchParams([...new FormData(form)].filter(([, value]) => value));
    if (sort.value !== 'featured') params.set('sort', sort.value);
    history.replaceState(null, '', `#/vehicles${params.size ? `?${params}` : ''}`);
    const results = filterStock(params);
    root.querySelector('#results-count').textContent = `${results.length} ${results.length === 1 ? 'car' : 'cars'} in your collection`;
    root.querySelector('#vehicle-results').innerHTML = results.map(vehicleCard).join('');
    root.querySelector('#no-results').hidden = results.length > 0;
  };
  form.elements.make.addEventListener('change', () => {
    form.elements.model.innerHTML = options(STOCK.filter((car) => car.make === form.elements.make.value).map((car) => car.model), '', 'Any model');
    form.elements.model.disabled = !form.elements.make.value;
  });
  form.addEventListener('change', update);
  form.addEventListener('submit', (event) => { event.preventDefault(); update(); });
  form.elements.query.addEventListener('input', update);
  sort.addEventListener('change', update);
  root.querySelectorAll('[data-clear-filters]').forEach((button) => button.addEventListener('click', () => {
    for (const field of form.querySelectorAll('input, select')) field.value = '';
    form.elements.model.innerHTML = options([], '', 'Any model');
    form.elements.model.disabled = true;
    sort.value = 'featured';
    update();
    form.elements.query.focus();
  }));
  update();
}

function vehiclePage(car) {
  const quote = financeQuote(car.price, 0, 60);
  const specs = [['Registration year', car.year], ['Mileage', `${car.miles.toLocaleString('en-GB')} miles`], ['Fuel', car.fuel], ['Transmission', car.gearbox], ['Engine / battery', car.engine], ['Body style', car.bodyType], ['Doors', car.doors], ['Stock reference', car.id.toUpperCase()]];
  return `${header('A closer look', `${car.make} ${car.model}`, `${car.trim} | ${car.year} | ${car.miles.toLocaleString('en-GB')} miles`, `<a href="#/vehicles">The collection</a><span aria-hidden="true">/</span>${esc(car.model)}`)}<div class="shell page-content">
    <div class="vehicle-layout"><div><div class="vehicle-image"><img src="${photo(car.img, 1400)}" alt="${esc(`${car.make} ${car.model}, illustrative stock photograph`)}"${car.focus ? ` style="object-position:${car.focus}"` : ''} /></div><p class="image-caption">Illustrative photography. This demo uses one photo per car; the exact vehicle, trim and condition would be confirmed at a viewing.</p>
      <h2>At a glance.</h2><dl class="spec-table">${specs.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>
      <section class="section-gap"><h2>A good fit for the road ahead.</h2><p class="quiet">This ${car.year} ${esc(car.model)} brings together ${car.gearbox.toLowerCase()} driving and the practicality of a ${car.bodyType.toLowerCase()}. With ${car.miles.toLocaleString('en-GB')} miles in this sample specification, it is ready to be explored at your own pace.</p><p class="quiet">Ask about service records, running costs and the details that matter to you. We would confirm the full specification, preparation and warranty in writing before a real purchase.</p><ul class="check-list"><li>Vehicle history and mileage checks discussed before purchase</li><li>Preparation and condition report explained at handover</li><li>Time for a viewing and an unhurried test drive</li><li>Part-exchange and finance options to talk through</li></ul></section>
    </div><aside class="vehicle-purchase content-card"><p class="eyebrow">A considered choice</p><h2>${esc(car.make)}<br />${esc(car.model)}</h2><p>${esc(car.trim)}</p><div class="price">${gbp.format(car.price)}</div><p>Or an illustrative ${money.format(quote.monthly)} per month.</p><a class="button" href="#/contact?vehicle=${car.id}">Enquire about this car &nearr;</a><a class="button button-outline" href="#/finance?vehicle=${car.id}">Explore finance</a><a class="button button-outline" href="#/sell?vehicle=${car.id}">Value your part-exchange</a><p class="fine-print">Cash price ${money.format(car.price)}. No deposit. Amount of credit ${money.format(car.price)}. 60 monthly payments of ${money.format(quote.monthly)}. Total payable ${money.format(quote.total)}. Cost of credit ${money.format(quote.interest)}. ${APR}% APR. No fees or balloon payment in this illustration. Finance subject to status; not an offer.</p><span class="demo-label">Demo vehicle &middot; Not available to buy or reserve</span></aside></div>
    <section class="section-gap"><div class="section-heading"><h2>Something else to consider.</h2><a class="text-link" href="#/vehicles">The full collection &nearr;</a></div><ul class="vehicle-grid">${STOCK.filter((other) => other.id !== car.id).slice(0, 3).map(vehicleCard).join('')}</ul></section>
  </div>`;
}

function financePage(params) {
  const car = STOCK.find((vehicle) => vehicle.id === params.get('vehicle'));
  return `${header('Finance, without the fog', 'A little clarity goes a long way.', 'Work out a comfortable monthly payment before you fall for the car. No credit check, no obligation, just a useful starting point.')}<div class="shell page-content">
    <div class="calculator"><form id="finance-calculator"><div><p class="eyebrow">Make it work for you</p><h2>Your numbers.<br />Your next car.</h2></div>
      <label class="field">Choose an example car<select name="vehicle"><option value="">Set your own price</option>${STOCK.map((vehicle) => `<option value="${vehicle.id}"${vehicle === car ? ' selected' : ''}>${esc(`${vehicle.make} ${vehicle.model}`)} - ${gbp.format(vehicle.price)}</option>`).join('')}</select></label>
      <label class="field">Cash price (£)<input name="price" type="number" min="1" max="200000" step="0.01" required value="${car ? car.price : 12000}" /></label>
      <label class="field">Deposit (£)<input name="deposit" type="number" min="0" max="${car ? car.price : 12000}" step="0.01" required value="0" /></label>
      <label class="field">Repayment term<select name="months">${[24, 36, 48, 60].map((months) => `<option value="${months}"${months === 60 ? ' selected' : ''}>${months} months (${months / 12} years)</option>`).join('')}</select></label>
      <p class="fine-print">Hire purchase illustration at ${APR}% APR. No fees or optional final balloon payment are included. You can change the price, deposit and term.</p>
    </form><div class="quote-panel" id="finance-output" aria-live="polite"></div></div>
    <div class="section-gap">${steps([['Find your comfort zone.', 'Start with what you are happy paying each month, allowing room for insurance, maintenance and the journeys themselves.'], ['Talk through the options.', 'In a live dealership, a finance specialist would explain lender terms, eligibility and any commission before you choose.'], ['Make an informed decision.', 'Read the full agreement and check the total payable, deposit and any fees. There is no application or credit search in this demo.']])}</div>
    ${faqs([['Is this a finance application?', 'No. This calculator is a local illustration only. It does not check eligibility, perform a credit search or submit an application.'], ['How are the figures calculated?', 'We use the effective monthly rate equivalent to 11.9% APR and equal monthly repayments, rounded to the nearest penny. The total is based on those rounded payments. A real lender may adjust the final payment and include different fees or terms.'], ['What is hire purchase?', 'You typically pay a deposit and fixed monthly instalments. Ownership usually passes after all payments and any purchase fee are settled. Always check the actual lender agreement.'], ['Can I use my current car as a deposit?', 'In a real transaction, any agreed part-exchange value less outstanding finance could contribute to your deposit. A valuation and finance settlement would need to be confirmed first.']])}
    ${cta('Let us talk it through.', 'Explore the demo enquiry flow. No application or credit check will be made.', car ? `#/contact?vehicle=${car.id}&subject=Finance` : '#/contact?subject=Finance', 'Ask about finance')}
  </div>`;
}

function setupFinance(root) {
  const form = root.querySelector('#finance-calculator');
  const output = root.querySelector('#finance-output');
  const update = () => {
    const price = form.elements.price.valueAsNumber;
    const deposit = form.elements.deposit.valueAsNumber;
    form.elements.deposit.max = Number.isFinite(price) ? String(price) : '0';
    if (!form.checkValidity()) {
      output.innerHTML = '<p class="eyebrow">Check your figures</p><h2>Let us get the numbers right.</h2><p role="alert">Enter a price between £1 and £200,000 and a deposit no greater than the cash price.</p>';
      return;
    }
    const months = Number(form.elements.months.value);
    const quote = financeQuote(price, deposit, months);
    const car = STOCK.find((vehicle) => vehicle.id === form.elements.vehicle.value);
    const enquiryLink = car ? `#/contact?vehicle=${car.id}&subject=Finance` : '#/contact?subject=Finance';
    root.querySelector('.callout .button').setAttribute('href', enquiryLink);
    output.innerHTML = `<p class="eyebrow">Your illustrative payment</p><strong class="quote-amount">${money.format(quote.monthly)}</strong><p>per month for ${months} months &middot; ${APR}% APR</p><dl>${[['Cash price', price], ['Your deposit', deposit], ['Amount of credit', quote.credit], ['Total cost of credit', quote.interest], ['Total payable (including deposit)', quote.total]].map(([label, value]) => `<div><dt>${label}</dt><dd>${money.format(value)}</dd></div>`).join('')}</dl><p class="fine-print">${months} payments of ${money.format(quote.monthly)}, with no fees or balloon payment. This is an illustration, not a personalised quote or credit offer. Real lender terms may differ. Finance subject to status, age and affordability checks. Dealership Name is a fictional credit broker, not a lender.</p><a class="button button-light" href="${enquiryLink}">Talk through the options &nearr;</a>`;
  };
  form.addEventListener('submit', (event) => event.preventDefault());
  form.elements.vehicle.addEventListener('change', () => {
    const car = STOCK.find((vehicle) => vehicle.id === form.elements.vehicle.value);
    if (car) form.elements.price.value = car.price;
  });
  form.elements.price.addEventListener('input', () => { form.elements.vehicle.value = ''; });
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  update();
}

function enquiryForm({ heading = 'Start a conversation.', subject = 'General enquiry', message = '', extraFields = '', button = 'Preview your enquiry' } = {}) {
  return `<form class="form-panel demo-form"><span class="demo-label">Design preview &middot; Nothing is sent</span><h2>${esc(heading)}</h2><p>Try the form with sample details. This demo validates your inputs, but does not send, store or process your enquiry.</p><div class="form-grid">
    ${extraFields}
    <label class="field">Your name<input name="name" required autocomplete="name" maxlength="100" placeholder="Alex Taylor" /></label>
    <label class="field">Email address<input name="email" type="email" required autocomplete="email" maxlength="200" placeholder="alex@example.com" /></label>
    <label class="field">Phone (optional)<input name="phone" type="tel" autocomplete="tel" maxlength="30" /></label>
    <label class="field">Enquiry about<select name="subject">${options(['General enquiry', 'Vehicle viewing', 'Finance', 'Part-exchange', 'Sell my car', 'MOT & servicing', 'Warranty', 'Body shop', 'Breakdown assistance'], subject, 'Please choose')}</select></label>
    <label class="field full-width">Your message<textarea name="message" rows="4" required maxlength="2000" placeholder="What would you like to know?">${esc(message)}</textarea></label>
    <label class="checkbox-field full-width"><input type="checkbox" name="consent" required /><span>I understand this is a demo and no enquiry will be sent. Read the <a href="#/privacy">privacy information</a>.</span></label>
    <button class="button full-width" type="submit">${esc(button)} &nearr;</button>
  </div><p class="form-notice" role="status" tabindex="-1" hidden></p></form>`;
}

function setupForms(root) {
  root.querySelectorAll('.demo-form').forEach((form) => form.addEventListener('submit', (event) => {
    event.preventDefault();
    const notice = form.querySelector('[role="status"]');
    notice.textContent = form.querySelector('[name="registration"]')
      ? 'Demo valuation request checked. Nothing has been sent, saved or valued. A real valuation would require a vehicle inspection, condition details and any finance settlement. You can edit the details and preview again.'
      : 'Demo enquiry checked. Nothing has been sent or saved, and no booking or credit application has been made. You can edit your sample details and preview again.';
    notice.hidden = false;
    notice.focus();
  }));
}

function contactPage(params) {
  const car = STOCK.find((vehicle) => vehicle.id === params.get('vehicle'));
  const subject = params.get('subject') || (car ? 'Vehicle viewing' : 'General enquiry');
  return `${header('Visit & contact', 'The kettle is on.', 'A question, a closer look or a conversation about your next car. However you would like to start, you are welcome here.')}<div class="shell page-content"><div class="page-split"><div><div class="contact-details"><div class="content-card"><p class="eyebrow">Demo showroom</p><h3>Leeds,<br />West Yorkshire.</h3><p>A fictional location for this design. There is no trading showroom or appointment to attend.</p></div><div class="content-card"><p class="eyebrow">A note before you call</p><h3>Let us keep it simple.</h3><p>Contact details and live bookings are not enabled in this preview. Use the form to explore the enquiry experience.</p></div></div><div class="content-card section-gap"><h3>Our showroom hours.</h3><ul class="hours"><li><span>Monday - Friday</span><span>9am - 6pm</span></li><li><span>Saturday</span><span>9am - 5pm</span></li><li><span>Sunday</span><span>By appointment</span></li></ul><p class="fine-print">Illustrative opening hours. Visits cannot be booked in this demo.</p></div><div class="location-card section-gap"><span class="location-ring ring-one"></span><span class="location-ring ring-two"></span><span class="location-road"></span><div class="location-label"><span class="brand-mark">D</span><strong>A little out of the ordinary.</strong><span>Leeds, West Yorkshire</span><a href="https://www.openstreetmap.org/search?query=Leeds%2C%20West%20Yorkshire" target="_blank" rel="noopener noreferrer">Explore the city on the map &nearr;</a></div><span class="map-caption">Illustrated location &middot; Not a dealership address</span></div></div>${enquiryForm({ subject, message: car ? `I would like to know more about the ${car.year} ${car.make} ${car.model} (${gbp.format(car.price)}), stock reference ${car.id}.` : '' })}</div></div>`;
}

function sellPage(params) {
  const car = STOCK.find((vehicle) => vehicle.id === params.get('vehicle'));
  return `${header('Sell or part-exchange', 'A good next step for your current car.', 'Moving on should be straightforward. Explore selling outright or putting your car towards something in the collection.')}<div class="shell page-content">
    ${steps([['Tell us about your car.', 'Registration, mileage and an honest picture of its condition give a valuer a useful place to start.'], ['Talk through the details.', 'Service history, ownership and any outstanding finance all matter. A live dealership would confirm an offer after inspection.'], ['Choose your next chapter.', 'Sell outright or use any agreed equity towards your next car. No obligation to buy from the collection.']])}
    <div class="page-split section-gap"><div><p class="eyebrow">A fair conversation</p><h2>No guesswork.<br />No instant-price theatre.</h2><p class="quiet">A car is more than a registration number. Its history, condition and the way it has been looked after deserve a proper look.</p><ul class="check-list"><li>Have your current mileage and service history handy</li><li>Tell us about any damage or known mechanical issues</li><li>Request a settlement figure if finance is outstanding</li><li>Keep the V5C and proof of ownership ready for a real sale</li></ul><p class="fine-print">This is a demo enquiry flow, not an automated valuation service. No offer, payment or finance settlement will be generated.</p></div>
      ${enquiryForm({ heading: 'Tell us what you are moving on from.', subject: car ? 'Part-exchange' : 'Sell my car', message: car ? `I am interested in part-exchanging towards the ${car.make} ${car.model}, stock reference ${car.id}.` : '', button: 'Preview valuation request', extraFields: '<label class="field">Registration<input name="registration" required maxlength="12" placeholder="AB21 CDE" /></label><label class="field">Mileage<input name="mileage" type="number" min="0" max="1000000" step="1" required placeholder="35000" /></label><label class="field">Make & model<input name="currentCar" required maxlength="100" placeholder="Volkswagen Golf" /></label><label class="field">Outstanding finance?<select name="outstandingFinance" required><option value="">Please choose</option><option>No</option><option>Yes</option><option>Not sure</option></select></label>' })}
    </div>${faqs([['Can I sell without buying a car?', 'That is the intended outright-sale option. In a live service, purchase decisions and any offer would depend on the car and an inspection. This preview cannot buy vehicles.'], ['What if my car has finance outstanding?', 'Ask your lender for a current settlement figure. If the agreed value is lower than the settlement, the shortfall must be addressed before a sale can proceed.'], ['Is a valuation guaranteed?', 'No. This form is a demonstration only. A real valuation needs accurate details and an inspection, and any offer should set out its conditions in writing.']])}
  </div>`;
}

function aboutPage() {
  return `${header('Our approach', 'Car people. People people.', 'A thoughtful collection, an honest conversation and a little more care at every turn. This is our approach.')}<div class="shell page-content">
    <div class="editorial-split"><div class="editorial-photo"><img src="${photo(showroomImage, 1000)}" alt="A Range Rover presented outside a contemporary building" loading="lazy" /><span class="photo-note">Good cars. Well found.</span></div><div class="editorial-copy"><p class="eyebrow">A little out of the ordinary</p><h2>Less forecourt fuss.<br />More finding your fit.</h2><p>Dealership Name is a fictional independent dealership template, ready to personalise. The idea is simple: buying a used car can feel thoughtful, welcoming and refreshingly clear.</p><p>We would rather talk about the school run, the weekend away and what you actually need than rush you towards a set of keys. The right car should make sense for your life, not just look good in a photograph.</p><a class="text-link" href="#/vehicles">Meet the collection &nearr;</a></div></div>
    <section class="section-gap"><p class="eyebrow">The things we stand for</p><h2>Care, without the complications.</h2>${steps([['A considered collection.', 'A manageable selection makes room for knowing the detail. Condition, history and suitability matter more than filling a forecourt.'], ['Clarity from the start.', 'Clear prices, useful descriptions and honest answers. In a real sale, preparation, warranty and finance terms would be confirmed in writing.'], ['Here for what comes next.', 'The handover should not be the end of the conversation. Our aftercare pages show how support, maintenance and peace of mind fit together.']])}</section>
    <div class="callout"><div><p class="eyebrow">Designed for the long way home</p><h2>A showroom, not a sales pitch.</h2><p>Browse at your pace. Ask the questions. Imagine your next journey.</p></div><a class="button" href="#/contact">Come and say hello &nearr;</a></div>
    <p class="fine-print section-gap">Dealership Name is a design concept, not a real dealer. Staff, trading history, awards and verified customer ratings are deliberately not claimed. Homepage reviews are illustrative.</p>
  </div>`;
}

const SERVICES = {
  '/mot': {
    eyebrow: 'MOT & servicing', title: 'Look after the everyday journeys.',
    intro: 'From an annual MOT to the next service, a little planned care helps keep the road ahead feeling straightforward.',
    heading: 'Good habits.<br />Better miles.',
    text: 'Choose the right kind of workshop conversation for your car. In a live service, the team would confirm the specification, schedule and price before any work begins.',
    checks: ['MOT enquiries for cars and light passenger vehicles', 'Interim or full servicing to suit mileage and age', 'Oil, filters, brakes and tyre condition discussed', 'Additional work only after a clear explanation and approval'],
    cards: [['MOT testing', 'An annual roadworthiness test, not a substitute for a service. Share your registration and expiry date when enquiring.'], ['Routine servicing', 'A service plan based on the manufacturer schedule, your mileage and the way the car is used.'], ['A specific concern', 'A new noise, a warning light or a change in how it drives? Describe the symptoms so a technician can advise.']],
    questions: [['Can I book a slot online?', 'This demo lets you preview a service enquiry only. It does not show live workshop availability or create a booking.'], ['Will you do extra work without asking?', 'The intended process is to explain findings, costs and options before requesting approval. Always agree the scope and price with the actual workshop.'], ['What should I bring?', 'For a real appointment, bring your service record, locking wheel nut key where applicable, and details of any symptoms or warning lights.']],
    subject: 'MOT & servicing', action: 'Enquire about a service',
  },
  '/warranty': {
    eyebrow: 'Warranty & aftercare', title: 'A little reassurance goes a long way.',
    intro: 'Understand what happens after handover, what to check in a warranty and where to turn if something does not feel right.',
    heading: 'Peace of mind.<br />In plain English.',
    text: 'A useful warranty starts with clear terms. Before a real purchase, you should know the provider, duration, claim limits and exclusions, not just the name of the plan.',
    checks: ['Check covered components and any claim limits', 'Understand wear-and-tear and pre-existing-fault exclusions', 'Keep servicing up to date and retain receipts', 'Contact the provider before authorising a repair'],
    cards: [['Before handover', 'Ask for the full policy wording, start date, excess and claims process. Confirm any cover in writing.'], ['While you own the car', 'Follow the maintenance schedule and do not ignore warning lights. Warranty and routine upkeep serve different purposes.'], ['When you need help', 'Note the symptoms and contact the named provider. Get authorisation before repairs if the policy requires it.']],
    questions: [['Is warranty cover included in this demo?', 'No policy is sold or issued here. Cover duration, provider and benefits must be agreed by a real dealership; this page does not promise a particular plan.'], ['Does a warranty replace my consumer rights?', 'No. A commercial warranty is additional to applicable statutory rights, not a replacement for them. Seek independent advice if you are unsure.'], ['Can I extend the cover?', 'A real provider may offer extensions subject to eligibility, age, mileage and terms. Ask for a quote and the policy wording before deciding.']],
    subject: 'Warranty', action: 'Ask about aftercare',
  },
  '/body-shop': {
    eyebrow: 'Body shop', title: 'Back to looking like yourself.',
    intro: 'From an everyday scuff to paint and panel repairs, a careful assessment is the first step towards putting things right.',
    heading: 'Small details.<br />A proper finish.',
    text: 'Every repair needs a closer look. Share what happened and which panels are affected so a workshop can explain the repair approach, timing and cost.',
    checks: ['Paintwork and bumper scuff enquiries', 'Panel damage and dent assessment', 'Alloy wheel refurbishment enquiries', 'A written scope and estimate before work begins'],
    cards: [['Describe the damage', 'Tell us where it is, how it happened and whether the car is safe to drive. This demo does not accept photo uploads.'], ['Agree the approach', 'A real repairer would inspect the damage and discuss repair versus replacement, paint matching and costs.'], ['Check the finish', 'At collection, review the completed work and ask about any paint aftercare or repair guarantee.']],
    questions: [['Can you price a repair from this form?', 'No. This is a demo enquiry, not a repair estimate. A real body shop needs sufficient detail and usually a physical inspection to quote accurately.'], ['Do you handle insurance repairs?', 'You would need to confirm insurer approval and the repairer process before booking. This preview does not make insurance arrangements.'], ['What if the car is unsafe to drive?', 'Do not drive it. Seek professional recovery advice and contact your insurer or roadside assistance provider where appropriate.']],
    subject: 'Body shop', action: 'Discuss a repair',
  },
  '/breakdown': {
    eyebrow: 'Roadside support', title: 'For the unexpected turn.',
    intro: 'Know who to call and what to check before you need roadside assistance. A calm next step matters when a journey is interrupted.',
    heading: 'A plan for<br />the unplanned.',
    text: 'Roadside assistance varies by provider and policy. Check your cover documents for the right number, recovery limits and any exclusions before setting off.',
    checks: ['Keep your provider contact details somewhere accessible', 'Check whether the vehicle or the person is covered', 'Understand roadside, home-start and recovery limits', 'Confirm start dates, exclusions and any onward-travel benefits'],
    cards: [['Keep yourself safe', 'Follow local road safety guidance. If there is immediate danger or a medical emergency, contact the emergency services.'], ['Contact your provider', 'Use the assistance number on your own policy. Share your location, vehicle registration and a description of the problem.'], ['Understand the next step', 'Your provider can explain attendance, recovery and onward-travel options under your specific cover.']],
    questions: [['Can I request emergency recovery here?', 'No. This website is a non-operational design preview and is not monitored. Use your actual roadside provider or the emergency services if appropriate.'], ['Is breakdown cover included with these cars?', 'No cover is provided in this demo. Any real purchase would need written confirmation of provider, duration, limits and exclusions.'], ['Can I arrange support through the enquiry form?', 'The form only previews a non-urgent enquiry. Nothing is sent or booked. Never rely on it for urgent assistance.']],
    subject: 'Breakdown assistance', action: 'Explore support information',
  },
};

function servicePage(service) {
  return `${header(service.eyebrow, service.title, service.intro)}<div class="shell page-content"><div class="page-split"><div class="service-lead"><p class="eyebrow">Here for the miles ahead</p><h2>${service.heading}</h2><p>${esc(service.text)}</p><ul class="check-list">${service.checks.map((check) => `<li>${esc(check)}</li>`).join('')}</ul></div><div><p class="eyebrow">Straightforward from the start</p><h2>The right help starts with the right details.</h2><p class="quiet">Whether you bought from us or are simply exploring your options, there should be room for a useful conversation. Bring the details, ask the questions and agree the next step before committing.</p><p class="quiet">This is a fictional dealership preview. Services, policies and appointments are not available to purchase or book here.</p><a class="button" href="#/contact?subject=${encodeURIComponent(service.subject)}">${esc(service.action)} &nearr;</a></div></div><section class="section-gap"><h2>A little more clarity.</h2>${steps(service.cards)}</section>${faqs(service.questions)}${cta('Good advice starts with a conversation.', 'Preview a non-urgent enquiry. No message or booking will be submitted.', `#/contact?subject=${encodeURIComponent(service.subject)}`, service.action)}</div>`;
}

function privacyPage() {
  return `${header('Privacy', 'Your details should stay yours.', 'Clear information about this design preview, local interactions and the external services used to display it.')}<div class="shell page-content"><article class="privacy-copy"><p class="eyebrow">Preview information &middot; Updated October 2026</p>
    <h2>This is a design demonstration.</h2><p>Dealership Name is fictional. This preview is not a dealership service, credit broker, valuation provider or emergency contact. No purchases, reservations, finance applications or appointments can be made through it.</p>
    <h2>Enquiries and valuation forms.</h2><p>Form inputs stay in the current browser page. Submitting a form runs local validation and shows a demo notice; it does not send an enquiry or store those details in a database, cookies or browser storage. Please use sample details rather than personal or sensitive information. Entered values are removed when that page is rebuilt or reloaded.</p>
    <h2>Stock filters and finance calculations.</h2><p>Stock filters are reflected in the page URL so the view can be bookmarked or shared. Do not put personal information into the search box. Finance calculations run locally and do not perform credit searches. The browser may retain visited URLs in its history.</p>
    <h2>External images, fonts and links.</h2><p>Photographs load from Unsplash and Pexels and fonts load from Google Fonts. Those providers receive normal browser request information, such as an IP address, when their resources load. External map links open OpenStreetMap in a new tab only when selected. Each provider has its own privacy terms.</p>
    <h2>Hosting and analytics.</h2><p>This template does not add analytics, advertising trackers, enquiry processing or application cookies. The website host may process standard access and security logs under its own policies. This statement only describes the template code, not every function of your browser or hosting platform.</p>
    <h2>Before using this for a real dealership.</h2><p>The operator must replace this preview information with an accurate privacy notice naming the controller, contact details, lawful bases, processors, retention periods, data rights and complaint routes. Any live forms, finance integrations, analytics or cookies must be reviewed before launch.</p>
    <a class="text-link" href="#/">Back to the homepage &nearr;</a></article></div>`;
}

function notFound(vehicle = false) {
  return `${header('A small detour', vehicle ? 'That car is not in the collection.' : 'We have taken a wrong turn.', 'The link may be out of date. There is still plenty to explore.')}<div class="shell page-content"><a class="button" href="${vehicle ? '#/vehicles' : '#/'}">${vehicle ? 'Back to the collection' : 'Back to the homepage'} &nearr;</a></div>`;
}

export function initPages(syncNav) {
  const home = document.querySelector('#home-page');
  const root = document.querySelector('#route-page');
  const route = (initial = false) => {
    const { path, params } = parseRoute(location.hash);
    const isHome = path === '/' || !path.startsWith('/');
    home.hidden = !isHome;
    root.hidden = isHome;
    document.body.classList.toggle('inner-page', !isHome);
    document.querySelectorAll('.nav-links a').forEach((link) => {
      if (link.getAttribute('href') === `#${path}`) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    let title = homeTitle;
    if (!isHome) {
      title = `${routeTitles[path] || 'Page not found'} | Dealership Name`;
      if (path === '/vehicles') {
        root.innerHTML = stockPage(params);
        setupStock(root);
      } else if (path.startsWith('/vehicles/')) {
        const car = STOCK.find((vehicle) => vehicle.id === path.slice('/vehicles/'.length));
        root.innerHTML = car ? vehiclePage(car) : notFound(true);
        title = `${car ? `${car.make} ${car.model}` : 'Vehicle not found'} | Dealership Name`;
      } else if (path === '/finance') {
        root.innerHTML = financePage(params);
        setupFinance(root);
      } else if (path === '/contact') root.innerHTML = contactPage(params);
      else if (path === '/sell') root.innerHTML = sellPage(params);
      else if (path === '/about') root.innerHTML = aboutPage();
      else if (path === '/privacy') root.innerHTML = privacyPage();
      else if (SERVICES[path]) root.innerHTML = servicePage(SERVICES[path]);
      else root.innerHTML = notFound();
      setupForms(root);
      if (!initial) root.querySelector('h1').focus({ preventScroll: true });
    } else {
      root.replaceChildren();
      if (!initial && path === '/') home.querySelector('h1').focus({ preventScroll: true });
    }
    document.title = title;
    syncNav();
    if (!initial) {
      const anchor = isHome && path !== '/' ? document.getElementById(path) : null;
      if (anchor) anchor.scrollIntoView();
      else window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };
  home.querySelector('h1').tabIndex = -1;
  window.addEventListener('hashchange', () => route());
  route(true);
}
