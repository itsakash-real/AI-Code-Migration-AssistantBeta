import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { cookies } from "next/headers";


// Basic request payload typing
interface MigrateRequest {
  sourceLanguage: string;
  targetLanguage: string;
  code: string;
  notes?: string;
}

function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<MigrateRequest>;
    const sourceLanguage = (body.sourceLanguage || "").trim();
    const targetLanguage = (body.targetLanguage || "").trim();
    const code = (body.code || "").toString();
    const notes = (body.notes || "").toString();

    if (!sourceLanguage || !targetLanguage || !code) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: sourceLanguage, targetLanguage, code" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: "Server is not configured: missing GOOGLE_API_KEY" },
        { status: 500 }
      );
    }

    // Daily usage limit: 5 per user (cookie-based)
    const cookieName = "migrate_usage";
    let usageCount = 0;
    let usageDate = todayStr();

    try {
      const jar = cookies();  // No await
      const raw = jar.get(cookieName)?.value; // Use directly
  if (raw) {
    const parsed = JSON.parse(raw) as { count: number; date: string };
    if (parsed.date === todayStr()) {
      usageCount = parsed.count || 0;
      usageDate = parsed.date;
    }
      }
    } catch (err) {
      console.error("Error reading cookies:", err);
    }

    // Increment usage and set cookie
usageCount += 1;
const remaining = Math.max(0, 5 - usageCount);

  cookies().set(cookieName, JSON.stringify({ count: usageCount, date: usageDate }), {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24, // 1 day
});

    const genAI = new GoogleGenerativeAI(apiKey);
    const system = `You are an expert AI Code Migration Assistant. You translate source code from one language/framework to another while preserving functionality, behavior, and performance. You follow the best practices and idioms of the target ecosystem. Avoid pseudo code. Where APIs don't have direct equivalents, provide practical alternatives. Maintain edge cases, error handling, types, and comments where helpful.`;

    const userPrompt = [
      `TASK: Translate the following code from ${sourceLanguage} to ${targetLanguage}.`,
      `NOTES (optional): ${notes || "(none)"}`,
      "REQUIREMENTS:",
      "- Preserve functionality, behavior, and performance characteristics.",
      "- Use idiomatic patterns and best practices of the target language/framework.",
      "- Keep important edge cases, error handling, and types.",
      "- If a direct equivalent doesn't exist, implement a practical alternative and document it briefly.",
      "- Return ONLY a JSON object with fields: { code: string, rationale: string }.",
      "- Put no markdown fences in the JSON and no additional keys.",
      "SOURCE CODE:\n" + code,
    ].join("\n");

    const candidateModels = [
      "gemini-1.5-pro",
      "gemini-1.5-flash",
      "gemini-1.5-flash-8b",
    ];

    let lastQuotaError: { message: string; retryAfterSec?: number } | null = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: `${system}\n\n${userPrompt}` }] }],
          generationConfig: {
            temperature: 0.2,
            topK: 32,
            topP: 0.95,
            maxOutputTokens: 4096,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_CIVIC_INTEGRITY", threshold: "BLOCK_NONE" },
          ] as any,
        });

        const text = result.response.text();

        let codeOut = "";
        let rationale = "";
        try {
          const jsonStart = text.indexOf("{");
          const jsonEnd = text.lastIndexOf("}");
          const jsonRaw = text.slice(jsonStart, jsonEnd + 1);
          const data = JSON.parse(jsonRaw);
          codeOut = (data.code || "").toString();
          rationale = (data.rationale || "").toString();
        } catch {
          rationale = text;
          codeOut = "";
        }

        return NextResponse.json(
          {
            ok: true,
            result: { code: codeOut, rationale, targetLanguage },
            model: modelName,
          },
          { headers: { "X-Usage-Remaining": String(remaining) } }
        );
      } catch (e: any) {
        const msg = e?.message || "";
        if (/quota|Too Many Requests|rate.?limit|429/i.test(msg)) {
          const retryMatch = msg.match(/retry in\s([0-9.]+)s/i);
          lastQuotaError = { message: msg, retryAfterSec: retryMatch ? Number(retryMatch[1]) : undefined };
          continue;
        }
        throw e;
      }
    }

    if (lastQuotaError) {
      const hint = "All candidate models are currently quota-limited. Try again later or increase API quota.";
      return NextResponse.json(
        {
          ok: false,
          error: hint,
          details: lastQuotaError.message,
          retryAfterSec: lastQuotaError.retryAfterSec,
        },
        { status: 429, headers: { "X-Usage-Remaining": String(remaining) } }
      );
    }

    return NextResponse.json({ ok: false, error: "Unexpected error" }, { status: 500, headers: { "X-Usage-Remaining": String(remaining) } });
  } catch (err: any) {
    const message = err?.message || "Unknown error";
    const status = /rate|quota|429/i.test(message) ? 429 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
