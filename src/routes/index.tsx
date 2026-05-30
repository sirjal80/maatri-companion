import { createFileRoute, Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import heroImg from "@/assets/welcome-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maatri Nepal — Welcome" },
      { name: "description", content: "A warm AI-powered companion for pregnancy and motherhood in Nepal." },
      { property: "og:title", content: "Maatri Nepal — Welcome" },
      { property: "og:description", content: "A warm AI-powered companion for pregnancy and motherhood in Nepal." },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const { tr } = useLang();
  return (
    <main className="bg-warm-gradient relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-12">
      <div className="relative z-10 mx-auto grid w-full max-w-5xl items-center gap-10 md:grid-cols-2">
        <div className="text-center md:text-left">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            मातृ नेपाल · Maatri Nepal
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] text-foreground sm:text-5xl md:text-6xl">
            {tr("welcomeTitle")}
          </h1>
          <p className="mt-3 font-display text-2xl text-primary sm:text-3xl">Welcome to Maatri Nepal</p>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            {tr("welcomeSub")}
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground/80">
            Your trusted companion throughout pregnancy and motherhood.
          </p>
          <Link
            to="/language"
            className="mt-10 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-soft transition-all hover:scale-[1.02] hover:bg-primary/95 active:scale-[0.98]"
          >
            {tr("begin")} →
          </Link>
        </div>
        <div className="relative mx-auto w-full max-w-sm md:max-w-md">
          <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-blush/40 blur-3xl" />
          <img
            src={heroImg}
            alt="A peaceful pregnant mother cradling her belly, surrounded by lotus flowers"
            width={1024}
            height={1280}
            className="w-full rounded-[2rem] shadow-soft"
          />
        </div>
      </div>
    </main>
  );
}