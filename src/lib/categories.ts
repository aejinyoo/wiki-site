// Category metadata. Descriptions from spec section 7.
// If wiki-data/_meta.yaml ever carries descriptions, read those instead.

export type CategoryId =
  | "ai-ux-patterns"
  | "generative-tools"
  | "design-system-automation"
  | "trend-reports"
  | "lifestyle-recipe";

export const CATEGORY_DESCRIPTIONS: Record<CategoryId, string> = {
  "ai-ux-patterns": "AI 제품에서 반복 관찰되는 UX 패턴 · 프롬프트 UI · 에이전트 상호작용",
  "generative-tools": "생성형 제작 도구의 디자인 언어",
  "design-system-automation": "디자인 시스템 자동화 · AI 인퍼런스",
  "trend-reports": "리포트·아티클·시장 동향",
  "lifestyle-recipe": "요리·레시피·뷰티·라이프스타일",
};

export const CATEGORY_ORDER: CategoryId[] = [
  "ai-ux-patterns",
  "generative-tools",
  "design-system-automation",
  "trend-reports",
  "lifestyle-recipe",
];

export function categoryLabel(id: string): string {
  return id
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export function categoryDescription(id: string): string {
  return (
    CATEGORY_DESCRIPTIONS[id as CategoryId] ??
    "이 카테고리는 아직 설명이 없어요"
  );
}
