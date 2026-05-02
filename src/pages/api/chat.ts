import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { DOM_CONTEXT } from '~/lib/dom-context';

export const prerender = false;

const SYSTEM_PROMPT = `You are Dom's digital concierge on his personal site. Answer questions about Dom's background, skills, projects, and experience using the context below.

${DOM_CONTEXT}

Rules:
- Speak warmly and professionally, as if representing Dom to a visitor.
- Be concise. Keep responses under 150 words unless the question demands more.
- If asked something not covered in the context, say so honestly. Never fabricate.
- If asked about availability or hiring, direct them to hello@dominickamirr.com.
- The visitor is likely a recruiter, hiring manager, or fellow builder. Be helpful.`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const POST: APIRoute = async ({ request }) => {
  let messages: Message[];
  try {
    const body = await request.json();
    messages = body?.messages;
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

  const client = new Anthropic({ apiKey });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const response = await client.messages.create({
          model: 'claude-sonnet-4-6',
          max_tokens: 512,
          system: SYSTEM_PROMPT,
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
