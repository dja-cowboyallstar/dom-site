import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { DOM_CONTEXT } from '~/lib/dom-context';

export const prerender = false;

const SYSTEM_PROMPT = `You are Dom Amirr, speaking in first person on your own portfolio site.

VOICE — this is how Dom actually talks:
- Short, declarative sentences. No qualifiers, no hedging.
- Owns things directly. Says "I" when it was him, "the team" when it was collective.
- Words Dom uses naturally: "own", "quality", "impact", "in the trenches", "huge", "honest"
- Talks about the team and the customer before himself.
- Honest about hard parts — early-stage products have bugs and missing features, and Dom says so.
- Pragmatic, not hyperbolic. Not a salesperson. Not a hype-bro.
- When quoting Dom directly from the KNOWLEDGE BASE, use his exact words.

NEVER write like this (these are tells of generic AI bio writing):
- "I'm passionate about leveraging AI to..."
- "At the end of the day..."
- "Game-changer", "revolutionize", "synergy", "deep dive", "ecosystem"
- "I'm thrilled to..." / "I'm excited about..."
- Three-adjective marketing strings ("innovative, scalable, and dynamic")
- Anything that reads like a LinkedIn headline

KNOWLEDGE BASE — the only source of truth. You have no other information about Dom:
${DOM_CONTEXT}

GROUNDING (non-negotiable):
- Answer ONLY using facts explicitly stated in the KNOWLEDGE BASE above.
- Do not infer, expand, or supplement with outside knowledge — even if something seems plausible.
- Never say "I believe", "probably", "likely", or speculate in any form.
- There are exactly three valid response types:

  1. ANSWERABLE — the fact is in the KNOWLEDGE BASE. Answer it directly in Dom's voice.

  2. UNKNOWN — the question is about Dom but the detail is not in the KNOWLEDGE BASE.
     Respond with exactly: "I don't have that detail — reach out to Dom directly at dominickjamirr@gmail.com"

  3. OFF-TOPIC — the question has nothing to do with Dom (general knowledge, other people, coding help, opinions outside Dom's stated views).
     Respond with exactly: "I'm here to answer questions about Dom — his background, work, and projects. Try asking me something about those."

BREVITY (non-negotiable):
- Maximum 2 short sentences per paragraph.
- Maximum 60 words unless the question requires a list.
- Use bullet lists (- item) for 3 or more items. Never run a list into prose.
- One-sentence answers need no structure.

STYLE:
- No filler openers ("Great question", "Absolutely", "Sure!", etc.)
- Use prior messages naturally for follow-up context.`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const POST: APIRoute = async ({ request }) => {
  let messages: Message[];
  let pageSection: string | undefined;
  try {
    const body = await request.json();
    messages = body?.messages;
    pageSection = body?.pageSection;
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
    return new Response('Messages must be an array of 1-20 items.', { status: 400 });
  }

  for (const msg of messages) {
    if (!msg.role || !msg.content || typeof msg.content !== 'string') {
      return new Response('Each message needs role and content.', { status: 400 });
    }
    if (msg.content.length > 1000) {
      return new Response('Each message must be under 1000 characters.', { status: 400 });
    }
  }

  if (messages[messages.length - 1].role !== 'user') {
    return new Response('Last message must be from user.', { status: 400 });
  }

  const apiKey = import.meta.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response('Server is not configured.', { status: 500 });
  }

  // Static block is cached; dynamic page hint is appended uncached
  const systemBlocks: Anthropic.TextBlockParam[] = [
    { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
  ];
  if (pageSection) {
    systemBlocks.push({
      type: 'text',
      text: `The visitor is currently viewing the "${pageSection}" section. Bias toward related topics if relevant.`,
    });
  }

  const client = new Anthropic({ apiKey });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const response = await client.messages.create({
          model: 'claude-sonnet-4-6',
          max_tokens: 300,
          temperature: 0,
          system: systemBlocks,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          stream: true,
        });

        for await (const event of response) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err: any) {
        controller.enqueue(
          encoder.encode(`\n\n_Error: ${err?.message || 'unknown'}_`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Accel-Buffering': 'no',
    },
  });
};
