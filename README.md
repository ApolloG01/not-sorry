# Not Sorry - Joke Collection App

A React 19 + TypeScript + Redux Toolkit + Supabase project for discovering, saving, and creating jokes.

## 🚀 Recent Evolution: From Local to Cloud

Originally a practice project, **Not Sorry** has evolved into a full-stack application. It no longer relies on `localStorage`; it now features a real-time sync engine powered by **Supabase**.

- 🔐 **Real Authentication**: Secure login/signup via Supabase Auth.
- ☁️ **Cloud Persistence**: Your favorites and custom jokes follow you across devices.
- 🔄 **Real-time Sync**: Automatic state "hydration" on page refresh.
- 🛠️ **Data Normalization**: Handles complex data mapping between external APIs and internal DB.

## ✨ Features

- **Dynamic Joke Discovery**: Fetches from JokeAPI with custom category filtering.
- **The "Smart" Favorite System**: A unified toggle that handles both API-sourced jokes and user-created jokes seamlessly.
- **Full CRUD for User Jokes**: Create, Read, Update, and Delete your own comedic gold.
- **Auth-Guarded Content**: Access to "Dark" or "Explicit" humor is locked behind a secure session.
- **Robust Error Handling**: Integrated "Toast" notifications and loading states for a premium UX.

## 🛠️ Tech Stack

- **Frontend**: React 19 (Functional Components + Hooks)
- **Language**: TypeScript (Strict Type Safety)
- **Backend-as-a-Service**: Supabase (PostgreSQL + Auth)
- **State Management**: Redux Toolkit (Normalized State)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📁 Project Architecture & Data Flow

1. **Auth Listener**: `App.tsx` maintains a live subscription to Supabase Auth.
2. **Data Hydration**: On login or refresh, Redux is "hydrated" with favorites from the cloud.
3. **Optimistic UI**: The UI updates via Redux immediately, while Supabase handles the background sync.

## 🚀 Deployment to GitHub Pages

### 1. Prerequisites

Ensure you have the `gh-pages` package installed:

```bash
npm install gh-pages --save-dev
```
