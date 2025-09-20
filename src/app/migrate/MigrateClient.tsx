"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Copy, Loader2, RefreshCw, Sparkles, TriangleAlert, Wand2 } from "lucide-react";

const LANGS = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Go",
  "Java",
  "C#",
  "Ruby",
  "PHP",
  "Rust",
  "Kotlin",
  "Swift",
];

export function MigrateClient() {
  const [sourceLanguage, setSourceLanguage] = useState("TypeScript");
  const [targetLanguage, setTargetLanguage] = useState("Python");
  const [code, setCode] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string>("");
  const [rationale, setRationale] = useState<string>("");
  const [remaining, setRemaining] = useState<number | null>(5);
  // Analysis state
  const [syntaxIssues, setSyntaxIssues] = useState<string[]>([]);
  const [partialWarning, setPartialWarning] = useState<string | null>(null);
  const [fixing, setFixing] = useState(false);

  const lineCount = useMemo(() => Math.max(1, code.split("\n").length), [code]);
  const linesArray = useMemo(() => Array.from({ length: lineCount }, (_, i) => i + 1), [lineCount]);
  const gutterRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const canSubmit = useMemo(
    () =>
      sourceLanguage.trim() &&
      targetLanguage.trim() &&
      code.trim() &&
      !loading &&
      sourceLanguage !== targetLanguage &&
      (remaining === null || remaining > 0),
    [sourceLanguage, targetLanguage, code, loading, remaining]
  );

  const handleSwap = useCallback(() => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
  }, [sourceLanguage, targetLanguage]);

  const handleCopy = useCallback(async (text: string) => {
    try { await navigator.clipboard.writeText(text); } catch {}
  }, []);

  const onEditorScroll = useCallback(() => {
    if (!gutterRef.current || !textareaRef.current) return;
    gutterRef.current.scrollTop = textareaRef.current.scrollTop;
  }, []);

  // --- Simple syntax/quality checks ---
  function checkBalance(s: string) {
    const pairs: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
    const stack: string[] = [];
    for (const ch of s) {
      if (ch === "(" || ch === "[" || ch === "{") stack.push(ch);
      if (ch === ")" || ch === "]" || ch === "}") {
        const need = pairs[ch];
        const got = stack.pop();
        if (got !== need) return false;
      }
    }
    return stack.length === 0;
  }

  function analyzeOutputText(text: string, lang: string) {
    const issues: string[] = [];
    const lower = text.toLowerCase();

    // Structural balance
    if (!checkBalance(text)) {
      issues.push("Unbalanced brackets/braces/parentheses detected.");
    }

    // Quick JS check
    if (lang === "JavaScript") {
      try {
        // eslint-disable-next-line no-new-func
        new Function(text);
      } catch (e: any) {
        issues.push(`JavaScript parser error: ${e?.message ?? "Invalid syntax"}`);
      }
    }

    // Heuristic partial migration markers
    const partialMarkers = [
      "todo", "fixme", "not implemented", "stub", "pseudo", "placeholder",
      "manually", "manual step", "cannot", "not supported", "omitted"
    ];
    const hasPartial = partialMarkers.some((m) => lower.includes(m));
    const partialMsg = hasPartial ? "The assistant indicates some parts may require manual completion." : null;

    return { issues, partialMsg };
  }

  useEffect(() => {
    if (!output) {
      setSyntaxIssues([]);
      setPartialWarning(null);
      return;
    }
    const { issues, partialMsg } = analyzeOutputText(output, targetLanguage);
    setSyntaxIssues(issues);
    setPartialWarning(partialMsg);
  }, [output, targetLanguage]);

  const submit = useCallback(async () => {
    setLoading(true);
    setError(null);
    setOutput("");
    setRationale("");
    // reset analysis
    setSyntaxIssues([]);
    setPartialWarning(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
      const res = await fetch("/api/migrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ sourceLanguage, targetLanguage, code, notes }),
      });
      // capture usage header if present
      const hdr = res.headers.get("x-usage-remaining");
      if (hdr !== null) {
        const n = Number(hdr);
        if (!Number.isNaN(n)) setRemaining(n);
      }
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        // Handle quota/rate-limit hint gracefully
        if (res.status === 429) {
          const secs = typeof data?.retryAfterSec === "number" ? Math.ceil(data.retryAfterSec) : null;
          const msg = data?.error || "Rate limit hit. Please try again later.";
          setError(secs ? `${msg} Try again in ~${secs}s or enable billing for Gemini API.` : `${msg} Enable billing or try again later.`);
          return;
        }
        setError(data?.error || `Request failed (${res.status})`);
        return;
      }
      const nextCode: string = data.result?.code || "";
      const { issues, partialMsg } = analyzeOutputText(nextCode, targetLanguage);
      setSyntaxIssues(issues);
      setPartialWarning(partialMsg);
      setOutput(nextCode);
      setRationale(data.result?.rationale || "");
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [sourceLanguage, targetLanguage, code, notes]);

  // Ask assistant to fix syntax only, using current output as input
  const requestFix = useCallback(async () => {
    if (!output) return;
    setFixing(true);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
      const promptNotes = `${notes ? notes + "\n\n" : ""}Please fix any syntax errors, missing imports, or obvious typos in the provided ${targetLanguage} code. Do not change logic. Return ONLY corrected code and a short explanation.`;
      const res = await fetch("/api/migrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          sourceLanguage: targetLanguage,
          targetLanguage: targetLanguage,
          code: output,
          notes: promptNotes,
        }),
      });
      const hdr = res.headers.get("x-usage-remaining");
      if (hdr !== null) {
        const n = Number(hdr);
        if (!Number.isNaN(n)) setRemaining(n);
      }
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setError(data?.error || `Fix request failed (${res.status})`);
        return;
      }
      const fixedCode: string = data.result?.code || "";
      const { issues, partialMsg } = analyzeOutputText(fixedCode, targetLanguage);
      setSyntaxIssues(issues);
      setPartialWarning(partialMsg);
      setOutput(fixedCode);
      setRationale((prev) => `${prev ? prev + "\n\n" : ""}Auto-fix notes: ${data.result?.rationale || "Applied syntax corrections."}`);
    } catch (e: any) {
      setError(e?.message || "Could not auto-fix the code");
    } finally {
      setFixing(false);
    }
  }, [output, targetLanguage, notes]);

  useEffect(() => {
    // Provide a tiny starter to show the flow
    if (!code) {
      setCode(`function add(a: number, b: number) {\n  return a + b;\n}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Source</span>
            <div className="flex items-center gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={handleSwap} aria-label="Swap languages">
                <RefreshCw className="mr-2 h-4 w-4" /> Swap
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => handleCopy(code)} aria-label="Copy source code">
                <Copy className="mr-2 h-4 w-4" /> Copy
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Usage banner */}
          <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-secondary)] px-3 py-2 text-xs text-[var(--color-secondary-foreground)]">
            {remaining !== null ? (
              <span>
                You have <strong>{remaining}</strong> {remaining === 1 ? "run" : "runs"} left today (5/day).
              </span>
            ) : (
              <span>5 free runs/day. Remaining shown after first run.</span>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="src-lang">From</Label>
              <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                <SelectTrigger id="src-lang"><SelectValue placeholder="Select source" /></SelectTrigger>
                <SelectContent>
                  {LANGS.map(l => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tgt-lang">To</Label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger id="tgt-lang"><SelectValue placeholder="Select target" /></SelectTrigger>
                <SelectContent>
                  {LANGS.map(l => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input id="notes" placeholder="Constraints, frameworks, versions, performance notes…" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          {/* Compiler-like editor */}
          <div className="space-y-2">
            <Label htmlFor="code">Source Code</Label>
            <div className="relative grid grid-cols-[3rem_1fr] overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-card)]">
              {/* Gutter */}
              <div
                ref={gutterRef}
                aria-hidden
                className="select-none border-r border-[var(--color-border)] bg-[var(--color-muted)]/60 font-mono text-xs leading-6 text-[var(--color-muted-foreground)]"
                style={{ maxHeight: 320, overflow: "auto", padding: "0.75rem 0.5rem" }}
              >
                {linesArray.map((n) => (
                  <div key={n} className="tabular-nums text-right pr-1">{n}</div>
                ))}
              </div>
              {/* Textarea */}
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onScroll={onEditorScroll}
                  className="h-[320px] resize-none border-0 bg-transparent font-mono text-sm leading-6 focus-visible:ring-0"
                  placeholder="Paste your source code here…"
                  spellCheck={false}
                />
                {/* Subtle status bar */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 border-t border-[var(--color-border)] bg-[var(--color-secondary)]/60 px-2 py-1 text-[10px] text-[var(--color-muted-foreground)]">
                  Ln {lineCount}, Col —
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center gap-3">
          <Button onClick={submit} disabled={!canSubmit} aria-label="Run migration">
            {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Migrating…</>) : (<><Sparkles className="mr-2 h-4 w-4" /> Run Migration</>)}
          </Button>
          {error && <span className="text-sm text-red-600 dark:text-red-400">{error}</span>}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Result</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Warnings / diagnostics */}
          {(syntaxIssues.length > 0 || partialWarning) && (
            <div className="rounded-md border border-yellow-400/40 bg-yellow-100 text-yellow-900 dark:border-yellow-400/30 dark:bg-yellow-950/30 dark:text-yellow-200">
              <div className="flex items-start gap-2 px-3 py-2 text-sm">
                <TriangleAlert className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div className="space-y-1">
                  {syntaxIssues.length > 0 && (
                    <div>
                      <span className="font-medium">Potential syntax issues detected:</span>
                      <ul className="mt-1 list-disc pl-5">
                        {syntaxIssues.map((m, i) => (<li key={i}>{m}</li>))}
                      </ul>
                    </div>
                  )}
                  {partialWarning && <div className="mt-1">{partialWarning}</div>}
                  <div className="pt-1">
                    <Button type="button" size="sm" variant="outline" onClick={requestFix} disabled={fixing || !output} aria-label="Ask assistant to fix code">
                      {fixing ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Fixing…</>) : (<><Wand2 className="mr-2 h-4 w-4" /> Ask to fix code</>)}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-muted-foreground)]">Translated code</span>
            <Button type="button" variant="outline" size="sm" onClick={() => handleCopy(output)} disabled={!output} aria-label="Copy translated code">
              <Copy className="mr-2 h-4 w-4" /> Copy
            </Button>
          </div>
          <pre className={`max-h-[420px] overflow-auto rounded-md border ${syntaxIssues.length ? "border-red-500/60" : "border-[var(--color-border)]"} bg-[var(--color-card)] p-4 text-sm leading-relaxed`}><code>{output || "// The translated code will appear here."}</code></pre>

          <Separator />

          <div className="space-y-2">
            <div className="text-sm text-[var(--color-muted-foreground)]">Rationale</div>
            <pre className="max-h-[240px] overflow-auto rounded-md border border-[var(--color-border)] bg-[var(--color-card)] p-3 text-sm leading-relaxed whitespace-pre-wrap">{rationale || "The assistant will explain important decisions, alternatives, and caveats here."}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}