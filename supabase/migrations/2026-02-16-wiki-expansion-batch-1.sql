-- Phase 4: wiki content expansion batch 1
-- Safe to run multiple times.

insert into public.wiki_articles (
  slug,
  title,
  category,
  summary,
  infobox,
  content,
  related_articles,
  tags,
  last_updated
)
values
  (
    'airport-rail-vs-limousine',
    'Incheon Airport to Seoul: AREX vs Limousine Bus',
    'Transport',
    'A practical decision guide for choosing AREX, airport limousine, taxi, or late-night alternatives based on luggage, budget, and arrival time.',
    '{"Best for speed": "AREX Express", "Best for heavy luggage": "Limousine Bus", "Late-night fallback": "Taxi or N-bus + transfer", "Typical destination": "Hongdae, Seoul Station, Gangnam"}'::jsonb,
    '<h2 id="overview">Overview</h2><p>Most first-time visitors overthink airport transfer. The real answer is simple: choose by <strong>arrival time</strong>, <strong>luggage volume</strong>, and <strong>final neighborhood</strong>.</p><h2 id="arex">AREX (Airport Railroad)</h2><p>AREX All Stop is usually the best value. AREX Express is faster to Seoul Station but not always worth it if your final stop is far from Seoul Station.</p><ul><li>Good when you can navigate one or two subway transfers.</li><li>Bad when you carry oversized luggage during rush hour.</li></ul><h2 id="limousine">Airport Limousine Bus</h2><p>Often underrated. If your hotel is near a limousine stop, this is the lowest-stress option.</p><ul><li>Pros: seated ride, luggage storage, fewer transfers.</li><li>Cons: traffic-sensitive during peak times.</li></ul><h2 id="late-night">Late-night arrivals (after subway closing)</h2><p>If you land after the last train, compare flat-fee airport taxi apps and late-night bus routes. <del>Do not discover this at 1:30 AM with 20% battery.</del></p><h2 id="decision">Quick decision rule</h2><p>One backpack: AREX. Two suitcases + tired body: limousine. Arrival after midnight: pre-check taxi fare in app.</p><h2 id="references">References</h2><ol><li id="ref-1">Incheon Airport transportation notices.</li><li id="ref-2">Seoul Metro and AREX schedule pages.</li></ol>',
    array['seoul-subway', 'ktx', 'kakao-t', 't-money'],
    array['airport', 'arex', 'limousine', 'late-night'],
    current_date
  ),
  (
    'airport-arrival-checklist',
    'Korea Arrival Checklist (First 6 Hours)',
    'Practical',
    'A zero-panic checklist for immigration, SIM/eSIM, transport card, cash, and your first meal after landing in Korea.',
    '{"Time window": "First 6 hours", "Priority": "Connectivity -> Transport -> Payment", "Works for": "Short trip and long stay"}'::jsonb,
    '<h2 id="priority">Priority order</h2><p>Get internet first, then transportation, then payment setup. Everything else gets easier after these three.</p><h2 id="step-1">1) Connectivity</h2><p>Activate eSIM/SIM at airport or before departure. Verify data works before leaving terminal Wi-Fi.</p><h2 id="step-2">2) Transport card</h2><p>Buy and top up a T-money card for subway/bus convenience.</p><h2 id="step-3">3) Cash + card</h2><p>Carry a small KRW buffer for transit and small shops. Many places take cards, but having backup cash prevents edge-case stress.</p><h2 id="step-4">4) Navigation apps</h2><p>Install Naver Map and Kakao Map. Google Maps walking is okay, but transit and exits are much better in local apps.</p><h2 id="step-5">5) First meal plan</h2><p>Mark one late-opening restaurant near your accommodation before moving.</p><h2 id="references">References</h2><ol><li id="ref-1">Korea Tourism Organization arrival guides.</li><li id="ref-2">Airport and transport operator official pages.</li></ol>',
    array['sim-card', 't-money', 'naver-map', 'kakao-map', 'currency-exchange'],
    array['arrival', 'checklist', 'first-day', 'newcomer'],
    current_date
  ),
  (
    'trash-and-recycling-korea',
    'Trash and Recycling in Korea (Without Getting Side-Eyed)',
    'Practical',
    'How garbage separation, food waste, and disposal bags work in Korea, especially for foreigners in short-term rentals.',
    '{"Core rule": "Sort correctly", "Most confusion": "Food waste vs regular trash", "Apartment tip": "Check building-specific notices"}'::jsonb,
    '<h2 id="why">Why this matters</h2><p>Trash rules are actively enforced in many neighborhoods. Wrong sorting causes fines or neighbor complaints.</p><h2 id="types">Main categories</h2><ul><li>General waste (paid disposal bags in many districts)</li><li>Recyclables (plastic, paper, can, glass sorted)</li><li>Food waste (separate collection system)</li></ul><h2 id="short-stay">Short-term stay reality</h2><p>Airbnb and officetel setups vary a lot. Always ask host/building manager for exact disposal location and schedule.</p><h2 id="common-mistakes">Common mistakes</h2><ul><li>Throwing food-stained plastic in recyclables.</li><li>Missing district-designated trash bags.</li><li>Ignoring pickup days in low-rise neighborhoods.</li></ul><h2 id="references">References</h2><ol><li id="ref-1">Local district office disposal guidelines.</li><li id="ref-2">Ministry of Environment public sorting materials.</li></ol>',
    array['convenience-store', 'visa-waiver'],
    array['recycling', 'trash', 'housing', 'daily-life'],
    current_date
  ),
  (
    'late-night-transport-seoul',
    'Late-night Transport in Seoul (After Last Train)',
    'Transport',
    'A practical playbook for moving safely after subway closure, including night bus patterns, taxi app strategy, and surge-time avoidance.',
    '{"Subway close": "Roughly around midnight", "Best tools": "Naver Map + Kakao T", "Risk window": "Fri/Sat 00:30-02:30"}'::jsonb,
    '<h2 id="last-train">Know your last train</h2><p>Last train times vary by line and direction. Check your exact station pair before going out.</p><h2 id="n-bus">Night buses</h2><p>Seoul night buses (N-routes) are useful if your destination is near major corridors.</p><h2 id="taxi">Taxi strategy</h2><p>Use app dispatch for clearer pickup and pricing expectations. Roadside hail can be slower in hot nightlife zones.</p><h2 id="safety">Safety basics</h2><ul><li>Share route with a friend.</li><li>Confirm plate number before boarding.</li><li>Avoid dead-phone situations.</li></ul><h2 id="references">References</h2><ol><li id="ref-1">Seoul Transport Operation official route pages.</li><li id="ref-2">Kakao T service notices.</li></ol>',
    array['seoul-subway', 'kakao-t', 'hongdae'],
    array['nightlife', 'taxi', 'bus', 'safety'],
    current_date
  ),
  (
    'papago-and-translation-stack',
    'Translation Stack in Korea: Papago First, Then Others',
    'Apps',
    'A practical language workflow for signs, menus, chats, and support calls using Papago plus backup tools.',
    '{"Default app": "Papago", "Best for": "Korean context translation", "Backup": "Google Translate + camera OCR"}'::jsonb,
    '<h2 id="why-papago">Why Papago is often better in Korea</h2><p>Papago usually handles colloquial Korean and local noun context better, especially in service interactions.</p><h2 id="real-workflow">Real-world workflow</h2><ol><li>Camera OCR for signs/menus.</li><li>Type key phrases before calling support.</li><li>Keep short sentence templates for delivery/taxi messages.</li></ol><h2 id="pitfalls">Pitfalls</h2><p>Literal machine output can sound abrupt. Keep sentences short and polite.</p><h2 id="references">References</h2><ol><li id="ref-1">Naver Papago product documentation.</li><li id="ref-2">User reports across expat communities.</li></ol>',
    array['naver-map', 'kakao-t', 'sim-card'],
    array['papago', 'translation', 'language', 'apps'],
    current_date
  ),
  (
    'delivery-apps-korea',
    'Food Delivery Apps in Korea: What Actually Works for Foreigners',
    'Apps',
    'How to navigate app signup, Korean-only screens, address input, and payment friction in major delivery apps.',
    '{"Common pain": "Signup and address format", "Peak delay": "Rain and late-night", "Fallback": "Call store directly"}'::jsonb,
    '<h2 id="basics">Basics</h2><p>Delivery in Korea is fast, but onboarding can be rough for non-Korean speakers.</p><h2 id="signup">Signup friction</h2><p>Some apps expect local phone verification and Korean address format. Save your address in Korean once and reuse it.</p><h2 id="payment">Payment</h2><p>Card acceptance varies by app/account type. Always keep one backup payment option.</p><h2 id="timing">Timing reality</h2><p>Rain, game nights, and weekends can spike waits. Order earlier than your hunger crisis.</p><h2 id="references">References</h2><ol><li id="ref-1">Major delivery platform help centers.</li><li id="ref-2">Community-reported onboarding issues.</li></ol>',
    array['convenience-store', 'kakao-t', 'coupang'],
    array['delivery', 'food', 'apps', 'payment'],
    current_date
  ),
  (
    'kakao-talk-etiquette',
    'KakaoTalk Etiquette for Newcomers',
    'Culture',
    'Unwritten messaging norms in Korea for group chats, work chats, response timing, and polite tone.',
    '{"Main app": "KakaoTalk", "Tone rule": "Short and polite", "Common mistake": "Overly direct English style"}'::jsonb,
    '<h2 id="context">Context</h2><p>KakaoTalk is social infrastructure in Korea. Tone and timing can matter more than grammar.</p><h2 id="group-chats">Group chats</h2><ul><li>Use concise updates.</li><li>Avoid spamming stickers in formal chats.</li><li>Read room hierarchy in work/school groups.</li></ul><h2 id="reply-speed">Reply speed</h2><p>Fast reply is appreciated in logistics chats. For non-urgent topics, same-day is usually fine.</p><h2 id="politeness">Politeness shortcuts</h2><p>Simple softeners and gratitude phrases improve interaction quality quickly.</p><h2 id="references">References</h2><ol><li id="ref-1">KakaoTalk official feature docs.</li><li id="ref-2">Expat and workplace communication anecdotes.</li></ol>',
    array['papago-and-translation-stack', 'workplace-culture-korea'],
    array['kakao', 'etiquette', 'culture', 'communication'],
    current_date
  ),
  (
    'weather-and-air-quality-korea',
    'Weather and Air Quality in Korea: Seasonal Survival Guide',
    'Practical',
    'What surprises foreigners the most about Korean weather and fine dust, with simple prep by season.',
    '{"Winter": "Dry and cold", "Summer": "Hot, humid, heavy rain", "Air quality": "Check PM alerts daily"}'::jsonb,
    '<h2 id="overview">Overview</h2><p>Korean weather swings are real. Packing for one season only can fail hard.</p><h2 id="spring">Spring</h2><p>Pollen plus fine-dust alerts can overlap. Keep a mask and check PM indicators.</p><h2 id="summer">Summer</h2><p>Heat and humidity are intense. Sudden rainstorms are common.</p><h2 id="winter">Winter</h2><p>Indoor heating is strong, outside air is dry and cold. Layer smart.</p><h2 id="apps">Useful apps</h2><p>Use local weather apps and AirKorea-style PM reporting.</p><h2 id="references">References</h2><ol><li id="ref-1">KMA weather services.</li><li id="ref-2">Air quality public monitoring portals.</li></ol>',
    array['sim-card', 'convenience-store'],
    array['weather', 'air-quality', 'fine-dust', 'season'],
    current_date
  ),
  (
    'banking-for-foreigners-korea',
    'Banking for Foreigners in Korea: What You Can Do Early',
    'Practical',
    'A reality-based guide to opening accounts, handling verification friction, and using online banking as a foreign resident.',
    '{"Best early step": "Prepare ARC + phone + address docs", "Main friction": "Identity verification", "Short trip": "Card + cash hybrid"}'::jsonb,
    '<h2 id="short-vs-long">Short trip vs long stay</h2><p>Tourists usually rely on international cards and cash. Long-stay users should prepare for account setup paperwork.</p><h2 id="requirements">Typical requirements</h2><ul><li>ARC (for residents)</li><li>Korean phone number</li><li>Proof of address or status documents</li></ul><h2 id="tips">Practical tips</h2><p>Visit larger branch offices and go during daytime weekdays for smoother onboarding.</p><h2 id="references">References</h2><ol><li id="ref-1">Major Korean bank onboarding pages.</li><li id="ref-2">Financial supervisory consumer guidance.</li></ol>',
    array['currency-exchange', 'visa-waiver'],
    array['bank', 'account', 'finance', 'long-stay'],
    current_date
  ),
  (
    'mobile-payments-korea',
    'Mobile Payments in Korea: Where They Work and Where They Don''t',
    'Practical',
    'A practical overview of cards, QR, transit cards, and app-based wallets from a foreign visitor perspective.',
    '{"Still dominant": "Physical card", "Transit": "T-money ecosystem", "Watch out": "Small shops and legacy terminals"}'::jsonb,
    '<h2 id="card-first">Card-first reality</h2><p>Korea is card-friendly, but app-wallet interoperability is not universal for foreigners.</p><h2 id="transit">Transit payments</h2><p>T-money remains the easiest consistent method for buses/subways.</p><h2 id="qr">QR and app wallets</h2><p>Some local wallets require local identity and bank linkage.</p><h2 id="edge-cases">Edge cases</h2><p>Street stalls, smaller clinics, and old terminals can break your perfect cashless plan.</p><h2 id="references">References</h2><ol><li id="ref-1">Card network acceptance notices.</li><li id="ref-2">Transit payment operator guides.</li></ol>',
    array['t-money', 'currency-exchange', 'banking-for-foreigners-korea'],
    array['payment', 'card', 'wallet', 'cashless'],
    current_date
  ),
  (
    'hospital-visit-korea',
    'How to Visit a Hospital in Korea (Without Panic)',
    'Practical',
    'A simple hospital flow guide: reservation, registration desk, department routing, payment, and prescription pickup.',
    '{"Emergency": "119", "Walk-in possible": "Many clinics/hospitals", "Language": "English support varies by location"}'::jsonb,
    '<h2 id="clinic-vs-hospital">Clinic vs hospital</h2><p>Small symptoms start at local clinics. Large hospitals are better for specialist care.</p><h2 id="visit-flow">Typical visit flow</h2><ol><li>Reception desk registration</li><li>Department wait</li><li>Doctor consult</li><li>Payment counter</li><li>External pharmacy pickup</li></ol><h2 id="language">Language support</h2><p>Major city hospitals are more likely to provide English support desks.</p><h2 id="references">References</h2><ol><li id="ref-1">National and city-level medical support portals.</li><li id="ref-2">Hospital multilingual service pages.</li></ol>',
    array['pharmacy-in-korea', 'emergency-numbers-korea', 'health-insurance-basics-korea'],
    array['hospital', 'medical', 'clinic', 'health'],
    current_date
  ),
  (
    'pharmacy-in-korea',
    'Pharmacy in Korea: Prescriptions, OTC, and After-hours',
    'Practical',
    'How Korean pharmacies operate, what requires a prescription, and where to look for late-night options.',
    '{"Need prescription": "Many stronger meds", "OTC": "Available with pharmacist guidance", "After-hours": "Limited rotating pharmacies"}'::jsonb,
    '<h2 id="basics">Basics</h2><p>Many medications are dispensed at external pharmacies after clinic/hospital visits.</p><h2 id="otc">OTC expectations</h2><p>Pharmacists can recommend alternatives, but ingredient names may differ from your home country.</p><h2 id="after-hours">After-hours</h2><p>Late-night pharmacy coverage is limited by area. Check in advance for night/weekend duty pharmacies.</p><h2 id="references">References</h2><ol><li id="ref-1">Local government duty-pharmacy listings.</li><li id="ref-2">Pharmaceutical information portals.</li></ol>',
    array['hospital-visit-korea', 'emergency-numbers-korea'],
    array['pharmacy', 'medicine', 'otc', 'health'],
    current_date
  ),
  (
    'emergency-numbers-korea',
    'Emergency Numbers in Korea (Save These Now)',
    'Practical',
    'Critical hotlines and what each number handles, including police, fire/ambulance, and tourist interpretation help.',
    '{"Police": "112", "Fire/Ambulance": "119", "Tourist hotline": "1330"}'::jsonb,
    '<h2 id="core">Core numbers</h2><ul><li><strong>112</strong>: Police</li><li><strong>119</strong>: Fire and ambulance</li><li><strong>1330</strong>: Korea travel helpline and interpretation support</li></ul><h2 id="what-to-say">What to say first</h2><p>State location, issue type, and whether immediate medical/police response is required.</p><h2 id="prep">Pre-save checklist</h2><p>Save contacts, set your accommodation address in notes, and keep one Korean emergency phrase screenshot.</p><h2 id="references">References</h2><ol><li id="ref-1">Korea emergency service official pages.</li><li id="ref-2">KTO tourist helpline documentation.</li></ol>',
    array['hospital-visit-korea', 'late-night-transport-seoul'],
    array['emergency', '112', '119', '1330'],
    current_date
  ),
  (
    'accommodation-contract-basics',
    'Accommodation Contracts in Korea: Deposits, Utilities, Exit Rules',
    'Practical',
    'What foreigners should verify before signing long-stay housing contracts in Korea, including deposit risk and utility terms.',
    '{"High-risk area": "Deposit terms", "Must-check": "Utility and maintenance fees", "Exit": "Notice period"}'::jsonb,
    '<h2 id="deposit">Deposit structure</h2><p>Korean housing often uses substantial deposits. Never rely on verbal promises only.</p><h2 id="fees">Recurring fees</h2><p>Confirm management, internet, gas, water, and electricity terms separately.</p><h2 id="exit">Exit and refund</h2><p>Read notice period, cleaning deductions, and move-out inspection rules carefully.</p><h2 id="references">References</h2><ol><li id="ref-1">Housing dispute guidance resources.</li><li id="ref-2">Local contract advisory services.</li></ol>',
    array['goshiwon-reality', 'visa-waiver'],
    array['housing', 'contract', 'deposit', 'long-stay'],
    current_date
  ),
  (
    'goshiwon-reality',
    'Goshiwon Reality Check for Foreigners',
    'Places',
    'A realistic overview of goshiwon life: who it is good for, hidden tradeoffs, and what to inspect before move-in.',
    '{"Best for": "Short budget stay", "Main tradeoff": "Space and sound insulation", "Key check": "Ventilation and safety"}'::jsonb,
    '<h2 id="fit">Who it fits</h2><p>Goshiwon can be useful for short transitional periods, especially in expensive districts.</p><h2 id="checks">Inspection checklist</h2><ul><li>Window/ventilation</li><li>Shared kitchen cleanliness</li><li>Noise at night</li><li>Fire safety equipment</li></ul><h2 id="tradeoffs">Tradeoffs</h2><p>Low entry cost often means limited privacy and storage.</p><h2 id="references">References</h2><ol><li id="ref-1">Housing community reports.</li><li id="ref-2">District fire safety guidance.</li></ol>',
    array['accommodation-contract-basics', 'hongdae', 'myeongdong'],
    array['goshiwon', 'housing', 'budget', 'seoul'],
    current_date
  ),
  (
    'workplace-culture-korea',
    'Workplace Culture in Korea: Practical Survival Notes',
    'Culture',
    'Actionable norms for meetings, messaging, hierarchy, and after-work culture that foreigners should know early.',
    '{"Biggest gap": "Hierarchy and indirect communication", "Useful habit": "Confirm decisions in writing", "Boundary": "Respectful but clear"}'::jsonb,
    '<h2 id="hierarchy">Hierarchy awareness</h2><p>Titles and seniority can shape communication flow more than many visitors expect.</p><h2 id="meetings">Meetings and follow-ups</h2><p>Summarize action items in chat/email after meetings to reduce ambiguity.</p><h2 id="hoesik">After-work gatherings</h2><p>Participation expectations vary by company. Read team culture, but keep personal boundaries polite and consistent.</p><h2 id="references">References</h2><ol><li id="ref-1">Government workplace adaptation resources.</li><li id="ref-2">Expat professional community experiences.</li></ol>',
    array['kakao-talk-etiquette', 'study-abroad-korea-basics'],
    array['work', 'culture', 'office', 'communication'],
    current_date
  ),
  (
    'study-abroad-korea-basics',
    'Study Abroad in Korea: First Semester Survival',
    'Practical',
    'A first-semester guide covering housing timing, course registration stress, campus apps, and admin paperwork rhythm.',
    '{"Most stressful week": "Course registration", "Must setup": "Campus portal + banking + transport", "Early win": "Buddy network"}'::jsonb,
    '<h2 id="before-arrival">Before arrival</h2><p>Prepare digital copies of passport, admission docs, and insurance details.</p><h2 id="first-weeks">First two weeks</h2><p>Campus onboarding is fast. Set up phone, transport, and portal logins immediately.</p><h2 id="classes">Class registration</h2><p>Have backup course lists because seats can disappear quickly.</p><h2 id="social">Social adaptation</h2><p>Join one club or exchange community early to avoid isolation spiral.</p><h2 id="references">References</h2><ol><li id="ref-1">University international office pages.</li><li id="ref-2">Student community experience threads.</li></ol>',
    array['workplace-culture-korea', 'sim-card', 't-money'],
    array['study', 'university', 'exchange', 'student-life'],
    current_date
  ),
  (
    'health-insurance-basics-korea',
    'Health Insurance Basics in Korea (Short Stay vs Resident)',
    'Practical',
    'A concise distinction between travel insurance expectations and resident-level national insurance scenarios.',
    '{"Short stay": "Travel insurance critical", "Resident": "Check NHIS eligibility and schedule", "Risk": "Out-of-pocket surprise costs"}'::jsonb,
    '<h2 id="short-stay">Short stay visitors</h2><p>Travel insurance is your primary safety net. Confirm emergency and hospitalization coverage.</p><h2 id="residents">Residents</h2><p>Resident eligibility and enrollment timing can vary. Verify status directly with official channels.</p><h2 id="cost">Cost planning</h2><p>Without proper coverage, diagnostics and procedures can become expensive quickly.</p><h2 id="references">References</h2><ol><li id="ref-1">National Health Insurance Service guidance.</li><li id="ref-2">Travel insurance policy documentation best practices.</li></ol>',
    array['hospital-visit-korea', 'emergency-numbers-korea'],
    array['insurance', 'health', 'resident', 'travel'],
    current_date
  )
on conflict (slug) do update
set
  title = excluded.title,
  category = excluded.category,
  summary = excluded.summary,
  infobox = excluded.infobox,
  content = excluded.content,
  related_articles = excluded.related_articles,
  tags = excluded.tags,
  last_updated = excluded.last_updated,
  updated_at = now();
