import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/language")({
  head: () => ({
    meta: [
      { title: "Choose your language — Maatri Nepal" },
      { name: "description", content: "Continue in Nepali or English." },
    ],
  }),
  component: LanguagePage,
});

function LanguagePage() {
  const { tr, setLang } = useLang();
  const nav = useNavigate();
  const pick = (l: "ne" | "en") => {
    setLang(l);
    nav({ to: "/mode" });
  };
  return (
    <main className="bg-warm-gradient flex min-h-[100svh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl text-center">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">{tr("langTitle")}</h1>
        <p className="mt-3 text-muted-foreground">{tr("langSub")}</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <button
            onClick={() => pick("ne")}
            className="glass-card group flex flex-col items-center gap-2 rounded-3xl p-8 text-left transition-all hover:-translate-y-1 hover:border-secondary/50 hover:shadow-soft"
          >
            <span className="font-display text-3xl font-semibold text-foreground">नेपाली</span>
            <span className="text-sm text-muted-foreground">Nepali</span>
            <span className="mt-3 inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground opacity-0 transition-opacity group-hover:opacity-100">
              जारी राख्नुहोस् →
            </span>
          </button>
          <button
            onClick={() => pick("en")}
            className="glass-card group flex flex-col items-center gap-2 rounded-3xl p-8 text-left transition-all hover:-translate-y-1 hover:border-secondary/50 hover:shadow-soft"
          >
            <span className="font-display text-3xl font-semibold text-foreground">English</span>
            <span className="text-sm text-muted-foreground">अंग्रेजी</span>
            <span className="mt-3 inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground opacity-0 transition-opacity group-hover:opacity-100">
              Continue →
            </span>
          </button>
        </div>
        <Link to="/" className="mt-8 inline-block text-sm text-muted-foreground hover:text-foreground">
          ← {tr("back")}
        </Link>
      </div>
    </main>
  );
}