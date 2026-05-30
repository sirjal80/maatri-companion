import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useLang } from "@/lib/i18n";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Maatri Nepal" }] }),
  component: LoginPage,
});

type AuthMode = "login" | "signup";

function LoginPage() {
  const { tr } = useLang();
  const { setGuest, setUser, updateProfile } = useAppState();
  const nav = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedName = name.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMessage(tr("provideCredentials"));
      return;
    }

    if (mode === "signup" && !trimmedName) {
      setErrorMessage(tr("provideName"));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: mode,
          email: trimmedEmail,
          password: trimmedPassword,
          name: mode === "signup" ? trimmedName : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data?.message || tr("authFailed"));
        return;
      }

      if (data?.user) {
        setUser(data.user);
        setGuest(false);
        updateProfile({ name: data.user.name });
        setStatusMessage(tr("authSuccess"));
        nav({ to: "/dashboard" });
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : tr("authFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-warm-gradient flex min-h-[100svh] items-center justify-center px-6 py-12">
      <div className="glass-card w-full max-w-lg rounded-3xl p-8 text-center shadow-soft">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
          <ShieldCheck className="h-7 w-7" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold">{tr("loginTitle")}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{tr("loginSub")}</p>

        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === "login"
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-foreground hover:bg-muted"
            }`}
          >
            {tr("loginAction")}
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === "signup"
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-foreground hover:bg-muted"
            }`}
          >
            {tr("signupAction")}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
          {mode === "signup" ? (
            <label className="block text-sm font-medium text-foreground">
              {tr("name")}
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={tr("name")}
                className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </label>
          ) : null}

          <label className="block text-sm font-medium text-foreground">
            {tr("emailAddress")}
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
              className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </label>

          <label className="block text-sm font-medium text-foreground">
            {tr("password")}
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              type="password"
              className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </label>

          {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
          {statusMessage ? <p className="text-sm text-primary">{statusMessage}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/95 disabled:opacity-60"
          >
            {isSubmitting ? tr("pleaseWait") : mode === "login" ? tr("loginAction") : tr("signupAction")}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setGuest(true);
            nav({ to: "/dashboard" });
          }}
          className="mt-4 w-full rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
        >
          {tr("continueGuest")} →
        </button>
      </div>
    </main>
  );
}
