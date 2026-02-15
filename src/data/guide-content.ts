export interface GuideItem {
  title: string;
  content: string;
  icon?: string;
}

export interface GuideSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  items: GuideItem[];
}

export const guideSections: GuideSection[] = [
  {
    id: "getting-around",
    title: "Getting Around",
    description: "Korea's public transport is world-class. Here's how to navigate it.",
    icon: "🚇",
    items: [
      {
        title: "Get a T-money Card First",
        icon: "💳",
        content: "Your first priority after landing. Pick up a <a href=\"/wiki/t-money\">T-money card</a> at any convenience store or subway station for ~₩3,000. Load it up and use it on all subways, buses, and most taxis. <del>Paying cash on the bus is technically possible but everyone will hate you</del>."
      },
      {
        title: "Seoul Subway",
        icon: "🚇",
        content: "The <a href=\"/wiki/seoul-subway\">Seoul Metro</a> covers virtually everywhere you want to go. 9+ lines, runs 5:30am to midnight. Fares start at ₩1,400 with T-money. Signs are in Korean, English, Chinese, and Japanese."
      },
      {
        title: "Taking a Taxi",
        icon: "🚕",
        content: "Taxis are affordable and plentiful. Use <a href=\"/wiki/kakao-t\">KakaoT</a> app to hail a cab — it works like Uber and avoids communication barriers. Base fare ~₩4,800. Most drivers accept T-money card payment. <del>Trying to hail a street taxi while waving dramatically like in a drama works too</del>."
      },
      {
        title: "KTX for Long Distances",
        icon: "🚄",
        content: "Heading to Busan, Gyeongju, or other cities? The <a href=\"/wiki/ktx\">KTX</a> is fast, comfortable, and punctual. Seoul to Busan in ~2h15min. Book in advance on the KORAIL website or KorailPass app."
      }
    ]
  },
  {
    id: "essential-apps",
    title: "Essential Apps",
    description: "Download these before landing. Some require setup that works better on WiFi.",
    icon: "📱",
    items: [
      {
        title: "Naver Map — Your Navigation Bible",
        icon: "🗺️",
        content: "<a href=\"/wiki/naver-map\">Naver Map</a> is the Google Maps of Korea — but better for Korea. Google Maps has poor public transit data here. Naver Map shows real-time subway arrivals, walking directions, and even bus ETAs. English mode available."
      },
      {
        title: "KakaoT — Taxi App",
        icon: "🚖",
        content: "<a href=\"/wiki/kakao-t\">KakaoT</a> lets you book taxis in English, see estimated fares, and pay by card. Essential for late nights or areas with few cabs. Note: full features require a Korean phone number."
      },
      {
        title: "Naver Papago — Translation",
        icon: "🌐",
        content: "Better than Google Translate for Korean. Camera translate mode works well for menus. Download offline language packs for subway/WiFi-dead zones."
      },
      {
        title: "Coupang & Coupang Eats",
        icon: "📦",
        content: "Staying a week or more? <a href=\"/wiki/coupang\">Coupang</a> delivers next morning before 7am. Coupang Eats rivals any food delivery service globally — cheap, fast, everything available."
      }
    ]
  },
  {
    id: "money-payments",
    title: "Money & Payments",
    description: "Korea is increasingly cashless, but cash is still useful in certain situations.",
    icon: "💰",
    items: [
      {
        title: "Currency Exchange",
        icon: "💱",
        content: "Get <a href=\"/wiki/currency-exchange\">Korean Won</a> at Myeongdong money changers for the best rates — significantly better than the airport. Bring USD, EUR, or JPY in cash for best rates. Shinhan Bank's Global ATMs accept most foreign cards."
      },
      {
        title: "Cards & Contactless",
        icon: "💳",
        content: "Visa and Mastercard are accepted at most establishments. Samsung Pay and Apple Pay work at many places. Smaller restaurants and street food may be cash-only. Always carry ₩50,000–₩100,000 cash as backup."
      },
      {
        title: "No Tipping",
        icon: "🙅",
        content: "Korea has no <a href=\"/wiki/tipping-culture\">tipping culture</a>. Do not tip at restaurants, taxis, or hotels. It can even cause awkwardness. High-end hotels may include a 10% service charge automatically."
      }
    ]
  },
  {
    id: "stay-connected",
    title: "Stay Connected",
    description: "Korea has world-class 5G coverage. Getting connected is easy.",
    icon: "📡",
    items: [
      {
        title: "SIM Card or eSIM",
        icon: "📶",
        content: "Pick up a tourist <a href=\"/wiki/sim-card\">SIM card</a> at Incheon Airport (SKT, KT, LG U+ booths at arrivals). Data-only SIMs start around ₩33,000/month. eSIM via Airalo works before you land — recommended for newer unlocked phones."
      },
      {
        title: "Free WiFi",
        icon: "📡",
        content: "Free WiFi is available in most cafes, restaurants, and all subway stations. Quality varies. Airport WiFi is fast and free. Government WiFi hotspots (iptime, KT WiFi) are everywhere but throttled."
      }
    ]
  },
  {
    id: "food-drink",
    title: "Food & Drink",
    description: "Korean food culture has a few key things to know before diving in.",
    icon: "🍖",
    items: [
      {
        title: "Korean BBQ Basics",
        icon: "🔥",
        content: "At <a href=\"/wiki/korean-bbq\">Korean BBQ</a> restaurants, you grill meat at your table. Banchan (side dishes) are free and refillable — just ask. Wrap meat in lettuce with garlic and ssamjang paste. <del>Using the scissors to cut meat feels weird at first but you'll be a pro by day 2</del>."
      },
      {
        title: "Convenience Store Food",
        icon: "🏪",
        content: "Korea's <a href=\"/wiki/convenience-store\">편의점 (convenience stores)</a> are legendary. Triangle kimbap (~₩1,500), cup ramen with hot water station, hotteok, steamed buns. Open 24/7, on every block."
      },
      {
        title: "Dietary Restrictions",
        icon: "🥗",
        content: "Vegetarian/vegan options are improving but still limited outside Seoul. Many dishes contain meat stock even if no visible meat. Apps like HappyCow or searching '비건 (vegan)' or '채식 (vegetarian)' help. Halal-certified restaurants exist in Itaewon and some areas."
      }
    ]
  },
  {
    id: "culture-etiquette",
    title: "Culture & Etiquette",
    description: "A few key cultural norms will make your trip much smoother.",
    icon: "🙏",
    items: [
      {
        title: "Respect for Elders",
        icon: "👴",
        content: "Korean culture is Confucian-influenced. Offer seats on public transport to elderly passengers. When dining with Koreans, let elders sit and eat first. Receiving items (business cards, gifts, dishes) with two hands or right hand supported by left is respectful."
      },
      {
        title: "Shoes Off Indoors",
        icon: "👟",
        content: "Many traditional restaurants, guesthouses, and homes require removing shoes. Look for a step-up threshold or visible shoe rack — that's your cue."
      },
      {
        title: "Hanbok Experience",
        icon: "👘",
        content: "Renting a <a href=\"/wiki/hanbok\">hanbok</a> (traditional Korean dress) near Gyeongbokgung lets you enter most palaces for free and makes for great photos. Shops near the palace gate rent for ₩15,000–₩30,000 for 2-4 hours."
      },
      {
        title: "No Tipping",
        icon: "🚫",
        content: "Reiterated for emphasis: <a href=\"/wiki/tipping-culture\">do not tip</a> in Korea. It's not customary and can cause confusion."
      }
    ]
  },
  {
    id: "emergency",
    title: "Emergency Information",
    description: "Save these numbers before you go out. Tourist hotlines have English support.",
    icon: "🆘",
    items: [
      {
        title: "Emergency Numbers",
        icon: "📞",
        content: "<strong>Police: 112</strong> | <strong>Fire/Ambulance: 119</strong> | <strong>Tourist Hotline (English 24/7): 1330</strong> | Coast Guard: 122. The 1330 tourist hotline is excellent — they can translate for you in real-time if you're stuck in a situation where you need to communicate with locals."
      },
      {
        title: "Medical Care",
        icon: "🏥",
        content: "Korea has excellent, affordable medical care. Severance Hospital (Sinchon) and Samsung Medical Center have international clinics. ER visits are generally quick and affordable compared to Western countries. Bring your passport for registration."
      }
    ]
  }
];
