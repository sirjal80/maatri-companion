import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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

type RequestItem = {
  id: number;
  type: "blood" | "charity";
  title: string;
  details: string;
  contact: string;
  image?: string;
  createdAt: string;
  author: string;
};

const REQUESTS_STORAGE_KEY = "maatri.communityRequests";

function Dashboard() {
  const { tr, lang } = useLang();
  const { profile, updateProfile, phase, setPhase, user } = useAppState();
  const week = profile.week ?? 20;
  const userName = user?.name || (lang === "ne" ? "आमा" : "Aama❤️");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [requestType, setRequestType] = useState<"blood" | "charity">("blood");
  const [requestTitle, setRequestTitle] = useState("");
  const [requestDetails, setRequestDetails] = useState("");
  const [contactNumber, setContactNumber] = useState(profile.emergencyContact ?? "");
  const [uploadedBill, setUploadedBill] = useState<string | null>(null);
  const [communityRequests, setCommunityRequests] = useState<RequestItem[]>([]);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(REQUESTS_STORAGE_KEY);
    if (stored) {
      try {
        setCommunityRequests(JSON.parse(stored));
      } catch {
        setCommunityRequests([]);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(communityRequests));
  }, [communityRequests]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, []);

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
            {tr("postpartumBanner")}
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
                {lang === "ne" ? "नमस्ते आमा❤️" : "Hey Aama❤️"}
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

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{tr("personalInfo")}</p>
                <h2 className="mt-2 font-display text-2xl font-semibold">{userName}</h2>
                {user ? (
                  <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">{tr("guestProfileNote")}</p>
                )}
              </div>
            </div>
            <div className="mt-6 space-y-4 text-sm">
              <label className="block">
                <span className="text-muted-foreground">{tr("dueDate")}</span>
                <input
                  type="date"
                  value={profile.dueDate ?? ""}
                  onChange={(event) => updateProfile({ dueDate: event.target.value })}
                  className="mt-2 w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </label>
              <label className="block">
                <span className="text-muted-foreground">{tr("bloodGroup")}</span>
                <input
                  value={profile.bloodGroup ?? ""}
                  onChange={(event) => updateProfile({ bloodGroup: event.target.value })}
                  placeholder={lang === "ne" ? "A+, B-..." : "A+, B-..."}
                  className="mt-2 w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </label>
              <label className="block">
                <span className="text-muted-foreground">{tr("emergencyContact")}</span>
                <input
                  value={profile.emergencyContact ?? ""}
                  onChange={(event) => updateProfile({ emergencyContact: event.target.value })}
                  placeholder={lang === "ne" ? "९८४..." : "+977 ..."}
                  className="mt-2 w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </label>
              <label className="block">
                <span className="text-muted-foreground">{tr("uploadProfileData")}</span>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === "string") {
                          updateProfile({ proofFileName: file.name, proofFileData: reader.result });
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center justify-center rounded-2xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
                  >
                    {tr("uploadButton")}
                  </button>
                  <span className="truncate text-sm text-muted-foreground">
                    {profile.proofFileName ?? tr("noFileSelected")}
                  </span>
                </div>
              </label>
              {profile.proofFileName ? (
                <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                  <span>{tr("uploadedFile")} {profile.proofFileName}</span>
                  <button
                    type="button"
                    onClick={() => updateProfile({ proofFileName: undefined, proofFileData: undefined })}
                    className="rounded-full border border-border px-3 py-1 text-xs text-foreground hover:bg-muted"
                  >
                    {tr("removeFile")}
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6">
            <h2 className="font-display text-2xl font-semibold">{tr("wellnessQuickTips")}</h2>
            <p className="mt-3 text-sm text-muted-foreground">{tr("wellnessQuickIntro")}</p>
            <div className="mt-6 grid gap-3">
              <div className="rounded-3xl bg-blush/80 p-4 text-sm text-primary">
                {tr("updateProfileTip")}
              </div>
              <div className="rounded-3xl bg-secondary/80 p-4 text-sm text-secondary-foreground">
                {tr("chatProfileTip")}
              </div>
            </div>
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

        <div className="mt-6 rounded-3xl border border-border bg-card/80 p-6 shadow-soft" id="symptoms">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{tr("symptoms")}</p>
              <h2 className="mt-2 font-display text-2xl font-semibold">{tr("dangerSigns")}</h2>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{tr("symptomsIntro")}</p>
            </div>
            <Link
              to="/emergency"
              className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/95"
            >
              {tr("viewAllDangerSigns")}
            </Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              lang === "ne" ? "भारी रक्तस्राव" : "Heavy bleeding",
              lang === "ne" ? "तीव्र पेट दुखाइ" : "Severe abdominal pain",
              lang === "ne" ? "बच्चाको चाल कम भएको" : "Reduced baby movement",
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-border bg-background/70 p-4 text-sm text-muted-foreground">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-border bg-card/80 p-6 shadow-soft" id="health-awareness">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{tr("healthAwareness")}</p>
              <h2 className="mt-2 font-display text-2xl font-semibold">{tr("healthAwareness")}</h2>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{tr("healthAwarenessIntro")}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (!requestTitle.trim() || !requestDetails.trim()) {
                  setFeedback(tr("fillFields"));
                  return;
                }
                if (requestType === "blood" && !contactNumber.trim()) {
                  setFeedback(tr("contactRequired"));
                  return;
                }
                const nextRequest: RequestItem = {
                  id: Date.now(),
                  type: requestType,
                  title: requestTitle.trim(),
                  details: requestDetails.trim(),
                  contact: contactNumber.trim(),
                  image: uploadedBill ?? undefined,
                  createdAt: new Date().toISOString(),
                  author: user?.name || (lang === "ne" ? "अतिथि" : "Guest"),
                };
                setCommunityRequests((prev) => [nextRequest, ...prev]);
                setRequestTitle("");
                setRequestDetails("");
                setUploadedBill(null);
                setFeedback(tr("requestPosted"));
              }}
              className="space-y-4"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm text-muted-foreground">{tr("requestTypeLabel")}</span>
                  <select
                    value={requestType}
                    onChange={(event) => setRequestType(event.target.value as "blood" | "charity")}
                    className="mt-2 w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  >
                    <option value="blood">{tr("requestTypeBlood")}</option>
                    <option value="charity">{tr("requestTypeCharity")}</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm text-muted-foreground">{tr("requestTitleLabel")}</span>
                  <input
                    value={requestTitle}
                    onChange={(event) => setRequestTitle(event.target.value)}
                    placeholder={tr("requestTitleLabel")}
                    className="mt-2 w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-sm text-muted-foreground">{tr("requestDetailsLabel")}</span>
                <textarea
                  value={requestDetails}
                  onChange={(event) => setRequestDetails(event.target.value)}
                  rows={4}
                  placeholder={tr("requestDetailsLabel")}
                  className="mt-2 w-full rounded-3xl border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </label>
              <label className="block">
                <span className="text-sm text-muted-foreground">{tr("requestContact")}</span>
                <input
                  value={contactNumber}
                  onChange={(event) => setContactNumber(event.target.value)}
                  placeholder={lang === "ne" ? "+977 98..." : "+977 ..."}
                  className="mt-2 w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </label>
              <label className="block">
                <span className="text-sm text-muted-foreground">{tr("uploadProof")}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => setUploadedBill(String(reader.result));
                    reader.readAsDataURL(file);
                  }}
                  className="mt-2 w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </label>
              {uploadedBill && (
                <img src={uploadedBill} alt="Bill proof" className="mt-2 h-40 w-full rounded-3xl object-cover" />
              )}
              {feedback ? <p className="text-sm text-primary">{feedback}</p> : null}
              <button
                type="submit"
                className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/95"
              >
                {tr("submitRequest")}
              </button>
            </form>

            <div className="rounded-3xl bg-background/80 p-5">
              <h3 className="font-display text-lg font-semibold">{tr("communityPosts")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{tr("communityPostsIntro")}</p>
              <div className="mt-5 space-y-4">
                {communityRequests.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{tr("noRequests")}</p>
                ) : (
                  communityRequests.map((request) => (
                    <div key={request.id} className="rounded-3xl border border-border bg-card p-4">
                      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                        <span className={request.type === "blood" ? "text-ember" : "text-secondary-foreground"}>
                          {request.type === "blood" ? tr("requestTypeBlood") : tr("requestTypeCharity")}
                        </span>
                        <span>{new Date(request.createdAt).toLocaleDateString(lang === "ne" ? "ne-NP" : "en-US")}</span>
                      </div>
                      <h4 className="mt-3 text-base font-semibold text-foreground">{request.title}</h4>
                      <p className="mt-2 text-sm text-muted-foreground">{request.details}</p>
                      {request.image ? (
                        <img src={request.image} alt={request.title} className="mt-4 h-40 w-full rounded-3xl object-cover" />
                      ) : null}
                      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center justify-between gap-3">
                          <span>{tr("requestContact")}</span>
                          <a href={`tel:${request.contact}`} className="font-medium text-primary">
                            {request.contact}
                          </a>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span>{tr("requestPostedBy")}</span>
                          <span>{request.author}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
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