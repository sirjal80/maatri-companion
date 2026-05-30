import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MessageCircleHeart, UserCircle2, Sparkles, MapPin, Phone } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/mode")({
  head: () => ({
    meta: [{ title: "Continue as guest or sign in — Maatri Nepal" }],
  }),
  component: ModePage,
});

function ModePage() {
  const { tr } = useLang();
  const { setGuest } = useAppState();
  const nav = useNavigate();

  const guestFeatures = [
    { icon: MessageCircleHeart, label: tr("chat") },
    { icon: MapPin, label: tr("hospitals") },
    { icon: Sparkles, label: tr("dashboard") },
    { icon: Phone, label: tr("emergency") },
  ];

  return (
    <main className="bg-warm-gradient min-h-[100svh] px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">{tr("modeTitle")}</h1>
          <p className="mt-3 text-muted-foreground">{tr("modeSub")}</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <button
            onClick={() => {
              setGuest(true);
              nav({ to: "/dashboard" });
            }}
            className="glass-card group flex flex-col rounded-3xl p-7 text-left transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-soft"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blush text-primary">
              <Sparkles className="h-6 w-6" />
            </span>
            <h2 className="mt-5 font-display text-2xl font-semibold">{tr("guestTitle")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tr("guestSub")}</p>
            <ul className="mt-5 grid grid-cols-2 gap-2 text-sm">
              {guestFeatures.map((f) => (
                <li key={f.label} className="flex items-center gap-2 text-foreground/80">
                  <f.icon className="h-4 w-4 text-primary" /> {f.label}
                </li>
              ))}
            </ul>
            <span className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">
              {tr("continueGuest")} →
            </span>
          </button>

          <Link
            to="/login"
            className="glass-card group flex flex-col rounded-3xl p-7 text-left transition-all hover:-translate-y-1 hover:border-lavender/60 hover:shadow-soft"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
              <UserCircle2 className="h-6 w-6" />
            </span>
            <h2 className="mt-5 font-display text-2xl font-semibold">{tr("loginTitle")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tr("loginSub")}</p>
            <span className="mt-6 inline-flex items-center gap-2 self-start rounded-full border border-border bg-card px-5 py-2 text-sm font-semibold text-foreground">
              {tr("loginTitle")} →
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}