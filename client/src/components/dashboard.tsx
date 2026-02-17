import { Bookmark, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { AddBookmarkForm } from "@/components/add-bookmark-form";
import { BookmarkList } from "@/components/bookmark-list";
import { useBookmarks } from "@/hooks/use-bookmarks";
import type { User } from "@supabase/supabase-js";

interface DashboardProps {
  user: User;
  onSignOut: () => void;
}

function getUserDisplayName(user: User): string {
  return (
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "User"
  );
}

function getUserAvatar(user: User): string {
  return user.user_metadata?.avatar_url || user.user_metadata?.picture || "";
}

function getUserInitials(user: User): string {
  const name = getUserDisplayName(user);
  return name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Dashboard({ user, onSignOut }: DashboardProps) {
  const { bookmarks, loading, error, addBookmark, deleteBookmark } =
    useBookmarks(user.id);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-primary" />
            <h1 className="font-bold text-lg" data-testid="text-dashboard-title">
              Smart Bookmarks
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={getUserAvatar(user)} alt={getUserDisplayName(user)} />
                <AvatarFallback className="text-xs">{getUserInitials(user)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:inline" data-testid="text-user-name">
                {getUserDisplayName(user)}
              </span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={onSignOut}
              data-testid="button-signout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <AddBookmarkForm onAdd={addBookmark} />

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-medium text-muted-foreground">
              Your Bookmarks
              {!loading && bookmarks.length > 0 && (
                <span className="ml-1.5">({bookmarks.length})</span>
              )}
            </h2>
          </div>
          <BookmarkList
            bookmarks={bookmarks}
            loading={loading}
            error={error}
            onDelete={deleteBookmark}
          />
        </div>
      </main>
    </div>
  );
}
