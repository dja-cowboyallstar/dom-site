---
title: "The Audit Trail Is the Product"
description: "Notes on why agentic systems for finance are hard, and why most teams build the wrong half first."
pubDate: 2026-04-28
draft: true
tags: ["agents", "finance", "controllers", "ai"]
---

> **Draft.** Claude wrote this for me to react to. I'll rewrite it in my own voice before publishing.

The first time I demoed an LLM-generated SuiteQL query to a controller, she nodded at the answer and asked the question I should have expected: *Where did this come from?*

Not the SQL. The number.

She wanted the audit trail. And this is the gap most agent demos never close. When a controller asks *what were our accrued purchases last quarter*, she is not asking for a number. She is asking for a number she can defend. There is a difference, and the difference is the entire job.

## What I mean by audit trail

An audit trail is not a log. Logs are for engineers. An audit trail is the version of the answer a human can stand behind in a room, in front of someone with the authority to question it. It needs to:

- Tie out to a primary source. Not "the database says so," but the GL, the invoice, the journal entry, the vendor bill.
- Show the path. Which records were aggregated, which were excluded, which were grossed up versus netted.
- Explain itself. In language that does not require knowing what a CTE is.
- Survive change. The same answer should be reproducible six months from now, even if the underlying records have moved.

Logs satisfy zero of these. Most agent systems I've seen produce logs and call them audit trails. They are not the same thing.

## Why this is hard for LLMs

LLMs are great at generating answers. They are bad, currently, at three things audit work needs.

**Stable provenance.** A model run twice may take different paths to the same answer. For an analyst, that's fine. For a controller signing the close, it's disqualifying.

**Knowing what it doesn't know.** The harder a controller question is, the more likely an LLM is to confidently produce a query that joins the wrong way and looks plausible. A model that says *I don't know which subsidiary you mean* is more useful than one that hallucinates a foreign key.

**Materiality awareness.** A $43 variance and a $43,000 variance look identical to a token stream. The first doesn't warrant a model call. The second warrants three.

You can engineer around all three. None of them are solved by a bigger context window, a better fine-tune, or a more agentic framework. They're solved by the slow, unglamorous work of hardening retrieval, instrumenting paths, and refusing to answer questions you cannot defend.

## What most teams build instead

Most "AI for finance" demos optimize for the wrong half. They produce a beautiful chart and skip the citation. They wrap a chat interface around a vector store and call it a controller tool. They pitch *natural language to SQL* as the headline feature and bury the part where the SQL ties out.

These products will not survive contact with a real controller. They get one demo, one round of "this is interesting," and then they disappear. The next question is always *where did this come from*, and the answer is always weak.

The right shape, in my experience: build the citation layer first. The model layer second. The chat interface last. Most teams build them in the opposite order, ship a demo, and then spend a year retrofitting the audit trail.

## What this looks like in practice

For Abacus, that means three commitments. Every answer cites the GL accounts and date range it touched. Every aggregation shows the row count, so the controller knows whether they're looking at three transactions or three thousand. Every query is reproducible: the same question twice gives the same SQL twice, with the same answer.

It's slower to build. It is also the only version that survives.

The audit trail is not a feature. The audit trail is the product. Everything else is decoration.
