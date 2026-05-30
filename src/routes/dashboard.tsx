import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircleHeart, MapPin, HeartPulse, Baby, Sparkles, Salad, Sun } from "lucide-react";
import { useLang, type Lang } from "@/lib/i18n";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Your dashboard — Maatri Nepal" }],
  }),
  component: Dashboard,
});

const sizeChart: Record<number, { en: string; ne: string }> = {
  8: { en: "a raspberry", ne: "एउटा रास्पबेरी" },
  12: { en: "a lime", ne: "एउटा कागती" },
  16: { en: "an avocado", ne: "एउटा एभोकाडो" },
  20: { en: "a banana", ne: "एउटा केरा" },
  24: { en: "an ear of corn", ne: "एउटा मकैको घोगा" },
  28: { en: "an eggplant", ne: "एउटा भन्टा" },
  32: { en: "a coconut", ne: "एउटा नरिवल" },
  36: { en: "a papaya", ne: "एउटा मेवा" },
  40: { en: "a small watermelon", ne: "सानो खरबुजा" },
};

function babySize(week: number, lang: Lang) {
  const keys = Object.keys(sizeChart).map(Number).sort((a, b) => a - b);
  const closest = keys.reduce((p, c) => (Math.abs(c - week) < Math.abs(p - week) ? c : p), keys[0]);
  return sizeChart[closest][lang];
}

function Dashboard() {
  const { tr, lang } = useLang();
  const { profile, updateProfile, phase, setPhase } = useAppState();
  const week = profile.week ?? 20;

  const ppTips =
    lang === "ne"
      ? {
          nutrition: "स्तनपानको समयमा पर्याप्त पानी पिउनुहोस् र हरियो सागसब्जी, गेडागुडी, दूध समावेश गर्नुहोस्।",
          mother: "तपाईंको शरीर पुनः बलियो हुँदैछ — हल्का हिँडाइ र गहिरो सास फेर्ने अभ्यासले मद्दत गर्छ।",
          emotional: "आराम पाउनु पनि उत्तिकै महत्त्वपूर्ण छ। तपाईंलाई सहयोग चाहिए जतिबेला पनि माँग्नुहोस्।",
        }
      : {
          nutrition: "Drink plenty of water and add leafy greens, lentils and milk to support recovery and breastfeeding.",
          mother: "Your body is healing — short walks and slow, deep breaths gently restore strength.",
          emotional: "Resting is part of healing. Ask for support whenever you need it — you are not alone.",
        };

  const pgTips =
    lang === "ne"
      ? {
          nutrition: "आइरन र फोलेट युक्त खाना खानुहोस् — गहत, पालुङ्गो, सुख्खा फल। दिनमा कम्तीमा ८ गिलास पानी पिउनुहोस्।",
          mother: "तपाईंको पेट बढ्दैछ र शरीरमा हार्मोन परिवर्तन हुँदैछन्। थकाइ महसुस हुनु सामान्य हो।",
          emotional: "गहिरो सास फेर्ने ५ मिनेट निकाल्नुहोस्। तपाईं उत्कृष्ट काम गर्दै हुनुहुन्छ।",
        }
      : {
          nutrition: "Choose iron- and folate-rich foods — black gram, spinach, dried fruits. Aim for 8 glasses of water.",
          mother: "Your belly is growing and hormones are shifting. Feeling tired is completely normal.",
          emotional: "Take 5 quiet minutes to breathe deeply today. You're doing beautifully.",
        };

  const tips = phase === "postpartum" ? ppTips : pgTips;

  return (
    <main className="bg-warm-gradient min-h-[calc(100svh-65px)] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {phase === "postpartum" && (
          <div className="mb-5 rounded-2xl border border-lavender/40 bg-secondary/60 px-5 py-3 text-sm text-secondary-foreground">
            🎉 {tr("postpartumBanner")}
          </div>
        )}

        <div className="glass-card relative overflow-hidden rounded-3xl p-6 sm:p-8">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-blush/60 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-secondary/60 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {phase === "postpartum" ? tr("postpartumMode") : tr("pregnancyMode")}
              </p>
              <h1 className="mt-1 font-display text-3xl font-semibold sm:text-4xl">
                {lang === "ne" ? "नमस्ते" : "Hello"}, {profile.name || (lang === "ne" ? "आमा" : "Mama")} 🌸
              </h1>
              {phase === "pregnancy" && (
                <p className="mt-2 text-muted-foreground">
                  {tr("weekLabel")} <span className="font-semibold text-foreground">{week}</span> · {tr("babySize")}{" "}
                  <span className="font-semibold text-primary">{babySize(week, lang)}</span>
                </p>
              )}
            </div>
            {phase === "pregnancy" && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateProfile({ week: Math.max(1, week - 1) })}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-lg hover:bg-muted"
                >
                  −
                </button>
                <div className="rounded-2xl bg-blush px-5 py-2 text-center">
                  <p className="text-xs text-primary/80">{tr("weekLabel")}</p>
                  <p className="font-display text-2xl font-semibold text-primary">{week}</p>
                </div>
                <button
                  onClick={() => updateProfile({ week: Math.min(42, week + 1) })}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-lg hover:bg-muted"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <TipCard icon={Baby} title={phase === "postpartum" ? (lang === "ne" ? "नवजात शिशुको हेरचाह" : "Newborn care") : tr("motherChanges")} body={tips.mother} accent="bg-blush text-primary" />
          <TipCard icon={Salad} title={tr("nutritionTip")} body={tips.nutrition} accent="bg-secondary text-secondary-foreground" />
          <TipCard icon={Sun} title={tr("emotionalNote")} body={tips.emotional} accent="bg-ember/15 text-ember" />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link to="/chat" className="glass-card group flex items-center justify-between gap-4 rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blush text-primary">
                <MessageCircleHeart className="h-6 w-6" />
              </span>
              <div>
                <p className="font-display text-lg font-semibold">{tr("askMaatri")}</p>
                <p className="text-sm text-muted-foreground">{tr("chatPlaceholder")}</p>
              </div>
            </div>
            <Sparkles className="h-5 w-5 text-primary opacity-0 transition group-hover:opacity-100" />
          </Link>
          <Link to="/hospitals" className="glass-card group flex items-center justify-between gap-4 rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
                <MapPin className="h-6 w-6" />
              </span>
              <div>
                <p className="font-display text-lg font-semibold">{tr("hospitals")}</p>
                <p className="text-sm text-muted-foreground">{tr("nearbyHospitals")}</p>
              </div>
            </div>
          </Link>
        </div>

        {phase === "pregnancy" && (
          <div className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/50 p-4 text-sm">
            <div className="flex items-center gap-3">
              <HeartPulse className="h-5 w-5 text-primary" />
              <p className="text-muted-foreground">
                {lang === "ne" ? "बच्चा जन्मियो? पोस्टपार्टम मोडमा जानुहोस्।" : "Baby is here? Switch to postpartum mode."}
              </p>
            </div>
            <button
              onClick={() => setPhase("postpartum")}
              className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95"
            >
              {tr("switchToPostpartum")}
            </button>
          </div>
        )}
        {phase === "postpartum" && (
          <div className="mt-8 rounded-2xl border border-border bg-card/50 p-4 text-center text-sm text-muted-foreground">
            <button onClick={() => setPhase("pregnancy")} className="underline-offset-2 hover:underline">
              {lang === "ne" ? "← गर्भावस्था मोडमा फर्कनुहोस्" : "← Switch back to pregnancy mode"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function TipCard({
  icon: Icon,
  title,
  body,
  accent,
}: {
  icon: typeof Baby;
  title: string;
  body: string;
  accent: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <span className={`grid h-10 w-10 place-items-center rounded-xl ${accent}`}>
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}