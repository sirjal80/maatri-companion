import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Phase = "pregnancy" | "postpartum";

export type Profile = {
  name?: string;
  week?: number;
  dueDate?: string;
  bloodGroup?: string;
  emergencyContact?: string;
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
});

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isGuest, setGuestState] = useState(true);
  const [phase, setPhaseState] = useState<Phase>("pregnancy");
  const [profile, setProfile] = useState<Profile>({ week: 20 });

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
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      "maatri.state",
      JSON.stringify({ user, isGuest, phase, profile }),
    );
  }, [user, isGuest, phase, profile]);

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
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useAppState = () => useContext(Ctx);
