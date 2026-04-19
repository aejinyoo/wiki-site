import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// daily briefs: src/content/wiki-data/daily/YYYY-MM-DD.md
// NOTE: upstream files currently lack frontmatter — every field optional
// so Astro parses them. date is derived from the filename slug at usage time.
const daily = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/wiki-data/daily",
  }),
  schema: z.object({
    date: z.string().optional(),
    generated_at: z.string().optional(),
    item_count: z.number().optional(),
    title: z.string().optional(),
  }),
});

// wiki items: src/content/wiki-data/wiki/{category}/*.md
// Schema is permissive: upstream data has extra fields not in spec section 11.
const wikiItem = defineCollection({
  loader: glob({
    pattern: "*/*.md",
    base: "./src/content/wiki-data/wiki",
  }),
  schema: z
    .object({
      id: z.string(),
      source: z.string().default("Manual"),
      url: z.string().default(""),
      author: z.string().optional().default(""),
      captured_at: z.string(),
      title: z.string(),
      summary_3lines: z.string().optional().default(""),
      tags: z.array(z.string()).default([]),
      category: z.string(),
      confidence: z.number().min(0).max(1).default(0.5),
      tried: z.boolean().optional().default(false),
      tried_at: z.string().nullable().optional(),

      // extra fields produced by the curator pipeline (optional)
      body_ko: z.string().optional(),
      key_takeaways: z.array(z.string()).optional(),
      what_to_try: z.string().optional(),
      why_it_matters: z.string().optional(),
      original_language: z.string().optional(),
    })
    .passthrough(),
});

export const collections = { daily, wikiItem };
