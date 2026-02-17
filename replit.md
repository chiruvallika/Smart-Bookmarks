# Smart Bookmark App

## Overview
A real-time bookmark manager using React + Supabase (Auth, Database, Realtime) + Tailwind CSS. Users sign in with Google OAuth and can add/delete bookmarks that sync in real-time across tabs.

## Architecture
- **Frontend**: React 18 + Vite + TypeScript, served on port 5000
- **Backend**: Express (serves static files only — all data goes through Supabase client-side)
- **Auth**: Supabase Auth with Google OAuth provider
- **Database**: Supabase PostgreSQL with RLS policies
- **Realtime**: Supabase Realtime (postgres_changes)
- **Styling**: Tailwind CSS + shadcn/ui components

## Key Files
- `client/src/lib/supabase.ts` - Supabase client initialization
- `client/src/lib/types.ts` - TypeScript interfaces for Bookmark
- `client/src/hooks/use-auth.ts` - Auth hook (Google OAuth sign in/out)
- `client/src/hooks/use-bookmarks.ts` - Bookmarks CRUD + realtime subscription
- `client/src/components/dashboard.tsx` - Main dashboard with bookmark management
- `client/src/components/login-page.tsx` - Google sign-in landing page
- `client/src/components/add-bookmark-form.tsx` - Form to add new bookmarks
- `client/src/components/bookmark-item.tsx` - Individual bookmark card
- `client/src/components/bookmark-list.tsx` - Bookmark list with loading/empty states
- `client/src/components/theme-provider.tsx` - Dark/light mode provider
- `client/src/App.tsx` - Root component with auth state routing

## Environment Variables
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon/public key

## Supabase Setup
- `bookmarks` table with RLS policies enforcing user_id matching
- Realtime enabled on bookmarks table
- Google OAuth provider enabled in Supabase Auth
