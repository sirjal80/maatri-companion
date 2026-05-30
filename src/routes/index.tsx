import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import welcomeLogo from "../../Gemini_Generated_Image_20eqa720eqa720eq.png?url";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Welcome To Maatri Nepal Your Companion in Pregnancy" },
      {
        name: "description",
        content: "Select Nepali or English to begin your journey with Maatri Nepal.",
      },
      { property: "og:title", content: "Welcome To Maatri Nepal Your Companion in Pregnancy" },
      {
        property: "og:description",
        content: "A warm, bilingual maternal companion experience for mothers in Nepal.",
      },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const { setLang } = useLang();
  const navigate = useNavigate();

  const chooseLanguage = (language: "ne" | "en") => {
    setLang(language);
    navigate({ to: "/mode" });
  };

  return (
    <main className="bg-warm-gradient relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute left-6 top-8 hidden rounded-3xl border border-border bg-card/90 p-3 shadow-soft sm:block">
        <img src={welcomeLogo} alt="Maatri Nepal logo" className="h-16 w-16 rounded-2xl object-cover" />
      </div>

      <div className="relative z-10 w-full max-w-4xl rounded-[2.5rem] border border-border bg-card/95 p-10 shadow-soft backdrop-blur-xl">
        <div className="flex flex-col items-center gap-8 text-center">
          <img src={welcomeLogo} alt="Maatri Nepal logo" className="h-24 w-24 rounded-3xl border border-border bg-cream p-3 shadow-soft" />
          <div>
            <h1 className="font-display text-5xl font-semibold leading-tight tracking-tight text-foreground sm:text-6xl">
              Maatri Nepal
            </h1>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <button
            onClick={() => chooseLanguage("en")}
            className="rounded-[1.75rem] border border-border bg-primary px-8 py-6 text-left text-foreground shadow-soft transition hover:-translate-y-0.5 hover:bg-primary/95"
          >
            <span className="block text-2xl font-semibold">English</span>
            <span className="mt-2 block text-sm text-primary-foreground/90">Continue in English</span>
          </button>
          <button
            onClick={() => chooseLanguage("ne")}
            className="rounded-[1.75rem] border border-border bg-secondary px-8 py-6 text-left text-secondary-foreground shadow-soft transition hover:-translate-y-0.5 hover:bg-secondary/95"
          >
            <span className="block text-2xl font-semibold">नेपाली</span>
            <span className="mt-2 block text-sm text-secondary-foreground/90">नेपालीमा अगाडि बढ्नुहोस्</span>
          </button>
        </div>
      </div>
    </main>
  );
}
