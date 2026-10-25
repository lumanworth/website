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

export const PROMISES: [string, string][] = [
  ["Made up data", "We build and test on made up data, never your real records."],
  ["Guest access", "We work in your accounts as a guest you can remove at any time."],
  ["Deleted at the close", "We delete our copies of your information within 30 days of the last handover."],
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

export const COMPANY =
  "A small software company, privately owned and run by its founder. The person you meet is the person who designs and builds it, from the first email to the handover.";

export const NEXT = [
  "We reply within one business day.",
  "One meeting about your work, not our tools. No charge.",
  "A brief in plain words, with a price range.",
];
