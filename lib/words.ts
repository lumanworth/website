/* The words on the Home page. Facts from lumanworth/docs/process/how-we-work (25 Oct 2026); no prices, no client names, no tool names. */

export type Kind = { h: string; t: string; p: string; before: string; after: string };
export type Step = { h: string; p: string; get: string; you: string };
export type Own = { h: string; p: string; rows: [string, string][] };
export type Faq = { q: string; a: string };

export const KINDS: Kind[] = [
  {
    h: "Business systems",
    t: "The software the whole company runs on.",
    p: "Software for operations with many people and many roles. Approvals, field crews with no signal, and records that stand up in an audit.",
    before: "Job sheets on paper, typed up on a Friday, and nobody sure which one is current.",
    after: "Crews capture work on site, even with no signal. It syncs when they are back in range, and every record shows who did what and when.",
  },
  {
    h: "Workflow and consulting",
    t: "How work moves, and what wastes it.",
    p: "Every job starts here. We spend time with the people doing the work, map how a day really runs, and remove the steps that waste it.",
    before: "A quote lives in three spreadsheets and an inbox, and only one person knows how it fits together.",
    after: "One form feeds the job, the invoice and the monthly report. Sometimes the fix is that small.",
  },
  {
    h: "AI in the workflow",
    t: "Answers from your own records, with the source.",
    p: "AI inside the system, not bolted on. It reads your own documents and records, shows where every answer came from, and a person still makes the call.",
    before: "An hour in a PDF to find one setting, or a call to the one person who remembers.",
    after: "Ask in plain words, get the answer from your own manuals and job history, with the page it came from.",
  },
  {
    h: "Websites and apps",
    t: "The front door, and the tools behind it.",
    p: "Company sites, customer portals and phone apps. Fast, accessible, and simple for your own staff to change.",
    before: "Every change to the website means a phone call and a wait.",
    after: "Your office edits the site itself, and clients see their jobs and pay in the portal behind it.",
  },
];

export const STEPS: Step[] = [
  {
    h: "Brief",
    p: "One meeting about your work, not our tools. We talk to the people who will use it.",
    get: "A brief in plain words, with a price range, never a single number.",
    you: "Whether to go further. Nothing is charged up to here.",
  },
  {
    h: "Design",
    p: "Screens, the data behind them and a test plan, walked through with you at the end.",
    get: "The design, and a fixed price for each build phase. The design is yours once paid.",
    you: "You accept the screens before anything is built.",
  },
  {
    h: "Build",
    p: "Small changes, each tested, on a preview you can use from the first week.",
    get: "A short note every Friday and a demonstration at the end of each phase.",
    you: "Any change is quoted and agreed in writing before we start it.",
  },
  {
    h: "Check",
    p: "You check the release against the done list we agreed at the start.",
    get: "Ten business days to accept, and ten more to retest anything that needs it.",
    you: "Whether it is done. The list decides, not us.",
  },
  {
    h: "Release",
    p: "Live on your approval, on your accounts, with nothing left in our name.",
    get: "The handover pack: accounts, code and runbook. Then our access is removed.",
    you: "When it goes live.",
  },
];

export const OWN: Own[] = [
  {
    h: "In your name",
    p: "Everything the product runs on is opened in your name on day one. We work in it as an admin you can remove, never the owner.",
    rows: [
      ["Code", "In your repository"],
      ["Hosting", "Your account and your bill"],
      ["Database", "Your account"],
      ["Payments", "Money lands in your account"],
      ["Domain", "Registered to you"],
      ["App stores", "Published under your name"],
    ],
  },
  {
    h: "Written down",
    p: "Every release comes with what anyone would need to pick it up cold, your own team or an engineer you choose.",
    rows: [
      ["Runbook", "How it is built, released and run"],
      ["Changelog", "Every change, dated"],
      ["Accounts list", "Each account, its owner, our access, and the day it was removed"],
      ["How it fits together", "A plain map of the parts"],
      ["Open items", "Anything unfinished, written down"],
      ["Friday notes", "A short note every week of the build"],
    ],
  },
  {
    h: "Agreed in writing",
    p: "Each phase has a fixed price, a target date and a done list, signed before work starts. Changes you ask for are quoted before we begin.",
    rows: [
      ["Fixed price", "Set before each phase opens"],
      ["Target date", "Agreed before work starts"],
      ["Done list", "What done means, written first"],
      ["Changes", "Quoted and signed before we start them"],
    ],
  },
  {
    h: "After handover",
    p: "Once the last phase is live, it runs without us. We do not host it and we do not sell support contracts.",
    rows: [
      ["Defects", "Fixed free for 30 days after each release goes live"],
      ["Lock in", "None. Everything is already in your name"],
      ["If you want us", "A prepaid block of our hours for questions and small changes"],
      ["New work", "Scoped and priced as a new phase"],
    ],
  },
];

export const FAQ: Faq[] = [
  {
    q: "What does it cost?",
    a: "After the first meeting you get a price range, never a single number. The design phase has a fixed price, and it ends with a fixed price for each build phase. Nothing is charged before the design phase.",
  },
  {
    q: "How long does it take?",
    a: "Each phase has a target date agreed in writing before it starts. A website is one phase. A system is a design phase and then build phases, each with its own date.",
  },
  {
    q: "Who owns it?",
    a: "You do, once each phase is paid. The accounts are in your name from day one, and our own tools and any open source parts come with a permanent licence to use them.",
  },
  {
    q: "What if you are not around?",
    a: "That is the point of the handover pack. Your team, or any engineer you choose, can carry it on without us. We build it to be run without us.",
  },
  {
    q: "Can you work with what we already have?",
    a: "Usually. Often the answer is a link between systems you already pay for, or a small tool, not a new platform.",
  },
  {
    q: "Do you host it or run it for us?",
    a: "No. It runs on your accounts, and we hand it over. After the 30 day defect window you can buy a block of our hours if you want them.",
  },
];

export const CLIENTS = "Most of our work comes by introduction. We do not publish client names.";

export const NEXT = [
  "We reply within one business day.",
  "One meeting about your work, not our tools. No charge.",
  "A brief in plain words, with a price range.",
];

/* Security and data: two moments. k keys a row so it can glide from one side to the other; f marks never (1) or gone (2). No provider names. */
export type SideRow = { k: string; h: string; d: string; f?: 1 | 2 };
export type Moment = { yours: SideRow[]; ours: SideRow[] };
export const SIDES: Record<"build" | "after", Moment> = {
  build: {
    yours: [
      { k: "code", h: "Code", d: "In your repository" },
      { k: "db", h: "Database and files", d: "Your account" },
      { k: "bk", h: "Backups", d: "Run by your provider" },
      { k: "dom", h: "Domain and app stores", d: "In your name" },
      { k: "acc", h: "Our access", d: "Named people, own logins, multi factor sign in" },
    ],
    ours: [
      { k: "cred", h: "Credentials", d: "An encrypted vault, one folder for you" },
      { k: "mail", h: "Emails and documents", d: "Company mail, never personal accounts" },
      { k: "real", h: "Your real records", d: "Never here", f: 1 },
    ],
  },
  after: {
    yours: [
      { k: "code", h: "Code", d: "In your repository" },
      { k: "db", h: "Database and files", d: "Your account" },
      { k: "bk", h: "Backups", d: "Run by your provider" },
      { k: "dom", h: "Domain and app stores", d: "In your name" },
      { k: "cred", h: "Credentials", d: "Moved into your own vault" },
      { k: "acc", h: "Our access", d: "Removed, and confirmed in writing", f: 2 },
    ],
    ours: [
      { k: "mail", h: "Emails and documents", d: "Deleted within 30 days", f: 2 },
      { k: "real", h: "Your real records", d: "Never here", f: 1 },
      { k: "inv", h: "Invoices", d: "Kept as the law requires" },
    ],
  },
};

export const ANSWERS: [string, string][] = [
  ["What do you build with?", "Code and made up data. Our tools, AI included, never see your real records."],
  ["What if something goes wrong?", "We tell you within 48 hours of becoming aware, and help you respond."],
];


/* How we work: five steps over ten stages. A field is the same for both kinds of job, or { w, s } for a website or a system.
   Facts from docs/process/how-we-work (25 Oct 2026); no prices. */
export type Track = "w" | "s";
export type ByTrack = string | { w: string; s: string };
export type Stage = { h: ByTrack; p: ByTrack; get: ByTrack; rp?: { s: string } };
export const pickTrack = (x: ByTrack | undefined, t: Track) => (x && typeof x === "object" ? x[t] : x);
export const PHASES: [string, number][] = [["Brief", 3], ["Design", 2], ["Build", 1], ["Check", 1], ["Release", 3]];
const REPEAT = { s: "Build and check repeat for each build phase." };
export const STAGES: Stage[] = [
  { h: "Introduction", p: "You tell us what you need, and we tell you straight if we are the right fit.", get: "A clear answer, and a start date if we are full." },
  { h: "First session", p: "One meeting about your work, not our tools. No charge.", get: "A brief in plain words, with a price range." },
  { h: "Proposal", p: "What we will build, in what order, and when.", get: { w: "A fixed price for the site.", s: "A fixed price for the design, and a range for the build." } },
  { h: "Sign", p: "Short terms in plain words. Your accounts are opened in your name from the first week.", get: "Every account in your name." },
  { h: "Design", p: { w: "The pages drawn and agreed with you before anything is built.", s: "The screens and the data behind them, drawn and agreed before anything is built." }, get: { w: "Pages ready to build.", s: "The design, and a fixed price for each build phase." } },
  { h: { w: "Build", s: "Build phase" }, p: "Built on a preview you can use from the first week.", get: { w: "A short note every Friday.", s: "A short note every Friday, and a demonstration at the end of the phase." }, rp: REPEAT },
  { h: "Acceptance", p: "You check it against the done list we agreed at the start.", get: "The final say on whether it is done.", rp: REPEAT },
  { h: "Handover", p: "Live on your approval, on your accounts. Then our access is removed.", get: "The handover pack: accounts, code and runbook." },
  { h: "After", p: "Defects fixed free for 30 days after go live. We do not host it or sell support.", get: "Our time, only if you want it." },
  { h: "Close", p: "We delete our copies of your information within 30 days.", get: "Nothing of yours left with us." },
];

/* What we do: the four demos. Sample names only. Every figure must add up; tests/words.test.ts checks it. */
export type Event = { a: string; e: string; who: string; t: string; off?: true };
export const EVENTS: Event[] = [
  { a: "Booked on the website", e: "job.created", who: "Customer", t: "9:12 am" },
  { a: "Priced by your rules", e: "price.applied", who: "System", t: "9:12 am" },
  { a: "Approved", e: "job.approved", who: "Mia, office", t: "9:20 am" },
  { a: "Assigned to a technician", e: "job.assigned", who: "Mia, office", t: "9:21 am" },
  { a: "Customer told by text", e: "notify.sent", who: "System", t: "9:21 am" },
  { a: "Completed on site", e: "job.completed", who: "Tom, technician", t: "2:05 pm", off: true },
  { a: "Access note changed by the office", e: "job.updated", who: "Mia, office", t: "2:30 pm" },
  { a: "Synced, one conflict settled by rule", e: "sync.applied", who: "System", t: "3:40 pm" },
  { a: "Invoice sent from the job", e: "invoice.sent", who: "System", t: "3:40 pm" },
  { a: "Paid by card link", e: "invoice.paid", who: "Customer", t: "3:52 pm" },
];

/* A day in the office, mapped, then redesigned. A step with no "after" is taken out. Minutes are office time on each job. */
export type MapStep = { before: string; mins: number; after?: { h: string; mins: number } };
export const MAP_STEPS: MapStep[] = [
  { before: "Customer rings the office", mins: 4, after: { h: "Customer books online, or the office takes the call", mins: 2 } },
  { before: "Details written on the whiteboard", mins: 2 },
  { before: "Typed into the job spreadsheet", mins: 3 },
  { before: "Texted to the technician", mins: 2, after: { h: "Job and address appear on the technician's phone", mins: 0 } },
  { before: "Technician rings back for the address", mins: 3 },
  { before: "Paper job sheet typed up on Friday", mins: 6 },
  { before: "Invoice built from the job sheet", mins: 8, after: { h: "Job sheet becomes the invoice, office checks it", mins: 2 } },
  { before: "Payment chased by phone", mins: 5, after: { h: "Customer pays by card link", mins: 1 } },
];

/* Answers from the operator manual and the job history. The third has no source, so it is withheld. */
export type Ask = { q: string; a: string; src: string; trace: string[] };
export const ASKS: Ask[] = [
  { q: "What oil does the loader engine take?", a: "SAE 15W-40. About 38 litres with a new filter.", src: "Source: operator manual, page 112, refill capacities", trace: ["operator manual, 286 pages, searched", "3 passages matched", "citation check passed"] },
  { q: "When was the loader last serviced?", a: "12 October. The 500 hour service, by Sam Ortiz.", src: "Source: job 1182", trace: ["412 job records searched", "1 record matched", "citation check passed"] },
  { q: "What torque for the bucket pin bolts?", a: "Not in the operator manual or your job history. Check the service manual, or ask the dealer.", src: "No source, so no answer", trace: ["operator manual and 412 jobs searched", "0 passages matched", "answer withheld"] },
];

/* The sample page on a slow network. Server rendered words (18 KB) land first, the photo (120 KB) after; CSS, font and script
   make up the other 22 KB of the 160 KB.
   Slow 4G as Lighthouse throttles it, 150 ms round trip at 1.6 Mbps; 3G at 400 ms and 400 kbps. */
export const NETWORKS = { "4g": { name: "Slow 4G", words: 0.9, done: 1.5 }, "3g": { name: "3G", words: 2.4, done: 4.8 } } as const;
export const PAGE_KB = 160;

/* Company: what we take on and what we turn down, from the price sheet, in plain words. */
export type ScopeItem = [string, string];
export const SCOPE: Record<"on" | "off", { h: string; label: string; items: ScopeItem[] }> = {
  on: {
    h: "What we take on.",
    label: "We take on",
    items: [
      ["Web apps and admin consoles", "The system the office runs on"],
      ["Phone apps", "Published through the stores, under your name"],
      ["Customer and partner portals", "Bookings, documents and accounts in one place"],
      ["Booking, dispatch and payments", "From the first booking to the paid invoice"],
      ["Links to systems you already use", "Accounting, sign in and the rest"],
      ["AI on your own records", "Answers with the source, or no answer"],
      ["Offline work and sync", "For crews out of signal"],
      ["Company websites", "Fast, accessible, and yours"],
    ],
  },
  off: {
    h: "What we turn down.",
    label: "We turn down",
    items: [
      ["Hardware and firmware", "Devices are their own trade"],
      ["Games", "A craft of its own"],
      ["Crypto and blockchain", "Not work we stand behind"],
      ["Banking, lending and insurance cores", "Licensed work, for licensed builders"],
      ["Medical device software", "Regulated as a device, so not us"],
      ["Large ERP rollouts", "A different kind of firm"],
      ["Fixed prices on code we have not read", "A paid review comes first"],
      ["Running your product after handover", "It is yours to run, on your accounts"],
    ],
  },
};
