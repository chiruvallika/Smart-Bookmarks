import { useState } from "react";
import { Plus, Link2, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { InsertBookmark } from "@/lib/types";

interface AddBookmarkFormProps {
  onAdd: (bookmark: InsertBookmark) => Promise<void>;
}

export function AddBookmarkForm({ onAdd }: AddBookmarkFormProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();

    if (!trimmedTitle || !trimmedUrl) {
      toast({
        title: "Missing fields",
        description: "Please enter both a title and URL.",
        variant: "destructive",
      });
      return;
    }

    let finalUrl = trimmedUrl;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = "https://" + finalUrl;
    }

    try {
      new URL(finalUrl);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await onAdd({ title: trimmedTitle, url: finalUrl });
      setTitle("");
      setUrl("");
      toast({
        title: "Bookmark added",
        description: "Your bookmark has been saved.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to add bookmark.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Bookmark title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="pl-9"
            data-testid="input-bookmark-title"
          />
        </div>
        <div className="relative flex-1">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-9"
            data-testid="input-bookmark-url"
          />
        </div>
        <Button type="submit" disabled={submitting} className="gap-2 shrink-0" data-testid="button-add-bookmark">
          <Plus className="h-4 w-4" />
          {submitting ? "Adding..." : "Add"}
        </Button>
      </form>
    </Card>
  );
}
