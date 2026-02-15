export interface CommunityPost {
  id: number;
  title: string;
  content: string;
  author: string;
  category: 'review' | 'question' | 'free' | 'tip';
  upvotes: number;
  views: number;
  comments: number;
  createdAt: string;
  tags: string[];
}

export const communityPosts: CommunityPost[] = [
  {
    id: 1,
    title: "Honest review after 3 weeks in Korea: what surprised me most as a first-timer from the US",
    content: `I just got back from my first trip to Korea (Seoul for 2 weeks + 4 days in Busan) and wanted to write up an honest review while everything is still fresh.

**The good stuff nobody warned me about:**

The subway system genuinely blew my mind. I live in New York, so I thought I understood subways. I do not. Seoul's metro runs on time, every time, the signs are in four languages, and it goes everywhere. The air conditioning actually works. I cried a little.

Convenience stores. I knew people talked about them but I thought it was hype. It is not hype. I ate my best ₩3,000 meal (triangle kimbap + banana milk) at a GS25 at 2am and I have never been so happy.

How safe I felt walking around at 3am. As a solo female traveler this was meaningful.

**What actually caught me off guard:**

The tipping thing threw me for a loop the first day. I tried to leave a ₩5,000 note at a restaurant and the server came running after me. I thought I'd done something wrong. Then I realized she was trying to return my money. The wiki article here explains it well — just don't tip anywhere, ever.

Nobody jaywalks. Even at 3am with zero cars in sight, Koreans stand at the red light and wait. I felt like an anarchist every time I crossed early.

Portions are HUGE. I ordered what I thought was a snack-sized army stew (budae jjigae) and received a pot that could feed four people for ₩12,000.

**Busan vs Seoul:**

Both are great but Busan feels more relaxed. Haeundae Beach, Jagalchi Fish Market, Gamcheon Culture Village — all excellent. The raw fish at Jagalchi is the freshest I've ever had.

Would go back immediately if I could.`,
    author: "Sarah_fromBoston",
    category: "review",
    upvotes: 347,
    views: 18420,
    comments: 52,
    createdAt: "2025-10-14",
    tags: ["first-timer", "Seoul", "Busan", "solo travel", "US", "review"]
  },
  {
    id: 2,
    title: "KakaoT registration without a Korean phone number — here's what actually worked for me",
    content: `I saw a bunch of conflicting info online about this so posting my experience from last month.

Background: I'm from Germany, traveling with an eSIM (Airalo), which gives me data but not a Korean number that works for SMS verification.

**What didn't work:**
- Trying to register with my German number (failed at verification step)
- Using a Google Voice number (same issue)

**What worked:**
Adding my Visa card directly without completing full account verification. There's a guest/limited mode where you can enter your destination and payment card without a full account. You don't get all the features (can't see driver rating, some vehicle categories unavailable) but the basic taxi booking function worked fine.

My Visa Debit card from N26 (Mastercard) worked on the first try. Some people report issues with prepaid cards — use a credit or debit card linked to a real bank account.

**Alternative:** If you're arriving at Incheon, get a KT or SKT tourist SIM at the arrivals booth before anything else. Takes 10 minutes and then KakaoT registration is completely straightforward. I did this on my second visit and it's infinitely easier.

Hope this helps someone. The app is essential — trying to hail street taxis in areas like Gangnam at midnight without it is a nightmare.`,
    author: "Matthias_K",
    category: "tip",
    upvotes: 214,
    views: 11830,
    comments: 38,
    createdAt: "2025-09-28",
    tags: ["KakaoT", "taxi", "eSIM", "registration", "Germany", "tip"]
  },
  {
    id: 3,
    title: "Is the food in Myeongdong actually good or is it all tourist trap pricing?",
    content: `Planning my first Korea trip (flying in from Manila in December) and every travel blog says to go to Myeongdong for street food. But other posts say it's overpriced tourist stuff and to go somewhere else. Which is it??

Specifically asking about:
- The lobster on a stick thing (worth it?)
- Tteokbokki stalls
- Is the Olive Young in Myeongdong actually good or are prices the same everywhere?

Any Filipinos who've been recently with advice appreciated but all opinions welcome!`,
    author: "iana_ph",
    category: "question",
    upvotes: 67,
    views: 3940,
    comments: 29,
    createdAt: "2025-11-01",
    tags: ["Myeongdong", "street food", "food", "Philippines", "question", "Olive Young"]
  },
  {
    id: 4,
    title: "Living in Korea 4 years: the things I wish someone had told me at the start",
    content: `Australian here, living in Seoul since 2021. This post is for people moving here long-term, not just tourists (though some of it overlaps).

**Banking:**
Opening a Korean bank account as a foreigner used to be a nightmare. It's gotten better. KakaoBank now lets foreigners open accounts entirely in-app with your ARC (Alien Registration Card) and passport. Takes about 20 minutes. Do this before anything else when you get your ARC.

**Phone:**
Don't sign a 2-year plan until you're settled. Start with a tourist SIM for the first month, then switch to a monthly MVNO plan (알뜰폰). I pay ₩22,000/month for unlimited data. Massive difference from the ₩70,000+ that Koreans on carrier plans pay.

**Food delivery apps:**
Baemin (배달의민족) > Coupang Eats > Yogiyo in my experience. Baemin has the widest restaurant selection. But Coupang Eats often has better promotions and faster delivery. I use both. This is normal Korean behavior apparently.

**Garbage disposal:**
This will trip you up in the first week. Korea has mandatory waste separation — food waste, recycling (paper/plastic/glass/metal all separate), and general waste (you have to BUY specific government waste bags from convenience stores, called 종량제 봉투). Your building management will explain this but if they don't, ask a neighbor. Throwing regular trash in the wrong bag or leaving it in the wrong place will create problems.

**Language:**
Learning Hangul (the Korean alphabet) took me one weekend and genuinely changed my life here. The writing system is phonetically logical and you can read signs, menus, and subway stations within days even without knowing what the words mean. There is absolutely no excuse not to do this before you arrive for a longer stay.

Happy to answer questions about the long-term expat life.`,
    author: "Tom_InSeoul",
    category: "tip",
    upvotes: 589,
    views: 31240,
    comments: 94,
    createdAt: "2025-08-15",
    tags: ["expat", "long-term", "banking", "Australia", "living in Korea", "advice"]
  },
  {
    id: 5,
    title: "Norebang at 4am in Hongdae: a spiritual experience",
    content: `I need to tell someone about last Saturday.

My friends and I (four of us from the UK, here for 10 days) ended up at a coin norebang in Hongdae at 4am after a night that started at a chicken and beer place in Mapo at 7pm.

We had never done norebang before. We found a coin norebang (the ones where you pay like ₩500 per song) up some stairs and squeezed into a booth the size of a large wardrobe. There were tambourines. There was a microphone the size of my forearm. The song catalogue had every banger from 2004 we could possibly request.

We stayed for two hours. We spent roughly ₩8,000 total between four people. We sang Mr. Brightside four times. My friend Dan, who has never once shown an interest in singing anything ever, performed a full emotional rendition of Bohemian Rhapsody to an audience of three who applauded sincerely.

At 6am we ate samgyeopsal at a 24-hour BBQ place that had somehow materialized nearby. We took the first subway home at 5:30am.

I don't know what I expected from Korea. It wasn't this. It was better than this.

**Practical tip:** Coin norebang are everywhere in Hongdae, usually upstairs in commercial buildings. Look for small booths visible through the window. No reservation needed, just walk in and feed coins. Normal norebang (hourly rate rooms) are also all over and are better for groups who want more space and drink service.`,
    author: "jake_brighton",
    category: "free",
    upvotes: 412,
    views: 22180,
    comments: 67,
    createdAt: "2025-10-20",
    tags: ["norebang", "Hongdae", "nightlife", "UK", "coin norebang", "story"]
  },
  {
    id: 6,
    title: "Vegetarian/vegan in Seoul — honest guide from a 2-week trip",
    content: `I'm a vegetarian (no meat, eat eggs and dairy) and I just got back from Seoul. Here's the real situation, not the overly optimistic version some blogs write:

**The honest truth:**
Korean cuisine is heavily meat and seafood based. Many dishes that look vegetarian contain anchovy broth (멸치육수) or pork-based broth as a base. Kimchi traditionally contains fish sauce (there are vegan versions but they're not the default). This is genuinely challenging, especially outside of tourist areas.

**What works:**
- **Bibimbap (비빔밥):** Usually customizable. Ask for no meat (고기 빼주세요 — "goegi ppaeju seyo"). The egg and vegetables make it satisfying.
- **Dubu jorim (두부조림):** Spicy braised tofu. Often genuinely vegan or easily made so.
- **Japchae (잡채):** Glass noodles with vegetables. Often contains meat but can be ordered without.
- **Temple food restaurants (사찰음식):** Vegan Buddhist cuisine. No meat, no fish, and technically no strong-smelling vegetables (garlic, green onions) — unusual taste profile but genuinely excellent. Baru in Insadong is the most accessible restaurant. Expensive but worth it once.
- **Convenience store options:** CU and GS25 have been expanding vegetarian snack options. Check labels.
- **HappyCow app:** Essential for Seoul. The vegan/vegetarian restaurant scene in Itaewon, Hongdae, and Mapo is solid and growing.

**Useful Korean phrases:**
- 고기 빼주세요 = "Please remove the meat"
- 채식주의자예요 = "I am a vegetarian"
- 비건이에요 = "I am vegan"

Not the easiest destination for vegetarians but very manageable with a bit of preparation.`,
    author: "priya_v_travels",
    category: "tip",
    upvotes: 276,
    views: 14550,
    comments: 43,
    createdAt: "2025-09-05",
    tags: ["vegetarian", "vegan", "food", "dietary restrictions", "Seoul", "India"]
  },
  {
    id: 7,
    title: "Best currency exchange rate I found in Seoul — specific locations",
    content: `Canadian here, just back from 12 days in Seoul. I was neurotic about getting good exchange rates so I tested several places.

**Results (USD to KRW, same day, similar amounts):**

1. Incheon Airport — worst rate. 3.8% below mid-market rate. Only exchanged $50 here for immediate expenses.
2. Hana Bank branch (Sinchon) — about 1.9% below mid-market
3. Myeongdong private changers — tested three different shops. Best rate was 0.6% below mid-market. Second best was 0.8%.
4. Shinhan Global ATM withdrawal — about 1.5% below mid-market, plus my home bank charged a CAD $5 flat fee per transaction. Still reasonable for smaller amounts.

**Specific shop recommendation:** The Myeongdong changer with the green and white sign on the main pedestrian street (approximately in the middle of the strip, right side if you're walking away from Myeongdong Station) had the best rate I found. They had a big rate board posted outside. I was exchanging USD in cash — I assume Euro and JPY get similarly good treatment but can't confirm.

**Practical note:** Bring USD cash for best results. Even Canadian dollars sometimes get a slightly worse rate. USD and EUR are the dominant currencies traded and you'll get the most competitive rates with those.`,
    author: "Chris_Vancouver",
    category: "tip",
    upvotes: 183,
    views: 9870,
    comments: 21,
    createdAt: "2025-10-08",
    tags: ["currency", "exchange", "Myeongdong", "won", "Canada", "money"]
  },
  {
    id: 8,
    title: "Gyeongbokgung Palace tips — go early, here's why",
    content: `I visited Gyeongbokgung twice on this trip (I know). First time at 11am on a Saturday. Second time at 9am on a Tuesday (opening time).

The difference was astronomical.

**Saturday 11am:** Massive crowds, especially at the main gate and Gyeonghoeru Pavilion. Hard to take photos without strangers in every frame. Guard ceremony was packed. Hot.

**Tuesday 9am:** Almost empty for the first 45 minutes. I walked through the main courtyard completely alone. Got photos in front of Gyeonghoeru Pavilion with no one in the background. The quiet makes the historical atmosphere actually land.

**Other tips:**
- The National Folk Museum (inside the grounds, free with palace ticket) is actually excellent and chronically undervisited. Budget 1.5 hours minimum.
- The audio guide rental (₩3,000) is worth it for the history context — there's a lot going on in this palace that's invisible without it.
- Hanbok rental for free entry genuinely makes financial sense. ₩15,000–₩20,000 rental vs ₩3,000 admission = the rental costs you about ₩12,000–₩17,000 net but you also get to wander a Joseon palace in traditional dress and take incredible photos. Easy decision.
- Tuesday closure note: the palace is closed on Tuesdays. Don't make my first-visit mistake of showing up on a Tuesday without checking.`,
    author: "helene_paris",
    category: "tip",
    upvotes: 298,
    views: 16340,
    comments: 35,
    createdAt: "2025-10-30",
    tags: ["Gyeongbokgung", "palace", "tips", "hanbok", "France", "morning"]
  },
  {
    id: 9,
    title: "Question: Do I need cash in Korea or can I go card-only?",
    content: `First time visiting Seoul in January (flying from Singapore). I tend to go card-only when traveling because I hate carrying cash. Is this viable in Korea?

Specific situations I'm worried about:
- Street food stalls in Myeongdong
- Small local restaurants
- Traditional markets
- Taxis

I have both Visa and Mastercard. Also have Apple Pay set up.

Thanks in advance`,
    author: "wei_sg",
    category: "question",
    upvotes: 44,
    views: 2810,
    comments: 22,
    createdAt: "2025-11-05",
    tags: ["cash", "cards", "payment", "Singapore", "question", "practical"]
  },
  {
    id: 10,
    title: "KTX Seoul to Busan experience report — worth every won",
    content: `Just did the Seoul-Busan KTX for the first time (I know, I've been living in Seoul for 8 months and kept putting it off). Writing this from Busan.

**Booking:**
Used the KORAIL website. English mode works. Had my Korean bank card and it went through first try. Can also use international Visa/Mastercard. Bought tickets 3 days in advance — this stretch is popular on weekends so I'd book earlier if possible.

**The train:**
Departed Seoul Station at exactly the time shown on the ticket. Arrived Busan at exactly the time shown. I sat there waiting for the 5-minute Korean-style delay that never came.

Seats are like airline economy but more legroom. The countryside outside the window goes from city to rice paddies to mountains to coast in a very satisfying way.

**Busan Station area:**
Right in the middle of central Busan. Subway connections to everywhere including Haeundae beach (about 35 minutes on the subway). No need for a taxi from the station.

**Price:**
I paid ₩59,800 for a standard seat one way. This is genuinely comparable to budget flights once you factor in getting to/from an airport and security time. The train wins.

**The special seats:**
Considered upgrading to 특실 (first class). Decided against it for a 2h15min trip. Might do it for the ride back just to compare.

10/10 would KTX again. Why would you fly domestically in Korea?`,
    author: "brendan_irl",
    category: "review",
    upvotes: 156,
    views: 8920,
    comments: 18,
    createdAt: "2025-10-25",
    tags: ["KTX", "Busan", "train", "review", "Ireland", "transport"]
  },
  {
    id: 11,
    title: "Everything that went wrong on my solo trip to Korea — an honest debrief",
    content: `I see a lot of \"Korea was perfect\" posts and want to add some balance. I had a great trip overall but here are the things that genuinely didn't go smoothly, in case they're useful.

**Naver Map vs reality:**
Twice the directions took me to the building entrance on the wrong side, meaning I walked an extra 10+ minutes around large apartment blocks. In Seoul, "addresses" can mean a large complex with multiple entrances. Arriving at a subway station exit is reliable; navigating to a specific building sometimes isn't. Korean custom is to share a "kakao map pin" with specific meeting points, not just an address. When meeting locals, ask them to share a pin.

**The tourist SIM I bought at the airport:**
Data speed was throttled to basically unusable after 3 days because I hit the daily limit doing a lot of navigation. I didn't realize there was a daily data cap. Read the SIM package carefully — "unlimited" often means unlimited at reduced speed after a threshold. I upgraded at a GS25 using the QR code on the SIM package.

**Trying to go cashless:**
I tried to eat at a small doenjang jjigae restaurant in Insadong and they were cash only. I had ₩2,000 on me. They were very patient and let me run to the GS25 around the corner while my soup waited. Always have some cash.

**Missing last subway:**
Missed the last Line 2 train by 5 minutes on a Tuesday (was in PC bang and lost track of time). The subway in Seoul ends around midnight. I ended up taking a KakaoT taxi home which cost ₩14,000. Not the end of the world but I hadn't planned for it. Know your last subway time.

Everything was fixable. Korea is actually a great country to make mistakes in because people are generally kind and help is usually nearby.`,
    author: "yuki_from_osaka",
    category: "free",
    upvotes: 501,
    views: 27650,
    comments: 78,
    createdAt: "2025-09-18",
    tags: ["honest", "mistakes", "solo travel", "Japan", "tips", "debrief"]
  },
  {
    id: 12,
    title: "PC Bang review: spent a whole rainy day in one and here's what happened",
    content: `It rained heavily all day in Seoul. My original plan was Namsan Tower and then walking Bukchon. Plan scrapped.

I ended up in a PC bang near Sinchon Station for about 6 hours. I am a casual gamer at best — I play FIFA occasionally and used to play a lot of StarCraft II in college. I have not been to a gaming cafe since I was 15.

**First impressions:**
Walked in, said "one person" at the counter, was assigned a seat by a screen at the front desk, sat down. The chair was a gaming chair that cost more than my home desk chair. The monitor was a 27-inch 144Hz panel. The keyboard had satisfying mechanical switches. I felt immediately inadequate as a human being.

**The games:**
Every major game was pre-installed. I played StarCraft II for three hours (got absolutely destroyed in ranked, played some campaign instead). Watched a Korean streamer on Twitch for a bit. Ate ramen delivered to my seat (₩2,500, arrived in 4 minutes, was fine). Downloaded nothing, installed nothing.

**Cost:**
₩1,200/hour. I was there 6 hours. Total: ₩7,200 including the ramen. This is less than one Starbucks coffee back home.

**Observation:**
The PC bang was 80% full at 2pm on a Wednesday. Many people were clearly students. A few older men playing casino-style games in the corner. One guy who appeared to have been there for several consecutive days (I do not know this for certain). The smell of ramen was constant and somehow comforting.

Would do again. Actually looking forward to the next rainy day.`,
    author: "marcus_nl",
    category: "review",
    upvotes: 234,
    views: 12760,
    comments: 29,
    createdAt: "2025-10-12",
    tags: ["PC bang", "gaming", "rainy day", "Netherlands", "review", "Sinchon"]
  },
  {
    id: 13,
    title: "Tip: The 1330 tourist hotline is actually amazing and underused",
    content: `Quick post because I feel like not enough people know about this.

Korea's tourist hotline — 1330 — is a free service you can call from any Korean phone (or even foreign roaming) 24 hours a day, 7 days a week, and get an English-speaking operator.

I used it three times during my 2 weeks:

**Time 1:** My restaurant reservation through a Korean website was unclear — I couldn't tell if it was confirmed. I called 1330, explained the situation, they called the restaurant in Korean on my behalf, confirmed the booking, and told me the details. Total time: 8 minutes.

**Time 2:** Got off at the wrong subway stop and couldn't figure out where I was relative to my hotel. The operator pulled up the location, told me which exit to take, and which bus would get me there. Free real-time guidance.

**Time 3:** I had a minor medical question about a pharmacy purchase — couldn't read the Korean dosage instructions on something I'd bought. The operator translated the relevant instructions for me.

This service is genuinely excellent. It's funded by the Korea Tourism Organization and staffed by professional multilingual operators. Save the number before you leave for the day: **1330**. Works from Korean SIMs and confirmed working from my Australian number on roaming (though I had to dial +82-2-1330 from a foreign number).`,
    author: "amber_syd",
    category: "tip",
    upvotes: 392,
    views: 20140,
    comments: 45,
    createdAt: "2025-10-03",
    tags: ["1330", "tourist hotline", "tips", "emergency", "Australia", "essential"]
  },
  {
    id: 14,
    title: "Honest review of Nanta Show — is it worth ₩77,000?",
    content: `Went to the Myeongdong Nanta show last week. The tickets were ₩66,000 each (mid-tier seats). Here's my honest take.

**The good:**
- Genuinely impressive percussion. These performers are skilled musicians and athletes. There's a sequence with kitchen knives that's legitimately heart-stopping.
- The comedy lands even without Korean language. Physical comedy and facial expressions carry everything.
- Audience participation section was fun — two people from the audience were brought up to help "cook" and it was chaotic and hilarious.
- The pacing is tight. 100 minutes with no dragging sections.

**The less good:**
- The venue at Myeongdong is showing its age slightly. The seats are fine but not luxurious.
- At ₩66,000-₩77,000 per person it's a meaningful chunk of a travel budget.
- It's been running since 1997. If you're familiar with the concept, there are no surprises — the show is essentially the same show it's always been.

**My verdict:**
Worth it once. The percussion quality and the fact it works without any language ability makes it a genuinely good choice for groups with mixed nationalities or families with kids. I went with a Korean friend and two French colleagues and everyone had a good time.

If budget is tight, there are cheaper entertainment options (norebang, street performances in Hongdae are free). But if you're spending on experiences this trip, Nanta delivers.`,
    author: "ricardo_mx",
    category: "review",
    upvotes: 128,
    views: 7380,
    comments: 24,
    createdAt: "2025-11-07",
    tags: ["Nanta", "show", "Myeongdong", "review", "Mexico", "entertainment"]
  },
  {
    id: 15,
    title: "Thai traveler perspective: Korea travel tips that were different from what I expected",
    content: `Just back from 10 days in Seoul. Flying from Bangkok. Writing this because I see most travel posts are from Western countries and the perspective is a bit different for us from Southeast Asia.

**Visa situation:**
Thais need K-ETA (if required for current policy — check before you go, it changes). The application took about 20 minutes online and was approved within a few hours. ₩10,000 fee which is nothing. Compared to visa requirements for many other countries this is very easy.

**Food:**
I was worried Korean food would be too spicy. It's not — most dishes are a different kind of spice from Thai food, and many are mild. Korean spice is more of a slow warmth from gochujang, not the sharp heat of Thai chilies. 삼겹살 (pork belly BBQ) was my favorite discovery — nothing like it at home.

The only adjustment was the fermented flavors (kimchi, doenjang). Strong at first but I was addicted by day 3.

**Weather comparison:**
I went in October. Coming from Bangkok's constant heat, Seoul in October was genuinely cold to me. Locals were in light jackets; I was in a padded coat I'd borrowed from a friend. If you're from tropical countries, bring more layers than you think you need.

**Language:**
My biggest surprise — I got by much better than expected. Subway signs in multiple languages, convenience stores with visual menus, and the tourist hotline (1330) for emergencies. I learned "감사합니다" (thank you) and "얼마예요?" (how much?) and these two phrases covered most daily situations.

**Would recommend to Thai travelers:**
Go. The food is different enough to be exciting but not alienating. The safety is remarkable (I walked everywhere alone at night). The transit is so logical once you understand it. The cosmetics are cheap compared to buying the same brands in Bangkok duty-free.`,
    author: "nattida_bkk",
    category: "free",
    upvotes: 267,
    views: 14230,
    comments: 41,
    createdAt: "2025-10-18",
    tags: ["Thailand", "Southeast Asia", "first-timer", "review", "K-ETA", "food"]
  }
];
