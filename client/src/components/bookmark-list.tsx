import { BookmarkItem } from "@/components/bookmark-item";
import { Bookmark as BookmarkIcon, Loader2 } from "lucide-react";
import type { Bookmark } from "@/lib/types";

interface BookmarkListProps {
  bookmarks: Bookmark[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string) => Promise<void>;
}

export function BookmarkList({ bookmarks, loading, error, onDelete }: BookmarkListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16" data-testid="loading-bookmarks">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 space-y-2" data-testid="error-bookmarks">
        <p className="text-sm text-destructive font-medium">Something went wrong</p>
        <p className="text-xs text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-16 space-y-3" data-testid="empty-bookmarks">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-muted">
          <BookmarkIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-sm">No bookmarks yet</p>
          <p className="text-xs text-muted-foreground">
            Add your first bookmark above to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2" data-testid="bookmark-list">
      {bookmarks.map((bookmark) => (
        <BookmarkItem
          key={bookmark.id}
          bookmark={bookmark}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
