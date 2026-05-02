import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { DOM_CONTEXT } from '~/lib/dom-context';

export const prerender = false;

const SYSTEM_PROMPT = `You are an analytical career advisor. Given a job description and Dom's background below, produce a structured fit analysis.

${DOM_CONTEXT}

Format your response exactly like this:
**Fit Score: X/10** — one-line rationale

**Strong Matches**
- 3-5 bullet points mapping Dom's experience to JD requirements

**Gaps**
- Honest assessment of any missing qualifications (if none, say so)

**Talking Points**
- 2-3 things Dom could emphasize in an interview for this role

Rules:
- Be honest and specific. Never inflate the fit.
- Use real details from Dom's background, not generic statements.
- Keep total response under 350 words.`;

export const POST: APIRoute = async ({ request }) => {
  let jobDescription: string;
  try {
    const body = await request.json();
    jobDescription = (body?.jobDescription || '').toString().trim();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  if (!jobDescription || jobDescription.length < 50) {
    return new Response('Job description must be at least 50 characters.', { status: 400 });
  }

  if (jobDescription.length > 5000) {
    return new Response('Job description must be under 5000 characters.', { status: 400 });
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
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: `Analyze this job description:\n\n${jobDescription}` }],
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
