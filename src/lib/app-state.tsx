import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Phase = "pregnancy" | "postpartum";

export type Profile = {
  name?: string;
  week?: number;
  dueDate?: string;
  bloodGroup?: string;
  emergencyContact?: string;
};

type State = {
  isGuest: boolean;
  setGuest: (v: boolean) => void;
  phase: Phase;
  setPhase: (p: Phase) => void;
  profile: Profile;
  updateProfile: (p: Partial<Profile>) => void;
};

const Ctx = createContext<State>({
  isGuest: true,
  setGuest: () => {},
  phase: "pregnancy",
  setPhase: () => {},
  profile: { week: 20 },
  updateProfile: () => {},
});

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [isGuest, setGuestState] = useState(true);
  const [phase, setPhaseState] = useState<Phase>("pregnancy");
  const [profile, setProfile] = useState<Profile>({ week: 20 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("maatri.state");
      if (raw) {
        const s = JSON.parse(raw);
        if (typeof s.isGuest === "boolean") setGuestState(s.isGuest);
        if (s.phase === "pregnancy" || s.phase === "postpartum") setPhaseState(s.phase);
        if (s.profile && typeof s.profile === "object") setProfile({ week: 20, ...s.profile });
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("maatri.state", JSON.stringify({ isGuest, phase, profile }));
  }, [isGuest, phase, profile]);

  return (
    <Ctx.Provider
      value={{
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