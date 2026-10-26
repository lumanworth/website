# lumanworth.com

The Lumanworth website. Next.js (App Router), React, TypeScript, hand written CSS. No UI framework, no analytics, no third party requests on the page.

## Pages

- `/` Home: the lines hero, What we do, How we work, Yours to keep, questions, Start a project (words in `lib/words.ts`)
- `/what` What we do, with one working example per kind of work
- `/how` How we work, the ten stages under the five steps
- `/security` Security and data, with the two statement PDFs in `public/docs`
- `/company` Company: the facts, how we work in small numbers, what we take on and turn down
- Each inner page has its own stylesheet next to its `page.tsx`; tokens and shared classes live in `app/globals.css`
- `/privacy` and `/terms`
- `/api/contact` receives the form and sends it to the support mailbox

## Run

```
npm install
npm run dev
```

Checks, in the order CI should run them:

```
npm run typecheck
npm run test          # vitest, the contact rules
npm run build
npm run test:e2e      # Playwright against next start on port 3100: pages, accessibility (axe), headers, form, speed, phone menu
```

## Environment

The form sends through an email delivery API. Without these the route answers 503 and the page tells the visitor to email instead.

- `RESEND_API_KEY`
- `CONTACT_FROM` (a verified sender on lumanworth.com)
- `CONTACT_TO` (defaults to support@lumanworth.com)

## Standards

- Colours only from the brand ramps (dev/lumanworth/brand/v2/tokens.json); ink and cream alternate by section, cards are a step of their own band
- Manrope for everything, JetBrains Mono for figures, both self hosted through next/font
- Lines only mark things you click; no images, no pills, no eyebrows over headings
- The symbol is never altered, only scaled
- Reduced motion turns every animation off
- Website tier: checks only, live on green. Hosted on Vercel (project website, team lumanworth), DNS on Cloudflare
