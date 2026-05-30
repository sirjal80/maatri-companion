import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Phase = "pregnancy" | "postpartum";
export type Theme = "light" | "dark";

export type Profile = {
  name?: string;
  week?: number;
  dueDate?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  proofFileName?: string;
  proofFileData?: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

type State = {
  user: User | null;
  setUser: (user: User | null) => void;
  isGuest: boolean;
  setGuest: (v: boolean) => void;
  phase: Phase;
  setPhase: (p: Phase) => void;
  profile: Profile;
  updateProfile: (p: Partial<Profile>) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
};

const Ctx = createContext<State>({
  user: null,
  setUser: () => {},
  isGuest: true,
  setGuest: () => {},
  phase: "pregnancy",
  setPhase: () => {},
  profile: { week: 20 },
  updateProfile: () => {},
  theme: "light",
  setTheme: () => {},
});

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isGuest, setGuestState] = useState(true);
  const [phase, setPhaseState] = useState<Phase>("pregnancy");
  const [profile, setProfile] = useState<Profile>({ week: 20 });
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("maatri.state");
      if (raw) {
        const s = JSON.parse(raw);
        if (s?.user && typeof s.user === "object" && typeof s.user.email === "string") {
          setUserState({
            id: String(s.user.id),
            email: String(s.user.email),
            name: String(s.user.name),
            createdAt: String(s.user.createdAt),
          });
        }
        if (typeof s.isGuest === "boolean") setGuestState(s.isGuest);
        if (s.phase === "pregnancy" || s.phase === "postpartum") setPhaseState(s.phase);
        if (s.profile && typeof s.profile === "object") setProfile({ week: 20, ...s.profile });
        if (s.theme === "light" || s.theme === "dark") setThemeState(s.theme);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(
      "maatri.state",
      JSON.stringify({ user, isGuest, phase, profile, theme }),
    );
  }, [user, isGuest, phase, profile, theme]);

  return (
    <Ctx.Provider
      value={{
        user,
        setUser: setUserState,
        isGuest,
        setGuest: setGuestState,
        phase,
        setPhase: setPhaseState,
        profile,
        updateProfile: (p) => setProfile((prev) => ({ ...prev, ...p })),
        theme,
        setTheme: setThemeState,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useAppState = () => useContext(Ctx);
