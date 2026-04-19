import { marked } from "marked";

// Upstream daily brief files currently wrap the whole body inside a triple-
// backtick fence (pipeline bug). Strip the wrapper before rendering.
// When the upstream fix lands, this still passes through untouched content.
export function stripOuterCodeFence(body: string): string {
  const lines = body.trimEnd().split("\n");
  if (lines.length < 2) return body;
  const first = lines[0].trim();
  const last = lines[lines.length - 1].trim();
  if (first === "```" && last === "```") {
    return lines.slice(1, -1).join("\n");
  }
  return body;
}

// Drop any H2 section whose heading mentions weekly wiki changes.
// The curator is also removing this section upstream; this belt-and-
// suspenders keeps older briefs clean.
export function stripWeeklySection(body: string): string {
  const weeklyHeading = /(?:이번\s*주|주간|weekly)/i;
  const out: string[] = [];
  let skipping = false;
  for (const line of body.split("\n")) {
    if (/^##\s/.test(line)) {
      skipping = weeklyHeading.test(line);
      if (skipping) continue;
    }
    if (!skipping) out.push(line);
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

function clean(body: string): string {
  return stripWeeklySection(stripOuterCodeFence(body));
}

export function renderDailyMarkdown(body: string): string {
  return marked.parse(clean(body), { async: false }) as string;
}

// Extract the first 3 non-empty, non-heading lines as a preview.
export function briefPreview(body: string, maxLines = 3): string {
  const lines = clean(body)
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#") && !l.startsWith("```"));
  return lines.slice(0, maxLines).join(" ");
}
