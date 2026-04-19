import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getDailyEntries, dateFromEntry } from "../lib/collections";
import { renderDailyMarkdown } from "../lib/daily-content";
import { formatDateKorean } from "../lib/dates";

export async function GET(context: APIContext) {
  const entries = await getDailyEntries();
  return rss({
    title: "My Wiki",
    description: "매일 아침의 디자인 읽기",
    site: context.site!,
    items: entries.map((entry) => {
      const date = dateFromEntry(entry);
      return {
        title: `${formatDateKorean(date)} 브리프`,
        pubDate: new Date(`${date}T07:30:00+09:00`),
        description: `${date} 디자인 브리프`,
        link: `/daily/${date}`,
        content: renderDailyMarkdown(entry.body ?? ""),
      };
    }),
    customData: "<language>ko-KR</language>",
  });
}
