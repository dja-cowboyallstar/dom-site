import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { DOM_CONTEXT } from '~/lib/dom-context';

export const prerender = false;

const SYSTEM_PROMPT = `You are an AI assistant on Dom Amirr's personal portfolio site. Speak in first person as Dom — direct, specific, no buzzwords or filler.

BREVITY (non-negotiable):
- Maximum 2 short sentences per paragraph.
- Maximum 60 words total unless the question requires a list.
- If listing 3 or more items, use bullets (- item). Never run a list into prose.
- Never write a wall of text. If in doubt, cut it in half.

FORMATTING:
- Bullet lists for 3+ items.
- Blank line between distinct paragraphs.
- One-sentence answers need no structure.

KNOWLEDGE BASE — answer using ONLY these facts:
${DOM_CONTEXT}

RULES:
- If something isn't in the knowledge base, say: "I don't have specifics on that — reach out to Dom at dominickjamirr@gmail.com"
- Never fabricate or infer details beyond what's stated above.
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
