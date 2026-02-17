import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Bookmark, InsertBookmark } from "@/lib/types";

export function useBookmarks(userId: string | undefined) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setBookmarks(data || []);
      setError(null);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setBookmarks((prev) => {
            const exists = prev.some((b) => b.id === payload.new.id);
            if (exists) return prev;
            return [payload.new as Bookmark, ...prev];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setBookmarks((prev) =>
            prev.filter((b) => b.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const addBookmark = useCallback(
    async (bookmark: InsertBookmark) => {
      if (!userId) return;
      const { error } = await supabase.from("bookmarks").insert({
        ...bookmark,
        user_id: userId,
      });
      if (error) throw new Error(error.message);
    },
    [userId]
  );

  const deleteBookmark = useCallback(async (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);
    if (error) {
      fetchBookmarks();
      throw new Error(error.message);
    }
  }, [fetchBookmarks]);

  return { bookmarks, loading, error, addBookmark, deleteBookmark, refetch: fetchBookmarks };
}
