import { Bookmark, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SiGoogle } from "react-icons/si";
import { ThemeToggle } from "@/components/theme-toggle";

interface LoginPageProps {
  onSignIn: () => void;
  loading: boolean;
}

export function LoginPage({ onSignIn, loading }: LoginPageProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-end gap-2 p-4">
        <ThemeToggle />
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-md bg-primary/10 mb-2">
              <Bookmark className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight" data-testid="text-app-title">
              Smart Bookmarks
            </h1>
            <p className="text-muted-foreground text-base max-w-sm mx-auto">
              Save, organize, and access your favorite links from anywhere. Real-time sync across all your devices.
            </p>
          </div>

          <Card className="p-6">
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h2 className="text-lg font-semibold">Get Started</h2>
                <p className="text-sm text-muted-foreground">
                  Sign in with your Google account to continue
                </p>
              </div>

              <Button
                onClick={onSignIn}
                disabled={loading}
                className="w-full gap-2"
                data-testid="button-google-signin"
              >
                <SiGoogle className="h-4 w-4" />
                {loading ? "Signing in..." : "Continue with Google"}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Your bookmarks are private and only visible to you
              </p>
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">Real-time</div>
              <p className="text-xs text-muted-foreground">Instant sync</p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">Private</div>
              <p className="text-xs text-muted-foreground">Your eyes only</p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">Simple</div>
              <p className="text-xs text-muted-foreground">No clutter</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
