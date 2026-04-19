import type { APIRoute } from "astro";
import {
  getDailyEntries,
  getWikiItems,
  dateFromEntry,
  slugCategory,
  slugLeaf,
} from "../lib/collections";
import { categoryLabel } from "../lib/categories";
import { stripOuterCodeFence, stripWeeklySection } from "../lib/daily-content";

type IndexEntry = {
  type: "daily" | "wiki";
  href: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  body: string;
  date: string;
};

function truncate(s: string, n: number): string {
  const t = s.trim();
  return t.length <= n ? t : t.slice(0, n) + "…";
}

export const GET: APIRoute = async () => {
  const items = await getWikiItems();
  const dailies = await getDailyEntries();

  const entries: IndexEntry[] = [];

  for (const entry of items) {
    const category = slugCategory(entry.id);
    const slug = slugLeaf(entry.id);
    entries.push({
      type: "wiki",
      href: `/wiki/${category}/${slug}`,
      title: entry.data.title,
      summary: entry.data.summary_3lines ?? "",
      category: categoryLabel(category),
      tags: entry.data.tags ?? [],
      body: truncate((entry.body ?? "").replace(/\s+/g, " "), 600),
      date: entry.data.captured_at?.slice(0, 10) ?? "",
    });
  }

  for (const entry of dailies) {
    const date = dateFromEntry(entry);
    const cleaned = stripWeeklySection(stripOuterCodeFence(entry.body ?? ""));
    entries.push({
      type: "daily",
      href: `/daily/${date}`,
      title: `${date} 브리프`,
      summary: truncate(
        cleaned.split("\n").filter((l) => l.trim() && !l.startsWith("#")).join(" "),
        240,
      ),
      category: "daily",
      tags: [],
      body: truncate(cleaned.replace(/\s+/g, " "), 800),
      date,
    });
  }

  return new Response(JSON.stringify(entries), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
