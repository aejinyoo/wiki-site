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

// Heading detector for the "🧪 오늘 해볼 만한 실험" section.
// Matches whether or not the emoji or "(Top N)" suffix is present.
const EXPERIMENT_HEADING_RE = /^##\s+.*(?:🧪|실험)/;

function escapeAttr(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function parseTableRow(line: string): string[] {
  // Strip leading/trailing pipe, split, trim each cell.
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

function isDividerRow(line: string): boolean {
  return /^\s*\|?\s*:?-{2,}/.test(line);
}

function renderInline(md: string): string {
  // marked.parseInline keeps cell-level markdown (links, emphasis) without
  // wrapping the result in <p>.
  return marked.parseInline(md, { async: false }) as string;
}

// Convert markdown tables that live inside the "🧪 실험" H2 into a regular
// HTML <table class="experiment-table">. Every <td> is tagged with a
// data-label attribute drawn from the column header so mobile CSS can render
// each row as a labeled card.
export function transformExperimentTable(body: string): string {
  const lines = body.split("\n");
  const out: string[] = [];
  let inExperimentSection = false;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (/^##\s/.test(line)) {
      inExperimentSection = EXPERIMENT_HEADING_RE.test(line);
      out.push(line);
      i++;
      continue;
    }

    if (
      inExperimentSection &&
      line.trim().startsWith("|") &&
      i + 1 < lines.length &&
      isDividerRow(lines[i + 1])
    ) {
      const headerLine = line;
      const dividerLine = lines[i + 1];
      const dataLines: string[] = [];
      let j = i + 2;
      while (j < lines.length && lines[j].trim().startsWith("|")) {
        dataLines.push(lines[j]);
        j++;
      }
      const headers = parseTableRow(headerLine);
      const rows = dataLines.map(parseTableRow);
      out.push(renderExperimentTable(headers, rows));
      i = j;
      // Re-evaluate section flag after consuming the table block.
      // (no-op: the next iteration starts on whatever follows the table)
      // Suppress unused var warning for dividerLine without keeping it around.
      void dividerLine;
      continue;
    }

    out.push(line);
    i++;
  }

  return out.join("\n");
}

function renderExperimentTable(headers: string[], rows: string[][]): string {
  const ths = headers.map((h) => `<th>${renderInline(h)}</th>`).join("");
  const trs = rows
    .map((cells) => {
      const tds = cells
        .map((cell, idx) => {
          const label = headers[idx] ?? "";
          return `<td data-label="${escapeAttr(label)}">${renderInline(cell)}</td>`;
        })
        .join("");
      return `<tr>${tds}</tr>`;
    })
    .join("\n");
  // Wrap in raw HTML block — marked passes block-level HTML through.
  return [
    `<table class="experiment-table">`,
    `<thead><tr>${ths}</tr></thead>`,
    `<tbody>`,
    trs,
    `</tbody>`,
    `</table>`,
  ].join("\n");
}

function clean(body: string): string {
  return transformExperimentTable(
    stripWeeklySection(stripOuterCodeFence(body)),
  );
}

export function renderDailyMarkdown(body: string): string {
  return marked.parse(clean(body), { async: false }) as string;
}

// True when the brief body (after cleaning) has no visible content —
// e.g. upstream generation failed and the file is empty or whitespace-only.
export function isDailyBodyEmpty(body: string | undefined | null): boolean {
  if (!body) return true;
  return clean(body).trim() === "";
}

// Extract the first 3 non-empty, non-heading lines as a preview.
export function briefPreview(body: string, maxLines = 3): string {
  const lines = clean(body)
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#") && !l.startsWith("```"));
  return lines.slice(0, maxLines).join(" ");
}
