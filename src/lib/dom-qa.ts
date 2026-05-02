export interface QAPair {
  keywords: string[];
  question: string;
  answer: string;
  category: string;
}

export const QA_PAIRS: QAPair[] = [
  // ─── Background & Career ─────────────────────────────
  {
    category: 'background',
    keywords: ['who', 'about', 'background', 'tell me', 'introduce', 'yourself'],
    question: 'Who is Dom?',
    answer: 'I\'m Dom. Functional and technical consultant turned AI builder with 10+ years leading business transformations. I\'m currently the founding hire for AI implementations at DualEntry, and I build products on the side — Abacus and Ascent. I live in New York with my wife and son.',
  },
  {
    category: 'background',
    keywords: ['career', 'path', 'journey', 'how did you', 'start', 'history'],
    question: 'What\'s your career path?',
    answer: 'I started at Bryant Park Consulting, a top Oracle implementation partner. Started as Principal Consultant, promoted to Engagement Manager in three months, and left in a leadership role when the company was 160+ employees. I left to go all-in on AI. Now I\'m the founding hire at DualEntry and building my own products.',
  },
  {
    category: 'background',
    keywords: ['experience', 'years', 'how long', 'tenure'],
    question: 'How much experience do you have?',
    answer: '10+ years in enterprise finance systems and business transformations. Most of that was NetSuite and Oracle. The last couple years have been focused entirely on AI implementations and building AI products.',
  },
  {
    category: 'background',
    keywords: ['location', 'where', 'based', 'live', 'city', 'new york'],
    question: 'Where are you based?',
    answer: 'New York, New York.',
  },

  // ─── Current Role (DualEntry) ────────────────────────
  {
    category: 'work',
    keywords: ['dualentry', 'current', 'role', 'job', 'work', 'doing now', 'currently'],
    question: 'What do you do at DualEntry?',
    answer: 'I\'m the founding hire for AI implementations. I implemented the first 20 customers and developed our delivery methodology centered around AI and efficiency. From there I grew the team to 10+ and scaled the customer base to 100+. The company raised a $90M Series A.',
  },
  {
    category: 'work',
    keywords: ['founding', 'early', 'startup', 'pre-seed', 'first'],
    question: 'What does founding hire mean?',
    answer: 'I was the first implementation hire at DualEntry, before product-market fit or a Series A. I developed the delivery methodology from scratch, implemented the first 20 customers directly, and shaped the product based on what I learned in the field. That\'s the part of startups I love — building the plane while flying it.',
  },
  {
    category: 'work',
    keywords: ['series a', 'funding', 'raised', '90', 'million', 'fundraise'],
    question: 'Tell me about DualEntry\'s fundraise.',
    answer: 'DualEntry raised a $90M Series A. I was part of the team that got the company from pre-seed to that milestone — onboarding the first 20 customers, scaling to 100+, and growing the team to 10+.',
  },

  // ─── Projects ────────────────────────────────────────
  {
    category: 'projects',
    keywords: ['abacus', 'netsuite', 'reporting', 'agent'],
    question: 'What is Abacus?',
    answer: 'Abacus is a reporting agent for NetSuite that I built. It answers controller-grade questions — accrued purchases, unbilled receivables, intercompany eliminations — and shows its work with a full audit trail. It\'s built on Oracle\'s AI Connector Service with 21 skills that encode years of audit-grade reporting practice.',
  },
  {
    category: 'projects',
    keywords: ['ascent', 'jobs', 'career', 'platform', 'job discovery'],
    question: 'What is Ascent?',
    answer: 'Ascent is a job discovery platform for engineers and operators looking at AI and frontier-tech companies. It indexes 228+ companies, classifies every posting by function and seniority, identifies the hiring team, and generates personalized learning paths and resume improvements for saved jobs. It\'s live at career-ascent.io.',
  },
  {
    category: 'projects',
    keywords: ['build', 'built', 'products', 'ship', 'shipped', 'side project', 'built with ai', 'what has dom built'],
    question: 'What has Dom built with AI?',
    answer: 'Three things: Abacus — a reporting agent that answers controller-grade questions against NetSuite with full audit trails. Ascent — a job discovery platform that indexes 228+ companies and generates AI learning paths. And at DualEntry, I lead AI implementations for enterprise accounting teams. I also built this site, including the chat you\'re using right now.',
  },
  {
    category: 'projects',
    keywords: ['examples', 'example', 'show me', 'like what', 'such as', 'specifics', 'proof'],
    question: 'What are some examples?',
    answer: 'At DualEntry: onboarded the first 20 customers from zero, built the implementation playbook, scaled to 100+ customers. With Abacus: 21 reporting skills that generate audit-ready SuiteQL queries against live NetSuite data. With Ascent: indexes ATS feeds from 228+ companies and matches candidates by function and seniority. At Bryant Park: promoted from Principal Consultant to Engagement Manager in three months.',
  },
  {
    category: 'work',
    keywords: ['startup', 'startup experience', 'early stage', 'pre-seed', 'series a', 'venture'],
    question: 'Tell me about his startup experience.',
    answer: 'I joined DualEntry at the pre-seed as the founding hire for AI implementations. No playbook, no customers, no team. I developed the delivery methodology, implemented the first 20 customers, grew the team to 10+, scaled to 100+ customers, and helped the company raise a $90M Series A. Before that I was an early hire at Bryant Park Consulting and watched it grow to 160+ employees. I know what it takes to build from nothing.',
  },
  {
    category: 'projects',
    keywords: ['bryant park', 'oracle', 'consulting', 'implementation partner'],
    question: 'What was Bryant Park Consulting?',
    answer: 'A top Oracle implementation partner where I was an early hire. I started as Principal Consultant, got promoted to Engagement Manager within three months, and left in a leadership role when the company had 160+ employees. I left to go work with AI full-time.',
  },

  // ─── Skills & Tech ──────────────────────────────────
  {
    category: 'skills',
    keywords: ['skills', 'tech', 'stack', 'technology', 'tools', 'languages'],
    question: 'What\'s your tech stack?',
    answer: 'NetSuite, Oracle ADW, Celigo, SuiteQL on the finance side. Claude API, TypeScript, Astro, Vercel on the AI/dev side. Power BI and Hex for reporting. I\'m comfortable across the full stack — I build the integrations, the agents, and the front-end.',
  },
  {
    category: 'skills',
    keywords: ['netsuite', 'erp', 'oracle', 'suiteql'],
    question: 'How deep is your NetSuite experience?',
    answer: 'Deep. 10+ years of implementation, reporting, and custom development. I\'ve done intercompany accounting redesigns across 30-entity portfolios, chart-of-accounts consolidations, and built SuiteQL-based reporting agents. I know the platform at the schema level.',
  },
  {
    category: 'skills',
    keywords: ['ai', 'artificial intelligence', 'machine learning', 'llm', 'claude', 'gpt'],
    question: 'What\'s your AI experience?',
    answer: 'I build with AI daily. At DualEntry I lead AI implementations for enterprise customers. I\'ve built Abacus (a reporting agent using Claude and Oracle\'s AI Connector) and Ascent (AI-powered job discovery with learning paths). I\'ve processed 8M+ tokens across projects. I\'m not a researcher — I\'m a builder who ships AI into production.',
  },
  {
    category: 'skills',
    keywords: ['coding', 'programming', 'developer', 'engineer', 'software'],
    question: 'Do you code?',
    answer: 'Yes. TypeScript is my primary language. I build full-stack products — this site is Astro + Vercel with streaming Claude API endpoints. Abacus and Ascent are both products I designed and built end-to-end. I\'m not a CS grad — I\'m a consultant who learned to code because building is the fastest way to solve problems.',
  },

  // ─── Work Style & Personality ────────────────────────
  {
    category: 'style',
    keywords: ['work style', 'how do you work', 'approach', 'management', 'leadership'],
    question: 'How do you work?',
    answer: 'Extreme ownership. I listen intently, I\'m empathetic, and I can be depended on. I lead by example and stay in the trenches — I don\'t manage from a spreadsheet. I\'m in the implementation with the team, solving problems alongside them. If something\'s broken, I fix it before I escalate it.',
  },
  {
    category: 'style',
    keywords: ['strengths', 'good at', 'best', 'superpower'],
    question: 'What are your strengths?',
    answer: 'I listen intently, I work very hard, and I can be depended on. I operate with extreme ownership — if it\'s my problem, I own it until it\'s solved. I learn fast and I make complex things simple. The common thread across NetSuite, Oracle, and AI is that I don\'t just learn tools — I learn how to deliver outcomes with them.',
  },
  {
    category: 'style',
    keywords: ['team', 'culture', 'collaborate', 'teammates', 'people'],
    question: 'How do you work with teams?',
    answer: 'I listen first. Empathy and rigor, in that order. I care about the people I work with and I hold a high bar for the work. At DualEntry I grew the team from zero to 10+. At Bryant Park I got promoted to managing engagements in three months. People trust me because I do the work alongside them, not above them.',
  },
  {
    category: 'style',
    keywords: ['learn', 'learning', 'growth', 'curious'],
    question: 'How do you learn new things?',
    answer: 'By building. I don\'t take courses — I pick a problem and ship something. That\'s how I learned AI (built Abacus and Ascent), how I learned TypeScript (built this site), and how I learned NetSuite (did implementations). The fastest feedback loop is a live product.',
  },
  {
    category: 'style',
    keywords: ['why ai', 'why leave', 'motivation', 'passion', 'obsessed'],
    question: 'Why AI?',
    answer: 'I\'m obsessed with the impact AI can have today, not someday. I left a leadership role at a 160-person company because I saw AI changing everything about how finance systems work. The opportunity to build at the frontier is worth more than the safety of a senior title.',
  },

  // ─── Personal ────────────────────────────────────────
  {
    category: 'personal',
    keywords: ['hobbies', 'fun', 'free time', 'outside work', 'interests', 'personal'],
    question: 'What do you do outside of work?',
    answer: 'Building with AI (it\'s a hobby and a job), taking care of plants, spending time with my wife and son, and trying new restaurants. My family is everything to me.',
  },
  {
    category: 'personal',
    keywords: ['family', 'wife', 'son', 'kids', 'married'],
    question: 'Tell me about your family.',
    answer: 'My wife, my son, and tacos — they\'re everything to me. That\'s the honest answer. Everything I build is ultimately for them.',
  },
  {
    category: 'personal',
    keywords: ['values', 'believe', 'principles', 'philosophy'],
    question: 'What do you value most?',
    answer: 'Family first, always. Professionally: empathy, rigor, and shipping. I believe you earn trust by doing the work, not by talking about it. And I believe AI should make people\'s work lives better, not replace them.',
  },
  {
    category: 'personal',
    keywords: ['food', 'tacos', 'restaurants', 'eat'],
    question: 'Favorite food?',
    answer: 'Tacos. Not even close.',
  },

  // ─── Hiring & Contact ───────────────────────────────
  {
    category: 'contact',
    keywords: ['hire', 'hiring', 'available', 'open to', 'looking', 'opportunities'],
    question: 'Are you open to opportunities?',
    answer: 'I\'m currently the founding hire at DualEntry, so I\'m heads down there. But I\'m always open to conversations about interesting problems, especially at the intersection of AI and enterprise. Reach out at dominickjamirr@gmail.com.',
  },
  {
    category: 'contact',
    keywords: ['contact', 'reach', 'email', 'connect', 'touch'],
    question: 'How can I reach you?',
    answer: 'Email: dominickjamirr@gmail.com. LinkedIn: linkedin.com/in/dom-amirr. GitHub: github.com/dja-cowboyallstar. Email is the fastest way to get a response.',
  },
  {
    category: 'contact',
    keywords: ['resume', 'cv', 'download'],
    question: 'Can I see your resume?',
    answer: 'Everything on this site is my resume — it\'s more current than any PDF. If you need a formal document, reach out at dominickjamirr@gmail.com and I\'ll send one over.',
  },
  {
    category: 'contact',
    keywords: ['consulting', 'freelance', 'contract', 'advisory'],
    question: 'Do you do consulting?',
    answer: 'I ran Currents Consulting for years doing NetSuite implementation and reporting work. Right now I\'m focused on DualEntry full-time, but I\'m open to advisory conversations. Email me at dominickjamirr@gmail.com.',
  },

  // ─── Meta / Site ─────────────────────────────────────
  {
    category: 'meta',
    keywords: ['site', 'website', 'portfolio', 'built with', 'how was this'],
    question: 'How was this site built?',
    answer: 'Astro with server-side rendering, deployed on Vercel. TypeScript throughout. The chat you\'re using right now runs on pre-curated responses for accuracy — no hallucination, no API latency. The Ask Abacus demo uses Claude\'s streaming API. Fonts are Instrument Serif and Inter.',
  },
  {
    category: 'meta',
    keywords: ['chat', 'bot', 'this', 'talking to', 'are you ai'],
    question: 'Am I talking to AI?',
    answer: 'You\'re reading curated responses that Dom wrote and reviewed — not a live AI model. This is intentional. The answers are accurate because they were written by a human, not generated on the fly. If you want to see live AI, try the Ask Abacus demo above.',
  },
];

export function findBestMatch(input: string): QAPair | null {
  const normalized = input.toLowerCase().replace(/[?!.,]/g, '').trim();
  const words = normalized.split(/\s+/);

  let bestMatch: QAPair | null = null;
  let bestScore = 0;

  for (const pair of QA_PAIRS) {
    let score = 0;
    for (const keyword of pair.keywords) {
      if (normalized.includes(keyword)) {
        // Longer keyword matches are worth more
        score += keyword.split(/\s+/).length;
      }
    }
    // Bonus for exact word matches
    for (const word of words) {
      if (pair.keywords.includes(word)) {
        score += 0.5;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = pair;
    }
  }

  // Require a minimum match quality
  return bestScore >= 1.5 ? bestMatch : null;
}

export const SUGGESTED_QUESTIONS = [
  'What has Dom built with AI?',
  'What are some examples?',
  'Tell me about his startup experience',
  'How does Dom work?',
  'Why AI?',
];

export const FALLBACK_RESPONSE = `I don't have a specific answer for that one. Here are some things I can tell you about:

• **My background** — career path, experience, skills
• **My work** — DualEntry, Abacus, Ascent
• **How I work** — leadership style, strengths, learning approach
• **Personal** — hobbies, family, values
• **Contact** — how to reach me, availability`;
