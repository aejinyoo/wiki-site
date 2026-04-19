// KST-friendly date helpers. Daily slugs are YYYY-MM-DD in KST.

export function formatDateKorean(iso: string): string {
  // iso = "YYYY-MM-DD" or ISO datetime. Parse safely.
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  const [, y, mm, d] = m;
  const weekday = new Date(`${y}-${mm}-${d}T00:00:00+09:00`).toLocaleDateString(
    "ko-KR",
    { weekday: "short", timeZone: "Asia/Seoul" },
  );
  return `${y}년 ${Number(mm)}월 ${Number(d)}일 (${weekday})`;
}

export function formatDateShort(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  const [, , mm, d] = m;
  return `${Number(mm)}월 ${Number(d)}일`;
}

export function todayInKst(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + (now.getTimezoneOffset() + 540) * 60000);
  const y = kst.getFullYear();
  const m = String(kst.getMonth() + 1).padStart(2, "0");
  const d = String(kst.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function shiftDate(iso: string, days: number): string | null {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const d = new Date(`${m[0]}T00:00:00+09:00`);
  d.setUTCDate(d.getUTCDate() + days);
  const y = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}
