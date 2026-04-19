import { getCollection, type CollectionEntry } from "astro:content";
import { CATEGORY_ORDER } from "./categories";

export type DailyEntry = CollectionEntry<"daily">;
export type WikiItemEntry = CollectionEntry<"wikiItem">;

// daily entries sorted newest-first. id is the filename (e.g. "2026-04-19").
export async function getDailyEntries(): Promise<DailyEntry[]> {
  const entries = await getCollection("daily");
  return entries
    .slice()
    .sort((a, b) => (dateFromEntry(b) ?? "").localeCompare(dateFromEntry(a) ?? ""));
}

export function dateFromEntry(entry: DailyEntry): string {
  // Prefer frontmatter date, fall back to filename-derived id (e.g. "2026-04-19").
  return entry.data.date ?? entry.id;
}

// wiki items sorted by captured_at desc.
export async function getWikiItems(): Promise<WikiItemEntry[]> {
  const entries = await getCollection("wikiItem");
  return entries
    .slice()
    .sort((a, b) => b.data.captured_at.localeCompare(a.data.captured_at));
}

export async function getItemsByCategory(
  category: string,
): Promise<WikiItemEntry[]> {
  const all = await getWikiItems();
  return all.filter((e) => slugCategory(e.id) === category);
}

export async function getItemsByTag(tag: string): Promise<WikiItemEntry[]> {
  const all = await getWikiItems();
  return all.filter((e) => (e.data.tags ?? []).includes(tag));
}

// glob loader gives `id` like "ai-ux-patterns/2026-04-19-foo". Split it.
export function slugCategory(id: string): string {
  return id.split("/")[0];
}

export function slugLeaf(id: string): string {
  const parts = id.split("/");
  return parts[parts.length - 1];
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const items = await getWikiItems();
  const counts: Record<string, number> = {};
  for (const cat of CATEGORY_ORDER) counts[cat] = 0;
  for (const item of items) {
    const cat = slugCategory(item.id);
    counts[cat] = (counts[cat] ?? 0) + 1;
  }
  return counts;
}
