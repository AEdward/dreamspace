import type { Locale } from "./locale";

const en = {
  nav: { home: "Home page", about: "About us", news: "News", contact: "Talk to us", call: "Call", menu: "Menu" },
  footer: { email: "Email:", mobile: "Mobile:", rights: "All rights reserved.", developedBy: "Developed by" },
  maintenance: {
    title: "We'll be right back",
    body: "is currently down for maintenance. Please check back shortly.",
    callUs: "Call us:",
  },
  hero: { callUs: "Call us:" },
  booking: {
    title: "Book an appointment",
    intro: "Tell us how to reach you and we'll set up a time.",
    submit: "Book appointment",
    notesLabel: "Preferred date / notes",
    notesPlaceholder: "e.g. Weekday afternoons work best",
  },
  form: {
    fullName: "Full name",
    phone: "Phone number",
    email: "Email (optional)",
    message: "Message",
    send: "Send",
    sendMessage: "Send message",
    sending: "Sending...",
    thanksTitle: "Thanks — we'll be in touch!",
    thanksBody: "We received your request and will contact you shortly.",
  },
  news: { latest: "Latest news", all: "News" },
  pricing: {
    heading: "Types and distribution of houses",
    sub: "Drag to rotate each model and explore the scale of every unit type.",
    sqm: "Sqm",
    beds: "Beds",
    baths: "Baths",
    downPayment: "Down payment",
    serviceFee: "Service fee",
    monthlySavings: "Monthly savings",
    monthlyServiceFee: "Monthly service fee",
    finalServiceFee: "Final service fee after the draw",
    totalCost: "Total construction cost:",
  },
  bank: {
    heading: "Bank details",
    sub: "Send registration/service fee and price payments to these accounts.",
    bank: "Bank",
    regAccount: "Registration & service fee account",
    priceAccount: "Price payment account",
  },
  contactPage: {
    sendMessage: "Send us a message",
    getInTouch: "Get in touch directly",
    ourOffices: "Our offices",
    mobile: "Mobile:",
    email: "Email:",
  },
  aboutPage: { partners: "Partners and sister companies" },
  sections: {
    partners: "Partners and sister companies",
    importantInfo: "Important information",
    constructionSites: "Construction sites",
  },
};

const am: typeof en = {
  nav: { home: "መነሻ ገጽ", about: "ስለ እኛ", news: "ዜና", contact: "ያነጋግሩን", call: "ይደውሉ", menu: "ዝርዝር" },
  footer: { email: "ኢሜይል:", mobile: "ስልክ:", rights: "መብቱ በህግ የተጠበቀ ነው።", developedBy: "በ" },
  maintenance: {
    title: "በቅርቡ እንመለሳለን",
    body: "በአሁኑ ጊዜ በጥገና ላይ ነው። እባክዎ ትንሽ ቆይተው ይመልከቱ።",
    callUs: "ይደውሉልን:",
  },
  hero: { callUs: "ይደውሉልን:" },
  booking: {
    title: "ቀጠሮ ይያዙ",
    intro: "እርስዎን እንዴት ማግኘት እንደምንችል ይንገሩን፣ ጊዜ እናዘጋጃለን።",
    submit: "ቀጠሮ ያስይዙ",
    notesLabel: "የሚመርጡት ቀን / ማስታወሻ",
    notesPlaceholder: "ለምሳሌ፦ በስራ ቀናት ከሰዓት በኋላ ይመቻል",
  },
  form: {
    fullName: "ሙሉ ስም",
    phone: "የስልክ ቁጥር",
    email: "ኢሜይል (አማራጭ)",
    message: "መልዕክት",
    send: "ላክ",
    sendMessage: "መልዕክት ላክ",
    sending: "በመላክ ላይ...",
    thanksTitle: "እናመሰግናለን — በቅርቡ እናገኝዎታለን!",
    thanksBody: "ጥያቄዎን ተቀብለናል፣ በቅርቡ እናገኝዎታለን።",
  },
  news: { latest: "የቅርብ ጊዜ ዜናዎች", all: "ዜና" },
  pricing: {
    heading: "የቤቶች አይነት እና ስርጭት",
    sub: "እያንዳንዱን ሞዴል ለማሽከርከር ይጎትቱ እና የእያንዳንዱን ዓይነት መጠን ይመልከቱ።",
    sqm: "ካ.ሜ",
    beds: "መኝታ ክፍሎች",
    baths: "መታጠቢያ ቤቶች",
    downPayment: "ቅድሚያ ክፍያ",
    serviceFee: "የአገልግሎት ክፍያ",
    monthlySavings: "ወርሃዊ ቁጠባ",
    monthlyServiceFee: "ወርሃዊ የአገልግሎት ክፍያ",
    finalServiceFee: "የመጨረሻ የአገልግሎት ክፍያ ከዕጣ በኋላ",
    totalCost: "ጠቅላላ የግንባታ ወጪ:",
  },
  bank: {
    heading: "የባንክ ዝርዝሮች",
    sub: "የምዝገባ/የአገልግሎት ክፍያ እና የዋጋ ክፍያዎችን ወደ እነዚህ አካውንቶች ይላኩ።",
    bank: "ባንክ",
    regAccount: "የምዝገባ እና አገልግሎት ክፍያ አካውንት",
    priceAccount: "የዋጋ ክፍያ አካውንት",
  },
  contactPage: {
    sendMessage: "መልዕክት ይላኩልን",
    getInTouch: "በቀጥታ ያግኙን",
    ourOffices: "ቅርንጫፎቻችን",
    mobile: "ስልክ:",
    email: "ኢሜይል:",
  },
  aboutPage: { partners: "አጋሮች እና ተመሳሳይ ኩባንያዎች" },
  sections: {
    partners: "አጋሮች እና ተመሳሳይ ኩባንያዎች",
    importantInfo: "ጠቃሚ መረጃ",
    constructionSites: "የግንባታ ቦታዎች",
  },
};

const om: typeof en = {
  nav: { home: "Fuula Jalqabaa", about: "Waaʼee Keenya", news: "Oduu", contact: "Nu Haasofsiisaa", call: "Bilbilaa", menu: "Meenuu" },
  footer: { email: "Imeelii:", mobile: "Bilbila:", rights: "Mirgi hundi seeraan kan eegame.", developedBy: "Kan qopheesse" },
  maintenance: {
    title: "Dafnee ni deebina",
    body: "yeroo ammaa suphaaf cufameera. Maaloo yeroo xiqqoo booda deebiʼaa ilaalaa.",
    callUs: "Nu bilbilaa:",
  },
  hero: { callUs: "Nu bilbilaa:" },
  booking: {
    title: "Beellama Qabadhaa",
    intro: "Akkamitti si qunnamuu akka dandeenyu nutti himi, yeroo ni qopheessina.",
    submit: "Beellama Qabadhu",
    notesLabel: "Guyyaa Filatamu / Yaada",
    notesPlaceholder: "Fkn: Guyyoota hojii boodaa gaarii dha",
  },
  form: {
    fullName: "Maqaa Guutuu",
    phone: "Lakkoofsa Bilbilaa",
    email: "Imeelii (filannoo)",
    message: "Ergaa",
    send: "Ergi",
    sendMessage: "Ergaa Ergi",
    sending: "Ergaa jira...",
    thanksTitle: "Galatoomi — dhiheenya sitti dhiyaanna!",
    thanksBody: "Gaaffii keessan fudhanneerra, dhiheenya isin qunnamna.",
  },
  news: { latest: "Oduu Dhiyoo", all: "Oduu" },
  pricing: {
    heading: "Gosaa fi Raabsa Manneenii",
    sub: "Model tokkoo tokkoo naanneessuuf harkisi, hangaa gosa hundaa ilaali.",
    sqm: "m²",
    beds: "Kutaalee Ciisichaa",
    baths: "Kutaalee Dhiqannaa",
    downPayment: "Kaffaltii Jalqabaa",
    serviceFee: "Kaffaltii Tajaajilaa",
    monthlySavings: "Qusannaa Jiʼaa",
    monthlyServiceFee: "Kaffaltii Tajaajilaa Jiʼaa",
    finalServiceFee: "Kaffaltii Tajaajilaa Xumuraa Ixaa Booda",
    totalCost: "Baasii Ijaarsaa Waliigalaa:",
  },
  bank: {
    heading: "Ibsa Baankii",
    sub: "Kaffaltii galmee/tajaajilaa fi gatii kanneen herrega kanatti ergaa.",
    bank: "Baankii",
    regAccount: "Herrega Galmee fi Kaffaltii Tajaajilaa",
    priceAccount: "Herrega Kaffaltii Gatii",
  },
  contactPage: {
    sendMessage: "Ergaa Nuuf Ergaa",
    getInTouch: "Kallattiin Nu Qunnamaa",
    ourOffices: "Damee Keenya",
    mobile: "Bilbila:",
    email: "Imeelii:",
  },
  aboutPage: { partners: "Hidhattoota fi Dhaabbilee Obboleessaa" },
  sections: {
    partners: "Hidhattoota fi Dhaabbilee Obboleessaa",
    importantInfo: "Odeeffannoo Barbaachisaa",
    constructionSites: "Bakkeewwan Ijaarsaa",
  },
};

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, am, om };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
