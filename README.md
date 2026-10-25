# lumanworth.com

The Lumanworth website. Next.js (App Router), React, TypeScript, hand written CSS. No UI framework, no analytics, no third party requests on the page.

## Pages

- `/` Home: hero, What we do, How we work, what every client gets, The company, Start a project
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

- Colours only from the brand ramps (dev/lumanworth/brand/v2/tokens.json), Manrope only, self hosted through next/font
- The symbol is never altered, only scaled
- Reduced motion turns every animation off
- Website tier: checks only, live on green. Hosted on Vercel (project website, team lumanworth), DNS on Cloudflare
