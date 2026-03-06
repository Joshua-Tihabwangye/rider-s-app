/* ─────────────────────────────────────────────────────────────
   Tours – Types, Mock Data & Simulated API
   ───────────────────────────────────────────────────────────── */

// ──── Types ────────────────────────────────────────────────

export interface Tour {
  slug: string;
  title: string;
  subtitle: string;
  destination: string;
  category: "city" | "daytrip" | "safari" | "weekend" | "adventure" | "cultural";
  images: string[];                 // URLs (placeholder gradient boxes used in UI)
  duration: string;                 // "4 hours", "Full day", "2 days"
  durationHours: number;            // numeric for filtering
  rating: number;
  reviewCount: number;
  pricePerPerson: number;           // UGX
  originalPrice?: number;           // strike-through if discounted
  currency: string;
  maxGroupSize: number;
  minGroupSize: number;
  groupType: "private" | "shared" | "both";
  difficulty: "easy" | "moderate" | "hard";
  pickupIncluded: boolean;
  highlights: string[];
  description: string;
  itinerary: ItineraryStep[];
  included: string[];
  notIncluded: string[];
  meetingPoint: string;
  meetingPointCoords?: { lat: number; lng: number };
  pickupDetails?: string;
  cancellationPolicy: string;
  cancellationHours: number;        // free cancel up to X hours
  faqs: FAQ[];
  operatorName: string;
  operatorVerified: boolean;
  evPowered: boolean;
  availableDates: TourDate[];
  addons: Addon[];
  similarTourSlugs: string[];
  availability: "available" | "few_spots" | "sold_out";
  featured?: boolean;
}

export interface ItineraryStep {
  time: string;
  title: string;
  description: string;
}

export interface TourDate {
  date: string;          // ISO YYYY-MM-DD
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  startTime: string;     // "08:00"
  endTime: string;       // "19:00"
  spotsLeft: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
}

export interface Review {
  id: string;
  tourSlug: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}

export type BookingStatus = "confirmed" | "upcoming" | "completed" | "cancelled";

export interface Booking {
  id: string;
  tourSlug: string;
  tourTitle: string;
  tourImage: string;
  destination: string;
  date: string;
  timeSlot: string;
  tourDays: number;          // chosen duration in days
  adults: number;
  children: number;
  addons: string[];
  addonsCost: number;
  baseCost: number;
  taxes: number;
  totalCost: number;
  currency: string;
  status: BookingStatus;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  country: string;
  specialRequests: string;
  promoCode: string;
  promoDiscount: number;
  paymentMethod: string;
  bookingRef: string;
  createdAt: string;
  cancellationPolicy: string;
  cancellationDeadline: string;
}

// ──── Category labels ──────────────────────────────────────

export const CATEGORY_LABELS: Record<Tour["category"], string> = {
  city: "City tours",
  daytrip: "Day trips",
  safari: "Safaris",
  weekend: "Weekend getaways",
  adventure: "Adventure",
  cultural: "Cultural"
};

// ──── Mock Tours ───────────────────────────────────────────

const generateDates = (startOffset: number, count: number): TourDate[] => {
  const dates: TourDate[] = [];
  const today = new Date();
  for (let i = startOffset; i < startOffset + count; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().split("T")[0];
    dates.push({
      date: iso!,
      timeSlots: [
        { id: `${iso}-am`, startTime: "08:00", endTime: "12:00", spotsLeft: Math.floor(Math.random() * 8) + 1 },
        { id: `${iso}-pm`, startTime: "14:00", endTime: "18:00", spotsLeft: Math.floor(Math.random() * 6) + 1 }
      ]
    });
  }
  return dates;
};

export const TOURS: Tour[] = [
  {
    slug: "kampala-city-ev-highlights",
    title: "Kampala City EV Highlights",
    subtitle: "Explore Uganda's vibrant capital in a quiet, zero-emission vehicle",
    destination: "Kampala",
    category: "city",
    images: ["kampala-1", "kampala-2", "kampala-3", "kampala-4"],
    duration: "4–5 hours",
    durationHours: 5,
    rating: 4.8,
    reviewCount: 124,
    pricePerPerson: 180000,
    currency: "UGX",
    maxGroupSize: 8,
    minGroupSize: 1,
    groupType: "both",
    difficulty: "easy",
    pickupIncluded: true,
    highlights: [
      "Ride in a 100% electric vehicle through Kampala",
      "Visit the iconic Old Taxi Park & Parliament Avenue",
      "Explore a vibrant local market with your guide",
      "Catch sunset views at Ggaba lakeside",
      "Small group or private option available"
    ],
    description: "Discover Kampala like never before — from the back of a quiet, zero-emission EV. Your expert local guide will take you through bustling downtown streets, past historic landmarks, through colorful markets and out to the peaceful shores of Lake Victoria at Ggaba. Perfect for first-time visitors and residents who want to see their city differently.",
    itinerary: [
      { time: "14:00", title: "Hotel / meeting point pickup", description: "Your EV driver picks you up from your hotel or a central meeting point in Kampala." },
      { time: "14:30", title: "Old Taxi Park & Downtown", description: "Drive through the famous Old Taxi Park and along Parliament Avenue, learning about Kampala's history." },
      { time: "15:30", title: "Local market stop", description: "Step out and explore a vibrant local market. Taste fresh tropical fruits and chat with vendors." },
      { time: "16:30", title: "Namugongo Martyrs Shrine", description: "A brief stop at this important cultural and religious site." },
      { time: "17:00", title: "Ggaba lakeside views", description: "Arrive at Ggaba for stunning sunset views over Lake Victoria. Enjoy complimentary bottled water." },
      { time: "18:30", title: "Drop-off", description: "Return to your original pickup point or a central location of your choice." }
    ],
    included: ["EV transport with air conditioning", "English-speaking guide", "Bottled water", "Hotel / central pickup & drop-off", "All entrance fees"],
    notIncluded: ["Meals and snacks (available for purchase)", "Personal shopping", "Gratuities"],
    meetingPoint: "Central Kampala — hotel pickup or Garden City Mall meeting point",
    meetingPointCoords: { lat: 0.3136, lng: 32.5811 },
    pickupDetails: "Your driver will contact you 30 minutes before pickup. Available from most Kampala hotels within 10 km of city centre.",
    cancellationPolicy: "Free cancellation up to 24 hours before the tour. After that, 50% fee applies.",
    cancellationHours: 24,
    faqs: [
      { question: "Is the vehicle fully electric?", answer: "Yes — 100% battery electric. Zero emissions, very quiet ride." },
      { question: "Can children join?", answer: "Absolutely! Children under 5 ride free. Ages 5–12 pay 50% of adult price." },
      { question: "What if it rains?", answer: "The tour runs rain or shine. The EV is fully enclosed with A/C. We provide umbrellas for walking stops." },
      { question: "Can I customize the route?", answer: "For private tours, yes! Let us know your interests and we'll tailor the itinerary." }
    ],
    operatorName: "EVzone Tours",
    operatorVerified: true,
    evPowered: true,
    availableDates: generateDates(1, 21),
    addons: [
      { id: "addon-lunch", name: "Lunch package", description: "Traditional Ugandan lunch at a recommended restaurant", price: 45000, currency: "UGX" },
      { id: "addon-photo", name: "Professional photos", description: "A photographer joins for the first 2 hours", price: 80000, currency: "UGX" },
      { id: "addon-snack", name: "Snack pack", description: "Local snacks & fresh juice pack", price: 15000, currency: "UGX" }
    ],
    similarTourSlugs: ["jinja-source-of-the-nile", "entebbe-botanical-lakeside", "kampala-nightlife-ev-tour"],
    availability: "available",
    featured: true
  },
  {
    slug: "jinja-source-of-the-nile",
    title: "EV Day Trip – Jinja, Source of the Nile",
    subtitle: "Full-day adventure to the birthplace of the world's longest river",
    destination: "Jinja",
    category: "daytrip",
    images: ["jinja-1", "jinja-2", "jinja-3", "jinja-4"],
    duration: "Full day (10–11 hrs)",
    durationHours: 11,
    rating: 4.9,
    reviewCount: 89,
    pricePerPerson: 350000,
    currency: "UGX",
    maxGroupSize: 6,
    minGroupSize: 2,
    groupType: "shared",
    difficulty: "easy",
    pickupIncluded: true,
    highlights: [
      "Scenic EV drive from Kampala to Jinja (approx 2 hrs)",
      "Boat ride to the exact Source of the Nile",
      "Visit Bujagali Falls viewpoint",
      "Delicious lunch at a Nile-side restaurant",
      "Optional white-water rafting add-on"
    ],
    description: "Take the ultimate day trip from Kampala to Jinja, the adventure capital of East Africa. Travel in comfort aboard an electric vehicle, visit the legendary Source of the Nile where Lake Victoria feeds into the world's longest river, and enjoy a relaxing boat ride. This is an unforgettable experience for nature lovers and history enthusiasts alike.",
    itinerary: [
      { time: "08:00", title: "Kampala departure", description: "Pick up from your hotel. Comfortable EV drive to Jinja with a brief stop at Mabira Forest viewpoint." },
      { time: "10:00", title: "Arrive Jinja", description: "Arrive in Jinja. Quick orientation walk through the town." },
      { time: "10:30", title: "Source of the Nile boat trip", description: "Board a motorboat to the exact source point of the Nile. Learn about the history and significance." },
      { time: "12:00", title: "Bujagali Falls viewpoint", description: "Drive to the Bujagali Falls area for a stunning viewpoint stop." },
      { time: "13:00", title: "Lunch", description: "Enjoy a delicious meal at a Nile-side restaurant with river views (included)." },
      { time: "14:30", title: "Free time or add-on", description: "Explore Jinja at your own pace, or do optional white-water rafting (add-on)." },
      { time: "16:30", title: "Depart for Kampala", description: "Begin the scenic drive back." },
      { time: "19:00", title: "Kampala arrival", description: "Drop-off at your hotel or central location." }
    ],
    included: ["Return EV transport from Kampala", "Boat ride at Source of the Nile", "Lunch at Nile-side restaurant", "Park entry fees", "English-speaking driver guide", "Bottled water"],
    notIncluded: ["White-water rafting (optional add-on)", "Personal purchases", "Alcoholic drinks", "Gratuities"],
    meetingPoint: "Kampala hotel pickup or Jinja Road meeting point",
    cancellationPolicy: "Free cancellation up to 48 hours before departure. 24–48 hours: 25% fee. Under 24 hours: no refund.",
    cancellationHours: 48,
    faqs: [
      { question: "How long is the drive to Jinja?", answer: "About 2 hours each way via the Kampala-Jinja highway. The EV makes it very comfortable." },
      { question: "Is lunch included?", answer: "Yes, a full lunch at a Nile-side restaurant is included. Vegetarian options available." },
      { question: "Can I add white-water rafting?", answer: "Yes! Select the rafting add-on during booking. It adds approximately 3 hours and costs UGX 250,000." }
    ],
    operatorName: "EVzone Tours",
    operatorVerified: true,
    evPowered: true,
    availableDates: generateDates(2, 18),
    addons: [
      { id: "addon-rafting", name: "White-water rafting", description: "Grade 3-5 rapids on the Nile. ~3 hours, all equipment included.", price: 250000, currency: "UGX" },
      { id: "addon-photo", name: "Professional photos", description: "Photographer for the full day", price: 120000, currency: "UGX" },
      { id: "addon-upgrade-lunch", name: "Premium lunch upgrade", description: "Upgrade to a premium 3-course Nile-side dining experience", price: 65000, currency: "UGX" }
    ],
    similarTourSlugs: ["kampala-city-ev-highlights", "lake-mburo-weekend-safari", "ssese-islands-getaway"],
    availability: "few_spots"
  },
  {
    slug: "lake-mburo-weekend-safari",
    title: "Weekend EV Safari – Lake Mburo",
    subtitle: "Two-day wildlife experience with eco-friendly EV transport",
    destination: "Lake Mburo National Park",
    category: "safari",
    images: ["mburo-1", "mburo-2", "mburo-3", "mburo-4"],
    duration: "2 days / 1 night",
    durationHours: 36,
    rating: 4.7,
    reviewCount: 56,
    pricePerPerson: 950000,
    originalPrice: 1100000,
    currency: "UGX",
    maxGroupSize: 6,
    minGroupSize: 2,
    groupType: "both",
    difficulty: "easy",
    pickupIncluded: true,
    highlights: [
      "EV-powered transfer from Kampala to Lake Mburo",
      "Morning and evening game drives",
      "Spot zebras, impalas, buffalos and hippos",
      "Comfortable lodge accommodation with park views",
      "Guided nature walk along the lake"
    ],
    description: "Escape the city for a magical weekend at Lake Mburo National Park. Travel in a quiet electric vehicle, enjoy morning and evening game drives among zebras and impalas, and spend the night at a cozy park-side lodge. This is the perfect introduction to East African safari life — accessible, affordable, and eco-friendly.",
    itinerary: [
      { time: "Day 1 - 07:00", title: "Depart Kampala", description: "Early morning departure via the Kampala-Mbarara highway. Stop at the Equator for photos." },
      { time: "Day 1 - 11:00", title: "Arrive Lake Mburo", description: "Check in at your lodge. Freshen up and enjoy lunch." },
      { time: "Day 1 - 15:00", title: "Afternoon game drive", description: "Explore the park's savannah in your EV. Spot zebras, impalas, topi, and more." },
      { time: "Day 1 - 18:30", title: "Sundowner", description: "Enjoy a sunset drink overlooking the lake before dinner at the lodge." },
      { time: "Day 2 - 06:30", title: "Morning game drive", description: "Early start for the best wildlife sightings. Hippos, buffalos, and birdlife." },
      { time: "Day 2 - 09:00", title: "Guided nature walk", description: "Walk along the lake shore with a park ranger. Learn about the flora and fauna." },
      { time: "Day 2 - 11:00", title: "Brunch & checkout", description: "Enjoy brunch at the lodge, then check out." },
      { time: "Day 2 - 14:00", title: "Return to Kampala", description: "Comfortable EV drive back, arriving late afternoon." }
    ],
    included: ["Return EV transport from Kampala", "1 night lodge accommodation", "All meals (2 lunches, dinner, breakfast, brunch)", "2 game drives", "Guided nature walk", "Park entry fees", "Bottled water"],
    notIncluded: ["Alcoholic beverages", "Laundry", "Gratuities", "Travel insurance"],
    meetingPoint: "Kampala hotel pickup (early morning)",
    cancellationPolicy: "Free cancellation up to 72 hours before departure. 48-72 hours: 25% fee. Under 48 hours: 50% fee.",
    cancellationHours: 72,
    faqs: [
      { question: "What animals will I see?", answer: "Lake Mburo is known for zebras, impalas, elands, topi, buffalos, hippos, and over 350 bird species." },
      { question: "Is the accommodation comfortable?", answer: "Yes — we partner with mid-range lodges with en-suite rooms, hot water, and park views." },
      { question: "Can I bring children?", answer: "Yes, children 6+ are welcome on game drives. Under 6 can enjoy the lodge and nature walks." }
    ],
    operatorName: "EVzone Safaris",
    operatorVerified: true,
    evPowered: true,
    availableDates: generateDates(3, 14),
    addons: [
      { id: "addon-upgrade-room", name: "Room upgrade", description: "Upgrade to a deluxe room with private terrace", price: 150000, currency: "UGX" },
      { id: "addon-boat", name: "Lake boat cruise", description: "1-hour boat trip to see hippos up close", price: 80000, currency: "UGX" },
      { id: "addon-insurance", name: "Travel insurance", description: "Comprehensive cover for the trip duration", price: 35000, currency: "UGX" }
    ],
    similarTourSlugs: ["jinja-source-of-the-nile", "queen-elizabeth-safari", "ssese-islands-getaway"],
    availability: "available"
  },
  {
    slug: "entebbe-botanical-lakeside",
    title: "Entebbe Botanical & Lakeside Tour",
    subtitle: "Peaceful half-day exploring Entebbe's gardens and Lake Victoria shores",
    destination: "Entebbe",
    category: "city",
    images: ["entebbe-1", "entebbe-2", "entebbe-3"],
    duration: "4 hours",
    durationHours: 4,
    rating: 4.6,
    reviewCount: 43,
    pricePerPerson: 120000,
    currency: "UGX",
    maxGroupSize: 10,
    minGroupSize: 1,
    groupType: "both",
    difficulty: "easy",
    pickupIncluded: true,
    highlights: [
      "Stroll through the century-old Entebbe Botanical Gardens",
      "Lake Victoria beach walk",
      "Visit the Uganda Wildlife Education Centre",
      "Fresh fish lunch at a lakeside restaurant"
    ],
    description: "A relaxing half-day escape from Kampala to the green, lakeside town of Entebbe. Walk through the historic Botanical Gardens, home to tropical plants and monkeys, then enjoy Lake Victoria's peaceful shoreline. End with fresh tilapia at a local lakeside restaurant.",
    itinerary: [
      { time: "09:00", title: "Kampala pickup", description: "EV pickup from your hotel. 40-minute drive to Entebbe." },
      { time: "09:45", title: "Botanical Gardens", description: "Explore the lush gardens with your guide. Spot monkeys and exotic birds." },
      { time: "11:00", title: "Lake Victoria beach", description: "Walk along the lake shore. Photo opportunities with stunning views." },
      { time: "12:00", title: "Lakeside lunch", description: "Enjoy fresh fish at a recommended restaurant (optional at own cost or add-on)." },
      { time: "13:00", title: "Return to Kampala", description: "Comfortable drive back to your hotel." }
    ],
    included: ["EV transport", "Botanical Gardens entry fee", "English-speaking guide", "Bottled water"],
    notIncluded: ["Lunch (available as add-on)", "Personal purchases", "Gratuities"],
    meetingPoint: "Kampala hotel pickup",
    cancellationPolicy: "Free cancellation up to 24 hours before the tour.",
    cancellationHours: 24,
    faqs: [
      { question: "Is lunch included?", answer: "By default, no — but you can add a lunch package during booking." },
      { question: "Is this suitable for elderly visitors?", answer: "Yes, the walking is gentle and mostly flat. We can accommodate mobility needs." }
    ],
    operatorName: "EVzone Tours",
    operatorVerified: true,
    evPowered: true,
    availableDates: generateDates(1, 21),
    addons: [
      { id: "addon-lunch-entebbe", name: "Lakeside lunch", description: "Fresh tilapia lunch with a lake view", price: 40000, currency: "UGX" },
      { id: "addon-wildlife-centre", name: "Wildlife Centre visit", description: "Add a visit to the Uganda Wildlife Education Centre", price: 30000, currency: "UGX" }
    ],
    similarTourSlugs: ["kampala-city-ev-highlights", "ssese-islands-getaway"],
    availability: "available"
  },
  {
    slug: "ssese-islands-getaway",
    title: "Ssese Islands Weekend Getaway",
    subtitle: "Tropical island escape on Lake Victoria with EV transfers",
    destination: "Ssese Islands",
    category: "weekend",
    images: ["ssese-1", "ssese-2", "ssese-3", "ssese-4"],
    duration: "3 days / 2 nights",
    durationHours: 60,
    rating: 4.5,
    reviewCount: 31,
    pricePerPerson: 1200000,
    currency: "UGX",
    maxGroupSize: 8,
    minGroupSize: 2,
    groupType: "shared",
    difficulty: "easy",
    pickupIncluded: true,
    highlights: [
      "EV drive to Entebbe + ferry to Ssese Islands",
      "White sand beaches and crystal-clear water",
      "Island cycling and nature walks",
      "Beachfront resort accommodation",
      "Stunning Lake Victoria sunsets"
    ],
    description: "Disconnect and unwind on the beautiful Ssese Islands in Lake Victoria. This three-day getaway includes EV transport, ferry crossing, beachfront accommodation, and plenty of time to explore island life — cycling, swimming, hiking, and simply relaxing by the water.",
    itinerary: [
      { time: "Day 1 - 07:00", title: "Kampala to Entebbe", description: "EV pickup and drive to Entebbe ferry terminal." },
      { time: "Day 1 - 08:30", title: "Ferry to Ssese Islands", description: "Scenic 3.5-hour ferry ride across Lake Victoria." },
      { time: "Day 1 - 12:00", title: "Arrive & check in", description: "Arrive at your beachfront resort. Lunch and settle in." },
      { time: "Day 1 - PM", title: "Beach & sunset", description: "Free afternoon to swim, explore, or simply relax on the beach." },
      { time: "Day 2 - Full day", title: "Island exploration", description: "Guided cycling tour, nature walks, fishing, or kayaking. All equipment included." },
      { time: "Day 3 - AM", title: "Morning swim & brunch", description: "Last morning on the island. Enjoy the beach and a final brunch." },
      { time: "Day 3 - 12:00", title: "Ferry & return", description: "Ferry back to Entebbe. EV drive to Kampala, arriving ~18:00." }
    ],
    included: ["Return EV transport + ferry tickets", "2 nights beachfront accommodation", "All meals", "Island cycling equipment", "Nature walk guide"],
    notIncluded: ["Alcoholic drinks", "Spa treatments", "Fishing equipment rental", "Travel insurance"],
    meetingPoint: "Kampala hotel pickup (early morning)",
    cancellationPolicy: "Free cancellation up to 7 days before. 3-7 days: 25% fee. Under 3 days: 50% fee.",
    cancellationHours: 168,
    faqs: [
      { question: "Is the ferry safe?", answer: "Yes, we use the main MV Kalangala ferry which is well-maintained and regularly inspected." },
      { question: "Is there Wi-Fi on the island?", answer: "Limited — some resorts have basic Wi-Fi. This is a great chance to disconnect!" }
    ],
    operatorName: "EVzone Adventures",
    operatorVerified: true,
    evPowered: true,
    availableDates: generateDates(5, 10),
    addons: [
      { id: "addon-fishing", name: "Fishing excursion", description: "Half-day fishing trip on Lake Victoria", price: 80000, currency: "UGX" },
      { id: "addon-spa", name: "Spa package", description: "Relaxing massage at the resort spa", price: 60000, currency: "UGX" },
      { id: "addon-insurance-ssese", name: "Travel insurance", description: "Comprehensive cover for the trip", price: 45000, currency: "UGX" }
    ],
    similarTourSlugs: ["lake-mburo-weekend-safari", "entebbe-botanical-lakeside"],
    availability: "available"
  },
  {
    slug: "kampala-nightlife-ev-tour",
    title: "Kampala Nightlife EV Tour",
    subtitle: "Experience Kampala after dark with a safe EV-powered pub crawl",
    destination: "Kampala",
    category: "cultural",
    images: ["nightlife-1", "nightlife-2", "nightlife-3"],
    duration: "5 hours",
    durationHours: 5,
    rating: 4.4,
    reviewCount: 67,
    pricePerPerson: 150000,
    currency: "UGX",
    maxGroupSize: 10,
    minGroupSize: 2,
    groupType: "shared",
    difficulty: "easy",
    pickupIncluded: true,
    highlights: [
      "Visit 3–4 of Kampala's best nightlife spots",
      "Safe EV transport between venues",
      "Complimentary welcome drink at first stop",
      "Meet fellow travelers and locals",
      "End at a live music venue"
    ],
    description: "See a different side of Kampala! This evening tour takes you to the city's most exciting bars, rooftop lounges, and live music venues — all connected by safe, quiet EV transport. No worrying about taxis or navigation. Just enjoy the night with your group.",
    itinerary: [
      { time: "19:00", title: "Hotel pickup", description: "Your EV picks you up for the night ahead." },
      { time: "19:30", title: "Rooftop bar", description: "Start with sundowner cocktails at a rooftop bar with city views. Welcome drink included." },
      { time: "21:00", title: "Local pub & street food", description: "Experience a popular local pub. Try rolex wraps and other street food." },
      { time: "22:30", title: "Live music venue", description: "End the night at a live Afrobeats or jazz venue." },
      { time: "00:00", title: "Drop-off", description: "Safe EV ride back to your hotel." }
    ],
    included: ["EV transport all evening", "Welcome drink", "Local guide / host", "Street food tasting"],
    notIncluded: ["Additional drinks", "Entry fees at venues (if any)", "Gratuities"],
    meetingPoint: "Kampala hotel pickup",
    cancellationPolicy: "Free cancellation up to 12 hours before the tour.",
    cancellationHours: 12,
    faqs: [
      { question: "Is this safe?", answer: "Absolutely — you'll have a dedicated driver and guide throughout. No need to handle transport yourself." },
      { question: "What's the age limit?", answer: "18+ only for this tour." }
    ],
    operatorName: "EVzone Tours",
    operatorVerified: true,
    evPowered: true,
    availableDates: generateDates(1, 21),
    addons: [
      { id: "addon-drinks-package", name: "Drinks package", description: "3 additional drinks included across all venues", price: 60000, currency: "UGX" },
      { id: "addon-vip-entry", name: "VIP entry", description: "Skip the line at premium venues", price: 40000, currency: "UGX" }
    ],
    similarTourSlugs: ["kampala-city-ev-highlights"],
    availability: "available"
  },
  {
    slug: "queen-elizabeth-safari",
    title: "Queen Elizabeth NP – 3 Day Safari",
    subtitle: "The ultimate Ugandan safari experience with EV game drives",
    destination: "Queen Elizabeth National Park",
    category: "safari",
    images: ["qenp-1", "qenp-2", "qenp-3", "qenp-4"],
    duration: "3 days / 2 nights",
    durationHours: 60,
    rating: 4.9,
    reviewCount: 38,
    pricePerPerson: 2800000,
    originalPrice: 3200000,
    currency: "UGX",
    maxGroupSize: 6,
    minGroupSize: 2,
    groupType: "private",
    difficulty: "moderate",
    pickupIncluded: true,
    highlights: [
      "Home to tree-climbing lions & 600+ bird species",
      "Kazinga Channel boat cruise for hippos & elephants",
      "Game drives in quiet EV vehicles",
      "Premium lodge accommodation",
      "Expert naturalist guides"
    ],
    description: "Experience one of Africa's most diverse national parks with the world's first EV game drive vehicles. Queen Elizabeth NP spans savannah, wetlands, and volcanic craters, home to lions, leopards, elephants, hippos, and hundreds of bird species. This 3-day premium safari is the trip of a lifetime.",
    itinerary: [
      { time: "Day 1", title: "Fly or drive to QENP", description: "Domestic flight to Kasese or long scenic drive. Arrive, check in to lodge." },
      { time: "Day 1 PM", title: "Kazinga Channel cruise", description: "Afternoon boat cruise. See hippos, elephants, buffalo at the water's edge." },
      { time: "Day 2 AM", title: "Early morning game drive", description: "Best time for predator sightings. Look for the famous tree-climbing lions." },
      { time: "Day 2 PM", title: "Crater lakes drive", description: "Explore the stunning explosion craters and volcanic landscapes." },
      { time: "Day 3 AM", title: "Final game drive + departure", description: "Last chance for wildlife sightings before returning to Kampala." }
    ],
    included: ["Return transport (EV where possible)", "2 nights premium lodge", "All meals", "3 game drives", "Boat cruise", "Park fees", "Expert guide"],
    notIncluded: ["Domestic flights (can be arranged)", "Drinks", "Laundry", "Tips", "Travel insurance"],
    meetingPoint: "Kampala hotel or Entebbe airport",
    cancellationPolicy: "Free cancellation up to 14 days before. 7-14 days: 25% fee. Under 7 days: 50% fee.",
    cancellationHours: 336,
    faqs: [
      { question: "Will I see lions?", answer: "Queen Elizabeth NP is famous for tree-climbing lions. Sightings are likely but not guaranteed in wildlife." },
      { question: "Is the drive long?", answer: "About 6–7 hours by road. We recommend the domestic flight option (1 hour) for comfort." }
    ],
    operatorName: "EVzone Safaris",
    operatorVerified: true,
    evPowered: true,
    availableDates: generateDates(7, 10),
    addons: [
      { id: "addon-flight", name: "Domestic flight", description: "Return flight Entebbe ↔ Kasese (1 hr vs 7 hrs drive)", price: 800000, currency: "UGX" },
      { id: "addon-chimp", name: "Chimp trekking add-on", description: "Half-day chimpanzee tracking in Kyambura Gorge", price: 350000, currency: "UGX" },
      { id: "addon-insurance-qe", name: "Travel insurance", description: "Comprehensive safari insurance", price: 55000, currency: "UGX" }
    ],
    similarTourSlugs: ["lake-mburo-weekend-safari", "ssese-islands-getaway"],
    availability: "few_spots",
    featured: true
  },
  {
    slug: "murchison-falls-adventure",
    title: "Murchison Falls Adventure – 2 Days",
    subtitle: "Witness the world's most powerful waterfall and abundant wildlife",
    destination: "Murchison Falls",
    category: "adventure",
    images: ["murchison-1", "murchison-2", "murchison-3"],
    duration: "2 days / 1 night",
    durationHours: 36,
    rating: 4.8,
    reviewCount: 44,
    pricePerPerson: 1500000,
    currency: "UGX",
    maxGroupSize: 8,
    minGroupSize: 2,
    groupType: "both",
    difficulty: "moderate",
    pickupIncluded: true,
    highlights: [
      "See the mighty Murchison Falls up close",
      "Game drive with giraffes, elephants, lions",
      "Nile boat cruise to the falls base",
      "Top-of-falls hiking trail",
      "Comfortable lodge stay"
    ],
    description: "Visit Uganda's largest national park and witness the incredible Murchison Falls, where the entire Nile River forces through a 7-metre gap. Combine wildlife game drives with a dramatic boat cruise to the base of the falls.",
    itinerary: [
      { time: "Day 1 - 06:00", title: "Depart Kampala", description: "Early start for the drive north. Stop at Ziwa Rhino Sanctuary en route." },
      { time: "Day 1 - 12:00", title: "Arrive & lunch", description: "Check in to your lodge. Lunch with park views." },
      { time: "Day 1 - 14:00", title: "Boat cruise to the falls", description: "Cruise up the Nile to the thundering base of Murchison Falls." },
      { time: "Day 2 - 06:30", title: "Morning game drive", description: "Cross the Nile by ferry for game drives on the north bank. Giraffes, elephants, lions." },
      { time: "Day 2 - 12:00", title: "Top of the falls hike", description: "Short hike to the top of Murchison Falls for breathtaking views." },
      { time: "Day 2 - 14:00", title: "Return to Kampala", description: "Drive back arriving early evening." }
    ],
    included: ["Return transport", "1 night lodge", "All meals", "Game drive", "Boat cruise", "Falls hike", "Park fees", "Guide"],
    notIncluded: ["Drinks", "Ziwa Rhino tracking ($30 pp)", "Tips", "Insurance"],
    meetingPoint: "Kampala hotel pickup",
    cancellationPolicy: "Free cancellation up to 72 hours before departure.",
    cancellationHours: 72,
    faqs: [
      { question: "How long is the drive?", answer: "About 5–6 hours each way. We leave very early to maximize park time." },
      { question: "Can I see rhinos?", answer: "We stop at Ziwa Rhino Sanctuary en route (optional add-on). It's the only place in Uganda to see rhinos." }
    ],
    operatorName: "EVzone Adventures",
    operatorVerified: true,
    evPowered: true,
    availableDates: generateDates(4, 12),
    addons: [
      { id: "addon-rhino", name: "Rhino tracking at Ziwa", description: "Walk with wild rhinos at Ziwa Sanctuary", price: 100000, currency: "UGX" },
      { id: "addon-premium-lodge", name: "Premium lodge upgrade", description: "Upgrade to a luxury riverside lodge", price: 200000, currency: "UGX" }
    ],
    similarTourSlugs: ["queen-elizabeth-safari", "lake-mburo-weekend-safari"],
    availability: "available"
  }
];

// ──── Mock Reviews ─────────────────────────────────────────

export const REVIEWS: Review[] = [
  { id: "r1", tourSlug: "kampala-city-ev-highlights", author: "Sarah M.", rating: 5, date: "2026-02-15", comment: "Amazing experience! The EV was so quiet and comfortable. Our guide knew every corner of Kampala. Highly recommend!", helpful: 12 },
  { id: "r2", tourSlug: "kampala-city-ev-highlights", author: "James K.", rating: 5, date: "2026-02-10", comment: "Perfect afternoon tour. The sunset at Ggaba was incredible. Great value for money.", helpful: 8 },
  { id: "r3", tourSlug: "kampala-city-ev-highlights", author: "Anna L.", rating: 4, date: "2026-01-28", comment: "Lovely tour overall. The market visit was my favorite part. Would have liked a bit more time at each stop.", helpful: 5 },
  { id: "r4", tourSlug: "kampala-city-ev-highlights", author: "David O.", rating: 5, date: "2026-01-15", comment: "Best way to see Kampala! The electric car was a conversation starter everywhere we went.", helpful: 15 },
  { id: "r5", tourSlug: "jinja-source-of-the-nile", author: "Emma W.", rating: 5, date: "2026-02-20", comment: "The Source of the Nile boat ride was magical. Lunch was delicious. The whole day was perfectly organized.", helpful: 20 },
  { id: "r6", tourSlug: "jinja-source-of-the-nile", author: "Michael T.", rating: 5, date: "2026-02-05", comment: "Did the rafting add-on — absolutely incredible! The EV ride there was so smooth. 10/10.", helpful: 18 },
  { id: "r7", tourSlug: "jinja-source-of-the-nile", author: "Lucy N.", rating: 4, date: "2026-01-22", comment: "Great day trip. Long drive but worth it. The guide was knowledgeable and friendly.", helpful: 7 },
  { id: "r8", tourSlug: "lake-mburo-weekend-safari", author: "Peter H.", rating: 5, date: "2026-02-12", comment: "Saw so many zebras and hippos! The lodge was comfortable and the food was excellent. Unforgettable weekend.", helpful: 14 },
  { id: "r9", tourSlug: "lake-mburo-weekend-safari", author: "Grace A.", rating: 4, date: "2026-01-30", comment: "Beautiful park. The EV game drive was a unique experience — animals weren't scared at all because it's so quiet!", helpful: 11 },
  { id: "r10", tourSlug: "queen-elizabeth-safari", author: "Tom R.", rating: 5, date: "2026-02-18", comment: "Trip of a lifetime! We saw tree-climbing lions on day 2. The boat cruise was spectacular. Worth every penny.", helpful: 25 },
  { id: "r11", tourSlug: "entebbe-botanical-lakeside", author: "Ruth K.", rating: 5, date: "2026-02-22", comment: "Such a peaceful morning. The Botanical Gardens were beautiful and the lake views were stunning.", helpful: 6 },
  { id: "r12", tourSlug: "kampala-nightlife-ev-tour", author: "Chris B.", rating: 4, date: "2026-02-01", comment: "Fun night out! Great way to explore Kampala's nightlife safely. The rooftop bar was amazing.", helpful: 9 }
];

// ──── Mock Bookings ────────────────────────────────────────

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "BK-2026-0301-001",
    tourSlug: "kampala-city-ev-highlights",
    tourTitle: "Kampala City EV Highlights",
    tourImage: "kampala-1",
    destination: "Kampala",
    date: "2026-03-15",
    timeSlot: "14:00 – 18:30",
    tourDays: 1,
    adults: 2,
    children: 1,
    addons: ["Lunch package"],
    addonsCost: 45000,
    baseCost: 405000,
    taxes: 20250,
    totalCost: 470250,
    currency: "UGX",
    status: "upcoming",
    contactName: "Robert Zimba",
    contactEmail: "robert@example.com",
    contactPhone: "+256 700 123 456",
    country: "Uganda",
    specialRequests: "We have a 4-year-old child. Please ensure car seat.",
    promoCode: "",
    promoDiscount: 0,
    paymentMethod: "Mobile Money",
    bookingRef: "EVZ-TOUR-2026-0301-001",
    createdAt: "2026-03-01T10:30:00Z",
    cancellationPolicy: "Free cancellation up to 24 hours before the tour.",
    cancellationDeadline: "2026-03-14T14:00:00Z"
  },
  {
    id: "BK-2026-0225-002",
    tourSlug: "jinja-source-of-the-nile",
    tourTitle: "EV Day Trip – Jinja, Source of the Nile",
    tourImage: "jinja-1",
    destination: "Jinja",
    date: "2026-03-22",
    timeSlot: "08:00 – 19:00",
    tourDays: 1,
    adults: 3,
    children: 0,
    addons: ["White-water rafting", "Professional photos"],
    addonsCost: 370000,
    baseCost: 1050000,
    taxes: 71000,
    totalCost: 1491000,
    currency: "UGX",
    status: "confirmed",
    contactName: "Robert Zimba",
    contactEmail: "robert@example.com",
    contactPhone: "+256 700 123 456",
    country: "Uganda",
    specialRequests: "",
    promoCode: "ADVENTURE10",
    promoDiscount: 105000,
    paymentMethod: "Card",
    bookingRef: "EVZ-TOUR-2026-0225-002",
    createdAt: "2026-02-25T14:20:00Z",
    cancellationPolicy: "Free cancellation up to 48 hours before departure.",
    cancellationDeadline: "2026-03-20T08:00:00Z"
  },
  {
    id: "BK-2026-0210-003",
    tourSlug: "kampala-city-ev-highlights",
    tourTitle: "Kampala City EV Highlights",
    tourImage: "kampala-1",
    destination: "Kampala",
    date: "2026-02-15",
    timeSlot: "14:00 – 18:30",
    tourDays: 1,
    adults: 2,
    children: 0,
    addons: [],
    addonsCost: 0,
    baseCost: 360000,
    taxes: 18000,
    totalCost: 378000,
    currency: "UGX",
    status: "completed",
    contactName: "Robert Zimba",
    contactEmail: "robert@example.com",
    contactPhone: "+256 700 123 456",
    country: "Uganda",
    specialRequests: "",
    promoCode: "",
    promoDiscount: 0,
    paymentMethod: "Mobile Money",
    bookingRef: "EVZ-TOUR-2026-0210-003",
    createdAt: "2026-02-10T09:15:00Z",
    cancellationPolicy: "Free cancellation up to 24 hours before the tour.",
    cancellationDeadline: "2026-02-14T14:00:00Z"
  },
  {
    id: "BK-2026-0120-004",
    tourSlug: "lake-mburo-weekend-safari",
    tourTitle: "Weekend EV Safari – Lake Mburo",
    tourImage: "mburo-1",
    destination: "Lake Mburo",
    date: "2026-01-25",
    timeSlot: "07:00 – 14:00 (next day)",
    tourDays: 2,
    adults: 4,
    children: 0,
    addons: ["Lake boat cruise"],
    addonsCost: 80000,
    baseCost: 3800000,
    taxes: 194000,
    totalCost: 4074000,
    currency: "UGX",
    status: "completed",
    contactName: "Robert Zimba",
    contactEmail: "robert@example.com",
    contactPhone: "+256 700 123 456",
    country: "Uganda",
    specialRequests: "Vegetarian meals for 2 guests please.",
    promoCode: "",
    promoDiscount: 0,
    paymentMethod: "Card",
    bookingRef: "EVZ-TOUR-2026-0120-004",
    createdAt: "2026-01-15T16:40:00Z",
    cancellationPolicy: "Free cancellation up to 72 hours before departure.",
    cancellationDeadline: "2026-01-22T07:00:00Z"
  },
  {
    id: "BK-2026-0105-005",
    tourSlug: "entebbe-botanical-lakeside",
    tourTitle: "Entebbe Botanical & Lakeside Tour",
    tourImage: "entebbe-1",
    destination: "Entebbe",
    date: "2026-01-10",
    timeSlot: "09:00 – 13:00",
    tourDays: 1,
    adults: 1,
    children: 0,
    addons: [],
    addonsCost: 0,
    baseCost: 120000,
    taxes: 6000,
    totalCost: 126000,
    currency: "UGX",
    status: "cancelled",
    contactName: "Robert Zimba",
    contactEmail: "robert@example.com",
    contactPhone: "+256 700 123 456",
    country: "Uganda",
    specialRequests: "",
    promoCode: "",
    promoDiscount: 0,
    paymentMethod: "Mobile Money",
    bookingRef: "EVZ-TOUR-2026-0105-005",
    createdAt: "2026-01-05T11:00:00Z",
    cancellationPolicy: "Free cancellation up to 24 hours before the tour.",
    cancellationDeadline: "2026-01-09T09:00:00Z"
  }
];

// ──── Simulated API functions ──────────────────────────────

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function fetchTours(): Promise<Tour[]> {
  await delay(600);
  return [...TOURS, ...getCustomTours()];
}

export async function fetchTourBySlug(slug: string): Promise<Tour | null> {
  await delay(400);
  const all = [...TOURS, ...getCustomTours()];
  return all.find(t => t.slug === slug) || null;
}

export async function fetchReviewsForTour(slug: string): Promise<Review[]> {
  await delay(300);
  return REVIEWS.filter(r => r.tourSlug === slug);
}

export async function fetchBookings(): Promise<Booking[]> {
  await delay(500);
  return MOCK_BOOKINGS;
}

export async function fetchBookingById(id: string): Promise<Booking | null> {
  await delay(300);
  return MOCK_BOOKINGS.find(b => b.id === id) || null;
}

export async function createBooking(data: Partial<Booking>): Promise<Booking> {
  await delay(1200);
  const id = `BK-${Date.now()}`;
  return {
    id,
    tourSlug: data.tourSlug || "",
    tourTitle: data.tourTitle || "",
    tourImage: data.tourImage || "",
    destination: data.destination || "",
    date: data.date || "",
    timeSlot: data.timeSlot || "",
    tourDays: data.tourDays || 1,
    adults: data.adults || 1,
    children: data.children || 0,
    addons: data.addons || [],
    addonsCost: data.addonsCost || 0,
    baseCost: data.baseCost || 0,
    taxes: data.taxes || 0,
    totalCost: data.totalCost || 0,
    currency: data.currency || "UGX",
    status: "confirmed",
    contactName: data.contactName || "",
    contactEmail: data.contactEmail || "",
    contactPhone: data.contactPhone || "",
    country: data.country || "",
    specialRequests: data.specialRequests || "",
    promoCode: data.promoCode || "",
    promoDiscount: data.promoDiscount || 0,
    paymentMethod: data.paymentMethod || "",
    bookingRef: `EVZ-TOUR-${id}`,
    createdAt: new Date().toISOString(),
    cancellationPolicy: data.cancellationPolicy || "",
    cancellationDeadline: data.cancellationDeadline || ""
  };
}

// ──── Helpers ──────────────────────────────────────────────

export function formatUGX(amount: number): string {
  return `UGX ${amount.toLocaleString("en-UG")}`;
}

export function getRatingDistribution(reviews: Review[]): number[] {
  const dist = [0, 0, 0, 0, 0]; // index 0 = 1 star, index 4 = 5 stars
  reviews.forEach(r => {
    const idx = Math.min(Math.max(Math.round(r.rating) - 1, 0), 4);
    if (dist[idx] !== undefined) {
      dist[idx]++;
    }
  });
  return dist;
}

// Gradient backgrounds for tour image placeholders
export const TOUR_GRADIENTS: Record<string, string> = {
  "kampala": "linear-gradient(135deg, #0F766E 0%, #134E4A 40%, #042f2e 100%)",
  "jinja": "linear-gradient(135deg, #1E40AF 0%, #1E3A5F 40%, #0C1929 100%)",
  "mburo": "linear-gradient(135deg, #854D0E 0%, #713F12 40%, #422006 100%)",
  "entebbe": "linear-gradient(135deg, #047857 0%, #065F46 40%, #022C22 100%)",
  "ssese": "linear-gradient(135deg, #0369A1 0%, #075985 40%, #0C4A6E 100%)",
  "nightlife": "linear-gradient(135deg, #7C3AED 0%, #5B21B6 40%, #3B0764 100%)",
  "qenp": "linear-gradient(135deg, #B45309 0%, #92400E 40%, #451A03 100%)",
  "murchison": "linear-gradient(135deg, #15803D 0%, #166534 40%, #052e16 100%)",
  "default": "linear-gradient(135deg, #1E293B 0%, #0F172A 40%, #020617 100%)"
};

export function getGradientForTour(slug: string): string {
  const key = Object.keys(TOUR_GRADIENTS).find(k => slug.includes(k));
  return (TOUR_GRADIENTS[key || "default"] || TOUR_GRADIENTS["default"])!;
}

// ──── Known destinations for custom tours ──────────────────

export interface DestinationInfo {
  name: string;
  distanceKm: number;
  driveTimeHours: number;
  mapX: number;
  mapY: number;
  category: Tour["category"];
  description: string;
}

export const KNOWN_DESTINATIONS: Record<string, DestinationInfo> = {
  "kampala city": { name: "Kampala City", distanceKm: 5, driveTimeHours: 0.5, mapX: 230, mapY: 145, category: "city", description: "Uganda's vibrant capital city" },
  "jinja": { name: "Jinja", distanceKm: 80, driveTimeHours: 2, mapX: 290, mapY: 130, category: "daytrip", description: "Adventure capital and Source of the Nile" },
  "entebbe": { name: "Entebbe", distanceKm: 40, driveTimeHours: 1, mapX: 210, mapY: 175, category: "city", description: "Lakeside town with botanical gardens" },
  "lake mburo": { name: "Lake Mburo National Park", distanceKm: 240, driveTimeHours: 4, mapX: 120, mapY: 200, category: "safari", description: "Close safari destination with zebras and impalas" },
  "murchison falls": { name: "Murchison Falls", distanceKm: 305, driveTimeHours: 5.5, mapX: 160, mapY: 40, category: "adventure", description: "Uganda's largest national park with mighty falls" },
  "queen elizabeth": { name: "Queen Elizabeth NP", distanceKm: 420, driveTimeHours: 7, mapX: 60, mapY: 170, category: "safari", description: "Home to tree-climbing lions and 600+ bird species" },
  "bwindi": { name: "Bwindi Impenetrable Forest", distanceKm: 535, driveTimeHours: 9, mapX: 50, mapY: 225, category: "adventure", description: "Mountain gorilla trekking destination" },
  "ssese islands": { name: "Ssese Islands", distanceKm: 85, driveTimeHours: 5, mapX: 180, mapY: 190, category: "weekend", description: "Tropical island getaway on Lake Victoria" },
  "fort portal": { name: "Fort Portal", distanceKm: 300, driveTimeHours: 5, mapX: 80, mapY: 120, category: "cultural", description: "Tourism city surrounded by crater lakes" },
  "sipi falls": { name: "Sipi Falls", distanceKm: 270, driveTimeHours: 5, mapX: 340, mapY: 80, category: "adventure", description: "Stunning waterfalls on Mount Elgon" },
  "kibale forest": { name: "Kibale Forest", distanceKm: 320, driveTimeHours: 5.5, mapX: 90, mapY: 133, category: "safari", description: "Primate capital of the world" },
  "lake bunyonyi": { name: "Lake Bunyonyi", distanceKm: 460, driveTimeHours: 8, mapX: 65, mapY: 240, category: "weekend", description: "Africa's second-deepest lake surrounded by terraced hills" },
  "rwenzori": { name: "Rwenzori Mountains", distanceKm: 380, driveTimeHours: 6, mapX: 55, mapY: 100, category: "adventure", description: "Mountains of the Moon – snow-capped peaks on the equator" },
  "kidepo valley": { name: "Kidepo Valley NP", distanceKm: 700, driveTimeHours: 10, mapX: 310, mapY: 20, category: "safari", description: "Uganda's most remote and pristine national park" },
};

export const KAMPALA_MAP = { x: 230, y: 145 };

// ──── Custom tour storage ──────────────────────────────────

const CUSTOM_TOURS_KEY = "evzone_custom_tours";

export function getCustomTours(): Tour[] {
  try {
    const stored = localStorage.getItem(CUSTOM_TOURS_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [];
}

export function addCustomTour(tour: Tour): void {
  const existing = getCustomTours();
  existing.push(tour);
  localStorage.setItem(CUSTOM_TOURS_KEY, JSON.stringify(existing));
}

// ──── Price calculation from distance ──────────────────────

export function calculateTourPrice(distanceKm: number, durationDays: number, groupSize: number): number {
  const transportCost = distanceKm * 2 * 2500;
  const activityCostPerPerson = 100000 * durationDays;
  const guideCostPerDay = 150000;
  const total = Math.round(
    (transportCost / Math.max(groupSize, 1)) + activityCostPerPerson + (guideCostPerDay * durationDays / Math.max(groupSize, 1))
  );
  return Math.round(total / 10000) * 10000;
}

export function estimateDuration(distanceKm: number): { durationStr: string; durationHours: number; durationDays: number } {
  if (distanceKm <= 50) return { durationStr: "Half day (4 hours)", durationHours: 4, durationDays: 0.5 };
  if (distanceKm <= 120) return { durationStr: "Full day (8–10 hours)", durationHours: 10, durationDays: 1 };
  if (distanceKm <= 300) return { durationStr: "2 days / 1 night", durationHours: 36, durationDays: 2 };
  return { durationStr: "3 days / 2 nights", durationHours: 60, durationDays: 3 };
}

export function findDestination(query: string): DestinationInfo | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;
  const exact = KNOWN_DESTINATIONS[q];
  if (exact) return exact;
  const partial = Object.entries(KNOWN_DESTINATIONS).find(([key, val]) =>
    key.includes(q) || val.name.toLowerCase().includes(q)
  );
  return partial ? partial[1] : null;
}

export function searchDestinations(query: string): DestinationInfo[] {
  const q = query.toLowerCase().trim();
  if (!q) return Object.values(KNOWN_DESTINATIONS);
  return Object.values(KNOWN_DESTINATIONS).filter(d =>
    d.name.toLowerCase().includes(q) || d.category.includes(q)
  );
}

export function buildCustomTour(
  name: string,
  destination: DestinationInfo,
  category: Tour["category"],
  description: string,
  groupSize: number,
  travelDetails?: {
    departureDate?: string;
    returnDate?: string;
    departureTime?: string;
    returnTime?: string;
    pickupLocation?: string;
    tripDays?: number;
  }
): Tour {
  const dur = estimateDuration(destination.distanceKm);
  const effectiveDays = travelDetails?.tripDays ?? Math.max(1, Math.ceil(dur.durationDays));
  const price = calculateTourPrice(destination.distanceKm, effectiveDays, groupSize);
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `custom-${Date.now()}`;
  const durationStr = travelDetails?.tripDays
    ? `${effectiveDays} day${effectiveDays !== 1 ? "s" : ""}${effectiveDays > 1 ? ` / ${effectiveDays - 1} night${effectiveDays > 2 ? "s" : ""}` : ""}`
    : dur.durationStr;
  const durationHours = effectiveDays * 24;

  return {
    slug,
    title: name,
    subtitle: `Custom EV tour to ${destination.name}`,
    destination: destination.name,
    category,
    images: [],
    duration: durationStr,
    durationHours,
    rating: 0,
    reviewCount: 0,
    pricePerPerson: price,
    currency: "UGX",
    maxGroupSize: Math.max(groupSize, 8),
    minGroupSize: 1,
    groupType: "private",
    difficulty: destination.distanceKm > 400 ? "moderate" : "easy",
    pickupIncluded: true,
    highlights: [
      `EV-powered trip to ${destination.name}`,
      `${destination.distanceKm} km scenic drive from Kampala`,
      `Approx. ${destination.driveTimeHours}h drive each way`,
      destination.description,
      "Experienced local guide included"
    ],
    description: description || `Discover ${destination.name} with a custom EV-powered tour. Enjoy a comfortable ${dur.durationStr.toLowerCase()} experience with pickup from Kampala, an expert guide, and zero-emission transport. ${destination.description}.`,
    itinerary: destination.distanceKm <= 120
      ? [
        { time: "08:00", title: "Kampala pickup", description: "EV pickup from your hotel or meeting point." },
        { time: `${Math.floor(8 + destination.driveTimeHours)}:00`, title: `Arrive ${destination.name}`, description: `Explore ${destination.name} with your guide.` },
        { time: "13:00", title: "Lunch break", description: "Enjoy a meal at a local restaurant (at own cost or add-on)." },
        { time: "16:00", title: "Return to Kampala", description: "Comfortable EV drive back." },
      ]
      : [
        { time: "Day 1 - 07:00", title: "Depart Kampala", description: `Early departure for the ${destination.driveTimeHours}h drive to ${destination.name}.` },
        { time: "Day 1 - PM", title: `Explore ${destination.name}`, description: `Afternoon activities and exploration.` },
        { time: "Day 2 - AM", title: "Morning activities", description: "Final exploration before departure." },
        { time: "Day 2 - PM", title: "Return to Kampala", description: "Scenic drive back, arriving in the evening." },
      ],
    included: ["EV transport with A/C", "English-speaking guide", "Bottled water", "Hotel pickup & drop-off"],
    notIncluded: ["Meals (unless added)", "Personal expenses", "Gratuities", "Travel insurance"],
    meetingPoint: travelDetails?.pickupLocation || "Kampala — hotel pickup or central meeting point",
    pickupDetails: travelDetails?.pickupLocation
      ? `Pickup at ${travelDetails.pickupLocation}${travelDetails.departureTime ? ` at ${travelDetails.departureTime}` : ""}. Your driver will contact you 30 minutes before.`
      : undefined,
    cancellationPolicy: "Free cancellation up to 48 hours before the tour.",
    cancellationHours: 48,
    faqs: [
      { question: "Is this a private tour?", answer: "Yes, custom tours are private by default." },
      { question: "Can I modify the itinerary?", answer: "Absolutely! Contact us to customize the route and activities." },
    ],
    operatorName: "EVzone Tours",
    operatorVerified: true,
    evPowered: true,
    availableDates: generateDates(2, 21),
    addons: [
      { id: `addon-lunch-${slug}`, name: "Lunch package", description: "Local restaurant lunch for the group", price: 40000, currency: "UGX" },
      { id: `addon-photo-${slug}`, name: "Professional photos", description: "Photographer for the tour", price: 100000, currency: "UGX" },
      { id: `addon-insurance-${slug}`, name: "Travel insurance", description: "Comprehensive cover", price: 35000, currency: "UGX" },
    ],
    similarTourSlugs: TOURS.filter(t => t.category === category).slice(0, 3).map(t => t.slug),
    availability: "available",
  };
}
