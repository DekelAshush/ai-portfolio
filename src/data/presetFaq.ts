/**
 * Curated FAQ for embedding match + verbatim answers. Safe to import on the
 * client for labels; answers are not secret (same as site copy).
 *
 * Order matters for `SUGGESTED_FAQ_QUESTIONS` (chips in the chat empty state).
 */
export interface PresetFaqItem {
  id: string;
  /** Primary question text (shown in suggested chips) */
  question: string;
  /** Returned verbatim when the match score is above the server threshold */
  answer: string;
  /** Extra phrases to improve recall in embedding space */
  aliases?: string[];
  /** If false, not shown as a quick chip in the empty state (defaults true) */
  showAsSuggestion?: boolean;
}

export const PRESET_FAQ: PresetFaqItem[] = [
  {
    id: "how-to-hire",
    question: "How can I get in touch about working together?",
    answer:
      "The best way to reach Dekel is by email at dekelasis@gmail.com or by sending a LinkedIn message at https://www.linkedin.com/in/dekel-ashush/. A short note with who you are, what you are looking for, and how you would like to connect works well. This assistant cannot schedule meetings or read inboxes for you, but those are the channels Dekel checks for professional outreach.",
    aliases: [
      "contact you",
      "contact Dekel",
      "how can I contact Dekel",
      "get in touch with Dekel",
      "Dekel email",
      "hire you",
      "collaboration",
      "email",
      "linkedin",
      "reach out",
    ],
  },
  {
    id: "what-is-playstre",
    question: "What is PlayStre?",
    answer:
      "PlayStre is a startup building an AI-powered game creation platform: you describe the game you want in natural language, and the product helps turn that into something playable—generated game logic in a safe sandbox, visuals and assets, and the full frontend–backend flow. The idea took shape during Dekel’s **AI Engineer internship** with **Product Manager Accelerator (PMA)**. He continues building PlayStre on the side in his spare time while actively seeking full-time opportunities in full-stack or AI engineering. You can connect with him through the contact options in this portfolio.",
    aliases: [
      "PlayStre",
      "Play Stre",
      "playstre startup",
      "what is play stre",
      "PlayStre company",
      "PMA internship",
      "Product Manager Accelerator",
      "PM Accelerator game startup",
      "AI game from prompt",
      "startup that makes games from prompts",
    ],
  },
  {
    id: "coding-and-fullstack-experience",
    question:
      "What’s your experience with coding and full-stack development?",
    answer:
      "Dekel has been writing code since high school, starting with hobby projects and self-driven learning. During his B.Sc. in Computer Science, which he completed in August 2025, he worked on coursework and projects in Python and C alongside the broader CS curriculum.\n\nHis main focus on modern full-stack development—React and Next.js frontends, APIs, backend systems, deployments, and AI integrations—grew through his internship experience, including his work on PlayStre, as well as the projects featured in this portfolio. In other words, he brings years of general programming experience, with more concentrated full-stack product-building experience developed through internships and hands-on project work.",
    aliases: [
      "coding experience",
      "programming experience",
      "how long have you coded",
      "years of coding",
      "full stack experience",
      "fullstack experience",
      "backend frontend experience",
      "web development experience",
      "software experience",
      "technical background",
    ],
  },
  {
    id: "slow-websites",
    question: "Why are some websites slow?",
    answer:
      "Websites can feel slow for many real-world reasons, not because they are \"bad\" in isolation. Free or hobby tiers of hosting often cold-start: the server or container wakes up on first request after idle time, which adds a few seconds. Heavy images or video, large JavaScript bundles, and missing caching also add time. Databases and APIs on shared infrastructure can be slower at peak, and every extra network round-trip adds latency. Demos in a portfolio are often optimized for a single use path, while production products serve many users and do more work per request—so a fair comparison is between similar traffic and feature sets.",
    aliases: [
      "site is slow",
      "loading time",
      "performance",
      "why is it laggy",
    ],
  },
  {
    id: "demo-vs-live",
    question: "Why don't all project websites work like the demo video?",
    answer:
      "Portfolio demos are a snapshot from when things were working. Live sites often sit on free or budget hosting: after idle time a server may cold-start or need a redeploy to come back, so the first visit can fail or feel broken until it wakes up. Projects also rely on APIs and AI that cost money per request or token—when quotas, budgets, or keys run out or get rotated, features drop until someone updates billing or config. The recording won’t always match what’s public today; that’s usually restart, deploy, or API cost—not a fake demo.",
    aliases: [
      "why doesn't the site work",
      "demo not working",
      "broken link",
      "different from video",
      "api cost",
      "api limits",
      "running out of api",
      "demo video vs live",
      "sites not like demo",
      "Why do not all project websites work like the demo video?",
    ],
  },
];

export const SUGGESTED_FAQ_QUESTIONS: string[] = PRESET_FAQ.filter(
  (f) => f.showAsSuggestion !== false,
).map((f) => f.question);
