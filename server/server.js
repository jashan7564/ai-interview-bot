import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  console.error("Missing OPENROUTER_API_KEY in .env");
  process.exit(1);
}

// Pick a DeepSeek model available on OpenRouter.
// Common options include:
// - "deepseek/deepseek-chat"
// - "deepseek/deepseek-r1"
// If one fails, switch to another.
const DEFAULT_MODEL = "stepfun/step-3.5-flash:free";

function buildSystemPrompt({ role, level, focus, style }) {
  return `
You are an interview coach running a realistic mock interview.

Candidate target:
- Role: ${role}
- Level: ${level}
- Focus: ${focus}

Rules:
- Ask ONE question at a time in mock interview mode.
- When evaluating an answer, return ONLY valid JSON with this schema:

{
  "score": 0-10,
  "strengths": string[],
  "gaps": string[],
  "better_answer": string,
  "follow_ups": string[],
  "next_question": string
}

Scoring guide:
- 9-10: excellent, complete, clear, correct
- 7-8: good but missing some depth/structure
- 5-6: partial, unclear, or shallow
- 0-4: incorrect or very weak

Coaching style: ${style}
No extra commentary outside JSON when evaluating.
`.trim();
}

async function openRouterChat({ model, messages, temperature = 0.4 }) {
  const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      // Optional but recommended by OpenRouter for attribution:
      "HTTP-Referer": "http://localhost",
      "X-Title": "AI Interview Practice Bot"
    },
    body: JSON.stringify({
      model,
      messages,
      temperature
    })
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`OpenRouter error ${resp.status}: ${text}`);
  }

  const data = await resp.json();
  return data.choices?.[0]?.message?.content ?? "";
}

// Start interview: returns first question
app.post("/api/start", async (req, res) => {
  try {
    const {
      role = "Backend Developer",
      level = "Junior",
      focus = "General",
      style = "Direct, structured, and practical.",
      model = DEFAULT_MODEL
    } = req.body || {};

    const system = buildSystemPrompt({ role, level, focus, style });

    const messages = [
      { role: "system", content: system },
      {
        role: "user",
        content: `Start a mock interview. Ask the first question for ${role} (${level}) focused on ${focus}.`
      }
    ];

    const content = await openRouterChat({ model, messages, temperature: 0.6 });

    // We keep it simple: first question is plain text
    res.json({ ok: true, question: content.trim(), model });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Evaluate answer: returns JSON coaching + next question
app.post("/api/evaluate", async (req, res) => {
  try {
    const {
      role = "Backend Developer",
      level = "Junior",
      focus = "General",
      style = "Direct, structured, and practical.",
      model = DEFAULT_MODEL,
      question,
      answer,
      history = []
    } = req.body || {};

    if (!question || !answer) {
      return res.status(400).json({ ok: false, error: "Missing question or answer" });
    }

    const system = buildSystemPrompt({ role, level, focus, style });

    const messages = [
      { role: "system", content: system },
      // prior turns (optional)
      ...history,
      { role: "user", content: `Question: ${question}\n\nCandidate answer:\n${answer}\n\nEvaluate and coach. Return ONLY JSON.` }
    ];

    const content = await openRouterChat({ model, messages, temperature: 0.3 });

    // Try parse JSON. If model returns extra text, attempt to extract JSON block.
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      const start = content.indexOf("{");
      const end = content.lastIndexOf("}");
      if (start !== -1 && end !== -1 && end > start) {
        parsed = JSON.parse(content.slice(start, end + 1));
      } else {
        throw new Error("Model did not return valid JSON.");
      }
    }

    res.json({ ok: true, result: parsed, model });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

const port = process.env.PORT || 8787;
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});