export interface GuideEntry {
  id: string;
  title: string;
  content: string;
}

export interface GuideGroup {
  id: string;
  title: string;
  description: string;
  entries: GuideEntry[];
}

export interface GuideTab {
  id: string;
  title: string;
  subtitle: string;
  intro: string;
  groups: GuideGroup[];
}

export const guideTabs: GuideTab[] = [
  {
    id: 'start-here',
    title: 'Start Here',
    subtitle: 'What this site is and how to use it without getting lost in 900 tabs.',
    intro:
      'KorWiki is for people who want practical, field-tested help in Korea. Not brochure fluff. Start with this page if your current strategy is "land first, panic later."',
    groups: [
      {
        id: 'how-to-read',
        title: 'How To Read KorWiki Fast',
        description: 'Get answers quickly instead of doom-scrolling.',
        entries: [
          {
            id: 'route-for-first-week',
            title: 'Recommended Reading Route (First Week in Korea)',
            content:
              'Day 0: read <a href="#arrival-playbook">Arrival Playbook</a>. Day 1: read <a href="#transport-core">Transport Core</a> + <a href="#money-core">Money Core</a>. Day 2 onward: jump by pain point. <del>If you read 40 pages before boarding, you are either very prepared or very anxious</del>.',
          },
          {
            id: 'labels-explained',
            title: 'How To Interpret Labels',
            content:
              'Articles mix <strong>Fact</strong>, <strong>Field Note</strong>, <strong>Tip</strong>, and <strong>Warning</strong>. Fact means policy/official rule. Field Note means recurring user-reported friction. Tip and Warning are tactical.',
          },
          {
            id: 'trust-source-order',
            title: 'Source Priority (When Sources Conflict)',
            content:
              'Order of trust: official notices > current provider policy > broad community consensus > single anecdote. If one Reddit comment says "always works," assume it works for exactly one person on exactly one Tuesday.',
          },
        ],
      },
      {
        id: 'core-links',
        title: 'Essential Jump Links',
        description: 'If you only click 5 things, click these.',
        entries: [
          {
            id: 'must-read-links',
            title: 'First-Trip Essential Pages',
            content:
              '<a href="/wiki/naver-map">Naver Map</a>, <a href="/wiki/t-money">T-money</a>, <a href="/wiki/sim-card">SIM/eSIM</a>, <a href="/wiki/currency-exchange">Currency Exchange</a>, <a href="/wiki/kakao-t">KakaoT</a>.',
          },
          {
            id: 'high-friction-shortcuts',
            title: 'High-Friction Shortcut List',
            content:
              'If something fails, jump to: payment declines, phone verification, address mismatch, late-night transport, and medical access. These five account for most traveler panic events.',
          },
        ],
      },
    ],
  },
  {
    id: 'arrival-transport',
    title: 'Arrival & Transport',
    subtitle: 'From airport chaos to smooth subway transfers.',
    intro:
      'Korea transport is excellent once you know the mechanics. Most stress happens in the first 24 hours.',
    groups: [
      {
        id: 'arrival-playbook',
        title: 'Arrival Playbook',
        description: 'Your first two hours after landing.',
        entries: [
          {
            id: 'airport-two-hour-plan',
            title: 'The First 2-Hour Plan',
            content:
              'Sequence: immigration -> SIM/eSIM check -> T-money card -> airport rail/taxi decision. Keep one screenshot of your destination address in Korean. <del>Spell-checking an address at the taxi door is a character-building moment</del>.',
          },
          {
            id: 'airport-transfer-options',
            title: 'Airport Transfer Decision Table',
            content:
              'AREX is cheapest and predictable. Limousine bus is easiest with luggage. Taxi is best when tired, late, or in a group. Use <a href="/wiki/kakao-t">KakaoT</a> if possible.',
          },
          {
            id: 'arrival-document-check',
            title: 'Arrival Document Check',
            content:
              'Keep passport, accommodation name, address in Korean, and emergency contact in one screenshot folder. You want zero digging when someone asks "where are you staying?"',
          },
        ],
      },
      {
        id: 'transport-core',
        title: 'Transport Core',
        description: 'Subway, bus, taxi, KTX in one place.',
        entries: [
          {
            id: 'subway-survival',
            title: 'Subway Survival',
            content:
              'Use <a href="/wiki/naver-map">Naver Map</a> for exits and transfer cars. Late-night last train times matter. Missing one connection can turn 35 minutes into "why am I still outside?" territory.',
          },
          {
            id: 'bus-etiquette',
            title: 'Bus Basics and Etiquette',
            content:
              'Tag in and tag out with T-money. Exit from the rear unless indicated otherwise. Keep backpack low in crowded buses. This one change prevents 80% of accidental shoulder-fights.',
          },
          {
            id: 'taxi-reality',
            title: 'Taxi Reality Check',
            content:
              'Most rides are fine. Night/weekend demand spikes are real. Keep destination in Korean text ready. Short-trip refusals still happen occasionally; app booking reduces this.',
          },
          {
            id: 'intercity-trains',
            title: 'Intercity Trains (KTX/SRT) in Practice',
            content:
              'Reserve early on holiday weekends. Peak-time last-minute seats are often gone. If your schedule is rigid, buy first and plan dinner second.',
          },
        ],
      },
    ],
  },
  {
    id: 'money',
    title: 'Money',
    subtitle: 'Payment, exchange, and banking without expensive mistakes.',
    intro:
      'Korea is card-friendly, but edge cases still hurt travelers. This section is about avoiding silent failure at the register.',
    groups: [
      {
        id: 'money-core',
        title: 'Payment & Exchange',
        description: 'Where money plans fail and how to recover.',
        entries: [
          {
            id: 'card-failure-plan',
            title: 'When Your Foreign Card Randomly Fails',
            content:
              'Have three layers: main card, backup card (different network), and emergency cash. Some kiosks and legacy terminals reject overseas cards unpredictably.',
          },
          {
            id: 'exchange-playbook',
            title: 'Exchange Playbook',
            content:
              'Airport exchange is convenience, not value. City exchanges are usually better. Always compare spread + fee. Keep small KRW bills for transit and small shops.',
          },
          {
            id: 'atm-cash-rules',
            title: 'ATM and Cash Access Rules',
            content:
              'Global ATMs exist, but not all cards work at all machines. If one fails, try a different bank network before assuming your card is dead.',
          },
        ],
      },
      {
        id: 'account-setup',
        title: 'Bank Account Realities',
        description: 'What is easy, what is not, and why.',
        entries: [
          {
            id: 'account-eligibility',
            title: 'Can Visitors Open a Korean Bank Account?',
            content:
              'Usually difficult for short-term visitors. Long-stay residents have better options with ARC and local documents. Plan your remittance flow before arrival if possible.',
          },
          {
            id: 'fee-traps',
            title: 'Fee Trap Checklist',
            content:
              'Watch for dynamic currency conversion prompts, overseas card surcharges, and hidden transfer fees. "Accept conversion?" on terminals usually means "pay more."',
          },
        ],
      },
    ],
  },
  {
    id: 'connectivity-apps',
    title: 'Connectivity & Apps',
    subtitle: 'Digital-first Korea: fast network, app-heavy workflows, fewer excuses.',
    intro:
      'Korea is one of the most digitally developed societies in the world. That is amazing, until one app asks for local verification you do not have.',
    groups: [
      {
        id: 'sim-esim',
        title: 'SIM / eSIM Setup',
        description: 'Stay online from minute one.',
        entries: [
          {
            id: 'sim-vs-esim',
            title: 'SIM vs eSIM Decision',
            content:
              'eSIM is fastest if your phone supports it. Physical SIM is safer if compatibility is unclear. Test activation before leaving airport Wi-Fi range.',
          },
          {
            id: 'number-verification-limits',
            title: 'Phone Verification Limits',
            content:
              'Some services require Korean number identity checks that tourist SIMs may not satisfy. Keep alternative flows ready (desktop web, guest checkout, friend assist).',
          },
          {
            id: 'wifi-fallbacks',
            title: 'Wi-Fi and Signal Fallback Plan',
            content:
              'Save offline maps for your first day. If data fails mid-transit, you still need station exits and your hotel route.',
          },
        ],
      },
      {
        id: 'must-have-apps',
        title: 'Must-Have Apps',
        description: 'Install first, regret less.',
        entries: [
          {
            id: 'navigation-translation',
            title: 'Navigation + Translation Stack',
            content:
              '<a href="/wiki/naver-map">Naver Map</a> + Papago is the baseline combo. One gets you there, one helps you survive menus and forms.',
          },
          {
            id: 'mobility-pay',
            title: 'Mobility + Payment Stack',
            content:
              '<a href="/wiki/kakao-t">KakaoT</a>, local wallet/payment apps, and transit top-up routines save surprising amounts of time.',
          },
          {
            id: 'app-onboarding-order',
            title: 'App Onboarding Order',
            content:
              'Install in this order: map -> translation -> mobility -> payments -> delivery. The earlier apps reduce friction while setting up the later ones.',
          },
        ],
      },
    ],
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle',
    subtitle: 'Food, routines, social norms, and daily frictions people do not tell you before arrival.',
    intro:
      'Lifestyle is where small cultural misses become daily stress. This section keeps those misses small and recoverable.',
    groups: [
      {
        id: 'food-routines',
        title: 'Food and Everyday Eating',
        description: 'How to eat well without translation roulette.',
        entries: [
          {
            id: 'ordering-practical',
            title: 'Ordering Without Panic',
            content:
              'Photos, set menus, and simple Korean phrases go far. Lunch queues move fast; hesitation is normal on day 1 and gone by day 3.',
          },
          {
            id: 'dietary-reality',
            title: 'Dietary Restriction Reality',
            content:
              'Vegetarian/halal options exist but require planning by neighborhood. Do not assume broth is meat-free unless explicitly confirmed.',
          },
          {
            id: 'delivery-etiquette',
            title: 'Delivery and Cafe Etiquette',
            content:
              'Pick-up counters move fast; be ready with order number. In busy cafes, lingering for hours at peak time is tolerated less than you might expect.',
          },
        ],
      },
      {
        id: 'etiquette',
        title: 'Culture & Etiquette',
        description: 'Respect signals that make interactions smoother.',
        entries: [
          {
            id: 'public-space-rules',
            title: 'Public Space Signals',
            content:
              'Queue order, low phone voice in transit, and giving priority seats to elderly passengers are noticed and appreciated.',
          },
          {
            id: 'social-humor',
            title: 'Social Humor Rule',
            content:
              'Light self-deprecating humor works better than loud sarcasm in first interactions. <del>Being funny is optional. Being rude by accident is expensive</del>.',
          },
          {
            id: 'silent-rules',
            title: 'Silent Rules Newcomers Miss',
            content:
              'Queue direction, escalator standing side, and tray return habits vary by place but people expect you to "read the room" quickly. Watch first, move second.',
          },
        ],
      },
    ],
  },
  {
    id: 'accommodations',
    title: 'Accommodations',
    subtitle: 'Hotels, short stays, and long-stay housing risk control.',
    intro:
      'The biggest money mistakes often happen in housing, not flights. Read this before paying deposits.',
    groups: [
      {
        id: 'short-stay',
        title: 'Short-Stay Booking',
        description: 'Hotel/guesthouse selection under uncertainty.',
        entries: [
          {
            id: 'location-over-room',
            title: 'Location Beats Room Size',
            content:
              'Near subway and convenience stores wins over larger rooms in isolated zones. Transit friction compounds every day.',
          },
        ],
      },
      {
        id: 'long-stay',
        title: 'Long-Stay Basics',
        description: 'Deposits, contracts, and monthly cost reality.',
        entries: [
          {
            id: 'deposit-structure',
            title: 'Deposit and Monthly Cost Structure',
            content:
              'Understand deposit, monthly rent, and management fees separately. Ask for utility rules in writing before payment.',
          },
          {
            id: 'contract-redflags',
            title: 'Contract Red Flags',
            content:
              'Unclear maintenance clauses, verbal-only promises, and vague refund terms are warning signs. Get specifics documented.',
          },
          {
            id: 'move-in-checklist',
            title: 'Move-In Checklist',
            content:
              'Photograph all pre-existing issues on day one: walls, bathroom, appliances, locks. Timestamped records save arguments at move-out.',
          },
        ],
      },
    ],
  },
  {
    id: 'health-safety',
    title: 'Health & Safety',
    subtitle: 'What to do when things go wrong at 2 a.m.',
    intro:
      'You probably will not need this section. That is exactly why it should be prepared before you do.',
    groups: [
      {
        id: 'medical-access',
        title: 'Medical Access',
        description: 'Clinics, pharmacies, and emergency care.',
        entries: [
          {
            id: 'clinic-vs-er',
            title: 'Clinic vs Emergency Room',
            content:
              'Use clinics for non-urgent care and ER for urgent conditions. Keep passport and basic medication list ready.',
          },
          {
            id: 'pharmacy-basics',
            title: 'Pharmacy Basics',
            content:
              'Pharmacists are often very helpful for common symptoms. Use translation support for allergies and existing conditions.',
          },
        ],
      },
      {
        id: 'safety-playbook',
        title: 'Safety Playbook',
        description: 'Prevention and incident response.',
        entries: [
          {
            id: 'emergency-numbers',
            title: 'Emergency Contacts',
            content:
              '<strong>112</strong> (police), <strong>119</strong> (fire/ambulance), <strong>1330</strong> (tourist support). Save before you need them.',
          },
          {
            id: 'lost-items',
            title: 'Lost Item Response',
            content:
              'Act fast: station office, taxi company, or local police desk depending on where the item was lost. Time matters more than paperwork perfection.',
          },
          {
            id: 'late-night-safety',
            title: 'Late-Night Safety Routine',
            content:
              'Share live location with one trusted contact, avoid unlicensed rides, and keep your accommodation name in Korean text ready for quick navigation.',
          },
        ],
      },
    ],
  },
  {
    id: 'work-study',
    title: 'Work & Study',
    subtitle: 'Living beyond tourism: campus, office, and admin expectations.',
    intro:
      'If you are in Korea for work or school, operational friction shifts from transport to systems and documents.',
    groups: [
      {
        id: 'work-basics',
        title: 'Workplace Basics',
        description: 'Communication and expectation gaps.',
        entries: [
          {
            id: 'office-culture',
            title: 'Office Culture Snapshot',
            content:
              'Hierarchy and response speed expectations can be different from what many foreigners are used to. Clarify channels and deadlines early.',
          },
        ],
      },
      {
        id: 'study-basics',
        title: 'Study and Campus Life',
        description: 'Academic logistics and daily workflows.',
        entries: [
          {
            id: 'student-admin',
            title: 'Student Admin Habits',
            content:
              'Track deadlines for registration, visa, insurance, and certificates in one calendar. Missing one form can create a long correction loop.',
          },
          {
            id: 'communication-patterns',
            title: 'Communication Patterns That Help',
            content:
              'Clear summaries, quick acknowledgements, and written follow-ups reduce misunderstandings in both office and campus settings.',
          },
        ],
      },
    ],
  },
];

export function findTabByGroupId(groupId: string): GuideTab | null {
  for (const tab of guideTabs) {
    if (tab.groups.some((group) => group.id === groupId)) {
      return tab;
    }
  }
  return null;
}
