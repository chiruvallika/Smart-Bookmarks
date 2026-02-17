import { Trash2, ExternalLink, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import type { Bookmark } from "@/lib/types";

interface BookmarkItemProps {
  bookmark: Bookmark;
  onDelete: (id: string) => Promise<void>;
}

function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return "";
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export function BookmarkItem({ bookmark, onDelete }: BookmarkItemProps) {
  const [deleting, setDeleting] = useState(false);
  const [imgError, setImgError] = useState(false);
  const faviconUrl = getFaviconUrl(bookmark.url);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(bookmark.id);
    } catch {
      setDeleting(false);
    }
  };

  return (
    <Card className="p-4 hover-elevate transition-all group" data-testid={`card-bookmark-${bookmark.id}`}>
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5 w-8 h-8 rounded-md bg-muted flex items-center justify-center overflow-visible">
          {faviconUrl && !imgError ? (
            <img
              src={faviconUrl}
              alt=""
              className="w-4 h-4"
              onError={() => setImgError(true)}
            />
          ) : (
            <Globe className="w-4 h-4 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-sm hover:underline inline-flex items-center gap-1.5 max-w-full"
            data-testid={`link-bookmark-${bookmark.id}`}
          >
            <span className="truncate">{bookmark.title}</span>
            <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
          </a>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground truncate" data-testid={`text-url-${bookmark.id}`}>
              {getDomain(bookmark.url)}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(bookmark.created_at)}
            </span>
          </div>
        </div>

        <Button
          size="icon"
          variant="ghost"
          onClick={handleDelete}
          disabled={deleting}
          className="shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ visibility: "visible" }}
          data-testid={`button-delete-${bookmark.id}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
