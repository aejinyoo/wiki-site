// Category metadata. Descriptions from spec section 7.
// If wiki-data/_meta.yaml ever carries descriptions, read those instead.

export type CategoryId =
  | "ai-ux-patterns"
  | "prompt-ui"
  | "agent-interaction"
  | "generative-tools"
  | "design-system-automation"
  | "trend-reports";

export const CATEGORY_DESCRIPTIONS: Record<CategoryId, string> = {
  "ai-ux-patterns": "AI 제품에서 반복 관찰되는 UX 패턴들",
  "prompt-ui": "프롬프트 입력·편집·관리 인터페이스",
  "agent-interaction": "에이전트와 대화·개입·감독 UI",
  "generative-tools": "생성형 제작 도구의 디자인 언어",
  "design-system-automation": "디자인 시스템 자동화 · AI 인퍼런스",
  "trend-reports": "리포트·아티클·시장 동향",
};

export const CATEGORY_ORDER: CategoryId[] = [
  "ai-ux-patterns",
  "prompt-ui",
  "agent-interaction",
  "generative-tools",
  "design-system-automation",
  "trend-reports",
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
