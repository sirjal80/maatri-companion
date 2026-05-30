import { createFileRoute } from "@tanstack/react-router";
import { Phone, MapPin, Star } from "lucide-react";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/hospitals")({
  head: () => ({ meta: [{ title: "Hospitals & clinics — Maatri Nepal" }] }),
  component: HospitalsPage,
});

const HOSPITALS = [
  {
    name: { en: "Paropakar Maternity & Women's Hospital", ne: "परोपकार प्रसूति तथा स्त्री रोग अस्पताल" },
    area: { en: "Thapathali, Kathmandu", ne: "थापाथली, काठमाडौं" },
    phone: "01-4260106",
    tag: { en: "Government · Maternity", ne: "सरकारी · प्रसूति" },
  },
  {
    name: { en: "Tribhuvan University Teaching Hospital", ne: "त्रिभुवन विश्वविद्यालय शिक्षण अस्पताल" },
    area: { en: "Maharajgunj, Kathmandu", ne: "महाराजगन्ज, काठमाडौं" },
    phone: "01-4412303",
    tag: { en: "Government · Multi-specialty", ne: "सरकारी · बहुविशेषज्ञता" },
  },
  {
    name: { en: "Norvic International Hospital", ne: "नर्भिक इन्टरनेसनल अस्पताल" },
    area: { en: "Thapathali, Kathmandu", ne: "थापाथली, काठमाडौं" },
    phone: "01-5970032",
    tag: { en: "Private · Maternity care", ne: "निजी · प्रसूति सेवा" },
  },
  {
    name: { en: "Grande International Hospital", ne: "ग्रान्डे इन्टरनेसनल अस्पताल" },
    area: { en: "Dhapasi, Kathmandu", ne: "धापासी, काठमाडौं" },
    phone: "01-5159266",
    tag: { en: "Private · Multi-specialty", ne: "निजी · बहुविशेषज्ञता" },
  },
  {
    name: { en: "B&B Hospital", ne: "बी एण्ड बी अस्पताल" },
    area: { en: "Gwarko, Lalitpur", ne: "ग्वार्को, ललितपुर" },
    phone: "01-5533206",
    tag: { en: "Private · Maternity & Pediatric", ne: "निजी · प्रसूति र बालरोग" },
  },
  {
    name: { en: "Manipal Teaching Hospital", ne: "मणिपाल शिक्षण अस्पताल" },
    area: { en: "Phulbari, Pokhara", ne: "फूलबारी, पोखरा" },
    phone: "061-526416",
    tag: { en: "Government · Maternity", ne: "सरकारी · प्रसूति" },
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
              <div className="mt-4 flex gap-2">
                <a
                  href={`tel:${h.phone}`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/95"
                >
                  <Phone className="h-4 w-4" /> {tr("callNow")}
                </a>
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(h.name.en)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  <MapPin className="h-4 w-4" /> {tr("directions")}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}