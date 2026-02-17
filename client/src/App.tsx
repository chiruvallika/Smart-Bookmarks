import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { LoginPage } from "@/components/login-page";
import { Dashboard } from "@/components/dashboard";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

function App() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return user ? (
    <Dashboard user={user} onSignOut={signOut} />
  ) : (
    <LoginPage onSignIn={signInWithGoogle} loading={loading} />
  );
}

export default function AppWithProviders() {
  return (
    <ThemeProvider>
      <App />
      <Toaster />
    </ThemeProvider>
  );
}
