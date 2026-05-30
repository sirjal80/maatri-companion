import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "ne" | "en";

type Dict = Record<string, { ne: string; en: string }>;

export const t: Dict = {
  appName: { ne: "मातृ नेपाल", en: "Maatri Nepal" },
  welcomeTitle: { ne: "मातृ नेपालमा स्वागत छ", en: "Welcome to Maatri Nepal" },
  welcomeSub: {
    ne: "गर्भावस्था र मातृत्व यात्राको भरपर्दो साथी।",
    en: "Your trusted companion throughout pregnancy and motherhood.",
  },
  begin: { ne: "सुरु गरौं", en: "Let's begin" },
  langTitle: { ne: "तपाईं कसरी अगाडि बढ्न चाहनुहुन्छ?", en: "How would you like to continue?" },
  langSub: { ne: "तपाईंको भाषा छान्नुहोस्", en: "Choose your language" },
  modeTitle: { ne: "तपाईंलाई कस्तो लाग्छ?", en: "How would you like to use Maatri?" },
  modeSub: {
    ne: "लग इन नगरी पनि प्रयोग गर्न सक्नुहुन्छ।",
    en: "You can explore everything without an account.",
  },
  guestTitle: { ne: "अतिथिको रूपमा प्रयोग गर्नुहोस्", en: "Continue as guest" },
  guestSub: {
    ne: "एआई सहायक, अस्पताल खोजी, आपतकालीन सहयोग — तुरुन्तै प्रयोग गर्नुहोस्।",
    en: "AI assistant, hospital finder, emergency help — instant access.",
  },
  loginTitle: { ne: "साइन इन / खाता बनाउनुहोस्", en: "Sign in / Create account" },
  loginSub: {
    ne: "व्यक्तिगत साप्ताहिक सुझाव र सम्झना पाउनुहोस्।",
    en: "Get personalized weekly insights and reminders.",
  },
  loginComingSoon: {
    ne: "व्यक्तिगत खाता चाँडै आउँदैछ। अहिले अतिथिको रूपमा सुरु गर्नुहोस्।",
    en: "Personal accounts are coming soon. For now, continue as a guest.",
  },
  continueGuest: { ne: "अतिथिको रूपमा जारी राख्नुहोस्", en: "Continue as guest" },
  dashboard: { ne: "ड्यासबोर्ड", en: "Dashboard" },
  chat: { ne: "एआई सहायक", en: "AI Assistant" },
  hospitals: { ne: "अस्पताल", en: "Hospitals" },
  emergency: { ne: "आपतकालीन", en: "Emergency" },
  weekLabel: { ne: "गर्भावस्था हप्ता", en: "Pregnancy week" },
  babySize: { ne: "बच्चाको आकार", en: "Baby is the size of" },
  motherChanges: { ne: "तपाईंको शरीरमा हुने परिवर्तन", en: "What's happening in your body" },
  nutritionTip: { ne: "आजको पोषण सल्लाह", en: "Today's nutrition tip" },
  emotionalNote: { ne: "मनको हेरचाह", en: "A note for your heart" },
  askMaatri: { ne: "माatरीलाई सोध्नुहोस्", en: "Ask Maatri" },
  chatPlaceholder: {
    ne: "गर्भावस्था, पोषण, लक्षण... केहि पनि सोध्नुहोस्",
    en: "Ask about pregnancy, nutrition, symptoms — anything",
  },
  send: { ne: "पठाउनुहोस्", en: "Send" },
  emergencyTitle: { ne: "तुरुन्त सहायता", en: "Get help now" },
  callAmbulance: { ne: "एम्बुलेन्स बोलाउनुहोस् (102)", en: "Call ambulance (102)" },
  callDoctor: { ne: "डाक्टरलाई सम्पर्क गर्नुहोस्", en: "Contact doctor" },
  callFamily: { ne: "परिवारलाई फोन गर्नुहोस्", en: "Call family contact" },
  dangerSigns: { ne: "तत्काल चिकित्सा सहायता खोज्नुहोस्", en: "Seek immediate medical attention" },
  postpartumBanner: {
    ne: "बधाई छ! तपाईं अब प्रसवपछिको चरणमा हुनुहुन्छ।",
    en: "Congratulations! You're now in postpartum mode.",
  },
  pregnancyMode: { ne: "गर्भावस्था मोड", en: "Pregnancy mode" },
  postpartumMode: { ne: "प्रसवपछि मोड", en: "Postpartum mode" },
  switchToPostpartum: { ne: "बच्चा जन्मिसकेको छ", en: "My baby is born" },
  nearbyHospitals: { ne: "नजिकका अस्पताल र क्लिनिक", en: "Nearby hospitals & maternity clinics" },
  callNow: { ne: "फोन गर्नुहोस्", en: "Call" },
  directions: { ne: "बाटो", en: "Directions" },
  language: { ne: "भाषा", en: "Language" },
  back: { ne: "पछाडि", en: "Back" },
};

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; tr: (k: keyof typeof t) => string }>({
  lang: "en",
  setLang: () => {},
  tr: (k) => t[k]?.en ?? String(k),
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("maatri.lang") as Lang | null) : null;
    if (stored === "ne" || stored === "en") setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("maatri.lang", l);
  };

  const tr = (k: keyof typeof t) => t[k]?.[lang] ?? String(k);

  return <LangCtx.Provider value={{ lang, setLang, tr }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);