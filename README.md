# Threat Monitoring System

Threat post report, raid booking, and drugs monitoring system with Admin and Client roles.

## Tech Stack

- **React** + **TypeScript**
- **Vite**
- **Tailwind CSS**
- **React Router**

## Setup & Run

```bash
npm install
npm run dev
```

Then open the URL shown (e.g. http://localhost:5173).

## Environment (AI Chat)

The AI Chat uses the **Gemini API**. Copy `.env.example` to `.env` and set your key:

```bash
cp .env.example .env
# Edit .env and set: VITE_GEMINI_API_KEY=your_gemini_api_key
```

Get a key at [Google AI Studio](https://aistudio.google.com/app/apikey). Project uses **Gemini API Key** (e.g. Name: Gemini API Key, Project number: as in your Google Cloud project).

## Home & Navigation

- **Home** (`/`): Landing page for non-users with links to Sign in and Register. Login and Register pages include a **Home** button to return to the home page.
- **AI Chat**: Floating button (bottom-right) on all pages opens a Gemini-powered chat for help with the Threat Monitoring System.

## Auth

- **Login**: Email and password only. You are redirected to Admin or Client dashboard based on your account.
- **Registration**: Client only. Use "Register as client" to create a new client account. Admin accounts are pre-defined (no admin registration).

## Demo Login

| Role   | Email              | Password   |
|--------|--------------------|------------|
| Admin  | admin@gmail.com    | admin123   |
| Client | client@example.com | client123  |

## Features

- **Admin**: Dashboard; Threat reports (View full report, Change status); Raid bookings (View details, Change status); Drug monitoring (Add, Edit, Delete, View, Change status).
- **Client**: Dashboard, Report threat, Book raid.
- **Responsive**: Mobile-friendly layout with collapsible nav and responsive tables.

## Developer

**Raminder Jangao**

## Build

```bash
npm run build
npm run preview
```

## Deploy (Vercel)

The project includes `vercel.json` for Vercel deployment. Push to GitHub and import the repo in [Vercel](https://vercel.com); the build and rewrites are configured automatically.

**For AI Chat to work on Vercel:**

1. **Environment variable**  
   In the Vercel project: **Settings → Environment Variables** add:
   - **Name:** `VITE_GEMINI_API_KEY`  
   - **Value:** your Gemini API key  
   Apply to Production (and Preview if you want). Save.

2. **Redeploy**  
   Trigger a new deployment (e.g. **Deployments → … → Redeploy**) so the new env var is baked into the build. Vite only injects `VITE_*` at build time.

3. **Google API key restrictions (if you use them)**  
   If your Gemini key has **HTTP referrer** restrictions in [Google Cloud Console](https://console.cloud.google.com/apis/credentials), add your Vercel URL so the browser can call the API, e.g.:
   - `https://your-project.vercel.app/*`
   - or `https://*.vercel.app/*`  
   Otherwise the API may return 403 and the AI chat will fail.
