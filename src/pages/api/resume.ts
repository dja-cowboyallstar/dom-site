import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { DOM_CONTEXT } from '~/lib/dom-context';

export const prerender = false;

const SYSTEM_PROMPT = `You are a professional resume writer. Using Dom's background below, generate a tailored resume in structured markdown.

${DOM_CONTEXT}

Format:
**Dominick Amirr**
New York, New York | hello@dominickamirr.com | linkedin.com/in/dominickamirr

**Summary**
2-3 sentences. If a target role/company is provided, tailor the summary to emphasize relevant experience.

**Experience**
For each role: **Title — Company** (dates)
- 3-4 bullet points with specific metrics and outcomes

**Projects**
For Abacus and Ascent: name, one-line description, key metrics.

**Skills**
Grouped: ERP/Finance, Data/BI, AI/Development

Rules:
- Be specific with numbers and outcomes from the context.
- If a target role or company is provided, emphasize relevant experience and skills.
- If no target is provided, write a general-purpose resume.
- Keep it to one page worth of content (roughly 400 words).
- Use **bold** for section headers and role titles.
- Use bullet points for experience items.`;

export const POST: APIRoute = async ({ request }) => {
  let targetRole: string;
  let targetCompany: string;
  try {
    const body = await request.json();
    targetRole = (body?.targetRole || '').toString().trim();
    targetCompany = (body?.targetCompany || '').toString().trim();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  if (targetRole.length > 200 || targetCompany.length > 200) {
    return new Response('Fields must be under 200 characters.', { status: 400 });
  }

  const apiKey = import.meta.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response('Server is not configured.', { status: 500 });
  }

  let userMessage = 'Generate a resume for Dom.';
  if (targetRole && targetCompany) {
    userMessage = `Generate a resume tailored for the role of ${targetRole} at ${targetCompany}.`;
  } else if (targetRole) {
    userMessage = `Generate a resume tailored for the role of ${targetRole}.`;
  } else if (targetCompany) {
    userMessage = `Generate a resume tailored for a role at ${targetCompany}.`;
  }

  const client = new Anthropic({ apiKey });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const response = await client.messages.create({
          model: 'claude-sonnet-4-6',
          max_tokens: 2048,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userMessage }],
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
