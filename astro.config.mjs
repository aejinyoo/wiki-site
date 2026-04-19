// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// https://astro.build/config
export default defineConfig({
  site: "https://wiki-site.yaj4012146.workers.dev",
  markdown: {
    gfm: true,
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: { className: ["heading-anchor"] },
        },
      ],
    ],
    shikiConfig: {
      theme: "github-light",
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
