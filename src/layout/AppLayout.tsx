import { useState } from "react";
import { Cat } from "../components/cat/Cat";
import { ToastContainer } from "../components/ui/Toast";
import { AuthInitializer } from "./AuthInitializer";
import { AuthGuard } from "./AuthGuard";
import { OnboardingGuard } from "./OnboardingGuard";
import { AppRouter } from "../components/app/AppRouter";

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
        <OnboardingGuard
          onComplete={() => {
            window.location.hash = "#app/home";
          }}
        >
          <AppRouter />
        </OnboardingGuard>
      </AuthGuard>
    </>
  );
}
