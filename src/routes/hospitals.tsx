import { createFileRoute } from "@tanstack/react-router";
import { Phone, MapPin, Star } from "lucide-react";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/hospitals")({
  head: () => ({ meta: [{ title: "Hospitals & clinics — Maatri Nepal" }] }),
  component: HospitalsPage,
});

const HOSPITALS = [
  {
    name: { en: "Lumbini Provincial Hospital", ne: "लुम्बिनी प्रादेशिक अस्पताल" },
    area: { en: "Butwal, Lumbini", ne: "बुटवल, लुम्बिनी" },
    phone: "071-520110",
    tag: { en: "Government · Maternity", ne: "सरकारी · प्रसूति" },
  },
  {
    name: { en: "Kist Medical College & Teaching Hospital", ne: "किस्ट मेडिकल कलेज एण्ड टीचिङ अस्पताल" },
    area: { en: "Butwal, Lumbini", ne: "बुटवल, लुम्बिनी" },
    phone: "071-580100",
    tag: { en: "Private · Teaching", ne: "निजी · शिक्षण" },
  },
  {
    name: { en: "Global Hospital & Research Center", ne: "ग्लोबल अस्पताल एण्ड रिसर्च सेन्टर" },
    area: { en: "Butwal, Lumbini", ne: "बुटवल, लुम्बिनी" },
    phone: "071-520333",
    tag: { en: "Private · Maternity care", ne: "निजी · प्रसूति सेवा" },
  },
  {
    name: { en: "Shree Ganga Maternity Hospital", ne: "श्री गंगा प्रसूति अस्पताल" },
    area: { en: "Butwal, Lumbini", ne: "बुटवल, लुम्बिनी" },
    phone: "071-542345",
    tag: { en: "Private · Maternity", ne: "निजी · प्रसूति" },
  },
  {
    name: { en: "Butwal Nursing Home", ne: "बुटवल नर्सिङ होम" },
    area: { en: "Butwal, Lumbini", ne: "बुटवल, लुम्बिनी" },
    phone: "071-520100",
    tag: { en: "Private · Maternity & Pediatric", ne: "निजी · प्रसूति र बालरोग" },
  },
  {
    name: { en: "Royal Tulip Hospital", ne: "रायल ट्युलिप अस्पताल" },
    area: { en: "Butwal, Lumbini", ne: "बुटवल, लुम्बिनी" },
    phone: "071-520222",
    tag: { en: "Private · General", ne: "निजी · सामान्य" },
  },
];

function HospitalsPage() {
  const { tr, lang } = useLang();
  return (
    <main className="bg-warm-gradient min-h-[calc(100svh-65px)] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">{tr("nearbyHospitals")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {lang === "ne"
              ? "नेपालका प्रमुख प्रसूति अस्पताल र क्लिनिक — एकै ठाउँमा।"
              : "Trusted maternity hospitals and clinics across Nepal."}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            {tr("bookDescription")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {HOSPITALS.map((h) => (
            <div key={h.phone} className="glass-card rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-primary">{h.tag[lang]}</p>
                  <h3 className="mt-1 font-display text-lg font-semibold leading-tight">{h.name[lang]}</h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {h.area[lang]}
                  </p>
                </div>
                <Star className="h-4 w-4 fill-ember text-ember" />
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <a
                  href={`tel:${h.phone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/95"
                >
                  <Phone className="h-4 w-4" /> {tr("callNow")}
                </a>
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(h.name.en)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  <MapPin className="h-4 w-4" /> {tr("directions")}
                </a>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(
                    `${h.name.en} appointment`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  {tr("bookAppointment")}
                </a>
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(
                    `${h.name.en} online doctor consultation`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  {tr("bookOnlineMeeting")}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}