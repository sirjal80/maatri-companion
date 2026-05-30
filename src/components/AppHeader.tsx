import { Link, useRouterState } from "@tanstack/react-router";
import { Flower2 } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function AppHeader() {
  const { tr, lang, setLang } = useLang();
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (["/", "/language", "/mode"].includes(path)) return null;

  const links: Array<{ to: string; key: "dashboard" | "chat" | "hospitals" }> = [
    { to: "/dashboard", key: "dashboard" },
    { to: "/chat", key: "chat" },
    { to: "/hospitals", key: "hospitals" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-blush text-primary">
            <Flower2 className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">{tr("appName")}</span>
        </Link>
        <nav className="hidden gap-1 sm:flex">
          {links.map((l) => {
            const active = path.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                  active ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tr(l.key)}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => setLang(lang === "en" ? "ne" : "en")}
          className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
        >
          {lang === "en" ? "नेपाली" : "English"}
        </button>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-4 pb-2 sm:hidden">
        {links.map((l) => {
          const active = path.startsWith(l.to);
          return (
            <Link
              key={l.to}
              to={l.to}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm ${
                active ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"
              }`}
            >
              {tr(l.key)}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}