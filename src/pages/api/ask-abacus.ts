import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';

export const prerender = false;

const SYSTEM_PROMPT = `You are Abacus, a reporting agent for Oracle NetSuite. You translate controller-grade questions into SuiteQL queries.

For every question, output ONLY a SuiteQL query in a code block (\`\`\`sql ... \`\`\`). Nothing else. No restatement, no explanation, no caveats.

Use canonical NetSuite tables: \`transaction\`, \`transactionline\`, \`transactionaccountingline\`, \`account\`, \`customer\`, \`vendor\`, \`subsidiary\`, \`department\`, \`classification\`, \`location\`, \`item\`, \`employee\`, \`accountingperiod\`, \`projecttask\`. Use SuiteQL flavor (Oracle SQL subset). Use \`BUILTIN.DF()\` for display values. Keep queries under ~25 lines.`;

export const POST: APIRoute = async ({ request }) => {
  let question: string;
  try {
    const body = await request.json();
    question = (body?.question || '').toString().trim();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  if (!question || question.length > 500) {
    return new Response('Question must be 1–500 characters.', { status: 400 });
  }

  const apiKey = import.meta.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response('Server is not configured.', { status: 500 });
  }

  const client = new Anthropic({ apiKey });

  // Stream the response back to the client as it generates
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const response = await client.messages.create({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: question }],
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
          encoder.encode(`\n\n_Model error: ${err?.message || 'unknown'}_`)
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
