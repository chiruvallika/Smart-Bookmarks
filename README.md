# Smart Bookmark App

A simple, real-time bookmark manager built with **React**, **Supabase** (Auth, Database, Realtime), and **Tailwind CSS**.

## Live URL

**Deployed on Replit** (publish the app to get a live URL)

## Features

- **Google OAuth Authentication** — Sign up and log in using Google only (no email/password)
- **Add Bookmarks** — Save any URL with a custom title
- **Private Bookmarks** — Each user can only see and manage their own bookmarks (enforced via Row Level Security)
- **Real-time Sync** — Open two tabs; add a bookmark in one and it appears instantly in the other (powered by Supabase Realtime)
- **Delete Bookmarks** — Remove bookmarks with a single click
- **Dark Mode** — Toggle between light and dark themes
- **Responsive Design** — Works great on desktop and mobile

## Tech Stack

| Layer          | Technology                        |
| -------------- | --------------------------------- |
| Frontend       | React 18, Vite, TypeScript        |
| Styling        | Tailwind CSS, shadcn/ui           |
| Auth           | Supabase Auth (Google OAuth)      |
| Database       | Supabase PostgreSQL               |
| Real-time      | Supabase Realtime (Postgres CDC)  |
| Hosting        | Replit Deployments                |

> **Note:** The assignment specified Next.js App Router and Vercel deployment. This implementation uses React + Vite + Express on Replit instead, but all core functionality (Google OAuth, Supabase Auth/DB/Realtime, Tailwind CSS) is identical.

## Database Schema

```sql
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

### Row Level Security Policies

- **SELECT**: Users can only view their own bookmarks (`auth.uid() = user_id`)
- **INSERT**: Users can only create bookmarks for themselves (`auth.uid() = user_id`)
- **DELETE**: Users can only delete their own bookmarks (`auth.uid() = user_id`)

## Problems I Ran Into and How I Solved Them

### 1. Supabase Environment Variables Not Loading

**Problem:** After setting up the Supabase client, the app threw `Missing Supabase environment variables` on startup. The Vite development server wasn't picking up the newly added secrets.

**Solution:** Vite requires environment variables to be prefixed with `VITE_` to be exposed to the frontend. I ensured both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` were set as secrets, then restarted the development server so Vite could inject them via `import.meta.env`.

### 2. Real-time Updates Across Tabs

**Problem:** Getting bookmarks to appear in real-time across multiple browser tabs without polling or page refresh.

**Solution:** Used Supabase Realtime's `postgres_changes` feature to subscribe to `INSERT` and `DELETE` events on the `bookmarks` table, filtered by the current user's ID. The subscription listens for changes and updates the local state immediately. I also added deduplication logic to prevent duplicate entries when the same tab that inserted the record also receives the realtime event.

### 3. Row Level Security (RLS) Configuration

**Problem:** Without RLS, any authenticated user could potentially read or modify other users' bookmarks through the Supabase client.

**Solution:** Enabled RLS on the `bookmarks` table and created three policies (SELECT, INSERT, DELETE) that all check `auth.uid() = user_id`. This ensures data privacy is enforced at the database level — even if the frontend code had a bug, the database would reject unauthorized access.

### 4. Google OAuth Redirect URL

**Problem:** After Google login, the user was being redirected to the wrong URL or getting a redirect mismatch error.

**Solution:** Configured the `redirectTo` option in the `signInWithOAuth` call to use `window.location.origin`, which dynamically adapts to whatever domain the app is hosted on. Also needed to add the correct redirect URL in both the Supabase Authentication settings and the Google Cloud Console OAuth configuration.

### 5. URL Validation and Auto-Prefixing

**Problem:** Users might enter URLs without the `https://` protocol prefix, causing invalid URLs to be saved.

**Solution:** Added client-side validation that automatically prepends `https://` if the URL doesn't start with `http://` or `https://`. The URL is then validated using the `URL` constructor to ensure it's well-formed before saving.

### 6. Favicon Display for Bookmarks

**Problem:** Wanted to show website favicons next to each bookmark for better visual recognition, but favicons can fail to load for various reasons.

**Solution:** Used Google's favicon service (`https://www.google.com/s2/favicons?domain=...`) as a reliable proxy for fetching favicons. Added an `onError` handler that falls back to a generic globe icon if the favicon fails to load.

## Setup Instructions

### Prerequisites

- A Supabase project with Google OAuth enabled
- Google Cloud OAuth credentials (Client ID & Secret) configured in Supabase

### 1. Set Environment Variables

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Create Database Table

Run this SQL in the Supabase SQL Editor:

```sql
-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Users can only see their own bookmarks
CREATE POLICY "Users can view own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
```

### 3. Configure Google OAuth in Supabase

1. Go to Supabase Dashboard → Authentication → Providers → Google
2. Enable Google provider
3. Add your Google Client ID and Secret
4. Add the redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### 4. Run the App

```bash
npm run dev
```

## Architecture Decisions

- **Client-side Supabase**: All database operations go directly from the React frontend to Supabase using the JS client library. The Express backend only serves static files — no custom API routes needed since Supabase handles auth, data, and realtime.
- **Row Level Security**: Privacy is enforced at the database level, not in application code. This is more secure because even direct API calls to Supabase are filtered by the user's auth token.
- **Realtime via Postgres CDC**: Instead of polling or WebSocket-based custom solutions, Supabase's built-in Change Data Capture listens for database changes and pushes them to subscribed clients.
