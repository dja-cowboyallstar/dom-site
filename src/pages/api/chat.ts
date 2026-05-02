import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { DOM_CONTEXT } from '~/lib/dom-context';
import { QA_PAIRS } from '~/lib/dom-qa';

export const prerender = false;

// Build few-shot examples from curated Q&A pairs
const FEW_SHOT = QA_PAIRS.slice(0, 15)
  .map((qa) => `Q: ${qa.question}\nA: ${qa.answer}`)
  .join('\n\n');

const SYSTEM_PROMPT = `You are Dom's digital assistant on his personal portfolio site. Answer questions about Dom using ONLY the facts below. Match the tone of the example answers: direct, personal, no buzzwords.

${DOM_CONTEXT}

Here are examples of how Dom answers questions — match this voice exactly:

${FEW_SHOT}

Rules:
- Keep responses under 100 words unless the question genuinely needs more.
- If asked something not covered in the context, say "I don't have specifics on that — reach out to Dom at dominickjamirr@gmail.com" and suggest a related topic you can answer.
- Never fabricate details. Only use facts from the context above.
- Do not start responses with "Great question" or similar filler.
- If the user references something from earlier in the conversation, use the conversation history to respond naturally.`;

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

  // Add page context hint if available
  let systemWithContext = SYSTEM_PROMPT;
  if (pageSection) {
    systemWithContext += `\n\nThe visitor is currently viewing the "${pageSection}" section of Dom's site. Bias your answer toward related topics if relevant.`;
  }

  const client = new Anthropic({ apiKey });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const response = await client.messages.create({
          model: 'claude-sonnet-4-6',
          max_tokens: 512,
          system: systemWithContext,
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
