import { Link, useRouterState } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function EmergencyButton() {
  const { tr } = useLang();
  const path = useRouterState({ select: (s) => s.location.pathname });
  // Hide on the welcome/onboarding flow
  if (["/", "/language", "/mode", "/login", "/emergency"].includes(path)) return null;
  return (
    <Link
      to="/emergency"
      aria-label={tr("emergency")}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-ember px-5 py-3 text-ember-foreground shadow-soft transition-transform hover:scale-105 active:scale-95"
    >
      <Phone className="h-5 w-5" />
      <span className="text-sm font-semibold">{tr("emergency")}</span>
    </Link>
  );
}