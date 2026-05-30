import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Mail, Chrome, ShieldCheck } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Maatri Nepal" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { tr } = useLang();
  const { setGuest } = useAppState();
  const nav = useNavigate();
  return (
    <main className="bg-warm-gradient flex min-h-[100svh] items-center justify-center px-6 py-12">
      <div className="glass-card w-full max-w-md rounded-3xl p-8 text-center shadow-soft">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
          <ShieldCheck className="h-7 w-7" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold">{tr("loginTitle")}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{tr("loginComingSoon")}</p>
        <div className="mt-6 space-y-3">
          <button
            disabled
            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-sm font-medium text-muted-foreground"
          >
            <Chrome className="h-4 w-4" /> Google
          </button>
          <button
            disabled
            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-sm font-medium text-muted-foreground"
          >
            <Mail className="h-4 w-4" /> Email
          </button>
        </div>
        <button
          onClick={() => {
            setGuest(true);
            nav({ to: "/dashboard" });
          }}
          className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/95"
        >
          {tr("continueGuest")} →
        </button>
      </div>
    </main>
  );
}