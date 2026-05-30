import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, AlertTriangle, Stethoscope, Users } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/emergency")({
  head: () => ({ meta: [{ title: "Emergency — Maatri Nepal" }] }),
  component: EmergencyPage,
});

function EmergencyPage() {
  const { tr, lang } = useLang();
  const { profile } = useAppState();

  const dangerSigns =
    lang === "ne"
      ? [
          "भारी रक्तस्राव",
          "तीव्र पेट दुखाइ",
          "बच्चाको चाल कम भएको",
          "उच्च ज्वरो",
          "बेहोश हुनु वा रिँगटा लाग्नु",
          "दृष्टि धमिलो हुनु",
        ]
      : [
          "Heavy bleeding",
          "Severe abdominal pain",
          "Reduced baby movement",
          "High fever",
          "Fainting or dizziness",
          "Blurred vision",
        ];

  return (
    <main className="min-h-[calc(100svh-65px)] bg-ember/10 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-ember/40 bg-card p-6 shadow-soft sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ember text-ember-foreground">
              <AlertTriangle className="h-6 w-6" />
            </span>
            <div>
              <h1 className="font-display text-2xl font-semibold">{tr("emergencyTitle")}</h1>
              <p className="text-sm text-ember">{tr("dangerSigns")}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            <a
              href="tel:102"
              className="flex items-center justify-between rounded-2xl bg-ember px-5 py-4 text-ember-foreground shadow-soft hover:scale-[1.01] active:scale-[0.99]"
            >
              <span className="flex items-center gap-3">
                <Phone className="h-5 w-5" />
                <span className="font-semibold">{tr("callAmbulance")}</span>
              </span>
              <span className="text-sm opacity-80">102</span>
            </a>
            <a
              href="tel:1115"
              className="flex items-center justify-between rounded-2xl bg-card border border-border px-5 py-4 hover:bg-muted"
            >
              <span className="flex items-center gap-3">
                <Stethoscope className="h-5 w-5 text-primary" />
                <span className="font-semibold">{tr("callDoctor")}</span>
              </span>
              <span className="text-sm text-muted-foreground">Hello Doctor · 1115</span>
            </a>
            <a
              href={profile.emergencyContact ? `tel:${profile.emergencyContact}` : "#"}
              className="flex items-center justify-between rounded-2xl bg-card border border-border px-5 py-4 hover:bg-muted"
            >
              <span className="flex items-center gap-3">
                <Users className="h-5 w-5 text-secondary-foreground" />
                <span className="font-semibold">{tr("callFamily")}</span>
              </span>
              <span className="text-sm text-muted-foreground">
                {profile.emergencyContact || (lang === "ne" ? "सेट गरिएको छैन" : "Not set")}
              </span>
            </a>
          </div>

          <div className="mt-8">
            <h2 className="font-display text-lg font-semibold">
              {lang === "ne" ? "खतरनाक लक्षणहरू" : "Danger signs to watch for"}
            </h2>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {dangerSigns.map((s) => (
                <li
                  key={s}
                  className="rounded-xl border border-ember/30 bg-ember/5 px-3 py-2 text-foreground/80"
                >
                  • {s}
                </li>
              ))}
            </ul>
          </div>

          <Link
            to="/dashboard"
            className="mt-8 inline-block text-sm text-muted-foreground hover:text-foreground"
          >
            ← {tr("dashboard")}
          </Link>
        </div>
      </div>
    </main>
  );
}