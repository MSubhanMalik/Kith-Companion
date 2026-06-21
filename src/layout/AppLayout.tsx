import { useState, useEffect, useRef } from "react";
import { Cat } from "../components/cat/Cat";
import { ToastContainer } from "../components/ui/Toast";
import { AuthInitializer } from "./AuthInitializer";
import { AuthGuard } from "./AuthGuard";
import { OnboardingGuard } from "./OnboardingGuard";
import { AppRouter } from "../components/app/AppRouter";
import { useGoalsStore } from "../stores/goals";
import { useScheduleStore } from "../stores/schedule";
import { useAuthStore } from "../stores/auth";

function getMonday(): string {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today);
  monday.setDate(diff);
  return monday.toISOString().split("T")[0];
}

function DataLoader({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAuthStore(s => s.isLoggedIn);
  const fetchGoals = useGoalsStore(s => s.fetchGoals);
  const fetchLifeBlocks = useScheduleStore(s => s.fetchLifeBlocks);
  const fetchWeek = useScheduleStore(s => s.fetchWeek);
  const loaded = useRef(false);

  useEffect(() => {
    if (isLoggedIn && !loaded.current) {
      loaded.current = true;
      loadAll();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    function onHash() {
      if (window.location.hash === "#app/home" && loaded.current) {
        loadAll();
      }
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  function loadAll() {
    fetchGoals();
    fetchLifeBlocks();
    fetchWeek(getMonday());
  }

  return <>{children}</>;
}

export function AppLayout() {
  const [isInitialized, setIsInitialized] = useState(false);

  if (!isInitialized) {
    return (
      <>
        <AuthInitializer onInitialized={() => setIsInitialized(true)} />
        <div className="min-h-screen bg-page flex items-center justify-center">
          <Cat state="thinking" size={48} />
        </div>
      </>
    );
  }

  return (
    <>
      <ToastContainer />
      <AuthGuard>
        <DataLoader>
          <OnboardingGuard
            onComplete={() => {
              window.location.hash = "#app/home";
            }}
          >
            <AppRouter />
          </OnboardingGuard>
        </DataLoader>
      </AuthGuard>
    </>
  );
}
