export interface WikiArticle {
  slug: string;
  title: string;
  category: 'Transport' | 'Apps' | 'Food' | 'Culture' | 'Places' | 'Practical';
  summary: string;
  infobox?: Record<string, string>;
  content: string;
  relatedArticles: string[];
  tags: string[];
  lastUpdated: string;
}

export const wikiArticles: WikiArticle[] = [
  {
    slug: "naver-map",
    title: "Naver Map",
    category: "Apps",
    summary: "Korea's dominant navigation app. Google Maps is largely useless here — Naver Map is what everyone actually uses for directions, transit, and finding places.",
    infobox: {
      Platform: "iOS / Android",
      Language: "Korean, English",
      Free: "Yes",
      Developer: "Naver Corporation"
    },
    content: `<h2>Why Naver Map Instead of Google Maps?</h2>
<p>In most countries, Google Maps is the default navigation tool. <strong>In Korea, it is not.</strong> Google Maps has severely limited public transit data and often shows incorrect or outdated information for Korean addresses. Naver Map, built by Korea's largest internet company, is what locals actually use — and it's what you should use too.</p>
<p><del>Trying to use Google Maps in Seoul is like trying to drive with a map from 1995. Technically a map, practically useless.</del></p>

<h2>Setting Up English Mode</h2>
<p>Naver Map has an English interface that is decent enough for navigating. After installing the app, go to Settings (설정) and switch the language to English. Search works in English for major landmarks, subway stations, and popular restaurants. However, <strong>many smaller local businesses may only appear if searched in Korean</strong>, so having a Korean friend or Google Translate handy helps.</p>

<h2>Key Features for Foreigners</h2>
<ul>
  <li><strong>Transit directions:</strong> Shows real-time subway arrival times, bus ETAs, and walking segments. Far superior to Google Maps for Korean public transit.</li>
  <li><strong>Walking mode:</strong> Reliable pedestrian routing through alleys and shortcuts.</li>
  <li><strong>Satellite view:</strong> Useful for identifying buildings in dense urban areas.</li>
  <li><strong>Place reviews:</strong> Korean reviews with photos — even without reading Korean, the photos help you see what a restaurant actually looks like inside.</li>
  <li><strong>Nearby search:</strong> Tap the grid icon to find nearby convenience stores, ATMs, pharmacies, and restaurants.</li>
</ul>

<h2>Using Transit Directions</h2>
<p>Tap the directions button and select the transit icon (bus/subway symbol). Enter your destination and Naver Map will show multiple route options with estimated journey times, transfer counts, and costs with your <a href="/wiki/t-money">T-money card</a>. You can filter by fastest route, fewest transfers, or least walking.</p>
<p>The real-time subway tracking is particularly useful — you can see exactly when the next train arrives at your platform without hunting for signage.</p>

<h2>Tips for Best Results</h2>
<ul>
  <li>Search for subway stations by their English name (e.g., "Gangnam Station") — it works reliably.</li>
  <li>For restaurants, search by the Korean name if possible for more accurate results.</li>
  <li>Bookmark (save) your hotel or Airbnb immediately after landing so you can always navigate home.</li>
  <li>The app works offline for basic map viewing but requires data for live transit updates.</li>
</ul>
<p>See also: <a href="/wiki/kakao-map">Kakao Map</a> for an alternative, and <a href="/wiki/seoul-subway">Seoul Metro</a> for full subway guide.</p>`,
    relatedArticles: ["kakao-map", "seoul-subway", "kakao-t"],
    tags: ["apps", "navigation", "maps", "transit", "essential"],
    lastUpdated: "2025-11-01"
  },
  {
    slug: "kakao-map",
    title: "Kakao Map",
    category: "Apps",
    summary: "Kakao's mapping app, strong competitor to Naver Map. Often preferred for real-time road traffic and driving directions. Lighter English support than Naver Map.",
    infobox: {
      Platform: "iOS / Android",
      Language: "Korean (limited English)",
      Free: "Yes",
      Developer: "Kakao Corp"
    },
    content: `<h2>Kakao Map vs Naver Map</h2>
<p>Korea has two dominant mapping apps: <a href="/wiki/naver-map">Naver Map</a> and Kakao Map. For most foreign visitors, Naver Map is the recommended starting point because of its better English interface. However, Kakao Map has advantages in certain situations — particularly for <strong>real-time road traffic</strong> and for users who are already deep in the Kakao ecosystem (KakaoTalk, <a href="/wiki/kakao-t">KakaoT</a>).</p>
<p><del>Choosing between Naver Map and Kakao Map is one of the great debates of Korean digital life, right up there with which chicken delivery app is best.</del></p>

<h2>When to Use Kakao Map</h2>
<ul>
  <li><strong>Driving:</strong> Kakao Map's traffic data is considered best-in-class for Korean roads. If you're renting a car, many Korean drivers prefer Kakao Map or Kakao Navi over other options.</li>
  <li><strong>Kakao ecosystem integration:</strong> If you're sharing a location via KakaoTalk (Korea's dominant messaging app), Kakao Map links open natively and smoothly.</li>
  <li><strong>Finding Kakao-affiliated businesses:</strong> Some smaller local businesses have better data on Kakao Map than Naver Map.</li>
</ul>

<h2>English Language Limitations</h2>
<p>Unlike Naver Map, Kakao Map's English support is limited. The app is primarily designed for Korean users and many UI elements, menus, and reviews are Korean-only. Major subway stations and landmarks can be searched in English, but smaller places will require Korean input.</p>
<p>If you don't read Korean, it's recommended to use <a href="/wiki/naver-map">Naver Map</a> as your primary tool and Kakao Map as a secondary reference for traffic conditions.</p>

<h2>Key Features</h2>
<ul>
  <li><strong>Road view:</strong> Street-level imagery, similar to Google Street View.</li>
  <li><strong>Real-time traffic overlay:</strong> Green/yellow/red traffic conditions updated live.</li>
  <li><strong>Place sharing:</strong> Easily share map pins via KakaoTalk to friends and hotels.</li>
  <li><strong>Indoor maps:</strong> Available for major malls and airports.</li>
</ul>

<h2>Practical Usage for Tourists</h2>
<p>Many travelers find that installing both Naver Map and Kakao Map is worth the storage space. Use Naver Map for daily navigation and transit, and use Kakao Map when sharing locations with locals via KakaoTalk or when checking road conditions before a taxi or bus journey.</p>`,
    relatedArticles: ["naver-map", "kakao-t", "seoul-subway"],
    tags: ["apps", "navigation", "maps", "kakao", "driving"],
    lastUpdated: "2025-10-15"
  },
  {
    slug: "kakao-t",
    title: "KakaoT",
    category: "Transport",
    summary: "Korea's dominant taxi-hailing app. Functions like Uber. Essential for getting around at night, in rain, or anywhere you'd rather not explain your destination in Korean.",
    infobox: {
      Platform: "iOS / Android",
      Language: "Korean, English",
      Payment: "Card / KakaoPay",
      Developer: "Kakao Mobility"
    },
    content: `<h2>What is KakaoT?</h2>
<p>KakaoT (카카오T) is Korea's answer to Uber — a ride-hailing app that lets you book taxis from your phone. It's operated by Kakao Mobility, a subsidiary of Kakao Corp, and dominates the Korean taxi market. Most Korean taxi drivers are registered on the platform.</p>
<p><del>Before KakaoT existed, hailing a taxi in Korean as a foreigner involved a lot of pointing at your phone's Google Maps, hoping, and praying. KakaoT ended that era.</del></p>

<h2>Registering as a Foreigner</h2>
<p>Registering for KakaoT as a foreigner requires one of the following:</p>
<ul>
  <li><strong>Korean phone number:</strong> If you have a local SIM, registration is straightforward with SMS verification.</li>
  <li><strong>Foreign credit card:</strong> Visa and Mastercard are accepted directly in the app, allowing you to register and pay without a Korean number (though some features may be limited).</li>
</ul>
<p>The app itself has an <strong>English interface</strong>, making it usable even if you don't speak Korean. Set your pickup and drop-off points on the map and the app does the rest.</p>

<h2>Types of Taxis Available</h2>
<ul>
  <li><strong>기본택시 (Standard Taxi):</strong> The regular orange or silver taxis you see everywhere. Cheapest option. Base fare ~₩4,800 in Seoul.</li>
  <li><strong>블랙 (Kakao Black):</strong> Premium black sedan service. Higher fare, professional drivers, English-speaking drivers more likely. Good for airport transfers.</li>
  <li><strong>대형 (Large Taxi):</strong> Minivan-style for groups of 5-6 people or extra luggage.</li>
  <li><strong>바이크 (Kakao Bike):</strong> Taxi-bike service for quick solo trips. Not recommended for luggage-heavy travelers.</li>
</ul>

<h2>How to Use</h2>
<ol>
  <li>Open KakaoT and tap the taxi icon.</li>
  <li>Your current location auto-fills as pickup. Adjust if needed.</li>
  <li>Enter your destination (English search works for major places).</li>
  <li>See estimated fare before booking.</li>
  <li>Confirm and wait — driver details and a live map appear when matched.</li>
</ol>

<h2>Payment</h2>
<p>You can pay by credit/debit card registered in the app, or with a <a href="/wiki/t-money">T-money card</a> if paying the driver directly. Cash is also always accepted by Korean taxis. Note that tipping is not expected or customary — see <a href="/wiki/tipping-culture">Tipping Culture</a>.</p>

<h2>Street Hailing</h2>
<p>Korean taxis can still be hailed from the street. A lit orange or green sign on the roof means the taxi is available. In busy areas like <a href="/wiki/myeongdong">Myeongdong</a> or <a href="/wiki/hongdae">Hongdae</a>, late at night it can be faster to use KakaoT rather than compete with the street crowd.</p>`,
    relatedArticles: ["t-money", "seoul-subway", "tipping-culture"],
    tags: ["transport", "taxi", "apps", "kakao", "ridehailing"],
    lastUpdated: "2025-11-10"
  },
  {
    slug: "t-money",
    title: "T-money Card",
    category: "Transport",
    summary: "The rechargeable transit card used on subways, buses, and taxis across Korea. Your single most important purchase upon arrival.",
    infobox: {
      Price: "~₩3,000 (card) + balance",
      Accepted: "Subway, Bus, Taxi, 편의점",
      "Top-up": "Subway stations, CU, GS25, 7-Eleven"
    },
    content: `<h2>What is T-money?</h2>
<p>T-money is a contactless RFID smart card used for paying transit fares across Korea. It works on the <a href="/wiki/seoul-subway">Seoul Metro</a>, all city buses, most taxis, and even as a payment method at major convenience store chains. Think of it as a rechargeable Oyster Card or Octopus Card equivalent.</p>
<p>Getting a T-money card should be the <strong>first thing you do after landing</strong> — before you leave the airport, there are CU and GS25 convenience stores in the arrivals hall where you can buy one immediately.</p>

<h2>Where to Buy</h2>
<ul>
  <li><strong>Convenience stores:</strong> CU, GS25, 7-Eleven, Emart24 all sell T-money cards for approximately ₩3,000. This is the card itself with no balance — you top up separately.</li>
  <li><strong>Subway station ticket machines:</strong> Marked as T-money machines or transportation card machines. Available in English.</li>
  <li><strong>Airport:</strong> CU stores inside Incheon Airport arrivals sell them.</li>
</ul>
<p><del>The card design options at convenience stores range from plain functional to embarrassingly cute character editions. There is no wrong choice.</del></p>

<h2>How to Top Up (Charge)</h2>
<ul>
  <li><strong>Subway station machines:</strong> All Seoul Metro stations have card top-up machines at entrances. Select English, insert cash (₩1,000 minimum), and tap your card to load.</li>
  <li><strong>Convenience store counter:</strong> Hand the cashier your card and the amount you want to add. They'll charge it at the register.</li>
  <li><strong>Auto-charge:</strong> Link T-money to a Korean bank account for automatic top-up when balance drops below a set threshold (requires Korean bank account).</li>
</ul>
<p>Recommended starting balance: ₩30,000–₩50,000 for a week-long trip.</p>

<h2>Discounts vs Cash Fares</h2>
<p>Using T-money on buses and subways gives you a <strong>₩100–₩150 discount</strong> per ride compared to cash or single-trip tickets. On a week-long trip with multiple daily rides, this adds up meaningfully. More importantly, T-money enables seamless transfers: within 30 minutes of tapping off one transit vehicle, your next tap gets a transfer discount (sometimes free).</p>

<h2>Using T-money Beyond Transit</h2>
<p>T-money works as a payment card at:</p>
<ul>
  <li>CU, GS25, 7-Eleven, and Emart24 convenience stores</li>
  <li>Some McDonald's and fast food chains</li>
  <li>Most Korean taxis (tap on the card reader near the driver)</li>
</ul>

<h2>Refunds</h2>
<p>Unused T-money balance can be refunded at any subway station's T-money machine or at convenience stores — a ₩500 service fee applies. The card itself is not refunded (it's a keepsake at this point).</p>`,
    relatedArticles: ["seoul-subway", "kakao-t", "ktx", "convenience-store"],
    tags: ["transport", "payment", "transit card", "essential", "subway", "bus"],
    lastUpdated: "2025-10-20"
  },
  {
    slug: "seoul-subway",
    title: "Seoul Metro (지하철)",
    category: "Transport",
    summary: "One of the world's best subway systems. 9 main lines plus suburban lines cover the entire Seoul metropolitan area. Clean, punctual, and remarkably cheap.",
    infobox: {
      Lines: "9 main + suburban",
      "Operating hours": "5:30am – midnight",
      Fare: "₩1,400~₩2,150 (T-money)",
      Language: "Korean, English, Chinese, Japanese"
    },
    content: `<h2>Overview</h2>
<p>The Seoul Metropolitan Subway is consistently ranked among the best urban transit systems in the world. With over 9 main lines and multiple suburban extensions, it connects virtually every major neighborhood, tourist attraction, and commercial district in Seoul and the wider metropolitan area.</p>
<p>The system is clean, air-conditioned, safe, and runs with impressive punctuality. For foreign visitors, it's the <strong>fastest, cheapest, and most reliable way to get around</strong> Seoul.</p>

<h2>Lines and Key Destinations</h2>
<ul>
  <li><strong>Line 1 (Dark Blue):</strong> Incheon ↔ Seoul Station ↔ Cheongnyangni. Connects major northern districts.</li>
  <li><strong>Line 2 (Green, circular):</strong> The workhorse line. Gangnam, Hongdae (<a href="/wiki/hongdae">Hongik Univ.</a>), Sinchon, Ewha, City Hall. Most tourists spend half their time on Line 2.</li>
  <li><strong>Line 3 (Orange):</strong> Gyeongbokgung (<a href="/wiki/gyeongbokgung">palace</a>), Anguk, Apgujeong, Express Bus Terminal.</li>
  <li><strong>Line 4 (Sky Blue):</strong> <a href="/wiki/myeongdong">Myeongdong</a>, Seoul Station, Dongdaemun History & Culture Park.</li>
  <li><strong>Line 5-9:</strong> Cover eastern, western, and southern Seoul including Yeouido, Gimpo Airport, and Gangnam districts.</li>
  <li><strong>AREX (Airport Railroad):</strong> Direct line from Incheon International Airport to Seoul Station. Express (~43 min) or all-stop (~66 min). Runs approximately 5:20am–midnight.</li>
</ul>

<h2>Fares and Payment</h2>
<p>The base fare with a <a href="/wiki/t-money">T-money card</a> is <strong>₩1,400</strong> for distances under 10km, increasing slightly for longer trips (up to ₩2,150 for 50km+). Cash single-trip tickets cost ₩100 more and require a ₩500 deposit returned at the exit gate.</p>
<p>Children under 6 ride free; youth and senior discounts apply with registered cards.</p>

<h2>Navigating the System</h2>
<p>All stations have signage in Korean, English, Chinese, and Japanese. Platform screens show next train arrival times. The <a href="/wiki/naver-map">Naver Map</a> app integrates real-time subway data and is the recommended way to plan routes.</p>
<p><del>The subway map looks terrifying the first time you see it. Twenty minutes later you'll be navigating it like you've lived in Seoul for years. Trust the process.</del></p>

<h2>Key Stations to Know</h2>
<ul>
  <li><strong>Seoul Station:</strong> Main hub. KTX, AREX to airport, multiple subway lines.</li>
  <li><strong>Gangnam:</strong> Upscale shopping district, Line 2.</li>
  <li><strong>Hongik University:</strong> Hongdae nightlife area, Line 2 + AREX.</li>
  <li><strong>Myeongdong:</strong> Shopping and street food, Line 4.</li>
  <li><strong>Gyeongbokgung:</strong> Palace entrance, Line 3.</li>
  <li><strong>Dongdaemun:</strong> Night markets, fashion, Lines 1/2/4/5.</li>
</ul>

<h2>Etiquette</h2>
<ul>
  <li>Priority seats (marked in pink/blue) are reserved for elderly, pregnant, and disabled passengers. Do not sit in them even if empty.</li>
  <li>Eating strong-smelling food is frowned upon.</li>
  <li>Phone calls are discouraged — use earphones for media.</li>
  <li>Stand on the right on escalators; walk on the left.</li>
</ul>`,
    relatedArticles: ["t-money", "ktx", "naver-map", "arex"],
    tags: ["transport", "subway", "metro", "transit", "essential", "Seoul"],
    lastUpdated: "2025-11-05"
  },
  {
    slug: "ktx",
    title: "KTX (Korea Train Express)",
    category: "Transport",
    summary: "Korea's high-speed rail network. Seoul to Busan in under 2.5 hours. Fast, comfortable, and the best way to reach other major Korean cities.",
    infobox: {
      Speed: "Up to 305 km/h",
      "Seoul-Busan": "~2h 15min",
      Booking: "KORAIL website / KorailPass app",
      "Main stations": "Seoul, Yongsan, Osong, Daejeon, Dongdaegu, Busan"
    },
    content: `<h2>What is KTX?</h2>
<p>KTX (Korea Train Express) is Korea's high-speed rail network, operated by KORAIL (Korea Railroad Corporation). Launched in 2004, the system connects Seoul with Busan, Mokpo, Yeosu, Gangneung, and other major cities at speeds up to 305 km/h. It is <strong>the fastest way to travel between Korean cities</strong> and is consistently on time.</p>

<h2>Key Routes and Travel Times</h2>
<ul>
  <li><strong>Seoul → Busan:</strong> ~2h 15min (express KTX) or ~2h 40min (standard stops)</li>
  <li><strong>Seoul → Daejeon:</strong> ~50min</li>
  <li><strong>Seoul → Gyeongju:</strong> ~2h (via Singyeongju Station)</li>
  <li><strong>Seoul → Mokpo:</strong> ~2h 30min</li>
  <li><strong>Seoul → Gangneung:</strong> ~2h (KTX-Eum, newer line)</li>
</ul>
<p><del>Taking KTX from Seoul to Busan is faster than flying once you account for airport check-in and security. The train also drops you in the city center, not a field 40 minutes away from everything.</del></p>

<h2>Booking for Foreigners</h2>
<p>There are three main ways to book KTX tickets:</p>
<ul>
  <li><strong>KORAIL website (letskorail.com):</strong> English interface available. Pay with international Visa/Mastercard. Book up to 1 month in advance.</li>
  <li><strong>KorailPass app:</strong> Download on iOS/Android. User-friendly interface, supports English.</li>
  <li><strong>At the station:</strong> Ticket windows and machines at Seoul Station and major KTX stations have English options. Counter staff often speak basic English.</li>
  <li><strong>KORAIL Pass:</strong> A multi-day rail pass for foreigners — covers unlimited KTX travel for 2/3/5 days. Sold online or at main stations. Good value if traveling between multiple cities.</li>
</ul>

<h2>Seat Classes</h2>
<ul>
  <li><strong>일반실 (Standard):</strong> Comfortable, airline economy-style seats. Fine for most journeys.</li>
  <li><strong>특실 (First Class / Special):</strong> Wider seats, more legroom, complimentary drink service. Worth it for trips over 2 hours.</li>
</ul>

<h2>Main Departure Stations in Seoul</h2>
<p><strong>Seoul Station</strong> is the main hub on Line 1/4 of the <a href="/wiki/seoul-subway">subway</a> and connected to <a href="/wiki/sim-card">Incheon Airport</a> via AREX. <strong>Yongsan Station</strong> is another common departure point on the Honam/Jeolla line (for Mokpo, Yeosu). Check which station your train departs from when booking.</p>

<h2>Tips</h2>
<ul>
  <li>Book in advance, especially for weekends and public holidays — trains sell out.</li>
  <li>Bring snacks or buy from the onboard cart; no full meal service on standard KTX.</li>
  <li>Luggage racks are at the end of each car — overhead bins are small.</li>
  <li>Trains depart exactly on schedule. Do not cut it close.</li>
</ul>`,
    relatedArticles: ["seoul-subway", "t-money", "busan"],
    tags: ["transport", "train", "KTX", "high-speed rail", "Busan", "intercity"],
    lastUpdated: "2025-10-28"
  },
  {
    slug: "currency-exchange",
    title: "Currency Exchange",
    category: "Practical",
    summary: "Korean Won exchange rates vary dramatically by location. The airport is the worst place. Myeongdong is the best. Here's what you need to know.",
    infobox: {
      Currency: "Korean Won (₩, KRW)",
      Bills: "₩1,000 / ₩5,000 / ₩10,000 / ₩50,000",
      "Best rates": "Myeongdong private changers",
      "Airport rate": "~3-5% worse"
    },
    content: `<h2>Korean Currency Basics</h2>
<p>Korea uses the Korean Won (₩, KRW). Bills come in ₩1,000, ₩5,000, ₩10,000, and ₩50,000 denominations. Coins are ₩10, ₩50, ₩100, and ₩500 — though coins are increasingly irrelevant as Korea goes cashless.</p>
<p>As of 2025, rough reference rates: 1 USD ≈ ₩1,300–1,400 KRW; 1 EUR ≈ ₩1,400–1,500 KRW; 1 GBP ≈ ₩1,600–1,700 KRW. Always check live rates before traveling.</p>

<h2>Where to Exchange — Best Rates</h2>
<h3>Myeongdong Private Exchange Shops</h3>
<p>The private money changers in <a href="/wiki/myeongdong">Myeongdong</a> consistently offer the <strong>best exchange rates in Korea</strong> for major currencies (USD, EUR, JPY, CNY, HKD). These licensed shops compete aggressively and post rates on boards outside. Look for shops with "환전" (currency exchange) signage. Bring cash in your home currency — USD and EUR get the best rates everywhere.</p>
<p><del>The Myeongdong money changers are so competitive that they'll sometimes wave at you from the street like you're their long-lost friend. You kind of are — you're giving them business.</del></p>

<h3>Hana Bank Exchange Centers</h3>
<p>Hana Bank operates dedicated foreign exchange centers with competitive rates, including locations at major tourist areas. Rates are slightly lower than the best Myeongdong shops but more consistent and can handle less common currencies.</p>

<h2>Airport Exchange — Avoid If Possible</h2>
<p>Incheon Airport has exchange booths operated by Hana Bank and others. The rates are typically <strong>3–5% worse</strong> than Myeongdong. If you need Won immediately on arrival, exchange only a small amount (₩50,000–₩100,000) at the airport to cover immediate transport costs, then exchange the bulk in the city.</p>

<h2>ATMs for Foreign Cards</h2>
<p>Shinhan Bank's <strong>Global ATMs</strong> (orange machines labeled "Global ATM") accept most foreign Visa, Mastercard, and Maestro cards. Found at major subway stations and city branches. Withdrawal limit is typically ₩700,000 per transaction. Your home bank's foreign transaction fee applies.</p>
<ul>
  <li><strong>7-Eleven ATMs:</strong> Often accept foreign cards in a pinch.</li>
  <li><strong>Korea Exchange Bank (KEB) Hana ATMs:</strong> Widely available, good foreign card acceptance.</li>
  <li><strong>Post Office ATMs:</strong> Excellent foreign card compatibility.</li>
</ul>
<p>Note: Regular Korean bank ATMs (not labeled Global) often reject foreign cards entirely.</p>

<h2>Should You Bring Cash or Use Cards?</h2>
<p>Korea is rapidly going cashless — credit cards are accepted at most restaurants, convenience stores, and shops. However, <strong>always carry some cash</strong> (₩50,000–₩100,000) for traditional markets, small neighborhood restaurants, street food, and emergencies. Some smaller establishments are still cash-only.</p>`,
    relatedArticles: ["sim-card", "convenience-store", "myeongdong"],
    tags: ["money", "exchange", "won", "practical", "cash", "ATM"],
    lastUpdated: "2025-11-03"
  },
  {
    slug: "sim-card",
    title: "SIM Card & eSIM",
    category: "Practical",
    summary: "Korea has world-class 5G coverage. Tourist SIM cards and eSIMs are easy to get at Incheon Airport. Set this up before leaving the arrivals hall.",
    infobox: {
      Carriers: "SKT, KT, LG U+",
      "Airport pickup": "Incheon T1 & T2",
      eSIM: "Available via Airalo, KT",
      "Data-only": "₩33,000 / 30 days"
    },
    content: `<h2>Getting Connected in Korea</h2>
<p>Korea has excellent 5G and LTE coverage across the country — including subway tunnels, underground malls, and rural mountainous areas that would have zero signal in most countries. Getting a local SIM or eSIM is straightforward and cheap.</p>

<h2>SIM Cards at Incheon Airport</h2>
<p>All three major Korean carriers have booths in the arrivals hall of both Terminal 1 and Terminal 2 at Incheon International Airport:</p>
<ul>
  <li><strong>SKT (SK Telecom):</strong> Korea's largest carrier. Widest rural coverage.</li>
  <li><strong>KT (KT Corporation):</strong> Strong city coverage, good tourist SIM options.</li>
  <li><strong>LG U+:</strong> Often cheapest option, solid urban coverage.</li>
</ul>
<p>Staff at airport booths typically speak English. You'll need your passport. SIM setup takes about 10 minutes.</p>
<p><del>The airport SIM booths close around 10pm. If you land late at night, eSIM is your friend.</del></p>

<h2>Tourist SIM Options</h2>
<ul>
  <li><strong>Data-only SIM:</strong> Starting around ₩33,000 for 30 days of unlimited data (speed may throttle after daily limit). Cannot make local calls but works fine for KakaoTalk, messaging apps, and all data needs.</li>
  <li><strong>Voice + Data SIM:</strong> Adds local calling capability. Around ₩44,000–₩55,000 for 30 days. Useful if you need to make reservations by phone.</li>
  <li><strong>Short-term options:</strong> 3-day and 7-day data SIMs available from around ₩15,000–₩22,000.</li>
</ul>

<h2>eSIM Options</h2>
<p>For phones that support eSIM (most flagship phones from 2019 onward), you can activate connectivity before you land:</p>
<ul>
  <li><strong>Airalo:</strong> Most popular eSIM marketplace. Korea data plans from ~$10 for 1GB to ~$30 for 20GB. Install the Airalo app, purchase, and activate in under 5 minutes.</li>
  <li><strong>KT eSIM:</strong> KT's own tourist eSIM, purchasable online or at the airport. Reliable and often includes voice capabilities.</li>
  <li><strong>Roaming via home carrier:</strong> Increasingly affordable in some countries but typically more expensive than local options for Korea.</li>
</ul>

<h2>Pocket WiFi Rental</h2>
<p>Pocket WiFi (portable WiFi router) rentals are available at Incheon Airport for groups traveling together. Typically ₩8,000–₩12,000 per day. One device can share WiFi with multiple people. Return at the airport on departure. Less convenient than individual SIMs but cost-effective for larger groups.</p>

<h2>Free WiFi Alternatives</h2>
<p>Every subway station has free WiFi. Most cafes and restaurants offer it too. If your phone is unlocked and supports eSIM, getting even a small data plan is recommended — <a href="/wiki/naver-map">Naver Map</a>'s live transit data and <a href="/wiki/kakao-t">KakaoT</a> need an internet connection to work properly.</p>`,
    relatedArticles: ["naver-map", "kakao-t", "currency-exchange"],
    tags: ["connectivity", "SIM", "eSIM", "data", "phone", "practical", "airport"],
    lastUpdated: "2025-11-08"
  },
  {
    slug: "convenience-store",
    title: "Convenience Store (편의점)",
    category: "Food",
    summary: "Korean convenience stores are on a different level. Open 24/7, selling hot food, providing banking services, and stocking genuinely good snacks. A cultural institution.",
    infobox: {
      "Major chains": "CU, GS25, 7-Eleven, Emart24",
      Open: "24/7",
      ATM: "Yes (Global ATM available)",
      "Hot food": "Yes (ramyeon station, microwave)"
    },
    content: `<h2>The Korean Convenience Store Experience</h2>
<p>If you've been to a convenience store in the US, UK, or Australia — forget everything you know. Korean 편의점 (pyeonuijeom) are a different category of establishment. They are everywhere (there are over 50,000 nationwide), they are open 24 hours a day 365 days a year, and they serve genuinely good food.</p>
<p><del>Korean convenience stores have caused many travelers to question why their home country even has restaurants.</del></p>

<h2>The Four Main Chains</h2>
<ul>
  <li><strong>CU:</strong> Most common chain (formerly FamilyMart Korea). Strong food selection, frequent limited-edition collaborations.</li>
  <li><strong>GS25:</strong> Close second in ubiquity. Known for good private-label products and seasonal items.</li>
  <li><strong>7-Eleven Korea:</strong> Familiar brand, Korean-operated, notably different from international 7-Elevens.</li>
  <li><strong>Emart24:</strong> Run by Shinsegae Group. Newer and growing, often has slightly different product mix.</li>
</ul>

<h2>Must-Try Foods</h2>
<ul>
  <li><strong>삼각김밥 (Triangle Kimbap):</strong> Rice triangle with various fillings (tuna mayo, bulgogi, kimchi). ₩1,300–₩2,000. The ultimate Korean snack. Unwrap following the numbered tabs on the packaging.</li>
  <li><strong>컵라면 (Cup Ramen):</strong> Hot water dispensers at every counter — pour it yourself. Korea has a ridiculous range of flavors including premium ones unavailable elsewhere. ₩900–₩1,800.</li>
  <li><strong>핫바 / 어묵 (Hot Bar / Fish Cake):</strong> Skewered snacks in warming drawers near the counter. ₩1,000–₩2,000.</li>
  <li><strong>찐만두 (Steamed Dumplings):</strong> In the hot food case. Fresh, cheap, excellent.</li>
  <li><strong>붕어빵 (Fish-shaped Bread):</strong> Seasonal (winter), filled with red bean paste or custard. Look for street vendors outside, sometimes coordinated with convenience stores.</li>
  <li><strong>편의점 도시락 (Bento Boxes):</strong> Complete meals — rice, meat, vegetables. Microwave available. ₩3,500–₩6,000.</li>
</ul>

<h2>1+1 and 2+1 Deals</h2>
<p>Look for bright stickers saying <strong>1+1</strong> (buy one get one) or <strong>2+1</strong> (buy two get one). These rotate weekly and are legitimately good deals. Popular items go fast. The cashier will hand you your free item — just remember to take it.</p>

<h2>Services Beyond Food</h2>
<ul>
  <li><strong>Global ATMs:</strong> Most 7-Eleven and CU locations have ATMs that accept foreign cards.</li>
  <li><strong>Printing:</strong> Self-service printers (copiers, document printing, photo printing).</li>
  <li><strong>Ticket pickup:</strong> Collect tickets for concerts, shows, and some transport bookings.</li>
  <li><strong>Bill payment:</strong> Locals pay utility bills, phone bills, and more at the counter.</li>
  <li><strong>Phone charging:</strong> Some locations have charging lockers for rent.</li>
  <li><strong>T-money top-up:</strong> Hand your <a href="/wiki/t-money">T-money card</a> to the cashier with cash to load balance.</li>
</ul>

<h2>Eating In-Store</h2>
<p>Most Korean convenience stores have a small seating area inside or outside. It's completely normal to buy hot ramen and eat it at the in-store tables. There's usually a waste bin and recycling station nearby.</p>`,
    relatedArticles: ["t-money", "korean-bbq", "myeongdong"],
    tags: ["food", "convenience store", "CU", "GS25", "snacks", "budget", "24h"],
    lastUpdated: "2025-10-30"
  },
  {
    slug: "korean-bbq",
    title: "Korean BBQ (고기구이)",
    category: "Food",
    summary: "Grilling meat at your own table, surrounded by side dishes, with lettuce wraps and soju. Korean BBQ is a social dining experience unlike any other — and it's one of the highlights of any Korea trip.",
    infobox: {
      "Must-try": "삼겹살, 갈비, 목살",
      "Typical cost": "₩15,000–₩30,000/person",
      "Banchan refills": "Free",
      Tip: "None expected"
    },
    content: `<h2>What is Korean BBQ?</h2>
<p>고기구이 (gogigui) — literally "grilled meat" — refers to the distinctly Korean dining style where raw meat is brought to your table and cooked on a built-in charcoal or gas grill. It's a social, interactive experience meant to be shared with friends or family over a long, leisurely meal.</p>
<p>Korean BBQ restaurants range from budget neighborhood spots to premium Wagyu beef establishments. A solid meal at a standard local restaurant runs ₩15,000–₩20,000 per person; upscale charcoal galbi can be ₩50,000+.</p>

<h2>Essential Meats to Know</h2>
<ul>
  <li><strong>삼겹살 (Samgyeopsal):</strong> Thick pork belly slices, unmarinated. The most popular and iconic Korean BBQ cut. Fatty, rich, and incredible with garlic and kimchi.</li>
  <li><strong>목살 (Moksal):</strong> Pork neck/collar. Slightly leaner than samgyeopsal, very flavorful. Often overlooked but excellent.</li>
  <li><strong>갈비 (Galbi):</strong> Beef short ribs, typically marinated in soy, sugar, garlic, and Asian pear. Sweet, tender, and deeply satisfying.</li>
  <li><strong>불고기 (Bulgogi):</strong> Thinly sliced marinated beef, cooked on a curved pan rather than grill grates. Sweeter flavor profile.</li>
  <li><strong>항정살 (Hangjeongsal):</strong> Pork jowl meat. Slightly chewy, very flavorful, often a specialty cut at premium shops.</li>
</ul>
<p><del>You will not be able to choose just one. Order two kinds minimum or you will regret it deeply.</del></p>

<h2>How to Eat: The Full Experience</h2>
<ol>
  <li><strong>Banchan arrives first:</strong> Side dishes — kimchi, bean sprouts, seasoned spinach, picked radish, pajeon (green onion pancake) — fill the table. These are free and refillable. Just ask "더 주세요" (deo juseyo = "more please") or wave at the staff.</li>
  <li><strong>Meat goes on the grill:</strong> Staff will often grill for you initially, especially if you look uncertain. At many places you grill yourself — watch the edges, flip when the meat has changed color halfway up.</li>
  <li><strong>Scissors and tongs:</strong> Korean BBQ restaurants use scissors to cut meat on the grill. Staff will cut it for you or hand you scissors to do it yourself. This is completely normal.</li>
  <li><strong>Make a 쌈 (ssam):</strong> Place a piece of lettuce or perilla leaf in your palm. Add rice, a piece of grilled meat, raw garlic, ssamjang (dipping paste), and any banchan you like. Fold and eat in one bite if you can manage it.</li>
  <li><strong>Dipping sauces:</strong> Sesame oil with salt is traditional for samgyeopsal. Ssamjang (fermented bean paste + gochujang mix) for wraps.</li>
</ol>

<h2>Dining Etiquette</h2>
<ul>
  <li>Let the eldest person at the table eat first.</li>
  <li>Don't pour your own drink — pour for others and they will pour for you.</li>
  <li>Accept drinks with two hands or right hand supported by left when receiving from an elder.</li>
  <li>Tipping is not practiced in Korea — see <a href="/wiki/tipping-culture">Tipping Culture</a>.</li>
</ul>

<h2>Where to Go</h2>
<p><a href="/wiki/hongdae">Hongdae</a> and Mapo-gu are famous for galmaegi (pork skirt steak) restaurants. <a href="/wiki/myeongdong">Myeongdong</a> has tourist-oriented BBQ but prices are inflated. For authentic local experience, explore neighborhoods like Mapo, Noryangjin, or Mangwon.</p>`,
    relatedArticles: ["tipping-culture", "norebang", "myeongdong", "hongdae"],
    tags: ["food", "BBQ", "samgyeopsal", "galbi", "dining", "must-try"],
    lastUpdated: "2025-10-25"
  },
  {
    slug: "tipping-culture",
    title: "Tipping Culture",
    category: "Culture",
    summary: "Korea does not have a tipping culture. Do not tip. It is not expected, not customary, and can cause confusion or awkwardness.",
    infobox: {
      Restaurant: "No tip expected",
      Taxi: "No tip",
      Hotel: "No tip (service charge included at 5-stars)",
      Delivery: "No tip"
    },
    content: `<h2>The Simple Answer</h2>
<p>Korea does not have a tipping culture. <strong>Do not tip.</strong> This applies to restaurants, cafes, taxis, hotels, tour guides, hair salons, and essentially every service industry in Korea.</p>
<p>Unlike the United States where tipping is functionally mandatory, or Europe where it's a nice gesture, in Korea tipping can cause genuine confusion or even mild offense — it can imply the person needs charity or doesn't receive fair wages (Korean service workers generally receive full minimum wage by law, without the sub-minimum "tipped wage" classification common in the US).</p>
<p><del>Attempting to leave a tip in Korea will result in staff chasing you out the door to return your money. This is a real thing that happens. Don't do it to them.</del></p>

<h2>By Situation</h2>
<h3>Restaurants</h3>
<p>No tip, ever. This includes casual restaurants, <a href="/wiki/korean-bbq">Korean BBQ</a> spots, fine dining, and everything in between. Pay exactly what's on the bill. Some upscale international hotels may add a 10% service charge automatically — this is noted on the menu and is not an additional gratuity.</p>

<h3>Taxis</h3>
<p>Pay the meter fare and nothing more. <a href="/wiki/kakao-t">KakaoT</a> and other apps show the fare and you pay exactly that amount. Rounding up slightly (e.g., paying ₩10,000 on an ₩9,800 fare and saying "keep the change") is acceptable in spirit but not expected and rarely practiced.</p>

<h3>Hotels</h3>
<p>Standard Korean hotels: no tip for housekeeping, bellhops, or concierge. International luxury hotels (5-star foreign chain brands) may have service charges built into the bill. The occasional doorman or porter at a very high-end hotel who has been particularly helpful: a small token like ₩5,000 is fine but still not expected.</p>

<h3>Tour Guides</h3>
<p>Tipping tour guides is becoming more common as Korea's tourism industry grows and guides understand international visitor expectations. A tip is appreciated but not required. If a tour guide has been exceptional, ₩10,000–₩20,000 as a group tip is a kind gesture.</p>

<h3>Delivery Services</h3>
<p>Delivery apps like Baemin, Coupang Eats, and Yogiyo have no tip function. Delivery workers receive no tips. Do not try to hand a tip to the delivery person — they will be confused.</p>

<h2>Why This Matters for Visitors</h2>
<p>Many visitors from tipping cultures feel awkward not tipping. Resist the urge. The service you receive in Korea at a good restaurant or hotel is professional precisely because service workers are fairly compensated. You are not getting worse service because you don't tip — Korean hospitality culture (정, jeong) means service is given with genuine care regardless.</p>`,
    relatedArticles: ["korean-bbq", "kakao-t", "norebang"],
    tags: ["culture", "etiquette", "tipping", "practical", "money"],
    lastUpdated: "2025-10-18"
  },
  {
    slug: "norebang",
    title: "Norebang (노래방)",
    category: "Culture",
    summary: "Private karaoke rooms rented by the hour. One of the most beloved Korean nightlife traditions. Not a bar where you perform in front of strangers — a private room just for your group.",
    infobox: {
      Type: "Private room karaoke",
      Cost: "₩10,000–₩20,000/hour",
      "Drink service": "Available",
      "Coin Norebang": "₩500–₩1,000/song (self-service)"
    },
    content: `<h2>What is Norebang?</h2>
<p>Norebang (노래방, literally "song room") is private karaoke — you rent a room for your group and sing freely without any audience beyond your own friends. This is fundamentally different from Western karaoke bars where you perform on a stage in front of strangers. In norebang, the room is yours, the tambourines are yours, and there is no judgment.</p>
<p><del>Norebang is the great social equalizer. The most reserved person in your group will be belting ballads within 20 minutes. This is science.</del></p>

<h2>How It Works</h2>
<ol>
  <li>Walk in and tell the front desk how many people you have.</li>
  <li>They assign you a room sized for your group (small rooms for 2-4, large rooms for bigger groups).</li>
  <li>Time is tracked — typically sold in 30-minute or 1-hour blocks.</li>
  <li>The room has a TV screen, two microphones, a song selection tablet or remote, and usually tambourines and maracas.</li>
  <li>Select songs by number (books or digital search by artist/title). English songs are widely available in the catalog.</li>
  <li>Order drinks and snacks via an intercom or tablet — staff delivers to your room.</li>
  <li>Buy extra time at the end or leave when done.</li>
</ol>

<h2>Cost</h2>
<p>Standard norebang runs <strong>₩10,000–₩20,000 per hour for the room</strong> (not per person — you split it). Rooms vary in size and quality. Fancier chains with modern equipment and good sound systems charge more. Popular chains include Su Norebang (수 노래방) and Luxury Norebang (럭셔리 노래방).</p>

<h2>Coin Norebang — The Solo Experience</h2>
<p>Coin norebang (코인 노래방) is a budget variant where you pay per song rather than by the hour — typically ₩500–₩1,000 per song. The rooms are tiny (usually 2 people max), the equipment is basic, and there's no drink service. It's completely self-service. Popular for a quick solo session or a spontaneous stop with one friend. Found everywhere; look for small storefronts with coin slot machines visible through the window.</p>

<h2>Song Selection</h2>
<p>The catalog is enormous and includes:</p>
<ul>
  <li>Current K-pop hits (all of them, all versions)</li>
  <li>Classic Korean ballads — these are the ones Koreans get emotional over</li>
  <li>English pop and rock from all eras</li>
  <li>Japanese, Chinese, and other Asian language songs in most locations</li>
</ul>

<h2>Best Neighborhoods for Norebang</h2>
<p><a href="/wiki/hongdae">Hongdae</a> has the highest concentration of norebang and some of the best-equipped rooms. <a href="/wiki/myeongdong">Myeongdong</a> has many options oriented toward tourists. Most neighborhoods have at least one norebang — look for the 노래방 sign in neon.</p>`,
    relatedArticles: ["pc-bang", "hongdae", "tipping-culture"],
    tags: ["culture", "nightlife", "karaoke", "norebang", "entertainment"],
    lastUpdated: "2025-11-02"
  },
  {
    slug: "pc-bang",
    title: "PC Bang (PC방)",
    category: "Culture",
    summary: "24-hour gaming cafes with high-end gaming PCs, fast internet, and food service to your seat. A uniquely Korean cultural institution born from the StarCraft era.",
    infobox: {
      Cost: "~₩1,000–₩1,500/hour",
      Hours: "24/7",
      Food: "Served at desk",
      "Popular games": "StarCraft II, LoL, PUBG, Valorant"
    },
    content: `<h2>What is a PC Bang?</h2>
<p>PC bang (PC방, "PC room") is a type of internet cafe that is uniquely Korean in its scale and quality. These are not the dusty, dimly lit internet cafes of other countries — Korean PC bangs are equipped with <strong>top-tier gaming PCs, mechanical keyboards, high-refresh-rate monitors, and gaming headsets</strong>, all cleaned and maintained daily.</p>
<p>They emerged in the late 1990s during the StarCraft craze that made Korea the global center of esports, and they remain a core part of Korean youth culture today.</p>
<p><del>PC bangs are where Korean esports legends were forged. You are not a legend. But you can sit in the same chair type and pretend.</del></p>

<h2>The Experience</h2>
<p>Walk in, register at the front desk (sometimes just tap a screen), and take any available seat. A timer starts on your screen showing your session time. All major games are pre-installed — League of Legends, PUBG, Valorant, StarCraft II, Diablo IV, and current popular titles are typically all available.</p>
<p>The environment is usually dimly lit, air-conditioned to borderline cold temperatures, and filled with the sound of mechanical keyboards and occasional victory shouts muffled by headsets.</p>

<h2>Food and Drinks</h2>
<p>This is one of the distinctive features of Korean PC bangs: <strong>food is delivered to your seat</strong>. A menu (sometimes digital, on the seat-back screen) lets you order without leaving your chair. Common items include:</p>
<ul>
  <li>Cup ramen (classic, always available)</li>
  <li>Fried rice (볶음밥)</li>
  <li>Fried chicken snacks</li>
  <li>Snacks and drinks</li>
</ul>
<p>Prices are reasonable — ramen around ₩2,000, rice dishes ₩4,000–₩6,000.</p>

<h2>Cost and Hours</h2>
<p>Standard rate is approximately <strong>₩1,000–₩1,500 per hour</strong>. Many PC bangs offer discounted night rates after midnight. Open 24/7, they're a legitimate option for late-night entertainment when everything else is closed, or — honestly — as a place to crash and game if you miss your last subway.</p>

<h2>For Non-Gamers</h2>
<p>PC bangs are useful even if you're not there to game. The fast internet and private booth-style seating make them a reasonable place to work, watch content, or make video calls. Many travelers use them for printing boarding passes or documents (printers available at the counter). At ₩1,500/hour, it's also cheaper than most cafes in tourist areas.</p>

<h2>Finding a PC Bang</h2>
<p>Look for the "PC방" sign — usually in LED or neon, often on upper floors of commercial buildings. Concentrated near universities and in entertainment districts like <a href="/wiki/hongdae">Hongdae</a>, Sinchon, and Gangnam. There are also many near <a href="/wiki/norebang">norebang</a> venues as they cater to the same late-night crowd.</p>`,
    relatedArticles: ["norebang", "hongdae", "nanta-show"],
    tags: ["culture", "gaming", "PC bang", "nightlife", "esports", "entertainment"],
    lastUpdated: "2025-10-22"
  },
  {
    slug: "hongdae",
    title: "Hongdae (홍대)",
    category: "Places",
    summary: "Seoul's young, artsy, bohemian neighborhood centered around Hongik University. Best known for indie music, street performances, clubs, and an endlessly energetic nightlife.",
    infobox: {
      Station: "Hongik Univ. (Line 2, Airport Railroad)",
      Vibe: "Young, artsy, nightlife",
      "Best time": "Fri/Sat evening–late",
      Nearby: "Hapjeong, Sangsu, Mangwon"
    },
    content: `<h2>Overview</h2>
<p>홍대 (Hongdae) refers to the area surrounding Hongik University (홍익대학교), one of Korea's leading art and design schools. The neighborhood absorbed the creative energy of its university and expanded into one of Seoul's most vibrant entertainment and cultural districts. Today it draws students, young professionals, tourists, and the Korean indie arts scene in equal measure.</p>
<p>The area is best experienced from late afternoon into the early morning hours — this is not a daytime shopping district (though you can shop), it's primarily a nighttime social destination.</p>

<h2>What to Do</h2>
<h3>Street Performances</h3>
<p>The pedestrian street near Hongdae's main exit (Exit 9) hosts regular <strong>street performances (버스킹)</strong> on weekend evenings. Musicians, dance crews, and performance artists set up along the main drag. Watching Korean idol-style dance performances here is free, excellent, and a distinctly Seoul experience.</p>
<p><del>The busking performers in Hongdae are sometimes so good it genuinely raises the question of why they aren't already famous. Some of them become famous. You might be watching someone's origin story.</del></p>

<h3>Clubs and Bars</h3>
<p>Hongdae has Seoul's densest concentration of clubs. Major clubs include Club FF, Soap, Cakeshop, and Mystik — most open after midnight and run until dawn on weekends. Cover charge typically ₩10,000–₩20,000, sometimes includes a drink. Electronic music, hip-hop, and K-pop nights all operate. Bars range from tiny hole-in-the-wall pojangmacha (tarp tents) to rooftop venues.</p>

<h3>Shopping</h3>
<p>Streetwear, vintage clothing, and independent design brands define Hongdae shopping. Key areas:</p>
<ul>
  <li><strong>Aha:</strong> Korean streetwear and sneaker culture.</li>
  <li><strong>ABC Mart:</strong> Sneakers at standard retail prices.</li>
  <li><strong>Stylenanda Pink Hotel:</strong> The flagship store of Korean fashion brand Stylenanda — famous for its hotel-themed multi-floor layout.</li>
  <li><strong>Independent boutiques:</strong> Scattered throughout the alleyways, featuring local designers.</li>
</ul>

<h3>Cafes and Food</h3>
<p>Hongdae has some of Seoul's most creative cafes — multi-story concept cafes, themed cafes, and specialty coffee shops. Korean BBQ restaurants, street food stalls, and late-night ramen spots abound. After clubbing, the 24-hour galbi restaurants and pojangmacha tents do enormous business.</p>

<h2>Getting There</h2>
<p>Hongik University Station (홍익대입구역) is served by <strong>Line 2 (green)</strong> and the <strong>Airport Railroad (AREX)</strong>. From Incheon Airport, you can take AREX directly to Hongdae Station — no transfers. Use Exit 9 for the main entertainment area.</p>

<h2>Nearby Neighborhoods</h2>
<p>Hapjeong (합정) to the south is quieter, with excellent independent cafes and restaurants popular with creatives. Sangsu (상수) is similarly indie-leaning. Mangwon (망원) is a residential neighborhood with a great weekend market and local food culture — a nice daytime contrast to Hongdae's nightlife.</p>`,
    relatedArticles: ["myeongdong", "norebang", "pc-bang", "korean-bbq"],
    tags: ["places", "Seoul", "nightlife", "shopping", "music", "Hongdae", "clubs"],
    lastUpdated: "2025-11-04"
  },
  {
    slug: "myeongdong",
    title: "Myeongdong (명동)",
    category: "Places",
    summary: "Seoul's premier shopping and tourist district. The epicenter of K-beauty in Korea, with wall-to-wall cosmetics shops, lively street food stalls, and the city's best currency exchange rates.",
    infobox: {
      Station: "Myeongdong (Line 4)",
      "Best for": "K-beauty, street food, shopping",
      Open: "Shops ~10am–10pm",
      "Street food": "Evenings (5pm–late)"
    },
    content: `<h2>Overview</h2>
<p>명동 (Myeongdong) is Seoul's most visited tourist neighborhood and the heartland of Korea's world-famous beauty industry. The main pedestrian street and surrounding alleys are packed with K-beauty brands, international clothing retailers, department stores, street food vendors, and money changers. If you visit Seoul for even a few days, you will almost certainly pass through Myeongdong.</p>

<h2>K-Beauty Shopping</h2>
<p>Myeongdong has the highest concentration of Korean cosmetics brands in the world. Major flagship stores include:</p>
<ul>
  <li><strong>Olive Young (올리브영):</strong> Korea's dominant health and beauty chain. Think Sephora meets a pharmacy. Multiple Myeongdong locations. Best place for trusted multi-brand beauty shopping, skincare, and Korean sunscreen.</li>
  <li><strong>Innisfree:</strong> Nature-inspired Korean skincare. Multiple floors. Competitive prices and good gift sets.</li>
  <li><strong>The Face Shop:</strong> Accessible prices, wide range. Good for budget beauty shopping.</li>
  <li><strong>Laneige, Sulwhasoo, Amorepacific:</strong> Mid-to-premium tier Korean brands with dedicated stores.</li>
  <li><strong>COSRX, Some By Mi, Skin1004:</strong> Popular with international K-beauty fans, often found at Olive Young.</li>
</ul>
<p><del>Setting a budget before entering Myeongdong's Olive Young is strongly recommended. The budget will not survive, but the attempt is admirable.</del></p>

<h2>Street Food</h2>
<p>From late afternoon onwards, street food stalls line the pedestrian area. Classic options:</p>
<ul>
  <li><strong>떡볶이 (Tteokbokki):</strong> Spicy rice cakes in gochujang sauce. A Korean street food staple.</li>
  <li><strong>호떡 (Hotteok):</strong> Sweet pan-fried filled pancake. Brown sugar, nuts, cinnamon filling.</li>
  <li><strong>바닷가재 꼬치 (Lobster Skewer):</strong> Whole grilled lobster on a stick. Touristy but genuinely good. ₩10,000–₩15,000.</li>
  <li><strong>계란빵 (Gyeran-ppang):</strong> Egg bread — sweet bread with a whole egg baked inside. Popular in winter.</li>
  <li><strong>핫도그 (Korean Corn Dog):</strong> Skewered hot dog in a bread batter, sometimes coated with rice or ramen crumbs.</li>
</ul>

<h2>Currency Exchange</h2>
<p>Myeongdong has Seoul's best private <a href="/wiki/currency-exchange">currency exchange</a> rates. Look for licensed money changers with posted rate boards along the main street and side alleys. Bring USD, EUR, or JPY in cash for the best conversion rates on Korean Won.</p>

<h2>Other Attractions</h2>
<ul>
  <li><strong>명동성당 (Myeongdong Cathedral):</strong> A beautiful Gothic Catholic cathedral just uphill from the shopping area. Worth a quiet visit for the architecture and to escape the crowds.</li>
  <li><strong>Lotte Department Store:</strong> Massive department store with a food hall in the basement and international brands throughout.</li>
  <li><strong>Namdaemun Market:</strong> A short walk away — sprawling traditional market for wholesale prices on clothing, food, and imported goods.</li>
</ul>

<h2>Getting There</h2>
<p>Myeongdong Station (명동역) is on <strong>Line 4 (sky blue)</strong>. Exit 5 or 6 leads directly into the main shopping street. The area is pedestrian-friendly once inside but surrounding roads are busy.</p>`,
    relatedArticles: ["hongdae", "currency-exchange", "gyeongbokgung", "convenience-store"],
    tags: ["places", "Seoul", "shopping", "K-beauty", "street food", "Myeongdong", "Olive Young"],
    lastUpdated: "2025-11-06"
  },
  {
    slug: "gyeongbokgung",
    title: "Gyeongbokgung Palace (경복궁)",
    category: "Places",
    summary: "The largest and most impressive of Seoul's five Joseon dynasty palaces, built in 1395. The changing of the Royal Guard, the Gyeonghoeru Pavilion, and free entry in hanbok make this a must-visit.",
    infobox: {
      Location: "Gwanghwamun, Seoul",
      Station: "Gyeongbokgung (Line 3)",
      Hours: "9am–6pm (closed Tue)",
      Admission: "₩3,000 (free with Hanbok)",
      "Guard ceremony": "10am & 2pm"
    },
    content: `<h2>History</h2>
<p>경복궁 (Gyeongbokgung) was the main royal palace of the Joseon dynasty, first built in 1395 following the dynasty's founding by King Taejo. The name means "Greatly Blessed by Heaven." The palace complex served as the seat of royal power for over 200 years before being destroyed during the Japanese invasion of 1592 and left in ruins for nearly three centuries.</p>
<p>Reconstruction began in 1865 under Regent Heungseon Daewongun, restoring the palace to much of its former grandeur. Further destruction occurred during the Japanese colonial period (1910–1945), when the main building of the Government General was built directly in front of the palace, blocking it from view — that building was demolished in 1996, and restoration continues today.</p>

<h2>Key Sights Within the Palace</h2>
<ul>
  <li><strong>광화문 (Gwanghwamun Gate):</strong> The main southern gate, the iconic image of the palace. Two haetae (mythical guardian creatures) flank the entrance.</li>
  <li><strong>근정전 (Geunjeongjeon):</strong> The throne hall — the largest and most important building, where state ceremonies were held. Surrounded by stone paved courtyard.</li>
  <li><strong>경회루 (Gyeonghoeru Pavilion):</strong> An enormous two-story wooden pavilion on a rectangular pond, used for royal banquets and diplomatic receptions. One of Korea's most photographed structures.</li>
  <li><strong>향원정 (Hyangwonjeong):</strong> A hexagonal pavilion on an island in a smaller garden pond. Serene and beautiful — particularly photogenic.</li>
  <li><strong>국립민속박물관 (National Folk Museum of Korea):</strong> Located within the palace grounds. Free entry. Excellent exhibits on traditional Korean life, customs, and material culture.</li>
  <li><strong>국립고궁박물관 (National Palace Museum):</strong> Also within the grounds, south section. Free entry. Houses royal artifacts, court items, and historical records.</li>
</ul>

<h2>Changing of the Royal Guard</h2>
<p>The Royal Guard Changing Ceremony (수문장 교대의식) takes place daily <strong>at 10am and 2pm</strong> at Gwanghwamun Gate (except Tuesdays). The ceremony features guards in traditional Joseon military dress and takes approximately 20 minutes. Free to watch from outside the gate. Arrive 10 minutes early for a good viewing position.</p>
<p><del>The guard ceremony is genuinely impressive and not just a tourist tick-box. The costumes, the formation, and the accompanying music create a real sense of historical weight.</del></p>

<h2>Hanbok Free Entry</h2>
<p>Visitors wearing <a href="/wiki/hanbok">hanbok</a> (traditional Korean clothing) enter Gyeongbokgung for free. Rental shops line the streets near the Gyeongbokgung Station exit, and dozens of shops are concentrated in the Bukchon Hanok Village area nearby. Rent for ₩15,000–₩30,000 and explore the palace in traditional dress — a memorable experience and excellent for photos.</p>

<h2>Practical Information</h2>
<ul>
  <li>Closed Tuesdays. Open 9am–6pm (extended to 6:30pm summer, closing at 5pm November–February).</li>
  <li>Admission: ₩3,000 adults, free for under-24 Koreans, free with hanbok.</li>
  <li>Audio guides available in English, Chinese, Japanese, and French.</li>
  <li>Gwanghwamun Station (Line 5) or Gyeongbokgung Station (Line 3, Exit 5) are both walking distance.</li>
</ul>`,
    relatedArticles: ["hanbok", "myeongdong", "seoul-subway"],
    tags: ["places", "Seoul", "palace", "history", "Joseon", "culture", "must-visit"],
    lastUpdated: "2025-10-31"
  },
  {
    slug: "hanbok",
    title: "Hanbok (한복)",
    category: "Culture",
    summary: "Traditional Korean clothing worn by royalty and commoners during the Joseon dynasty. Today, renting a hanbok near palaces is a popular tourist activity — and gets you free entry to major palaces.",
    infobox: {
      "Rental cost": "₩15,000–₩30,000 / 2–4 hrs",
      "Best locations": "Gyeongbokgung, Bukchon",
      "Palace entry": "Free with Hanbok",
      "Return time": "Before palace closes"
    },
    content: `<h2>What is Hanbok?</h2>
<p>한복 (Hanbok) is the traditional clothing of Korea, worn for over a thousand years. The design varies by gender, social class, and occasion. Women wear a <strong>jeogori</strong> (short jacket) with a <strong>chima</strong> (full skirt that ties at the chest). Men wear a longer jeogori with <strong>baji</strong> (loose trousers). Colors are vibrant — historically, the colors indicated social status.</p>
<p>While few Koreans wear hanbok daily, it remains prominent for major holidays like Chuseok and Seollal, formal ceremonies like weddings, and increasingly as a fashion-forward choice by younger Koreans who wear modernized hanbok (생활한복, "everyday hanbok") casually.</p>

<h2>The Palace Free Entry Perk</h2>
<p>All five Seoul palaces offer <strong>free admission for visitors wearing hanbok</strong>:</p>
<ul>
  <li><a href="/wiki/gyeongbokgung">Gyeongbokgung Palace</a> (normally ₩3,000)</li>
  <li>Changdeokgung Palace (normally ₩3,000)</li>
  <li>Deoksugung Palace (normally ₩1,000)</li>
  <li>Changgyeonggung Palace (normally ₩1,000)</li>
  <li>Gyeonghuigung Palace (free regardless)</li>
</ul>
<p>This benefit alone often covers a significant portion of the rental cost.</p>

<h2>Where to Rent Hanbok</h2>
<h3>Near Gyeongbokgung</h3>
<p>The highest concentration of rental shops is on the road directly in front of Gyeongbokgung Station Exit 5, stretching toward the palace gate. Dozens of shops compete, so prices are reasonable and selection is wide. Most shops have hair accessories included in the rental and staff to help you dress correctly.</p>

<h3>Bukchon Hanok Village</h3>
<p>Bukchon (북촌) is a preserved neighborhood of traditional Korean houses (hanok) between Gyeongbokgung and Changdeokgung. Several hanbok rental shops operate here and the neighborhood itself provides a perfect backdrop — traditional architecture, narrow alleyways, and city views make for stunning photos.</p>

<h3>Insadong (인사동)</h3>
<p>The cultural arts district nearby also has rental shops and is a beautiful area for a hanbok stroll, with galleries, tea houses, and craft shops.</p>
<p><del>Within ten minutes of putting on a hanbok, you will want to photograph everything. This is both expected and encouraged. The rental shop staff have seen this happen ten thousand times and will smile knowingly.</del></p>

<h2>Practical Details</h2>
<ul>
  <li><strong>Rental duration:</strong> Most shops rent for 2–4 hours. You can extend for an additional fee.</li>
  <li><strong>What's included:</strong> Hanbok outfit + accessories (hairpin, norigae charm). Some shops offer hair styling for an additional ₩5,000–₩10,000.</li>
  <li><strong>Return time:</strong> Must return before the rental shop closes, which is typically before the palace's last entry time. Check closing times carefully in winter when palaces close at 5pm.</li>
  <li><strong>Weather:</strong> Summer hanbok can be hot. Winter hanbok rentals often include a thick traditional coat (두루마기).</li>
  <li><strong>Photos:</strong> Many rental shops offer a basic photo service or partner with professional photographers in the area.</li>
</ul>`,
    relatedArticles: ["gyeongbokgung", "myeongdong", "nanta-show"],
    tags: ["culture", "hanbok", "traditional", "fashion", "palace", "photography"],
    lastUpdated: "2025-10-27"
  },
  {
    slug: "coupang",
    title: "Coupang (쿠팡)",
    category: "Apps",
    summary: "Korea's Amazon. Rocket Delivery brings orders to your door before 7am if you order before midnight. Extraordinarily useful for travelers staying a week or more.",
    infobox: {
      Type: "E-commerce + food delivery",
      Delivery: "Rocket Delivery (next morning)",
      Language: "Korean",
      "Useful for": "Week+ stays, bulk snacks"
    },
    content: `<h2>What is Coupang?</h2>
<p>쿠팡 (Coupang) is South Korea's largest e-commerce company, often compared to Amazon in both scale and service model. Founded in 2010, it operates a nationwide logistics network with remarkable speed and coverage. For visitors staying in Korea for a week or more with a fixed address (Airbnb, long-term accommodation, hotel), Coupang can be an incredibly useful tool for stocking up on supplies.</p>

<h2>Rocket Delivery (로켓배송)</h2>
<p>Coupang's signature service: <strong>order before midnight, receive delivery before 7am the next morning</strong>. This is not an exaggeration or marketing copy — it works reliably, including in suburban and rural areas. Items marked with a rocket icon are eligible. The logistics feat involves a network of owned delivery trucks and a dedicated workforce making pre-dawn deliveries nationwide.</p>
<p><del>Waking up at 6:45am to the quiet thud of a Coupang box outside your door, containing exactly the snacks you ordered the night before, is a surreal and wonderful experience. Koreans treat this as completely normal. It is not normal. It is magic.</del></p>

<h2>What to Buy on Coupang as a Traveler</h2>
<p>Coupang is primarily in Korean, but major categories are navigable with Google Translate or a translation app:</p>
<ul>
  <li><strong>Snacks and drinks:</strong> Korean snacks (Pepero, shrimp crackers, honey butter chips), Korean convenience store items in bulk, drink mix packets.</li>
  <li><strong>Toiletries:</strong> If you forgot something or run out — toothpaste, shampoo, contact solution, etc.</li>
  <li><strong>Travel adapters and electronics:</strong> Korean plugs are Type C/F (European round pin). Cheap adapters available same-day.</li>
  <li><strong>K-beauty products:</strong> Often cheaper than retail stores, especially for well-known brands like COSRX, Skin1004, or Laneige.</li>
  <li><strong>Comfort items:</strong> Slippers, extra towels for extended stays.</li>
</ul>

<h2>Coupang Eats (쿠팡이츠)</h2>
<p>Coupang's food delivery service rivals Baemin (배달의민족) and Yogiyo. Extremely fast delivery, usually under 30 minutes. The app is Korean-language but major food categories and restaurant menus can be navigated with translation. Payment by international card works. Minimum order amounts apply (usually ₩10,000–₩15,000).</p>

<h2>Registering and Paying</h2>
<p>Creating a Coupang account requires a Korean phone number for SMS verification — an important limitation for short-stay visitors without a local SIM. If you have a Korean <a href="/wiki/sim-card">SIM card</a>, registration is simple. Payment works with international Visa and Mastercard. Coupang Rocket WOW membership (₩7,890/month) adds free shipping benefits but is unnecessary for short stays.</p>

<h2>Limitations for Tourists</h2>
<p>The app and website are in Korean. While Google Chrome's auto-translate handles product pages adequately, navigating reviews and seller information can be challenging. For tourists staying less than a week, <a href="/wiki/convenience-store">convenience stores</a> open 24/7 are typically more practical.</p>`,
    relatedArticles: ["convenience-store", "sim-card", "myeongdong"],
    tags: ["apps", "shopping", "delivery", "Coupang", "e-commerce", "practical"],
    lastUpdated: "2025-11-07"
  },
  {
    slug: "nanta-show",
    title: "Nanta Show (난타)",
    category: "Culture",
    summary: "Korea's longest-running theatrical production. A non-verbal percussion performance combining samulnori (Korean traditional drumming) with comedy and cooking — no Korean language required.",
    infobox: {
      Type: "Non-verbal percussion comedy",
      Duration: "~100 minutes",
      Venues: "Myeongdong, Hongdae, Jeju",
      Tickets: "₩55,000–₩77,000",
      Language: "No language barrier"
    },
    content: `<h2>What is Nanta?</h2>
<p>난타 (Nanta), also marketed internationally as "Cookin'", is a non-verbal theatrical performance that combines traditional Korean percussion (사물놀이, samulnori) with acrobatics, physical comedy, and audience interaction. The premise: four chefs must prepare a wedding banquet under extreme time pressure — using kitchen implements as percussion instruments.</p>
<p>Launched in 1997 by producer Song Seung-hwan, Nanta became the first Korean performance to be staged on Broadway (2004) and subsequently toured to over 60 countries. It remains one of Korea's longest-running theatrical productions.</p>

<h2>Why It Works Without Language</h2>
<p>The entire show is non-verbal. There is no dialogue — all storytelling is done through rhythm, physical comedy, facial expression, and audience interaction. The result is a performance that works equally well for Korean audiences and foreign visitors who speak no Korean whatsoever.</p>
<p>The percussion sequences are genuinely impressive — the performers are skilled musicians, and the rhythmic complexity of samulnori (a style of percussion with roots in Korean shamanistic ritual music) drives the entire show.</p>
<p><del>You may go in skeptical about a show involving kitchen utensils. You will come out having involuntarily applauded numerous times and wondering how vegetables can sound that dramatic when chopped.</del></p>

<h2>Audience Participation</h2>
<p>Several moments in the show involve audience members coming on stage. This is light-hearted and fun — typically involving helping prepare vegetables or participating in brief comedic skits. Participation is never forced, but volunteers are enthusiastically received.</p>

<h2>Venues</h2>
<ul>
  <li><strong>Myeongdong Nanta Theater (명동 난타극장):</strong> The main venue, centrally located near <a href="/wiki/myeongdong">Myeongdong</a>. Multiple shows daily. Most accessible for tourists.</li>
  <li><strong>Hongdae Nanta Theater (홍대 난타극장):</strong> Near <a href="/wiki/hongdae">Hongdae</a> Station. Similar schedule.</li>
  <li><strong>Jeju Nanta Theater:</strong> A permanent venue for visitors to Jeju Island.</li>
</ul>

<h2>Booking Tickets</h2>
<p>Tickets range from <strong>₩55,000 to ₩77,000</strong> depending on seat tier and venue. Book in advance via the official Nanta website (nanta.co.kr) or through tour booking platforms like Klook and Viator, which often offer package deals. Walk-up tickets are available if not sold out.</p>

<h2>Who It's For</h2>
<p>Nanta is genuinely suitable for all ages. Children enjoy the slapstick and energy. Adults appreciate the musical precision and the comedic timing. It's a 100-minute runtime without an interval. If you're looking for uniquely Korean cultural entertainment that requires zero language ability, Nanta is one of the best answers.</p>`,
    relatedArticles: ["norebang", "myeongdong", "hongdae", "hanbok"],
    tags: ["culture", "entertainment", "performance", "show", "non-verbal", "Nanta", "samulnori"],
    lastUpdated: "2025-10-29"
  },
  {
    slug: "visa-waiver",
    title: "Visa-Free Entry to Korea",
    category: "Practical",
    summary: "Citizens of 112 countries can enter Korea without a visa for up to 90 days. Some countries require K-ETA registration before arrival. Here's everything you need to know before you land.",
    infobox: {
      "Visa-free countries": "112 countries",
      Duration: "Up to 90 days (most)",
      "K-ETA": "Required for some countries (₩10,000)",
      "Entry point": "Incheon, Gimpo, Gimhae, Jeju"
    },
    content: `<h2>Visa-Free Entry Overview</h2>
<p>Korea offers visa-free entry to citizens of over 112 countries under bilateral or multilateral agreements. Most Western passport holders — including the United States, all EU member states, United Kingdom, Canada, Australia, New Zealand, and Japan — can enter for <strong>up to 90 days</strong> without a visa for tourism and short-term visits.</p>
<p>The allowed stay varies by nationality: most Western passports get 90 days; some Asian and South American passports get different durations. Always verify your specific country's agreement with the Korean Ministry of Foreign Affairs before traveling.</p>

<h2>K-ETA (Korea Electronic Travel Authorization)</h2>
<p>As of current regulations, some visa-exempt nationalities must obtain a <strong>K-ETA</strong> (Korea Electronic Travel Authorization) before arrival. This is similar to the US ESTA, Canada eTA, or Australian ETA.</p>
<ul>
  <li><strong>Cost:</strong> ₩10,000 (approximately USD $7–8)</li>
  <li><strong>Valid for:</strong> 2 years from approval date (multiple entries)</li>
  <li><strong>Processing time:</strong> Usually within 72 hours; can be near-instant</li>
  <li><strong>Apply at:</strong> eta.go.kr (the official K-ETA portal)</li>
</ul>
<p>Note: K-ETA requirements have changed over the years and some exemptions have been granted temporarily. Check the current status for your nationality close to your travel date, as requirements may differ from what's listed here.</p>
<p><del>The K-ETA website looks like it was designed in 2008 but it functions. Apply at least a week before departure and you'll be fine.</del></p>

<h2>Common Nationalities and Their Status</h2>
<ul>
  <li><strong>USA, Canada, UK, Australia, New Zealand:</strong> Visa-free 90 days. K-ETA requirements have varied — check current status.</li>
  <li><strong>EU Member States:</strong> Visa-free 90 days for most. Some EU countries require K-ETA.</li>
  <li><strong>Japan:</strong> Visa-free 90 days, no K-ETA required as of recent policy.</li>
  <li><strong>Southeast Asian countries:</strong> Varies significantly by country. Philippines, Vietnam, Indonesia may require a visa. Thailand is typically visa-free for shorter periods.</li>
</ul>

<h2>Entry Points</h2>
<ul>
  <li><strong>Incheon International Airport (ICN):</strong> Main international hub. The overwhelming majority of international arrivals. 48km from Seoul city center.</li>
  <li><strong>Gimpo International Airport (GMP):</strong> Handles flights from China, Japan, and Taiwan. Closer to Seoul, connected to subway directly.</li>
  <li><strong>Gimhae International Airport (PUS):</strong> Busan's airport. International flights from China, Japan, Southeast Asia.</li>
  <li><strong>Jeju International Airport (CJU):</strong> Jeju Island is a special self-governing province. Some nationalities that require a visa for mainland Korea can enter Jeju visa-free for short periods — a unique arrangement worth researching for relevant nationalities.</li>
</ul>

<h2>Immigration Tips</h2>
<ul>
  <li>Korean immigration officers may ask about accommodation, return tickets, and funds available. Have this information ready.</li>
  <li>Incheon Airport has a Smart Entry Service (SES) — biometric pre-registration for frequent visitors that allows use of automated e-gates.</li>
  <li>Incheon typically has short immigration queues, but can spike during peak hours (9am–noon). Factor this in when planning onward transport.</li>
  <li>Your passport must be valid for the entire duration of your stay. Korea does not require 6-month validity beyond your stay date, but airlines may.</li>
</ul>`,
    relatedArticles: ["sim-card", "currency-exchange", "seoul-subway"],
    tags: ["practical", "visa", "K-ETA", "immigration", "entry", "passport"],
    lastUpdated: "2025-11-09"
  }
];
