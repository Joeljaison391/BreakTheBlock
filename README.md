<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?style=for-the-badge&logo=supabase" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss" />
</p>

# 🪨 Break the Block

**Stop doomscrolling. Start doing.**

Break the Block is a gamified goal-tracking platform that reverse-engineers your dopamine loops — turning the same reward mechanics that keep you scrolling into fuel for real-world action.

> *"What if the dopamine loops that keep you scrolling could be rewired to make you unstoppable?"*

---

## 🧠 The Problem

Modern platforms are engineered to trap you in passive consumption. Hours vanish into doomscrolling. Goals stay as notes on your phone. The gap between intention and action grows wider every day.

**Break the Block** weaponizes behavioral psychology to break through digital stasis:

- **Dopamine Redirection** — Hijack reward loops for real achievements
- **Micro-Momentum** — Decompose overwhelming goals into 3 tiny steps
- **Streak Psychology** — Loss aversion becomes your greatest motivator  
- **The Stasis Stone** — A collective metaphor for inertia that your community chips away at together

---

## ✨ Features

### 🎯 Hybrid Goals (5 Types)
| Type | How It Works |
|------|-------------|
| **DailyHabit** | Calendar-based check-ins with date range tracking |
| **CountTarget** | Progress ring with +/- buttons (e.g., "Read 12 books") |
| **MultiStep** | Expandable checklist for complex projects |
| **ProofOnly** | Upload image evidence to complete |
| **Journal** | Text entries for reflection and gratitude |

### ⚡ Friction Breaker AI
When you're stuck, our AI generates **3 dopamine-friendly micro-steps** to get you moving. Upload a before photo, complete the steps one-by-one, then upload an after photo as proof.

### 🏆 20-Level Progression System
| Level | Title | XP | Unlock |
|-------|-------|-----|--------|
| 1 | Newbie | 0 | — |
| 3 | Mover | 150 | 💬 Chat |
| 5 | Breaker | 500 | 👥 Join Groups, 🛡️ Streak Shield |
| 7 | Crusher | 1,000 | 🏗️ Create Groups |
| 10 | Warrior | 2,500 | ⚡ Powerups |
| 15 | Legend | 7,500 | 🔥 2x XP Powerup |
| 20 | Block Breaker | 15,000 | 👑 All Unlocks |

### 📊 Structured XP System
Every action earns XP with **daily caps** to reward consistency:

| Action | XP | Daily Cap |
|--------|-----|-----------|
| Daily Login | +10 | 1x/day |
| Friction Breaker | +25 | 3x/day |
| Proof Upload | +15 | 3x/day |
| Goal Step | +10 | 10x/day |
| Goal Complete | +50 | No limit |
| Receive Like | +2 | 10x/day |
| Streak Bonus | ×2 | Cap 30 |
| Journal Entry | +5 | 3x/day |

### ⚡ Powerups
- **Double XP** — 2x multiplier for 1 hour (100 XP, Level 10+)
- **Streak Shield** — Survive 1 missed day (75 XP, Level 5+)

### 🪨 The Stasis Stone
A visual stone that **cracks as your community takes action**:
- **Group Stone** — Your faction's combined effort
- **Region Stone** — Average across all regional groups
- **Global Stone** — The world's collective momentum

Resets monthly. Hit 100% = confetti + badge.

### 👥 Group Factions
- Create or join **one** faction (enforced)
- Auto-assigned to a geographic region
- Shared group chat with image uploads
- Compete on Global, Regional, and Group leaderboards

### 📸 Social Feed
- Upload proof of achievements with Backblaze B2 cloud storage
- Like, comment, and celebrate each other's wins
- Proof-based accountability — no honor system

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Auth** | Supabase Auth (Email/Password) |
| **Database** | Supabase PostgreSQL + RLS |
| **Realtime** | Supabase Realtime (chat, feed) |
| **State** | Zustand (persisted) |
| **Animations** | Framer Motion |
| **File Storage** | Backblaze B2 (S3-compatible) |
| **AI** | OpenAI API (Friction Breaker) |
| **Rate Limiting** | Upstash Redis |
| **Background Jobs** | Inngest |
| **Monitoring** | Sentry |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Backblaze B2](https://www.backblaze.com/b2/cloud-storage.html) bucket

### 1. Clone & Install

```bash
git clone https://github.com/Joeljaison391/BreakTheBlock.git
cd BreakTheBlock
npm install
```

### 2. Environment Variables

Create a `.env` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Backblaze B2
B2_KEY_ID=your_key_id
B2_APPLICATION_KEY=your_app_key
B2_ENDPOINT=https://s3.us-west-004.backblazeb2.com
B2_REGION=us-west-004
B2_BUCKET_NAME=your_bucket_name

# OpenAI
OPENAI_API_KEY=your_openai_key

# Upstash Redis (optional)
REDIS_URL=your_redis_url

# Inngest (optional)
INNGEST_EVENT_KEY=your_event_key
INNGEST_SIGNING_KEY=your_signing_key
```

### 3. Database Setup

Run the SQL migrations in your Supabase SQL Editor in order:

1. `supabase/migrations/00_initial_schema.sql` — Core tables + RLS
2. `supabase/migrations/01_chat_and_region.sql` — Chat, regions, group rules
3. `supabase/migrations/02_gamification.sql` — Points, levels, powerups

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000/landing](http://localhost:3000/landing) to see the landing page.

---

## 📁 Project Structure

```
app/
├── landing/          # Public landing page
├── login/            # Auth (login/signup/actions)
├── actions/          # Server actions (feed, chat, groups, points, b2)
├── api/              # API routes (LLM, Inngest)
└── (app)/            # Protected routes
    ├── page.tsx      # Dashboard
    ├── goals/        # Goal tracker + create + templates
    ├── feed/         # Social proof feed
    ├── chat/         # Group messaging
    ├── leaderboard/  # Rankings + stone
    ├── friction/     # AI friction breaker wizard
    ├── groups/       # Create/join groups
    └── profile/      # User profile + timeline
components/
├── shared/           # Reusable UI (AnimatedStone, ProofCard, etc.)
└── onboarding/       # Tour overlay + developer note
lib/
├── gameConfig.ts     # All game rules (levels, points, powerups)
├── mockData.ts       # TypeScript interfaces + type definitions
├── ratelimit.ts      # Upstash rate limiter
└── utils.ts          # Utility helpers
store/
└── index.ts          # Zustand state management
supabase/
└── migrations/       # SQL schema + RLS policies
utils/
└── supabase/         # SSR client, middleware, browser client
```

---

## 🎮 Game Design Philosophy

Break the Block is built on **4 behavioral psychology principles**:

1. **Dopamine Redirection** — The same variable-ratio reward schedule that makes social media addictive is applied to real-world goal completion
2. **Micro-Momentum** — Based on BJ Fogg's Tiny Habits research — make the first step so small it's impossible to say no
3. **Loss Aversion** — Streak mechanics exploit Kahneman's prospect theory — the pain of breaking a streak outweighs the pleasure of building one
4. **Social Accountability** — Group factions and public proof create commitment devices backed by social pressure

---

## 📜 License

MIT

---

<p align="center">
  <strong>Built with 🔥 for people who refuse to stay stuck.</strong>
</p>
