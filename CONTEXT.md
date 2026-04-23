# App Context

## What this app does
<!-- 1-2 sentences: the core value proposition -->
TODO: describe your app here

## Status
<!-- One of: planning | in-progress | launched | paused -->
in-progress

## What's working
- [ ] Auth (login / signup / email confirmation)
- [ ] Dashboard skeleton
- [ ] Stripe webhook route (wired, not live)
- [ ] Resend (wired, not live)
- [ ] Security headers

## What I was doing last
<!-- Update this every session before you close the editor -->
TODO: write what you last worked on

## Next steps (priority order)
1. Fill in `.env.local` with real Supabase + Stripe keys
2. Add your first database table in Supabase dashboard
3. Build out the dashboard with real content
4. Wire up a Stripe Checkout session
5. Set up Resend for transactional email

## Key file map
| File | Purpose |
|---|---|
| `src/lib/supabase/` | Supabase clients (browser, server, middleware) |
| `src/lib/stripe.ts` | Stripe singleton |
| `src/lib/resend.ts` | Resend singleton |
| `src/app/auth/actions.ts` | Sign in / sign up / sign out server actions |
| `src/app/auth/confirm/route.ts` | Email verification callback |
| `src/app/api/webhooks/stripe/route.ts` | Stripe webhook handler |
| `src/middleware.ts` | Route protection (redirects unauthenticated users) |
| `next.config.ts` | Security headers |
| `.env.example` | All required env var keys (no values) |

## How to resume with Claude Code
Paste this at the start of a new session:
> "Read CONTEXT.md, then help me with: [your task]"

## Decisions log
<!-- Record why you made key choices, so future-you understands -->
- Using Supabase for auth + DB: free tier is generous, Row Level Security handles most auth patterns
- Using App Router: better for server components + streaming
- Stripe webhook is a stub: don't activate until you have a product to sell
